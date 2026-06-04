export const config = {
  kafka: {
    brokerUrl: process.env.KAFKA_BROKER_URL ?? 'localhost:9092',
    topic: process.env.KAFKA_TOPIC ?? 'topic-b',
    groupId: `${process.env.KAFKA_GROUP_ID ?? 'idep-test-group'}-${Date.now()}`,
    username: process.env.KAFKA_USERNAME ?? '',
    password: process.env.KAFKA_PASSWORD ?? '',
  },
  test: {
    maxWaitForMessageMs: parseInt(process.env.MAX_WAIT_FOR_MESSAGE_MS ?? '30000'),
  }
} as const;