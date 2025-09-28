import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { plainToInstance } from 'class-transformer';
import { PersonnelService } from 'src/personnel/personnel.service';
import { ServiceCategoryService } from 'src/service-category/service-category.service';
import { FindOneOptionsWithoutCompany } from '../common/types/find-one-options';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service) private serviceRepository: Repository<Service>,

    @Inject(forwardRef(() => PersonnelService))
    private personnelService: PersonnelService,

    @Inject(forwardRef(() => ServiceCategoryService))
    private serviceCategoryService: ServiceCategoryService,
  ) {}

  async create(company: Company, createServiceDto: CreateServiceDto) {
    const { serviceCategoryId, ...dto } = createServiceDto;

    const serviceCategory =
      await this.serviceCategoryService.findByIdOrThrowNotFoundException(
        company,
        createServiceDto.serviceCategoryId,
      );

    const newService = this.serviceRepository.create({
      company,
      serviceCategory,
      ...dto,
    });

    const savedService = await this.serviceRepository.save(newService);

    return plainToInstance(Service, savedService);
  }

  findAll(company: Company) {
    return this.serviceRepository.find({
      where: { company },
      relations: { serviceCategory: true },
    });
  }

  async findOneOrThrowNotFoundException(
    company: Company,
    options: FindOneOptionsWithoutCompany<Service>,
  ) {
    const service = await this.serviceRepository.findOne({
      ...options,
      where: { company, ...options.where },
    });

    if (!service) throw new NotFoundException();

    return service;
  }

  async findOneByPersonnel(company: Company, id: number, staffId: number) {
    return this.findOneOrThrowNotFoundException(company, {
      where: { id, personnel: { id: staffId } },
      relations: { personnel: { workingTimes: true } },
    });
  }

  async findOneStructured(company: Company, id: number) {
    const service = await this.findOneOrThrowNotFoundException(company, {
      where: { id },
      relations: { personnel: true, serviceCategory: true },
    });

    const personnel = await this.personnelService.findAllWithFilters(
      company,
      {},
    );

    const { personnel: servicePersonnel, ...other } = service;

    return {
      ...other,
      personnel: personnel.map((p) => ({
        ...p,
        staffIsQualifiedForService: Boolean(
          servicePersonnel?.find((sp) => sp.id === p.id),
        ),
      })),
    };
  }

  async update(
    company: Company,
    id: number,
    updateServiceDto: UpdateServiceDto,
  ) {
    const service = await this.findOneOrThrowNotFoundException(company, {
      where: { id },
    });

    const updatedService = { ...service, ...updateServiceDto };

    // TODO: This could be refactored to some generic service validation
    if (
      updateServiceDto.activated &&
      (!updatedService.duration || !updatedService.price)
    ) {
      throw new BadRequestException();
    }

    return this.serviceRepository.save(updatedService);
  }

  async updateCategoryForService(
    company: Company,
    id: number,
    serviceCategoryId: number,
  ) {
    const service = await this.findOneOrThrowNotFoundException(company, {
      where: { id },
    });

    const serviceCategory =
      await this.serviceCategoryService.findByIdOrThrowNotFoundException(
        company,
        serviceCategoryId,
      );

    const updatedService: Service = { ...service, serviceCategory };

    // Todo: use instanceToPlain, because now the serviceCategory is added to return
    return this.serviceRepository.save(updatedService);
  }

  async addPersonnelToService(
    company: Company,
    id: number,
    personnelId: number,
  ) {
    const service = await this.findOneOrThrowNotFoundException(company, {
      where: { id },
      relations: { personnel: true },
    });

    const personnelAlreadyAdded = service.personnel?.some(
      (p) => p.id === personnelId,
    );

    if (service.personnel && !personnelAlreadyAdded) {
      const personnel =
        await this.personnelService.findByIdOrThrowNotFoundException(
          company,
          personnelId,
        );

      service.personnel?.push(personnel);

      return this.serviceRepository.save(service);
    } else {
      return service;
    }
  }

  async removePersonnelFromService(
    company: Company,
    id: number,
    personnelId: number,
  ) {
    const service = await this.findOneOrThrowNotFoundException(company, {
      where: { id },
      relations: { personnel: true },
    });

    if (service.personnel) {
      service.personnel = service.personnel.filter((p) => p.id !== personnelId);
    }

    return this.serviceRepository.save(service);
  }

  async remove(company: Company, id: number) {
    const service = await this.findOneOrThrowNotFoundException(company, {
      where: { id },
    });

    return this.serviceRepository.remove(service);
  }
}
