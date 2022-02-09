import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { Cache } from 'cache-manager'
import { lastValueFrom } from 'rxjs'
import { Cron } from '@nestjs/schedule'

import everydayMsg from './script/everydayMsg'

@Injectable()
export class PluginService {
  constructor(private httpService: HttpService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Cron('0 */10 * * * *')
  async getHitokotoVal() {
    const res = await this.httpService.get('https://v1.hitokoto.cn?c=d')
    const response = await lastValueFrom(res)
    await this.cacheManager.set('hitokoto', response.data, { ttl: 0 })
  }

  async getHitokoto() {
    const res = await this.cacheManager.get('hitokoto')
    return res
  }

  @Cron('0 0 2 * * *')
  async getEverydayVal() {
    console.log('getEverydayVal')
    const res = await everydayMsg.call(this)
    await this.cacheManager.set('everydayMsg', res, { ttl: 0 })
  }

  async getEverydayMsg() {
    // const res = await everydayMsg.call(this)
    const res = await this.cacheManager.get('everydayMsg')
    if (res === null) {
      await this.getEverydayVal()
      const response = await this.getEverydayMsg()
      return response
    }
    return res
  }
}
