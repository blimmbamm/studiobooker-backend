import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) {}

  create(createCompanyDto: CreateCompanyDto) {
    const newCompany = this.companyRepository.create(createCompanyDto);

    return this.companyRepository.save(newCompany);
  }

  findAll() {
    return `This action returns all company`;
  }

  findOne(id: number) {
    return this.companyRepository.findOne({ where: { id } });
  }

  findOneByMail(email: string) {
    return this.companyRepository.findOne({
      where: { email },
    });
  }

  async emailIsAlreadyUsed(email: string) {
    return !!(await this.findOneByMail(email));
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.findOne(id);

    if (!company) {
      throw new NotFoundException();
    }

    const updatedCompany: Company = {
      ...company,
      ...updateCompanyDto,
      verified: true,
      hashedVerificationToken: null,
      verificationTokenExpiresAt: null,
    };

    return this.companyRepository.save(updatedCompany);
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
