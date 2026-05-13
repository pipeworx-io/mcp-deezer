interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Deezer MCP — public catalog (no auth required).
 *
 * Docs: https://developers.deezer.com/api
 */


const BASE = 'https://api.deezer.com';
const UA = 'pipeworx-mcp-deezer/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'search',
    description: 'Search Deezer for tracks/albums/artists/playlists.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'track | album | artist | playlist (default track)' },
        query: { type: 'string', description: 'e.g. "Daft Punk Get Lucky"' },
        limit: { type: 'number', description: '1-100 (default 25)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'track',
    description: 'Track metadata by Deezer track id.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number' } },
      required: ['id'],
    },
  },
  {
    name: 'album',
    description: 'Album metadata + tracklist by Deezer album id.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number' } },
      required: ['id'],
    },
  },
  {
    name: 'artist',
    description: 'Artist metadata by Deezer artist id.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number' } },
      required: ['id'],
    },
  },
  {
    name: 'artist_top',
    description: 'Top tracks for an artist.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number' }, limit: { type: 'number', description: '1-100 (default 25)' } },
      required: ['id'],
    },
  },
  {
    name: 'chart',
    description: 'Current chart (top tracks/albums/artists). Pass genre_id 0 for worldwide.',
    inputSchema: {
      type: 'object',
      properties: { genre_id: { type: 'number', description: 'Default 0 (all genres).' } },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search': {
      const type = ((args.type as string) ?? 'track').toLowerCase();
      if (!['track', 'album', 'artist', 'playlist'].includes(type))
        throw new Error('type must be track | album | artist | playlist.');
      const params = new URLSearchParams({
        q: reqStr(args, 'query', '"Daft Punk"'),
        limit: String(Math.min(100, Math.max(1, (args.limit as number) ?? 25))),
      });
      return dzGet(`/search/${type}?${params}`);
    }
    case 'track':
      return dzGet(`/track/${reqId(args)}`);
    case 'album':
      return dzGet(`/album/${reqId(args)}`);
    case 'artist':
      return dzGet(`/artist/${reqId(args)}`);
    case 'artist_top': {
      const id = reqId(args);
      const limit = Math.min(100, Math.max(1, (args.limit as number) ?? 25));
      return dzGet(`/artist/${id}/top?limit=${limit}`);
    }
    case 'chart': {
      const gid = (args.genre_id as number) ?? 0;
      return dzGet(`/chart/${gid}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function reqId(args: Record<string, unknown>): number {
  const id = (args.id as number) | 0;
  if (!id) throw new Error('Required argument "id" must be a Deezer numeric id.');
  return id;
}

async function dzGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Deezer: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  const json = (await res.json()) as { error?: { type?: string; message?: string; code?: number } };
  if (json.error) throw new Error(`Deezer error: ${json.error.message ?? json.error.type ?? 'unknown'}`);
  return json;
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
