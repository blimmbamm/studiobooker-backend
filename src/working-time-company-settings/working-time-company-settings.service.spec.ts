import { Test, TestingModule } from '@nestjs/testing';
import { WorkingTimeCompanySettingsService } from './working-time-company-settings.service';

describe('WorkingTimeCompanySettingsService', () => {
  let service: WorkingTimeCompanySettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkingTimeCompanySettingsService],
    }).compile();

    service = module.get<WorkingTimeCompanySettingsService>(WorkingTimeCompanySettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
