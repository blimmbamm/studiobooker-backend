import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hash } from 'bcrypt';
import { randomInt } from 'crypto';
import { EmailService } from 'src/email/email.service';
import { CompanyService } from 'src/company/company.service';

export interface JwtPayload {
  sub: number;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private emailService: EmailService,
    private companyService: CompanyService,
  ) {}

  async signUp(email: string, password: string) {
    if (await this.companyService.emailIsAlreadyUsed(email)) {
      throw new ConflictException('Email is already used');
    }

    // Generate password hash and verification token
    const hashedPassword = await hash(password, 10);
    const token = randomInt(100000, 999999).toString();
    const hashedVerificationToken = await hash(token, 10);
    const verificationTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 10);

    // Create new company
    await this.companyService.create({
      email,
      hashedPassword,
      hashedVerificationToken,
      verificationTokenExpiresAt,
      verified: false,
    });

    // Send verification email
    this.emailService.sendEmail(
      email,
      'Your verification token',
      `Token: ${token}`,
    );
  }

  async verifySignUp(email: string, token: string) {
    const company = await this.companyService.findOneByMail(email);

    // Check several things that should lead to failure
    if (
      !company ||
      !company.hashedVerificationToken ||
      !company.verificationTokenExpiresAt ||
      company.verificationTokenExpiresAt.getTime() < Date.now()
    ) {
      throw new BadRequestException('Invalid or expired token');
    }

    // Check token equality
    if (compareSync(token, company.hashedVerificationToken)) {
      // If token is correct, update company
      this.companyService.update(company.id, {
        verified: true,
        hashedVerificationToken: null,
        verificationTokenExpiresAt: null,
      });
    } else {
      throw new BadRequestException('Invalid token');
    }
  }

  private tokenIsExpired() {}

  async signIn(email: string, password: string) {
    const company = await this.companyService.findOneByMail(email);

    if (!company) {
      throw new BadRequestException('Wrong credentials');
    }

    if (compareSync(password, company.hashedPassword)) {
      // If credentials are correct, create access token
      const payload: JwtPayload = { sub: company.id };
      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new BadRequestException('Wrong credentials');
    }
  }

  signOut() {}
}
