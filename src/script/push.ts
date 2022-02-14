import axios from 'axios'

export function pushBark(content: string) {
  const barkUrl = 'https://router.qzran.cn:8027/dJccmbJQsSiYBmyoDZ2T2f/'
  let res = barkUrl + encodeURI(content)
  console.log('thissssssssssssss', res)
  axios.get(res)
}
