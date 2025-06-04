import { Test, TestingModule } from '@nestjs/testing';
import { WorkingTimeCompanySettingsController } from './working-time-company-settings.controller';
import { WorkingTimeCompanySettingsService } from './working-time-company-settings.service';

describe('WorkingTimeCompanySettingsController', () => {
  let controller: WorkingTimeCompanySettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkingTimeCompanySettingsController],
      providers: [WorkingTimeCompanySettingsService],
    }).compile();

    controller = module.get<WorkingTimeCompanySettingsController>(WorkingTimeCompanySettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
