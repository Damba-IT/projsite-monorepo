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
    }
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health Check',
        responses: {
          '200': {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok'
                    }
                  }
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
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      createdAt: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    // Add more endpoint documentation here
  }
} 