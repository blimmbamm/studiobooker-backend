import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateCompanyDto {
  @IsEmail()
  email: string;

  @IsString()
  hashedPassword: string;

  @IsString()
  @ValidateIf((object: CreateCompanyDto) => !!object.hashedVerificationToken)
  hashedVerificationToken: string | null;

  @IsDate()
  @ValidateIf((object: CreateCompanyDto) => !!object.verificationTokenExpiresAt)
  verificationTokenExpiresAt: Date | null;

  @IsBoolean()
  verified: boolean;
}
