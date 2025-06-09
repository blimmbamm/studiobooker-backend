import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SignInDto } from './dto/sign-in.dto';
import { Company } from 'src/company/entities/company.entity';
import { UseCompany } from './auth.decorator';
import { SignUpDto } from './dto/sign-up.dto';
import { VerifySignUpDto } from './dto/verify-sign-up.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto.email, signUpDto.password);

    return { message: 'success' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify')
  async verifySignUp(@Body() verifySignUpDto: VerifySignUpDto) {
    await this.authService.verifySignUp(
      verifySignUpDto.email,
      verifySignUpDto.token,
    );

    return { message: 'success' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // return this.authService.signIn(signInDto.email, signInDto.password);

    const token = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    res.cookie('token', token.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'success' };
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');

    return { message: 'success' };
  }

  @UseGuards(AuthGuard)
  @Get('company')
  getProfile(@UseCompany() company: Company) {
    return company;
  }
}
