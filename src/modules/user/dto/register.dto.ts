import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Matches, IsEmail } from 'class-validator'
import { regMobileCN } from 'src/utils/regex.util'

export class RegisterDTO {
  @ApiProperty({
    description: '手机号，唯一',
    example: '13049153466'
  })
  @Matches(regMobileCN, { message: '请输入正确手机号' })
  @IsNotEmpty({ message: '请输入手机号' })
  readonly mobile: string

  @ApiProperty({
    description: '用户名',
    example: 'Qzr'
  })
  @IsNotEmpty({ message: '请输入用户昵称' })
  @IsString({ message: '名字必须是 String 类型' })
  readonly username: string

  @ApiProperty({
    description: '邮箱',
    example: 'z5021996@vip.qq.com'
  })
  @IsNotEmpty({ message: '请输入邮箱' })
  @IsEmail({ message: '邮箱类型' })
  readonly email: string

  @ApiProperty({
    description: '用户密码',
    example: '123456'
  })
  @IsNotEmpty({ message: '请输入密码' })
  readonly password: string

  @ApiProperty({
    description: '二次输入密码',
    example: '123456'
  })
  @IsNotEmpty({ message: '请再次输入密码' })
  readonly passwordRepeat: string
}
