import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import {
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
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

  // async findOneOrThrowNotFoundException(id: number) {
  //   const company = await this.companyRepository.findOne({ where: { id } });

  //   if (!company) throw new NotFoundException();

  //   return company;
  // }

  async findOneOrThrowNotFoundException(options: FindOneOptions<Company>) {
    const company = await this.companyRepository.findOne(options);

    if (!company) throw new NotFoundException();

    return plainToInstance(Company, company);
  }

  async findByIdOrThrowNotFoundException(id: number) {
    return this.findOneOrThrowNotFoundException({ where: { id } });
  }

  findOne(options: FindOneOptions<Company>) {
    return this.companyRepository.findOne(options);
  }

  findById(id: number) {
    return this.findOne({ where: { id } });
  }

  async findByIdWithRelationsOrThrowNotFoundException(
    id: number,
    findOptionsRelations?: FindOptionsRelations<Company>,
  ) {
    return this.findOneOrThrowNotFoundException({
      where: { id },
      relations: findOptionsRelations,
    });
  }

  findByEmail(email: string) {
    return this.companyRepository.findOne({ where: { email } });
  }

  async emailIsAlreadyUsed(email: string) {
    const company = await this.findByEmail(email);
    return Boolean(company);
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.findByIdOrThrowNotFoundException(id);

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
    const company = await this.findByIdOrThrowNotFoundException(id);

    company.verified = true;
    company.hashedVerificationToken = null;
    company.verificationTokenExpiresAt = null;
    company.companyInfo = this.companyInfoService.create();
    company.workingTimeSettings =
      this.workingTimeCompanySettingsService.create();

    return this.companyRepository.save(company);
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
