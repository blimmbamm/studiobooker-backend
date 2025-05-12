import { Injectable } from '@nestjs/common';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceCategory } from './entities/service-category.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ServiceCategoryService {
  constructor(
    @InjectRepository(ServiceCategory)
    private serviceCategoryRepository: Repository<ServiceCategory>,
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
