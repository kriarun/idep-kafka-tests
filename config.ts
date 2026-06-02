export const config = {
  kafka: {
    brokerUrl: process.env.KAFKA_BROKER_URL ?? 'localhost:9092',
    topicB: process.env.KAFKA_TOPIC_B ?? 'topic-b',
    groupId: process.env.KAFKA_GROUP_ID ?? 'idep-test-group',
    apiKey: process.env.KAFKA_API_KEY ?? '',
    apiSecret: process.env.KAFKA_API_SECRET ?? '',
  },
  test: {
    waitTimeoutMs: parseInt(process.env.KAFKA_WAIT_TIMEOUT_MS ?? '30000'),
  }
} as const;