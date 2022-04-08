import { lastValueFrom } from 'rxjs'
import cheerio from 'cheerio'
import { pushBark } from '@/script/push'

interface goodsInfo {
  title: string
  price: string
  url: string
  comment: string // 评论数
  img: string
  up: number // 值
  down?: number // 不值
  chance?: number // 值率
  collcet?: string // 收藏
}

enum getType {
  Faxian = 'Faxian',
  Fenlei = 'Fenlei',
  Search = 'Search'
}

export default async function () {
  const promiseArr = [
    {
      title: '全品类',
      url: 'https://faxian.smzdm.com/h2s0t0f0c1p1/#filter-block'
    },
    {
      title: '电脑配件榜',
      url: 'https://www.smzdm.com/fenlei/diannaopeijian/h3c4s0f0t0p1/#feed-main/'
    },
    {
      title: 'ipad air5',
      url: 'https://search.smzdm.com/?c=faxian&s=ipad+air5&f_c=zhi&min_price=3000&max_price=6000&v=b'
    }
  ]

  const promiseList = await Promise.allSettled(promiseArr.map((x) => this.httpService.get(x.url)))
  const promiseVal = await Promise.allSettled(promiseList.map((x: any) => lastValueFrom(x.value)))

  let smzdmArr = []

  promiseVal.forEach((item, index) => {
    const { title, url } = promiseArr[index]
    let goodsArr: goodsInfo[]
    let type: getType

    const $ = cheerio.load(String((<any>item).value.data))

    if (url.indexOf('search.smzdm.com') !== -1) {
      // 搜索页
      type = getType.Search
      goodsArr = getSearchGoods.call(this, $)
    } else if (url.indexOf('/fenlei/') !== -1) {
      // 排行榜页
      type = getType.Fenlei
      goodsArr = getFenleiGoods.call(this, $)
    } else if (url.indexOf('faxian.smzdm.com') !== -1) {
      // 发现页
      type = getType.Faxian
      goodsArr = getFaxianGoods.call(this, $)
    }

    smzdmArr.push({
      title,
      type,
      content: goodsArr
    })
  })

  checkPush.call(this, smzdmArr)

  return smzdmArr

  /**
   * 计算值率
   * @param e dom元素
   * @returns 值率
   */
  function getChance(e) {
    const up = Number(e.find('.price-btn-up .unvoted-wrap span').text())
    const down = Number(e.find('.price-btn-down .unvoted-wrap span').text())
    let chance = 0

    if (up + down !== 0) {
      chance = Math.floor((up / (up + down)) * 100)
    }

    return {
      chance,
      up,
      down
    }
  }

  function getSearchGoods($) {
    let resArr: goodsInfo[] = []
    $('.feed-row-wide').each((i, e) => {
      const chance = getChance($(e))
      if (chance.chance !== 0) {
        const info = {
          title: $(e).find('.feed-block-title .feed-nowrap').text().trim().replace(/\s*/g, ''),
          price: $(e).find('.feed-block-title .z-highlight').text().trim(),
          chance: chance.chance,
          url: $(e).find('.feed-block-title a').attr('href'),
          collcet: $(e).find('.z-feed-foot-l .z-group-data span').first().text(),
          comment: $(e).find('.z-feed-foot-l .z-group-data span').last().text(),
          img: `https://images.weserv.nl/?url=https:${$(e).find('.z-feed-img img').attr('src')}`,
          down: chance.down,
          up: chance.up
        }
        resArr.push(info)
      }
    })
    return resArr
  }

  function getFenleiGoods($) {
    let resArr: goodsInfo[] = []
    $('.feed-row-wide').each((i, e) => {
      const chance = getChance($(e))
      if (chance.chance !== 0) {
        const info = {
          title: $(e).find('.feed-block-title a').text().trim().replace(/\s*/g, ''),
          price: $(e).find('.z-highlight a').text().trim(),
          chance: chance.chance,
          url: $(e).find('.feed-block-title a').attr('href'),
          collcet: $(e).find('.z-feed-foot-l .z-group-data span').first().text(),
          comment: $(e).find('.z-feed-foot-l .z-group-data span').last().text(),
          img: `https://images.weserv.nl/?url=https:${$(e).find('.z-feed-img img').attr('src')}`,
          down: chance.down,
          up: chance.up
        }
        resArr.push(info)
      }
    })
    return resArr
  }

  function getFaxianGoods($) {
    let resArr: goodsInfo[] = []
    $('.feed-list-col .J_feed_za').each((i, e) => {
      const info = {
        title: $(e).find('.feed-ver-title a').text().trim().replace(/\s*/g, ''),
        price: $(e).find('.z-highlight').text().trim(),
        url: $(e).find('.feed-ver-title a').attr('href'),
        comment: $(e).find('.z-group-data').last().text(),
        img: `https://images.weserv.nl/?url=${$(e).find('.feed-ver-pic img').attr('src')}`,
        up: $(e).find('.unvoted-wrap').text()
      }
      resArr.push(info)
    })
    return resArr
  }

  /**
   * 获取值得推送的商品
   * @param infoArr 所有商品信息
   */
  async function checkPush(infoArr) {
    const pushStr = await this.cacheManager.get('pushStr')
    let newPushStr = ''

    for (const item of infoArr) {
      const { type } = item
      for (const info of item.content) {
        const { up, title, comment } = info

        if (pushStr?.includes(title)) continue

        if (type === 'Faxian') {
          if (up > 100 && Number(comment) > 100) {
            goPush.call(this, title)
          }
        } else if (type === 'Search') {
          if (up > 10 && Number(comment) > 10 && info?.chance > 90) {
            goPush.call(this, title)
          }
        } else if (type === 'Fenlei') {
          if (up > 20 && Number(comment) > 20 && info?.chance > 90) {
            goPush.call(this, title)
          }
        }
      }
    }

    await this.cacheManager.set('pushStr', `${pushStr}|${newPushStr}`, { ttl: 0 })

    async function goPush(title: string) {
      pushBark(title)
      newPushStr += `|${title}`
    }
  }
}
