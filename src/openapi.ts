// TODO:: Look into following links to automate openApiSpec generation
// https://hono.dev/examples/zod-openapi
// https://hono.dev/examples/hono-openapi
// Maybe we should put the swaggerdoc plus openapi spec in its own worker to keep the projsite-api bundle/worker as small as possible

export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Projsite API',
    version: '1.0.0',
    description: 'API Documentation'
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Organization: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          active: { type: 'boolean' },
          is_deleted: { type: 'boolean' },
          logo: { type: 'string' },
          warehouse_module: { type: 'boolean' },
          created_by_user: { type: 'string' },
          created_by_service: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          organization_id: { type: 'integer' },
          active: { type: 'boolean' },
          is_deleted: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'object' },
          error: { type: 'string' }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health Check',
        security: [{ bearerAuth: [] }],
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
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Unauthorized'
                }
              }
            }
          }
        }
      }
    },
    '/organizations': {
      get: {
        summary: 'List Organizations',
        security: [{ bearerAuth: [] }],
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
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string' },
                  active: { type: 'boolean' },
                  is_deleted: { type: 'boolean' },
                  logo: { type: 'string' },
                  warehouse_module: { type: 'boolean' },
                  created_by_user: { type: 'string' },
                  created_by_service: { type: 'string' }
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
    '/organizations/{id}': {
      get: {
        summary: 'Get Organization by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Organization details',
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
          },
          '404': {
            description: 'Organization not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' },
                example: {
                  success: false,
                  error: 'Organization not found'
                }
              }
            }
          }
        }
      },
      patch: {
        summary: 'Update Organization',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  active: { type: 'boolean' },
                  is_deleted: { type: 'boolean' },
                  logo: { type: 'string' },
                  warehouse_module: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Organization updated',
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
      },
      delete: {
        summary: 'Delete Organization',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Organization deleted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' },
                example: {
                  success: true,
                  data: { message: 'Organization deleted successfully' }
                }
              }
            }
          }
        }
      }
    },
    '/organizations/{id}/projects': {
      get: {
        summary: 'Get Organization Projects',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'List of organization projects',
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
      }
    }
  }
} 