import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PluginModule } from './modules/plugin/plugin.module'
import { ArticleModule } from './modules/article/article.module'

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [PluginModule, ArticleModule]
})
export class AppModule {}
