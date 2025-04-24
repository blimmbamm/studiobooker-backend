import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkingTimeDto } from './dto/create-working-time.dto';
import { UpdateWorkingTimeDto } from './dto/update-working-time.dto';
import { Personnel } from 'src/personnel/entities/personnel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkingTime } from './entities/working-time.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { plainToInstance } from 'class-transformer';
import { NotFoundError } from 'rxjs';
import { UpdateWorkingTimeForPersonnelDto } from 'src/personnel/dto/update-working-time-for-personnel.dto';

@Injectable()
export class WorkingTimeService {
  constructor(
    @InjectRepository(WorkingTime)
    private workingTimeRepository: Repository<WorkingTime>,
  ) {}

  // create(createWorkingTimeDto: CreateWorkingTimeDto) {
  //   return 'This action adds a new workingTime';
  // }

  async create(
    company: Company,
    personnel: Personnel,
    dto: CreateWorkingTimeDto,
  ) {
    const workingTime = this.workingTimeRepository.create({
      ...dto,
      company,
      personnel,
    });

    const savedWorkingTime = await this.workingTimeRepository.save(workingTime);
    return plainToInstance(WorkingTime, savedWorkingTime);
  }

  findAll() {
    return `This action returns all workingTime`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workingTime`;
  }

  async update(
    company: Company,
    id: number,
    updateWorkingTimeDto: UpdateWorkingTimeDto,
  ) {
    const workingTime = await this.workingTimeRepository.findOne({
      where: { id, company },
    });

    if (!workingTime) {
      throw new NotFoundException();
    }

    const updatedWorkingTime = { ...workingTime, ...updateWorkingTimeDto };

    return this.workingTimeRepository.save(updatedWorkingTime);
  }

  async updateByPersonnelAndWeekday(
    company: Company,
    personnelId: number,
    weekday: string,
    dto: UpdateWorkingTimeForPersonnelDto,
  ){
    const workingTime = await this.workingTimeRepository.findOne({
      where: { company, personnel: {id: personnelId}, weekday },
    });

    if (!workingTime) {
      throw new NotFoundException();
    }

    const updatedWorkingTime = { ...workingTime, ...dto };

    return this.workingTimeRepository.save(updatedWorkingTime);
  };

  async remove(company: Company, id: number) {
    const workingTime = await this.workingTimeRepository.findOne({
      where: { id, company },
    });

    if (!workingTime) {
      throw new NotFoundException();
    }

    return this.workingTimeRepository.remove(workingTime);
  }
}
