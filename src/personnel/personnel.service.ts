import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { In, Repository } from 'typeorm';
import { Personnel } from './entities/personnel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { plainToInstance } from 'class-transformer';
import { ServiceService } from 'src/service/service.service';
import { WorkingTimeService } from 'src/working-time/working-time.service';
import { UpdateWorkingTimeForPersonnelDto } from './dto/update-working-time-for-personnel.dto';
import { ServiceCategoryService } from 'src/service-category/service-category.service';

@Injectable()
export class PersonnelService {
  constructor(
    @InjectRepository(Personnel)
    private personnelRepository: Repository<Personnel>,

    @Inject(forwardRef(() => ServiceService))
    private serviceService: ServiceService,

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

  findAll(company: Company) {
    return this.personnelRepository.find({
      where: { company },
      // relations: { services: true },
    });
  }

  async findOne(id: number, company: Company) {
    return this.personnelRepository.findOne({
      where: { id, company },
    });
  }

  async findOneStructured(id: number, company: Company) {
    /**
     * Load personnel with only services, no nested service categories
     * Load all service categories with service nested
     * Add
     */

    const personnel = await this.personnelRepository
      .createQueryBuilder('personnel')
      .where('personnel.id = :id', { id })
      .andWhere('personnel.companyId = :companyId', { companyId: company.id })
      .leftJoinAndSelect('personnel.services', 'services')
      .leftJoinAndSelect('personnel.workingTimes', 'workingTime')
      .leftJoin(
        'workingTime.workingTimeCompanySetting',
        'workingTimeCompanySetting',
      )
      .andWhere('workingTimeCompanySetting.enabled = :enabled', {
        enabled: true,
      })
      .getOne();

    // This could be used to filter on personnel first before join related data:
    // const fiteredPersonnelQuery = await this.personnelRepository
    //   .createQueryBuilder('personnel')
    //   .innerJoin(
    //     (qb) =>
    //       qb
    //         .subQuery()
    //         .select('p.id', 'id')
    //         .from(Personnel, 'p')
    //         .where('p.id = :id', { id })
    //         .andWhere('p.companyId = :companyId', { companyId: company.id }),
    //     'filteredPersonnel',
    //     'filteredPersonnel.id = personnel.id',
    //   )
    //   .leftJoinAndSelect(...)

    // This would also work but needs workingTimes to exist, otherwise no entity is found
    // This means that using services for the innerjoin would not work
    // const filteredPersonnelQuery2 = await this.personnelRepository
    //   .createQueryBuilder('personnel')
    //   .innerJoinAndSelect(
    //     'personnel.workingTimes',
    //     'workingTimes',
    //     '(personnel.id = :id) and (personnel.companyId = :companyId)',
    //     { id, companyId: company.id },
    //   )
    //   .leftJoinAndSelect(...)

    // Yet another way could be to use RelationQueryBuilder
    // Load personnel first then get related data, put everything together in here

    // Old way:
    // const personnel = await this.personnelRepository.findOne({
    //   where: { id, company },
    //   relations: { services: true, workingTimes: true },
    // });

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
      // This is unprecise: the query above requires working times
      // and working times company settings to be present --> more granular error handling?!
      throw new NotFoundException();
    }
  }

  async update(
    id: number,
    company: Company,
    updatePersonnelDto: UpdatePersonnelDto,
  ) {
    const personnel = await this.personnelRepository.findOne({
      where: { id, company },
    });

    if (!personnel) {
      throw new NotFoundException();
    }

    const updatedPersonnel = { ...personnel, ...updatePersonnelDto };

    return this.personnelRepository.save(updatedPersonnel);
  }

  async remove(id: number, company: Company) {
    const personnel = await this.personnelRepository.findOne({
      where: { id, company },
    });

    if (personnel) {
      return this.personnelRepository.remove(personnel);
    } else {
      throw new NotFoundException();
    }
  }

  addServicesFromCategoryToPersonnel(
    company: Company,
    id: number,
    serviceCategoryId: number,
  ) {
    // get staff
    // get services by category --> this needs to be added, i think
    // update staff.services accordingly
  }

  async addWorkingTime(id: number, company: Company, weekday: string) {
    const personnel = await this.personnelRepository.findOne({
      where: { id, company },
    });

    if (!personnel) {
      throw new NotFoundException();
    }

    return this.workingTimeService.create(company, personnel, {
      weekday,
      start: '09:00',
      end: '17:00',
    });
  }

  async updateWorkingTime(
    company: Company,
    id: number,
    weekday: string,
    dto: UpdateWorkingTimeForPersonnelDto,
  ) {
    return this.workingTimeService.updateByPersonnelAndWeekday(
      company,
      id,
      weekday,
      dto,
    );
  }
}
