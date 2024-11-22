import type { ElysiaSwaggerConfig } from '@elysiajs/swagger';

export const SWAGGER_CONFIG: ElysiaSwaggerConfig<'/api/docs'> = {
  exclude: ['/api/docs', '/api/docs/json', '/api/ready', '/api/live'],
  path: '/api/docs',
  provider: 'swagger-ui',
  autoDarkMode: false,
  documentation: {
    info: {
      title: Bun.env.SWAGGER_TITLE ?? 'API Docs',
      version: Bun.env.SWAGGER_VERSION ?? '1.0',
      description: Bun.env.SWAGGER_DESC ?? 'API documentation',
      contact: {
        email: Bun.env.SWAGGER_CONTACT_EMAIL ?? 'ateebkhan997@gmail.com',
        name: Bun.env.SWAGGER_CONTACT_NAME ?? 'Ateeb Khan',
        url: Bun.env.SWAGGER_CONTACT_URL ?? 'https://ateebportfolio.vercel.app/',
      },
    },
    security: [{ BearerAuth: [] }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
  },
};
