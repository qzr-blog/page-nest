import { Module } from '@nestjs/common'
import { PluginService } from './plugin.service'
import { PluginController } from './plugin.controller'
import { HttpModule } from '@nestjs/axios'

@Module({
  controllers: [PluginController],
  providers: [PluginService],
  imports: [HttpModule]
})
export class PluginModule {}
