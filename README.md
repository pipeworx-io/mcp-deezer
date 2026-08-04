# @pipeworx/deezer

Deezer public catalog MCP — search tracks/artists/albums + lookups (keyless, no OAuth needed for public catalog).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `search(type?, query, limit?)` — search tracks/albums/artists/playlists
- `track(id)` — full track metadata
- `album(id)` — album metadata + tracklist
- `artist(id)` — artist info
- `artist_top(id, limit?)` — most popular tracks for an artist
- `chart(genre_id?)` — current chart (worldwide or by genre)

## Data source

`https://api.deezer.com` (public read-only endpoints).

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "deezer": {
      "url": "https://gateway.pipeworx.io/deezer/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Deezer data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
