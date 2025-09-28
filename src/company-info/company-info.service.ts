import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCompanyInfoDto } from './dto/update-company-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyInfo } from './entities/company-info.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class CompanyInfoService {
  constructor(
    @InjectRepository(CompanyInfo)
    private companyInfoRepository: Repository<CompanyInfo>,
  ) {}

  create(timezone: string) {
    return this.companyInfoRepository.create({ timezone });
  }

  async getTimezone(company: Company) {
    const info = await this.findOneOrThrowNotFoundException({
      where: { company },
    });

    return info.timezone;
  }

  private async findOneOrThrowNotFoundException(
    options: FindOneOptions<CompanyInfo>,
  ) {
    const info = await this.companyInfoRepository.findOne(options);

    if (!info) throw new NotFoundException();

    return info;
  }

  async update(
    company: Company,
    id: number,
    updateCompanyInfoDto: UpdateCompanyInfoDto,
  ): Promise<CompanyInfo> {
    const info = await this.findOneOrThrowNotFoundException({
      where: { id, company },
    });

    return this.companyInfoRepository.save({
      ...info,
      ...updateCompanyInfoDto,
    });
  }
}
