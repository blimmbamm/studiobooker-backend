import { Test, TestingModule } from '@nestjs/testing';
import { CompanyInfoService } from './company-info.service';

describe('CompanyInfoService', () => {
  let service: CompanyInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyInfoService],
    }).compile();

    service = module.get<CompanyInfoService>(CompanyInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
