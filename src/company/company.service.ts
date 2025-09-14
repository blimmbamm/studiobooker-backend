import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import { CompanyInfoService } from 'src/company-info/company-info.service';
import { WorkingTimeCompanySettingsService } from 'src/working-time-company-settings/working-time-company-settings.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    private companyInfoService: CompanyInfoService,
    private workingTimeCompanySettingsService: WorkingTimeCompanySettingsService,
  ) {}

  create(createCompanyDto: CreateCompanyDto) {
    const newCompany = this.companyRepository.create(createCompanyDto);

    return this.companyRepository.save(newCompany);
  }

  findOne(id: number) {
    return this.companyRepository.findOne({ where: { id } });
  }

  async findOneWithInfoAndSettings(id: number) {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: { companyInfo: true, workingTimeSettings: true },
    });

    return plainToInstance(Company, company);
  }

  async findOneWithRelations(
    id: number,
    findOptionsRelations?: FindOptionsRelations<Company>,
  ) {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: findOptionsRelations,
    });

    return plainToInstance(Company, company);
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
    };

    return this.companyRepository.save(updatedCompany);
  }

  /**
   * This is called when company registration is successfully verified.
   *
   * Set verified flag, add company info and settings entities.
   */
  async finishCompanyInitialization(id: number) {
    const company = await this.findOne(id);

    if (!company) {
      throw new NotFoundException();
    }

    company.verified = true;
    company.hashedVerificationToken = null;
    company.verificationTokenExpiresAt = null;
    company.companyInfo = this.companyInfoService.create();
    company.workingTimeSettings =
      this.workingTimeCompanySettingsService.create();
    // Create other settings...

    return this.companyRepository.save(company);
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }

  seedData() {
    /**
     * Idea:
     * - create company and finalize it.
     * - add all relations (staff+appointments) to company, add cascade and save
     * - but: This would need unprotected endpoint, so must not go to company controller
     */
  }
}
