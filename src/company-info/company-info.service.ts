import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyInfoDto } from './dto/create-company-info.dto';
import { UpdateCompanyInfoDto } from './dto/update-company-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyInfo } from './entities/company-info.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class CompanyInfoService {
  constructor(
    @InjectRepository(CompanyInfo)
    private companyInfoRepository: Repository<CompanyInfo>,
  ) {}

  create() {
    return this.companyInfoRepository.create();
  }

  findAll() {
    return `This action returns all companyInfo`;
  }

  getInfoByCompanyId(companyId: number) {
    return this.companyInfoRepository.findOne({
      where: { company: { id: companyId } },
    });
  }

  async update(
    company: Company,
    id: number,
    updateCompanyInfoDto: UpdateCompanyInfoDto,
  ): Promise<CompanyInfo> {
    const info = await this.companyInfoRepository.findOne({
      where: { id, company },
    });

    if (!info) {
      throw new NotFoundException();
    }

    return this.companyInfoRepository.save({
      ...info,
      ...updateCompanyInfoDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} companyInfo`;
  }
}
