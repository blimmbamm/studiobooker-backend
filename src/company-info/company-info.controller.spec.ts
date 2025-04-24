import { Test, TestingModule } from '@nestjs/testing';
import { CompanyInfoController } from './company-info.controller';
import { CompanyInfoService } from './company-info.service';

describe('CompanyInfoController', () => {
  let controller: CompanyInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyInfoController],
      providers: [CompanyInfoService],
    }).compile();

    controller = module.get<CompanyInfoController>(CompanyInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
