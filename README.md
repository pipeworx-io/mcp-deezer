# mcp-deezer

Deezer public music catalog (search/tracks/albums/artists/charts)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search` | Search Deezer for tracks/albums/artists/playlists. |
| `track` | Track metadata by Deezer track id. |
| `album` | Album metadata + tracklist by Deezer album id. |
| `artist` | Artist metadata by Deezer artist id. |
| `artist_top` | Top tracks for an artist. |
| `chart` | Current chart (top tracks/albums/artists). Pass genre_id 0 for worldwide. |

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

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
