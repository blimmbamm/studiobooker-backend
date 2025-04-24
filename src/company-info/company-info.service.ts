import { Injectable } from '@nestjs/common';
import { CreateCompanyInfoDto } from './dto/create-company-info.dto';
import { UpdateCompanyInfoDto } from './dto/update-company-info.dto';

@Injectable()
export class CompanyInfoService {
  create(createCompanyInfoDto: CreateCompanyInfoDto) {
    return 'This action adds a new companyInfo';
  }

  findAll() {
    return `This action returns all companyInfo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} companyInfo`;
  }

  update(id: number, updateCompanyInfoDto: UpdateCompanyInfoDto) {
    return `This action updates a #${id} companyInfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} companyInfo`;
  }
}
