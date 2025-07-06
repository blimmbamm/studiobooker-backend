import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../constants';
import { EmailService } from 'src/email/email.service';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [
    CompanyModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
})
export class AuthModule {}
