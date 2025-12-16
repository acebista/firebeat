# Supabase MCP Server for JB Trade Link DMS

This MCP (Model Context Protocol) server provides comprehensive Supabase integration for the JB Trade Link DMS project.

## Features

- **Database Operations**: Execute SQL queries, list tables, manage migrations
- **Storage Management**: List buckets, manage storage configuration
- **Edge Functions**: Deploy and manage serverless functions
- **Branch Management**: Create, merge, and manage development branches
- **Monitoring**: Access logs, security advisors, and performance insights
- **Type Generation**: Generate TypeScript types from your database schema

## Setup

1. **Install Dependencies**
   ```bash
   cd mcp-server
   npm install
   ```

2. **Build the Server**
   ```bash
   npm run build
   ```

3. **Environment Variables**

   Create a `.env` file in the mcp-server directory (optional, will use main app defaults if not set):

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## MCP Client Configuration

To use this MCP server with an MCP client (like Claude Desktop), add this configuration:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "node",
      "args": ["/path/to/your/project/mcp-server/dist/index.js"],
      "env": {
        "VITE_SUPABASE_URL": "https://your-project.supabase.co",
        "VITE_SUPABASE_ANON_KEY": "your-anon-key"
      }
    }
  }
}
```

## Available Tools

### Database Operations
- `execute_sql` - Execute raw SQL queries
- `list_tables` - List all tables in specified schemas
- `list_migrations` - List database migrations
- `apply_migration` - Apply a new migration
- `list_extensions` - List installed PostgreSQL extensions

### Storage
- `list_storage_buckets` - List all storage buckets
- `get_storage_config` - Get storage configuration
- `update_storage_config` - Update storage settings

### Edge Functions
- `list_edge_functions` - List all edge functions
- `deploy_edge_function` - Deploy a new edge function
- `get_edge_function` - Retrieve edge function code

### Branch Management
- `list_branches` - List development branches
- `create_branch` - Create a new development branch
- `delete_branch` - Delete a development branch
- `merge_branch` - Merge branch to production
- `rebase_branch` - Rebase branch on production
- `reset_branch` - Reset branch migrations

### Monitoring & Management
- `get_logs` - Retrieve service logs
- `get_advisors` - Get security/performance advice
- `generate_typescript_types` - Generate TypeScript types
- `get_project_url` - Get project API URL
- `get_publishable_keys` - Get publishable API keys

## Integration with Main App

The MCP server uses the same Supabase configuration as your main application, ensuring consistency across your development workflow.

## Security Notes

- The server uses your Supabase anon key, which has Row Level Security (RLS) restrictions
- Management API features (branches, edge functions, etc.) require additional API keys
- Always follow your organization's security policies when configuring API access

## Development

### Adding New Tools

1. Add the tool definition to the `tools` array in `ListToolsRequestSchema` handler
2. Implement the tool method in the `SupabaseMCPServer` class
3. Add the case to the `CallToolRequestSchema` handler

### Testing

```bash
# Run in development mode
npm run dev

# Test with MCP client
# Use your MCP client to connect and test tools
```

## Troubleshooting

- **Connection Issues**: Verify your Supabase URL and keys
- **Permission Errors**: Check RLS policies and user permissions
- **Management API**: Some features require Supabase service role key or management API access

## License

This MCP server is part of the JB Trade Link DMS project.