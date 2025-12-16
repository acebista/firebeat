import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

class SupabaseMCPServer {
  private server: Server;
  private supabase: SupabaseClient;
  private supabaseUrl: string;

  constructor() {
    // Use the same Supabase configuration as the main app
    this.supabaseUrl = process.env.VITE_SUPABASE_URL ?? 'https://qlosefnvwvmqeebfqdcg.supabase.co';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsb3NlZm53dm1xZWViZnFkY2ciLCJhdWQiOiJzdXBhYmFzZSIsInN1YiI6ImFub24iLCJpYXQiOjE2OTg0MTY0MDAsImV4cCI6MTkxNDA3MjQwMH0.DXK3r8bXG1bXoY9b1jz1YV7Zt1nU5H3v3Z5Z8vV6H3o';

    this.supabase = createClient(this.supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      }
    });

    this.server = new Server(
      {
        name: "supabase-mcp-server",
        version: "1.0.0",
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "execute_sql",
            description: "Execute raw SQL queries in the Supabase database",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The SQL query to execute"
                }
              },
              required: ["query"]
            }
          },
          {
            name: "list_tables",
            description: "List all tables in the database",
            inputSchema: {
              type: "object",
              properties: {
                schemas: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of schemas to include. Defaults to all schemas.",
                  default: ["public"]
                }
              }
            }
          },
          {
            name: "list_migrations",
            description: "List all migrations in the database",
            inputSchema: {
              type: "object",
              properties: {}
            }
          },
          {
            name: "apply_migration",
            description: "Apply a migration to the database",
            inputSchema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "The name of the migration in snake_case"
                },
                query: {
                  type: "string",
                  description: "The SQL query to apply"
                }
              },
              required: ["name", "query"]
            }
          },
          {
            name: "get_project_url",
            description: "Get the API URL for the Supabase project",
            inputSchema: {
              type: "object",
              properties: {}
            }
          },
          {
            name: "get_publishable_keys",
            description: "Get all publishable API keys for the project",
            inputSchema: {
              type: "object",
              properties: {}
            }
          },
          {
            name: "list_storage_buckets",
            description: "List all storage buckets in the project",
            inputSchema: {
              type: "object",
              properties: {}
            }
          },
          {
            name: "get_storage_config",
            description: "Get the storage configuration for the project",
            inputSchema: {
              type: "object",
              properties: {}
            }
          },
          {
            name: "update_storage_config",
            description: "Update the storage configuration",
            inputSchema: {
              type: "object",
              properties: {
                config: {
                  type: "object",
                  properties: {
                    fileSizeLimit: { type: "number" },
                    features: {
                      type: "object",
                      properties: {
                        imageTransformation: {
                          type: "object",
                          properties: { enabled: { type: "boolean" } },
                          required: ["enabled"]
                        },
                        s3Protocol: {
                          type: "object",
                          properties: { enabled: { type: "boolean" } },
                          required: ["enabled"]
                        }
                      },
                      required: ["imageTransformation", "s3Protocol"]
                    }
                  },
                  required: ["fileSizeLimit", "features"]
                }
              },
              required: ["config"]
            }
          },
          {
            name: "list_edge_functions",
            description: "List all Edge Functions in the project",
            inputSchema: {
              type: "object",
              properties: {}
            }
          },
          {
            name: "deploy_edge_function",
            description: "Deploy an Edge Function to the project",
            inputSchema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "The name of the function"
                },
                files: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      content: { type: "string" },
                      name: { type: "string" }
                    },
                    required: ["name", "content"]
                  },
                  description: "The files to upload"
                },
                entrypoint_path: {
                  type: "string",
                  description: "The entrypoint of the function",
                  default: "index.ts"
                },
                import_map_path: {
                  type: "string",
                  description: "The import map for the function"
                }
              },
              required: ["name", "files"]
            }
          },
          {
            name: "get_edge_function",
            description: "Retrieve file contents for an Edge Function",
            inputSchema: {
              type: "object",
              properties: {
                function_slug: { type: "string" }
              },
              required: ["function_slug"]
            }
          },
          {
            name: "list_branches",
            description: "List all development branches",
            inputSchema: {
              type: "object",
              properties: {}
            }
          },
          {
            name: "create_branch",
            description: "Create a development branch",
            inputSchema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Name of the branch",
                  default: "develop"
                },
                confirm_cost_id: {
                  type: "string",
                  description: "The cost confirmation ID"
                }
              },
              required: ["confirm_cost_id"]
            }
          },
          {
            name: "delete_branch",
            description: "Delete a development branch",
            inputSchema: {
              type: "object",
              properties: {
                branch_id: { type: "string" }
              },
              required: ["branch_id"]
            }
          },
          {
            name: "merge_branch",
            description: "Merge a development branch to production",
            inputSchema: {
              type: "object",
              properties: {
                branch_id: { type: "string" }
              },
              required: ["branch_id"]
            }
          },
          {
            name: "rebase_branch",
            description: "Rebase a development branch on production",
            inputSchema: {
              type: "object",
              properties: {
                branch_id: { type: "string" }
              },
              required: ["branch_id"]
            }
          },
          {
            name: "reset_branch",
            description: "Reset migrations of a development branch",
            inputSchema: {
              type: "object",
              properties: {
                branch_id: { type: "string" },
                migration_version: {
                  type: "string",
                  description: "Reset to a specific migration version"
                }
              },
              required: ["branch_id"]
            }
          },
          {
            name: "get_logs",
            description: "Get logs for the project by service type",
            inputSchema: {
              type: "object",
              properties: {
                service: {
                  type: "string",
                  enum: ["api", "branch-action", "postgres", "edge-function", "auth", "storage", "realtime"]
                }
              },
              required: ["service"]
            }
          },
          {
            name: "get_advisors",
            description: "Get advisory notices for security/performance improvements",
            inputSchema: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["security", "performance"]
                }
              },
              required: ["type"]
            }
          },
          {
            name: "generate_typescript_types",
            description: "Generate TypeScript types for the project",
            inputSchema: {
              type: "object",
              properties: {}
            }
          },
          {
            name: "list_extensions",
            description: "List all extensions in the database",
            inputSchema: {
              type: "object",
              properties: {}
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "execute_sql":
            return await this.executeSql(args as { query: string });

          case "list_tables":
            return await this.listTables(args as { schemas?: string[] });

          case "list_migrations":
            return await this.listMigrations();

          case "apply_migration":
            return await this.applyMigration(args as { name: string; query: string });

          case "get_project_url":
            return await this.getProjectUrl();

          case "get_publishable_keys":
            return await this.getPublishableKeys();

          case "list_storage_buckets":
            return await this.listStorageBuckets();

          case "get_storage_config":
            return await this.getStorageConfig();

          case "update_storage_config":
            return await this.updateStorageConfig(args as { config: any });

          case "list_edge_functions":
            return await this.listEdgeFunctions();

          case "deploy_edge_function":
            return await this.deployEdgeFunction(args as {
              name: string;
              files: Array<{ content: string; name: string }>;
              entrypoint_path?: string;
              import_map_path?: string;
            });

          case "get_edge_function":
            return await this.getEdgeFunction(args as { function_slug: string });

          case "list_branches":
            return await this.listBranches();

          case "create_branch":
            return await this.createBranch(args as { name?: string; confirm_cost_id: string });

          case "delete_branch":
            return await this.deleteBranch(args as { branch_id: string });

          case "merge_branch":
            return await this.mergeBranch(args as { branch_id: string });

          case "rebase_branch":
            return await this.rebaseBranch(args as { branch_id: string });

          case "reset_branch":
            return await this.resetBranch(args as { branch_id: string; migration_version?: string });

          case "get_logs":
            return await this.getLogs(args as { service: string });

          case "get_advisors":
            return await this.getAdvisors(args as { type: string });

          case "generate_typescript_types":
            return await this.generateTypescriptTypes();

          case "list_extensions":
            return await this.listExtensions();

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  // Tool implementations
  private async executeSql(args: { query: string }) {
    try {
      const { data, error } = await this.supabase.rpc('exec_sql', { sql: args.query });

      if (error) {
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }]
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Failed to execute SQL: ${error instanceof Error ? error.message : String(error)}` }]
      };
    }
  }

  private async listTables(args: { schemas?: string[] }) {
    try {
      const schemas = args.schemas || ['public'];
      const { data, error } = await this.supabase
        .from('information_schema.tables')
        .select('table_schema, table_name')
        .in('table_schema', schemas);

      if (error) {
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }]
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Failed to list tables: ${error instanceof Error ? error.message : String(error)}` }]
      };
    }
  }

  private async listMigrations() {
    try {
      const { data, error } = await this.supabase
        .from('schema_migrations')
        .select('*')
        .order('version', { ascending: false });

      if (error) {
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }]
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Failed to list migrations: ${error instanceof Error ? error.message : String(error)}` }]
      };
    }
  }

  private async applyMigration(args: { name: string; query: string }) {
    try {
      // This would typically use Supabase's migration system
      // For now, we'll execute the SQL directly
      const { data, error } = await this.supabase.rpc('exec_sql', { sql: args.query });

      if (error) {
        return {
          content: [{ type: "text", text: `Error applying migration: ${error.message}` }]
        };
      }

      return {
        content: [{ type: "text", text: `Migration '${args.name}' applied successfully` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Failed to apply migration: ${error instanceof Error ? error.message : String(error)}` }]
      };
    }
  }

  private async getProjectUrl() {
    return {
      content: [{ type: "text", text: this.supabaseUrl }]
    };
  }

  private async getPublishableKeys() {
    // This would require access to Supabase management API
    // For now, return a placeholder
    return {
      content: [{ type: "text", text: "Publishable keys require management API access. Please check your Supabase dashboard." }]
    };
  }

  private async listStorageBuckets() {
    try {
      const { data, error } = await this.supabase.storage.listBuckets();

      if (error) {
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }]
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Failed to list storage buckets: ${error instanceof Error ? error.message : String(error)}` }]
      };
    }
  }

  private async getStorageConfig() {
    // Storage config requires management API
    return {
      content: [{ type: "text", text: "Storage config requires management API access." }]
    };
  }

  private async updateStorageConfig(args: { config: any }) {
    // Storage config update requires management API
    return {
      content: [{ type: "text", text: "Storage config update requires management API access." }]
    };
  }

  private async listEdgeFunctions() {
    // Edge functions require management API
    return {
      content: [{ type: "text", text: "Edge functions listing requires management API access." }]
    };
  }

  private async deployEdgeFunction(args: { name: string; files: Array<{ content: string; name: string }>; entrypoint_path?: string; import_map_path?: string }) {
    // Edge function deployment requires management API
    return {
      content: [{ type: "text", text: "Edge function deployment requires management API access." }]
    };
  }

  private async getEdgeFunction(args: { function_slug: string }) {
    // Edge function retrieval requires management API
    return {
      content: [{ type: "text", text: "Edge function retrieval requires management API access." }]
    };
  }

  private async listBranches() {
    // Branch operations require management API
    return {
      content: [{ type: "text", text: "Branch operations require management API access." }]
    };
  }

  private async createBranch(args: { name?: string; confirm_cost_id: string }) {
    return {
      content: [{ type: "text", text: "Branch creation requires management API access." }]
    };
  }

  private async deleteBranch(args: { branch_id: string }) {
    return {
      content: [{ type: "text", text: "Branch deletion requires management API access." }]
    };
  }

  private async mergeBranch(args: { branch_id: string }) {
    return {
      content: [{ type: "text", text: "Branch merge requires management API access." }]
    };
  }

  private async rebaseBranch(args: { branch_id: string }) {
    return {
      content: [{ type: "text", text: "Branch rebase requires management API access." }]
    };
  }

  private async resetBranch(args: { branch_id: string; migration_version?: string }) {
    return {
      content: [{ type: "text", text: "Branch reset requires management API access." }]
    };
  }

  private async getLogs(args: { service: string }) {
    return {
      content: [{ type: "text", text: "Log retrieval requires management API access." }]
    };
  }

  private async getAdvisors(args: { type: string }) {
    return {
      content: [{ type: "text", text: "Advisor retrieval requires management API access." }]
    };
  }

  private async generateTypescriptTypes() {
    return {
      content: [{ type: "text", text: "TypeScript type generation requires CLI access." }]
    };
  }

  private async listExtensions() {
    try {
      const { data, error } = await this.supabase
        .from('pg_extension')
        .select('extname, extversion');

      if (error) {
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }]
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Failed to list extensions: ${error instanceof Error ? error.message : String(error)}` }]
      };
    }
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Supabase MCP Server started");
  }
}

// Start the server
const server = new SupabaseMCPServer();
server.start().catch(console.error);