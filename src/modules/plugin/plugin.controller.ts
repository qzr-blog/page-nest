import { Controller, Get } from '@nestjs/common'
import { PluginService } from './plugin.service'
import { HttpService } from '@nestjs/axios'

@Controller('plugin')
export class PluginController {
  constructor(private readonly pluginService: PluginService, private httpService: HttpService) {}

  @Get('/hitokoto')
  getHitokoto() {
    return this.pluginService.getHitokoto()
  }
}
