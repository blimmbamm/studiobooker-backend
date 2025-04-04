import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SignInDto } from './dto/sign-in.dto';
import { Company } from 'src/company/entities/company.entity';
import { UseCompany } from './auth.decorator';
import { SignUpDto } from './dto/sign-up.dto';
import { VerifySignUpDto } from './dto/verify-sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto.email, signUpDto.password);
  }
  
  @HttpCode(HttpStatus.OK)
  @Post('verify')
  verifySignUp(@Body() verifySignUpDto: VerifySignUpDto) {
    return this.authService.verifySignUp(
      verifySignUpDto.email,
      verifySignUpDto.token,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('company')
  getProfile(@UseCompany() company: Company) {
    return company;
  }
}
