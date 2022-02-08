import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'

import everydayMsg from './script/everydayMsg'

@Injectable()
export class PluginService {
  constructor(private httpService: HttpService) {}

  async getHitokoto() {
    const res = await this.httpService.get('https://v1.hitokoto.cn?c=d')
    const response = await lastValueFrom(res)
    return response.data
  }

  async getEverydayMsg() {
    const res = await everydayMsg.call(this)

    return res
  }
}
