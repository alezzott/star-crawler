export const getRabbitMQConfig = () => {
  const {
    RABBITMQ_USER = 'guest',
    RABBITMQ_PASS = 'guest',
    RABBITMQ_HOST = 'rabbitmq',
    RABBITMQ_PORT = '5672',
    RABBITMQ_QUEUE = 'star-crawler-queue',
  } = process.env;

  const url = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

  return {
    url,
    queue: RABBITMQ_QUEUE,
  };
};
