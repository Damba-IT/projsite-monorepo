// TODO:: Look into following links to automate openApiSpec generation
// https://hono.dev/examples/zod-openapi
// https://hono.dev/examples/hono-openapi
// Maybe we should put the swaggerdoc plus openapi spec in its own worker to keep the projsite-api bundle/worker as small as possible

export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Projsite API",
    version: "1.0.0",
    description: "API Documentation with multiple authentication methods",
  },
  components: {
    securitySchemes: {
      clerkAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Clerk authentication for web clients",
      },
      serviceAuth: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key",
        description: "API key for service-to-service communication",
      },
    },
    schemas: {
      Organization: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          active: { type: "boolean" },
          is_deleted: { type: "boolean" },
          logo: { type: "string" },
          warehouse_module: { type: "boolean" },
          created_by_user: { type: "string" },
          created_by_service: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      Project: {
        type: "object",
        properties: {
          id: { type: "integer" },
          project_id: { type: "string" },
          name: { type: "string" },
          organization_id: { type: "integer" },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          status: { type: "string", enum: ["active", "inactive", "deleted"] },
          location_address: { type: "string" },
          location_formatted_address: { type: "string" },
          location_place_id: { type: "string" },
          location_lat: { type: "string" },
          location_lng: { type: "string" },
          created_by: { type: "string" },
          last_modified_by: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          settings: {
            type: "object",
            properties: {
              waste_booking_color: { type: "string" },
              resource_booking_color: { type: "string" },
              information: { type: "string" },
              shipment_module: { type: "boolean" },
              checkpoint_module: { type: "boolean" },
              warehouse_module: { type: "boolean" },
              waste_module: { type: "boolean" },
              inbox_module: { type: "boolean" },
              auto_approval: { type: "boolean" },
              waste_auto_approval: { type: "boolean" },
              sub_projects_enabled: { type: "boolean" },
            },
          },
          form_validation_rules: {
            type: "object",
            properties: {
              shipment_booking: {
                type: "object",
                properties: {
                  contractor: { type: "boolean" },
                  responsible_person: { type: "boolean" },
                  supplier: { type: "boolean" },
                  unloading_zone: { type: "boolean" },
                  prevent_zone_collide: { type: "boolean" },
                  sub_project: { type: "boolean" },
                  resources: { type: "boolean" },
                  env_data: { type: "boolean" },
                },
              },
              resource_booking: {
                type: "object",
                properties: {
                  contractor: { type: "boolean" },
                  responsible_person: { type: "boolean" },
                  sub_project: { type: "boolean" },
                  resources: { type: "boolean" },
                },
              },
              waste_booking: {
                type: "object",
                properties: {
                  sub_project: { type: "boolean" },
                  waste: { type: "boolean" },
                },
              },
            },
          },
        },
      },
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: { type: "object" },
          error: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        summary: "Health Check",
        security: [],
        responses: {
          "200": {
            description: "Server is healthy",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiResponse",
                },
                example: {
                  success: true,
                  data: { status: "ok" },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiResponse",
                },
                example: {
                  success: false,
                  error: "Unauthorized",
                },
              },
            },
          },
        },
      },
    },
    "/organizations": {
      get: {
        summary: "List Organizations",
        security: [{ clerkAuth: [] }, { serviceAuth: [] }],
        responses: {
          "200": {
            description: "List of organizations",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Organization" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create Organization",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string" },
                  active: { type: "boolean" },
                  is_deleted: { type: "boolean" },
                  logo: { type: "string" },
                  warehouse_module: { type: "boolean" },
                  created_by_user: { type: "string" },
                  created_by_service: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Organization created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Organization" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/organizations/{id}": {
      get: {
        summary: "Get Organization by ID",
        security: [{ clerkAuth: [] }, { serviceAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Organization details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Organization" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Organization not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
                example: {
                  success: false,
                  error: "Organization not found",
                },
              },
            },
          },
        },
      },
      patch: {
        summary: "Update Organization",
        security: [{ clerkAuth: [] }, { serviceAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  active: { type: "boolean" },
                  is_deleted: { type: "boolean" },
                  logo: { type: "string" },
                  warehouse_module: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Organization updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Organization" },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete Organization",
        security: [{ clerkAuth: [] }, { serviceAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Organization deleted",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
                example: {
                  success: true,
                  data: { message: "Organization deleted successfully" },
                },
              },
            },
          },
        },
      },
    },
    "/organizations/{id}/projects": {
      get: {
        summary: "Get Organization Projects",
        security: [{ clerkAuth: [] }, { serviceAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "List of organization projects",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Project" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/swagger": {
      get: {
        summary: "Swagger UI",
        security: [{ clerkAuth: [] }, { serviceAuth: [] }],
        responses: {
          "200": {
            description: "Swagger UI page",
          },
        },
      },
    },
    "/swagger.json": {
      get: {
        summary: "OpenAPI Specification",
        security: [{ clerkAuth: [] }, { serviceAuth: [] }],
        responses: {
          "200": {
            description: "OpenAPI specification in JSON format",
          },
        },
      },
    },
    "/projects": {
      get: {
        summary: "List Projects",
        security: [{ clerkAuth: [] }, { serviceAuth: [] }],
        responses: {
          "200": {
            description: "List of projects",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Project" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create Project",
        security: [{ clerkAuth: [] }, { serviceAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "project_id",
                  "name",
                  "organization_id",
                  "start_date",
                  "end_date",
                  "created_by",
                ],
                properties: {
                  project_id: { type: "string" },
                  name: { type: "string" },
                  organization_id: { type: "integer" },
                  start_date: { type: "string", format: "date-time" },
                  end_date: { type: "string", format: "date-time" },
                  location_address: { type: "string" },
                  location_formatted_address: { type: "string" },
                  location_place_id: { type: "string" },
                  location_lat: { type: "string" },
                  location_lng: { type: "string" },
                  created_by: { type: "string" },
                  settings: {
                    $ref: "#/components/schemas/Project/properties/settings",
                  },
                  form_validation_rules: {
                    $ref: "#/components/schemas/Project/properties/form_validation_rules",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Project created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Project" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/projects/{id}": {
      get: {
        summary: "Get Project by ID",
        security: [{ clerkAuth: [] }, { serviceAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Project details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Project" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Project not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
                example: {
                  success: false,
                  error: "Project not found",
                },
              },
            },
          },
        },
      },
      patch: {
        summary: "Update Project",
        security: [{ clerkAuth: [] }, { serviceAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["last_modified_by"],
                properties: {
                  name: { type: "string" },
                  start_date: { type: "string", format: "date-time" },
                  end_date: { type: "string", format: "date-time" },
                  status: {
                    type: "string",
                    enum: ["active", "inactive", "deleted"],
                  },
                  location_address: { type: "string" },
                  location_formatted_address: { type: "string" },
                  location_place_id: { type: "string" },
                  location_lat: { type: "string" },
                  location_lng: { type: "string" },
                  last_modified_by: { type: "string" },
                  settings: {
                    $ref: "#/components/schemas/Project/properties/settings",
                  },
                  form_validation_rules: {
                    $ref: "#/components/schemas/Project/properties/form_validation_rules",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Project updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Project" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Project not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete Project",
        security: [{ clerkAuth: [] }, { serviceAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Project deleted",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
                example: {
                  success: true,
                  data: { message: "Project deleted successfully" },
                },
              },
            },
          },
          "404": {
            description: "Project not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
        },
      },
    },
  },
};
