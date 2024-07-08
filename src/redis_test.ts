import Redis from './redis';

(async () => {
  const redis = new Redis('redis://redis:6379');
  const ping = await redis.ping().catch((error) => {
    // handle rejection here
    console.error('Error:', error);
  });
  console.log('ping =>', ping);
})().catch((error) => {
  // handle rejection here
  console.error('Error:', error);
});
