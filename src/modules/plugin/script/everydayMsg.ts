import { lastValueFrom } from 'rxjs'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

const txKey = 'cad9aba47305ebce4b84d90281b1f543'

export default async function () {
  let str = 'to 蝶宝 \n 然宝提醒你 \n'

  const moring = str + `${await getMoring.call(this)} \n`

  const chp = str + `${await getChp.call(this)} \n `

  const fish = str + `${await getHoliday.call(this)} \n`

  const love = str + `${await getLove.call(this)} \n`

  const night = str + `${await getNight.call(this)} \n`

  const news = str + `${await getNews.call(this)} \n`

  const areanews = str + `${await getAreanews.call(this)} \n`

  return {
    moring,
    fish,
    chp,
    love,
    night,
    news,
    areanews
  }
}

/**
 * 获取彩虹屁
 */
async function getChp() {
  let str = ''
  const chpRes = await this.httpService.get(`http://api.tianapi.com/caihongpi/index?key=${txKey}`)
  const chpResponse: any = await lastValueFrom(chpRes)
  str += chpResponse.data.newslist[0].content
  return str
}

/**
 * 获取土味情话
 */
async function getLove() {
  let str = ''
  const loveRes = await this.httpService.get(`http://api.tianapi.com/saylove/index?key=${txKey}`)
  const loveResponse: any = await lastValueFrom(loveRes)
  str += loveResponse.data.newslist[0].content
  return str
}

/**
 * 获取节假日信息
 */
async function getHoliday() {
  dayjs.locale('zh-cn')
  const now = dayjs()
  const nowString = now.format('YYYY-MM-DD')
  let str = `现在是摸鱼时间 \n今天是${nowString} \n`

  const jjrRes = await this.httpService.get(`http://api.tianapi.com/jiejiari/index?key=${txKey}&date=${nowString}&type=1`)
  const jjrResponse: any = await lastValueFrom(jjrRes)

  const newslist = jjrResponse.data.newslist

  for (const item of newslist) {
    const { wage } = item
    let holidayFirst = ''
    if (wage.includes('|')) holidayFirst = wage.split('|')[0]
    else holidayFirst = wage

    item.until = dayjs(holidayFirst).diff(now, 'day')
    if (item.until < 0) continue

    str += `距离${item.name}还有：${item.until}天 \n`
  }
  return str
}

/**
 * 获取早安心语
 */
async function getMoring() {
  let str = '该起床啦 不要睡懒觉当居居哦 \n'
  const mroingRes = await this.httpService.get(`http://api.tianapi.com/zaoan/index?key=${txKey}`)
  const mroingResponse: any = await lastValueFrom(mroingRes)
  str += mroingResponse.data.newslist[0].content
  return str
}

/**
 * 获取晚安心语
 */
async function getNight() {
  let str = '该碎觉啦 不准熬夜 要打屁屁哦 \n'
  const nightRes = await this.httpService.get(`http://api.tianapi.com/wanan/index?key=${txKey}`)
  const nightResponse: any = await lastValueFrom(nightRes)
  str += nightResponse.data.newslist[0].content
  return str
}

/**
 * 获取新闻
 */
async function getNews() {
  let str = '现在是新闻时间 \n'
  const newsRes = await this.httpService.get(`http://api.tianapi.com/networkhot/index?key=${txKey}`)
  const newsResponse: any = await lastValueFrom(newsRes)

  for (const item of newsResponse.data.newslist) {
    str += `${item.title} \n `
    // str += `${item.digest} \n`
  }
  return str
}

/**
 * 获取湖北新闻
 */
async function getAreanews() {
  let str = '现在是湖北新闻时间 \n'
  const newsRes = await this.httpService.get(`http://api.tianapi.com/areanews/index?key=${txKey}&areaname=${encodeURI('湖北')}`)
  const newsResponse: any = await lastValueFrom(newsRes)

  for (const item of newsResponse.data.newslist) {
    str += `${item.title} \n `
    // str += `${item.digest} \n`
  }
  return str
}
