// TODO:: Look into following links to automate openApiSpec generation
// https://hono.dev/examples/zod-openapi
// https://hono.dev/examples/hono-openapi
// Maybe we should put the swaggerdoc plus openapi spec in its own worker to keep the projsite-api bundle/worker as small as possible

export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Projsite API (MongoDB)',
    version: '1.0.0',
    description: 'API Documentation with multiple authentication methods'
  },
  components: {
    securitySchemes: {
      clerkAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Clerk authentication for web clients'
      },
      serviceAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API key for service-to-service communication'
      }
    },
    schemas: {
      Organization: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          active: { type: 'boolean' },
          is_deleted: { type: 'boolean' },
          logo: { type: 'string' },
          settings: { 
            type: 'object',
            properties: {
              warehouse_module: { type: 'boolean' }
            }
          },
          created_by_user: { type: 'string' },
          created_by_service: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      Project: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          project_id: { type: 'string' },
          name: { type: 'string' },
          organization_id: { type: 'string' },
          start_date: { type: 'string', format: 'date-time' },
          end_date: { type: 'string', format: 'date-time' },
          status: { type: 'string', enum: ['active', 'inactive', 'deleted'] },
          location_address: { type: 'string' },
          location_lat: { type: 'number' },
          location_lng: { type: 'number' },
          settings: {
            type: 'object',
            properties: {
              waste_booking_color: { type: 'string' },
              resource_booking_color: { type: 'string' },
              modules: {
                type: 'object',
                properties: {
                  waste_booking: { type: 'boolean' },
                  resource_booking: { type: 'boolean' },
                  shipment_booking: { type: 'boolean' }
                }
              }
            }
          },
          form_validation_rules: {
            type: 'object',
            properties: {
              shipment_booking: {
                type: 'object',
                properties: {
                  required_fields: { type: 'array', items: { type: 'string' } }
                }
              },
              resource_booking: {
                type: 'object',
                properties: {
                  required_fields: { type: 'array', items: { type: 'string' } }
                }
              },
              waste_booking: {
                type: 'object',
                properties: {
                  required_fields: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          },
          active: { type: 'boolean' },
          is_deleted: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          created_by_user: { type: 'string' },
          created_by_service: { type: 'string' },
          last_modified_by: { type: 'string' }
        }
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'object' },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
              details: { type: 'object' }
            }
          }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health Check',
        security: [],
        responses: {
          '200': {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: true,
                  data: { status: 'ok' }
                }
              }
            }
          }
        }
      }
    },
    '/v1/organizations': {
      get: {
        summary: 'List Organizations',
        security: [
          { clerkAuth: [] },
          { serviceAuth: [] }
        ],
        responses: {
          '200': {
            description: 'List of organizations',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Organization' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create Organization',
        security: [
          { clerkAuth: [] },
          { serviceAuth: [] }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string' },
                  logo: { type: 'string' },
                  settings: {
                    type: 'object',
                    properties: {
                      warehouse_module: { type: 'boolean' }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Organization created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Organization' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/v1/projects': {
      get: {
        summary: 'List Projects',
        security: [
          { clerkAuth: [] },
          { serviceAuth: [] }
        ],
        responses: {
          '200': {
            description: 'List of projects',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Project' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create Project',
        security: [
          { clerkAuth: [] },
          { serviceAuth: [] }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'organization_id', 'start_date', 'end_date'],
                properties: {
                  name: { type: 'string' },
                  organization_id: { type: 'string' },
                  start_date: { type: 'string', format: 'date-time' },
                  end_date: { type: 'string', format: 'date-time' },
                  location_address: { type: 'string' },
                  location_lat: { type: 'number' },
                  location_lng: { type: 'number' },
                  settings: { $ref: '#/components/schemas/Project/properties/settings' },
                  form_validation_rules: { $ref: '#/components/schemas/Project/properties/form_validation_rules' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Project created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Project' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}; 