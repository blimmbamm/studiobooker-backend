import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkingTimeDto } from './dto/create-working-time.dto';
import { UpdateWorkingTimeDto } from './dto/update-working-time.dto';
import { Personnel } from 'src/personnel/entities/personnel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkingTime } from './entities/working-time.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { plainToInstance } from 'class-transformer';
import { WorkingTimeCompanySettingsService } from 'src/working-time-company-settings/working-time-company-settings.service';

@Injectable()
export class WorkingTimeService {
  constructor(
    @InjectRepository(WorkingTime)
    private workingTimeRepository: Repository<WorkingTime>,

    private workingTimeCompanySettingsService: WorkingTimeCompanySettingsService,
  ) {}

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
    // 1. Fetch company default working times
    // 2. Copy those and create

    const companyDefaultWorkingTimeSettings =
      await this.workingTimeCompanySettingsService.getSettings(company);

    return this.workingTimeRepository.create(
      companyDefaultWorkingTimeSettings.map((workingTimeCompanySetting) => {
        const { weekday, start, end } = workingTimeCompanySetting;

        return {
          weekday,
          start,
          end,
          activated: false,
          company,
          workingTimeCompanySetting,
        };
      }),
    );
  }

  async findByIdOrThrowNotFoundException(company: Company, id: number) {
    const workingTime = await this.workingTimeRepository.findOne({
      where: { id, company },
    });

    if (!workingTime) throw new NotFoundException();

    return workingTime;
  }

  async update(
    company: Company,
    id: number,
    updateWorkingTimeDto: UpdateWorkingTimeDto,
  ) {
    const workingTime = await this.findByIdOrThrowNotFoundException(
      company,
      id,
    );

    const updatedWorkingTime = { ...workingTime, ...updateWorkingTimeDto };

    return this.workingTimeRepository.save(updatedWorkingTime);
  }

  async remove(company: Company, id: number) {
    const workingTime = await this.findByIdOrThrowNotFoundException(
      company,
      id,
    );

    return this.workingTimeRepository.remove(workingTime);
  }
}
