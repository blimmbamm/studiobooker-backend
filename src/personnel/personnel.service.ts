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

@Injectable()
export class PersonnelService {
  constructor(
    @InjectRepository(Personnel)
    private personnelRepository: Repository<Personnel>,

    @Inject(forwardRef(() => ServiceService))
    private serviceService: ServiceService,

    private workingTimeService: WorkingTimeService,
  ) {}

  async create(company: Company, createPersonnelDto: CreatePersonnelDto) {
    const newPersonnel = this.personnelRepository.create({
      company,
      ...createPersonnelDto,
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
    const personnel = await this.personnelRepository.findOne({
      where: { id, company },
      relations: { services: { serviceCategory: true }, workingTimes: true },
    });

    if (personnel) {
      // Yes, ! isn't nice, but safe here because relations are loaded explicitly:

      // Get unique list of service categories:
      const categories = personnel
        .services!.map((s) => s.serviceCategory!)
        .filter(
          (value, index, array) =>
            array.map((sc) => sc.id).indexOf(value.id) === index,
        );

      // For each category, find respective services and add them as new property
      // in category
      for (let category of categories) {
        const services = personnel
          .services!.filter((s) => s.serviceCategory!.id === category.id)
          .map((s) => {
            // Keep only atomic service fields (= omit serviceCategory)
            const { serviceCategory, ...atomicServiceProps } = s;
            return atomicServiceProps;
          });

        category.services = services;
      }

      // Keep all personnel fields excluding services
      const { services, ...personnelProps } = personnel || {};

      return {
        ...personnelProps,
        categories,
      };
    } else {
      return personnel;
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
