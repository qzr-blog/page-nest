import { Module, CacheModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PluginModule } from './modules/plugin/plugin.module'
import { ArticleModule } from './modules/article/article.module'
import { UserModule } from './modules/user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import envConfig from './config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CrawlerModule } from './modules/crawler/crawler.module'
import * as redisStore from 'cache-manager-redis-store'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    // 配置
    ConfigModule.forRoot({
      isGlobal: true, // 全局模块
      load: [envConfig], // 加载配置
      ignoreEnvFile: true // 禁止加载 .env 文件
    }),
    // 使用 TypeORM 配置数据库
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // 引入 ConfigModule
      inject: [ConfigService], // 注入 ConfigService
      useFactory: (configService: ConfigService) => {
        const DATABASE_CONFIG = configService.get('DATABASE_CONFIG')
        console.log('DATABASE_CONFIG ===========>', DATABASE_CONFIG.entities)
        return DATABASE_CONFIG
      } // 获取配置信息
    }),
    CacheModule.register({
      store: redisStore,
      port: 6379,
      host: 'localhost',
      password: 66668888,
      isGlobal: true
    }),
    PluginModule,
    ArticleModule,
    UserModule,
    CrawlerModule,
    ScheduleModule.forRoot()
  ]
})
export class AppModule {}
