import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateServiceCategoryDto,
  CreateServiceInCategoryDto,
} from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceCategory } from './entities/service-category.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { plainToInstance } from 'class-transformer';
import { CreateServiceDto } from 'src/service/dto/create-service.dto';
import { ServiceService } from 'src/service/service.service';

@Injectable()
export class ServiceCategoryService {
  constructor(
    @InjectRepository(ServiceCategory)
    private serviceCategoryRepository: Repository<ServiceCategory>,

    @Inject(forwardRef(() => ServiceService))
    private serviceService: ServiceService,
  ) {}

  async create(
    company: Company,
    createServiceCategoryDto: CreateServiceCategoryDto,
  ) {
    const serviceCategory = this.serviceCategoryRepository.create({
      company,
      ...createServiceCategoryDto,
    });

    const savedServiceCategory =
      await this.serviceCategoryRepository.save(serviceCategory);

    return plainToInstance(ServiceCategory, savedServiceCategory);
  }

  async createServiceInCategory(
    company: Company,
    categoryId: number,
    dto: CreateServiceInCategoryDto,
  ) {
    const category = await this.serviceCategoryRepository.findOne({
      where: { id: categoryId, company },
      relations: { services: true },
    });

    if (!category) {
      throw new NotFoundException();
    }

    const service = await this.serviceService.create(company, {
      ...dto,
      serviceCategoryId: category.id,
    });

    return service;
  }

  findAll(company: Company) {
    return this.serviceCategoryRepository.find({
      where: {
        company,
      },
      relations: { services: true },
    });
  }

  findOne(company: Company, id: number) {
    return this.serviceCategoryRepository.findOneOrFail({
      where: { company, id },
    });
  }

  update(id: number, updateServiceCategoryDto: UpdateServiceCategoryDto) {
    return `This action updates a #${id} serviceCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceCategory`;
  }
}
