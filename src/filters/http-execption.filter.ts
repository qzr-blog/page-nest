/*
 * @Date         : 2021-12-21 10:40:00
 * @Description  : 全局接口失败拦截器 包装失败信息
 * @Autor        : Qzr(z5021996@vip.qq.com)
 * @LastEditors  : Qzr(z5021996@vip.qq.com)
 * @LastEditTime : 2021-12-21 11:06:59
 */

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    // service返回的错误信息
    const message = exception.message

    // 验证器validator 错误信息
    const exceptionResponse: any = exception.getResponse()
    let validatorMessage = exceptionResponse
    if (typeof validatorMessage === 'object') {
      validatorMessage = exceptionResponse.message
      if (validatorMessage instanceof Array) {
        validatorMessage = validatorMessage[0]
      }
    }

    Logger.log({ exception })

    response.status(status).json({
      code: status,
      message: validatorMessage || message
    })
  }
}
