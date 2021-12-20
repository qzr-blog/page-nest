import { Module } from '@nestjs/common'
import { PluginService } from './plugin.service'
import { PluginController } from './plugin.controller'
import { HttpService } from '@nestjs/axios'

@Module({
  controllers: [PluginController],
  providers: [PluginService],
  imports: [HttpService]
})
export class PluginModule {}
