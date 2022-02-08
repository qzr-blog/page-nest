import * as redisStore from 'cache-manager-redis-store'

export default {
  // 服务基本配置
  SERVICE_CONFIG: {
    // 端口
    port: 3000,
    // 静态文件路径 localhost:3000/static/upload/xxx.jpg
    uploadStaticSrc: 'upload'
  },

  // swagger 配置
  SWAGGER_CONFIG: {
    enableSwagger: true
  },

  // 数据库配置
  DATABASE_CONFIG: {
    type: 'mysql',
    // host: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '66668888',
    database: 'page',
    // entities: ['../dist/modules/**/*.entity{.ts,.js}'],
    // entities: [`./src/**/*.entity{.ts,.js}`],
    entities: ['dist/**/*.entity.js'],
    synchronize: true,
    charset: 'utf8mb4',
    logging: false
  },

  // JWT 配置
  JWT_CONFIG: {
    secret: 'qzrisgood', // 密钥
    signOptions: {
      expiresIn: '24h' // token 过期时效
    }
  },

  REDIS_CONFIG: {
    store: redisStore,
    port: 6379,
    host: 'localhost',
    password: 66668888,
    isGlobal: true
  }
}
