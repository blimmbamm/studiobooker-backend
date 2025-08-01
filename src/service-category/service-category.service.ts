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
import { FindOptionsWhere, Repository } from 'typeorm';
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

  findAll(company: Company, filter?: FindOptionsWhere<ServiceCategory>) {
    return this.serviceCategoryRepository.find({
      where: {
        company,
        ...filter,
      },
      relations: { services: true },
    });
  }

  findOne(company: Company, id: number) {
    return this.serviceCategoryRepository.findOneOrFail({
      where: { company, id },
    });
  }

  async update(
    company: Company,
    id: number,
    updateServiceCategoryDto: UpdateServiceCategoryDto,
  ) {
    const category = await this.serviceCategoryRepository.findOne({
      where: { id, company },
    });

    if (!category) {
      throw new NotFoundException();
    }

    const updatedCategory = { ...category, ...updateServiceCategoryDto };

    return this.serviceCategoryRepository.save(updatedCategory);
  }

  async remove(company: Company, id: number) {
    const category = await this.serviceCategoryRepository.findOne({
      where: { id, company },
    });

    if (category) {
      return this.serviceCategoryRepository.remove(category);
    } else {
      throw new NotFoundException();
    }
  }
}
