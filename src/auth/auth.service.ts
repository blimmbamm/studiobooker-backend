import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Repository } from 'typeorm';

export interface JwtPayload {
  sub: number;
  company: Company;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    private jwtService: JwtService,
  ) {}

  async signIn(
    companyName: string,
    // username: string,
    // pass: string,
  ): Promise<{ access_token: string }> {
    const company = await this.companyRepository.findOne({where: {name: companyName}})
    // check credentials with compareHash or similar
    // if (user?.password !== pass) {
    //   throw new UnauthorizedException();
    // }
    if(!company) {
      throw new UnauthorizedException()
    }

    const payload: JwtPayload = { sub: company.id, company: company };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  signOut(){
    // this.jwtService.
  }
}
