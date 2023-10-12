import { createClient } from 'redis'
import { Schema } from 'redis-om'

const redis = createClient()
redis.on('error', (err) => console.log('Redis Client Error', err));
await redis.connect()