import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkingTimeDto } from './dto/create-working-time.dto';
import { UpdateWorkingTimeDto } from './dto/update-working-time.dto';
import { Personnel } from 'src/personnel/entities/personnel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkingTime } from './entities/working-time.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { plainToInstance } from 'class-transformer';
import { UpdateWorkingTimeForPersonnelDto } from 'src/personnel/dto/update-working-time-for-personnel.dto';
import { WorkingTimeCompanySettingsService } from 'src/working-time-company-settings/working-time-company-settings.service';

@Injectable()
export class WorkingTimeService {
  constructor(
    @InjectRepository(WorkingTime)
    private workingTimeRepository: Repository<WorkingTime>,

    private workingTimeCompanySettingsService: WorkingTimeCompanySettingsService,
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

  async createDefaultWorkingTimes(company: Company): Promise<WorkingTime[]> {
    // 1. Fetch company default working times (still not present)
    // 2. Copy those and create

    const companyDefaultWorkingTimeSettings =
      await this.workingTimeCompanySettingsService.getSettings(company);

    return this.workingTimeRepository.create(
      companyDefaultWorkingTimeSettings.map((workingTimeCompanySetting) => {
        const { weekday, defaultStart, defaultEnd } = workingTimeCompanySetting;
        
        return {
          weekday,
          start: defaultStart,
          end: defaultEnd,
          activated: false,
          company,
          workingTimeCompanySetting,
        };
      }),
    );

    // const DUMMY_DEFAULT_WORKING_TIMES = [
    //   'Monay',
    //   'Tuesday',
    //   'Wednesday',
    //   'Thursday',
    //   'Friday',
    // ].map((weekday) => ({
    //   weekday,
    //   start: '09:00',
    //   end: '17:00',
    //   company,
    //   enabled: true,
    //   activated: true,
    // }));

    // const workingTimes = this.workingTimeRepository.create(
    //   DUMMY_DEFAULT_WORKING_TIMES,
    // );

    // return this.workingTimeRepository.save(workingTimes);
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
  ) {
    const workingTime = await this.workingTimeRepository.findOne({
      where: { company, personnel: { id: personnelId }, weekday },
    });

    if (!workingTime) {
      throw new NotFoundException();
    }

    const updatedWorkingTime = { ...workingTime, ...dto };

    return this.workingTimeRepository.save(updatedWorkingTime);
  }

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
