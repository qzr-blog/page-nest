import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { Cache } from 'cache-manager'
import { lastValueFrom } from 'rxjs'
import { Cron } from '@nestjs/schedule'

import everydayMsg from './script/everydayMsg'

@Injectable()
export class PluginService {
  constructor(private httpService: HttpService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getHitokoto() {
    const res = await this.httpService.get('https://v1.hitokoto.cn?c=d')
    const response = await lastValueFrom(res)
    return response.data
  }

  @Cron('0 0 2 * *')
  async getEverydayVal() {
    const res = await everydayMsg.call(this)
    await this.cacheManager.set('everydayMsg', res, { ttl: 0 })
  }

  async getEverydayMsg() {
    // const res = await everydayMsg.call(this)
    const res = await this.cacheManager.get('everydayMsg')
    return res
  }
}
