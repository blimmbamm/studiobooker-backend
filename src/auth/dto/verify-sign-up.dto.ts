import { IsEmail, IsString } from "class-validator";

export class VerifySignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  token: string;
}