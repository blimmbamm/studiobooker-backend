import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedRequest, AuthGuard } from './auth.guard';
import { SignInDto } from './dto/sign-in.dto';
import { Company } from 'src/company/entities/company.entity';
import { UseCompany } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) { 
    // Todo: Add class validator here
    return this.authService.signIn(signInDto.companyIdentifier);
  }

  @UseGuards(AuthGuard)
  @Get('company')
  getProfile(@UseCompany() company: Company ) {
    return company;
  }

}
