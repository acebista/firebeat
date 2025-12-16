# MCP Integration for JB Trade Link DMS

## Overview

This document explains how to integrate Model Context Protocol (MCP) support for Supabase operations in your JB Trade Link DMS project.

## What is MCP?

Model Context Protocol (MCP) is a standard for connecting AI assistants to external tools and data sources. It allows AI models to interact with databases, APIs, and other systems in a structured way.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MCP Client    │────│  MCP Server      │────│   Supabase      │
│ (Claude Desktop │    │ (jb-trade-link-  │    │   Database      │
│  or other)      │    │  mcp-server)     │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Files Created

### MCP Server (`/mcp-server/`)
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `src/index.ts` - Main MCP server implementation
- `README.md` - Server documentation

### Configuration
- `mcp-config.json` - MCP client configuration
- `setup-mcp.sh` - Setup script

## Setup Instructions

### 1. Install Dependencies

Run the setup script:
```bash
./setup-mcp.sh
```

Or manually:
```bash
cd mcp-server
npm install
npm run build
```

### 2. Configure MCP Client

#### For Claude Desktop:
1. Open Claude Desktop
2. Go to Settings → Developer → Edit Config
3. Add the configuration from `mcp-config.json`

#### For Other MCP Clients:
Use the configuration in `mcp-config.json` as a reference, adjusting paths as needed.

### 3. Environment Variables

The MCP server uses the same environment variables as your main application:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Available Tools

### Database Operations
- **execute_sql**: Run raw SQL queries
- **list_tables**: List tables in schemas
- **list_migrations**: Show migration history
- **apply_migration**: Apply database migrations
- **list_extensions**: List PostgreSQL extensions

### Storage Operations
- **list_storage_buckets**: List storage buckets
- **get_storage_config**: Get storage settings
- **update_storage_config**: Modify storage configuration

### Edge Functions
- **list_edge_functions**: List serverless functions
- **deploy_edge_function**: Deploy new functions
- **get_edge_function**: Retrieve function code

### Development Workflow
- **list_branches**: Show development branches
- **create_branch**: Create new branches
- **merge_branch**: Merge to production
- **rebase_branch**: Rebase on production
- **reset_branch**: Reset branch state

### Monitoring & Management
- **get_logs**: Access service logs
- **get_advisors**: Security/performance advice
- **generate_typescript_types**: Generate types
- **get_project_url**: Get API endpoints
- **get_publishable_keys**: Get API keys

## Usage Examples

### Query Database
```
"Execute this SQL: SELECT id, name FROM customers LIMIT 5"
```

### Check Table Structure
```
"List all tables in the public schema"
```

### Monitor Performance
```
"Get performance advisors for the project"
```

### Manage Storage
```
"List all storage buckets"
```

## Security Considerations

### Row Level Security (RLS)
- The MCP server uses your Supabase anon key
- All queries respect RLS policies
- No direct access to sensitive operations

### Management API Features
Some advanced features require:
- Supabase service role key
- Management API access
- Additional permissions

### Best Practices
- Use environment variables for secrets
- Regularly rotate API keys
- Monitor access logs
- Follow principle of least privilege

## Development

### Adding New Tools

1. **Define the tool** in the `ListToolsRequestSchema` handler
2. **Implement the method** in `SupabaseMCPServer` class
3. **Add the case** in `CallToolRequestSchema` handler
4. **Test thoroughly** before deployment

### Testing
```bash
# Development mode
cd mcp-server && npm run dev

# Test with MCP client
# Connect your MCP client and test tools
```

### Debugging
- Check server logs in terminal
- Verify Supabase connection
- Test with simple queries first
- Use MCP client debug features

## Integration with Existing Workflow

The MCP server integrates seamlessly with your existing development workflow:

1. **Database Development**: Use MCP for schema exploration and testing
2. **Migration Management**: Apply and track database changes
3. **Performance Monitoring**: Get insights and recommendations
4. **Storage Management**: Manage files and configurations
5. **Edge Functions**: Deploy and manage serverless code

## Troubleshooting

### Common Issues

**Server won't start**
- Check Node.js version (requires 18+)
- Verify dependencies are installed
- Check environment variables

**Connection failures**
- Verify Supabase URL and keys
- Check network connectivity
- Confirm project permissions

**Tool execution errors**
- Check RLS policies
- Verify user permissions
- Review SQL syntax

**MCP client issues**
- Verify configuration paths
- Check MCP client version
- Review client logs

### Getting Help

1. Check the server logs: `npm run dev`
2. Test basic connectivity: `execute_sql` with `SELECT 1`
3. Verify Supabase dashboard access
4. Check MCP client documentation

## Future Enhancements

- Management API integration for advanced features
- Custom tool development
- Integration with CI/CD pipelines
- Enhanced error handling and logging
- Performance optimization

## Contributing

When adding new tools:
1. Follow the existing pattern
2. Add comprehensive error handling
3. Include input validation
4. Update documentation
5. Test with various scenarios

## License

This MCP integration is part of the JB Trade Link DMS project.