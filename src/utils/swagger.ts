import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Appeals API',
      version: '1.0.0',
      description: 'API для управления обращениями',
    },
    servers: [
      {
        url: 'http://localhost:5000/',
        description: 'Локальный сервер',
      },
    ],
    components: {
      schemas: {
        Appeal: {
          type: 'object',
          required: ['theme', 'text'],
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
              example: 1,
              description: 'Уникальный идентификатор обращения'
            },
            theme: {
              type: 'string',
              example: 'Проблема с доступом',
              description: 'Тема обращения'
            },
            text: {
              type: 'string',
              example: 'Не могу войти в систему',
              description: 'Текст обращения'
            },
            status: {
              type: 'string',
              enum: ['new', 'in_progress', 'completed', 'canceled'],
              example: 'new',
              description: 'Статус обращения'
            },
            resolution: {
              type: 'string',
              nullable: true,
              example: 'Пароль был успешно сброшен',
              description: 'Решение проблемы'
            },
            cancellationReason: {
              type: 'string',
              nullable: true,
              example: 'Дубликат существующего обращения',
              description: 'Причина отмены'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-11-20T12:00:00Z',
              description: 'Дата создания'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-11-20T12:05:00Z',
              description: 'Дата последнего обновления'
            }
          },
          description: 'Сущность обращения в системе'
        }
      }
    },
    tags: [
      {
        name: 'Appeals',
        description: 'Управление обращениями'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/dto/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);