import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateWorkingTimeCompanySettingDto } from './dto/update-working-time-company-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkingTimeCompanySetting } from './entities/working-time-company-setting.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class WorkingTimeCompanySettingsService {
  constructor(
    @InjectRepository(WorkingTimeCompanySetting)
    private workingTimeCompanySettingRepository: Repository<WorkingTimeCompanySetting>,
  ) {}

  async getSettings(company: Company): Promise<WorkingTimeCompanySetting[]> {
    return this.workingTimeCompanySettingRepository.find({
      where: { company },
    });
  }

  /** This only creates the entities, but doesn't save them */
  create() {
    return this.workingTimeCompanySettingRepository.create(
      [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ].map((weekday) => ({
        weekday,
        defaultStart: '09:00',
        defaultEnd: '17:00',
        enabled: weekday === 'Saturday' || weekday === 'Sunday' ? false : true,
      })),
    );
  }

  findAll() {
    return `This action returns all workingTimeCompanySettings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workingTimeCompanySetting`;
  }

  async update(
    company: Company,
    id: number,
    updateWorkingTimeCompanySettingDto: UpdateWorkingTimeCompanySettingDto,
  ) {
    const workingTimeSetting =
      await this.workingTimeCompanySettingRepository.findOne({
        where: { id, company },
      });

    if (!workingTimeSetting) {
      throw new NotFoundException();
    }

    return this.workingTimeCompanySettingRepository.save({
      ...workingTimeSetting,
      ...updateWorkingTimeCompanySettingDto,
    });
  }

}
