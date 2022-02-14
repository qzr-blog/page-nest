import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'

import { encryptPassword, makeSalt } from 'src/utils/cryptogram.util'

import { User } from './entities/user.entity'

import { RegisterDTO } from './dto/register.dto'
import { LoginDTO } from './dto/login.dto'

import { TokenVO } from './vo/token.vo'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService
  ) {}

  // 校验注册信息
  async checkRegisterForm(registerDTO: RegisterDTO): Promise<any> {
    if (registerDTO.password !== registerDTO.passwordRepeat) {
      throw new NotFoundException('两次输入的密码不一致，请检查')
    }
    const { mobile } = registerDTO
    const hasUser = await this.userRepository.findOne({ mobile })
    if (hasUser) {
      throw new NotFoundException('用户已存在')
    }
  }

  // 注册
  async register(registerDTO: RegisterDTO): Promise<any> {
    await this.checkRegisterForm(registerDTO)

    const { username, password, mobile, email } = registerDTO
    const salt = makeSalt() // 制作密码盐
    const hashPassword = encryptPassword(password, salt) // 加密密码

    const newUser: User = new User()
    newUser.username = username
    newUser.mobile = mobile
    newUser.password = hashPassword
    newUser.salt = salt
    newUser.email = email
    const result = await this.userRepository.save(newUser)
    return result
  }

  // 登陆校验用户信息
  async checkLoginForm(loginDTO: LoginDTO): Promise<any> {
    const { mobile, password } = loginDTO
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.salt')
      .addSelect('user.password')
      .where('user.mobile = :mobile', { mobile })
      .getOne()

    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    const { password: dbPassword, salt } = user
    const currentHashPassword = encryptPassword(password, salt)
    if (currentHashPassword !== dbPassword) {
      throw new NotFoundException('密码错误')
    }

    return user
  }

  // 生成 token
  async certificate(user: User) {
    const payload = {
      id: user.id,
      username: user.username,
      mobile: user.mobile
    }
    const token = this.jwtService.sign(payload)
    return token
  }

  async login(loginDTO: LoginDTO): Promise<TokenVO> {
    const user = await this.checkLoginForm(loginDTO)
    const token = await this.certificate(user)
    return {
      info: {
        token
      }
    }
  }
}
