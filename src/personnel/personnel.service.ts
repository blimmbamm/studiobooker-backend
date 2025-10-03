import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Personnel } from './entities/personnel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { plainToInstance } from 'class-transformer';
import { WorkingTimeService } from 'src/working-time/working-time.service';
import { ServiceCategoryService } from 'src/service-category/service-category.service';
import { StaffQueryDto } from './dto/staff-query.dto';

@Injectable()
export class PersonnelService {
  constructor(
    @InjectRepository(Personnel)
    private personnelRepository: Repository<Personnel>,

    private serviceCategoryService: ServiceCategoryService,
    private workingTimeService: WorkingTimeService,
  ) {}

  async create(company: Company, createPersonnelDto: CreatePersonnelDto) {
    const defaultWorkingTimes =
      await this.workingTimeService.createDefaultWorkingTimes(company);

    const newPersonnel = this.personnelRepository.create({
      company,
      ...createPersonnelDto,
      workingTimes: defaultWorkingTimes,
    });

    try {
      const savedPersonnel = await this.personnelRepository.save(newPersonnel);
      return plainToInstance(Personnel, savedPersonnel);
    } catch (error) {
      throw new ConflictException();
    }
  }

  async getByNameOrCreate(
    company: Company,
    createPersonnelDto: CreatePersonnelDto,
  ) {
    const personnel = await this.personnelRepository.findOne({
      where: { company, name: createPersonnelDto.name },
    });

    if (personnel) {
      return personnel;
    } else {
      return this.create(company, createPersonnelDto);
    }
  }

  findAllWithFilters(company: Company, query: StaffQueryDto) {
    const qb = this.personnelRepository
      .createQueryBuilder('personnel')
      .where('personnel.companyId = :companyId', { companyId: company.id });

    if (typeof query.activated === 'boolean') {
      qb.andWhere('personnel.activated = :activated', {
        activated: query.activated,
      });
    }

    if (typeof query.serviceId === 'number') {
      qb.leftJoin('personnel.services', 'service').andWhere(
        'service.id = :serviceId',
        { serviceId: query.serviceId },
      );
    }

    return qb.getMany();
  }

  async findOneStructured(company: Company, id: number) {
    /**
     * This query could be simplified by just using the standard repository methods.
     * The purpose of this query was to also filter on enabled workingTimeCompanySettings.
     * Let's keep it for later...
     */
    const personnel = await this.personnelRepository
      .createQueryBuilder('personnel')
      .where('personnel.id = :id', { id })
      .andWhere('personnel.companyId = :companyId', { companyId: company.id })
      .leftJoinAndSelect('personnel.services', 'services')
      .leftJoinAndSelect('personnel.workingTimes', 'workingTime')
      // .leftJoin(
      //   'workingTime.workingTimeCompanySetting',
      //   'workingTimeCompanySetting',
      // )
      // .andWhere('workingTimeCompanySetting.enabled = :enabled', {
      //   enabled: true,
      // })
      .orderBy('workingTime.workingTimeCompanySettingId', 'ASC')
      .getOne();

    if (personnel) {
      const serviceCategories = (
        await this.serviceCategoryService.findAll(company)
      ).map((sc) => {
        return {
          ...sc,
          services: sc.services?.map((s) => ({
            ...s,
            staffIsQualifiedForService: personnel.services?.some(
              (ps) => ps.id === s.id,
            ),
          })),
        };
      });

      // Exclude services:
      const { services, ...personnelProps } = personnel;

      return {
        ...personnelProps,
        serviceCategories,
      };
    } else {
      // If working times are again added to the query,
      // the error handling could/should be a little more granular
      throw new NotFoundException();
    }
  }

  async findByIdOrThrowNotFoundException(company: Company, id: number) {
    const personnel = await this.personnelRepository.findOne({
      where: { id, company },
    });

    if (!personnel) {
      throw new NotFoundException();
    }

    return personnel;
  }

  async update(
    company: Company,
    id: number,
    updatePersonnelDto: UpdatePersonnelDto,
  ): Promise<Personnel> {
    const personnel = await this.findByIdOrThrowNotFoundException(company, id);

    const updatedPersonnel = { ...personnel, ...updatePersonnelDto };

    return this.personnelRepository.save(updatedPersonnel);
  }

  async remove(company: Company, id: number) {
    const personnel = await this.findByIdOrThrowNotFoundException(company, id);

    return this.personnelRepository.remove(personnel);
  }
}
