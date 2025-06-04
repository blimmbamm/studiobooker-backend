import { Injectable } from '@nestjs/common';
import { CreateWorkingTimeCompanySettingDto } from './dto/create-working-time-company-setting.dto';
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
    // return ['Monay', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(
    //   (weekday) => ({
    //     id: 1,
    //     weekday,
    //     defaultStart: '09:00',
    //     defaultEnd: '17:00',
    //     enabled: true,
    //   }),
    // );
  }

  create(
    createWorkingTimeCompanySettingDto: CreateWorkingTimeCompanySettingDto,
  ) {
    return 'This action adds a new workingTimeCompanySetting';
  }

  findAll() {
    return `This action returns all workingTimeCompanySettings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workingTimeCompanySetting`;
  }

  update(
    id: number,
    updateWorkingTimeCompanySettingDto: UpdateWorkingTimeCompanySettingDto,
  ) {
    return `This action updates a #${id} workingTimeCompanySetting`;
  }

  remove(id: number) {
    return `This action removes a #${id} workingTimeCompanySetting`;
  }
}
