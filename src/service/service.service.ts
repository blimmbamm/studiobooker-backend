import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { plainToInstance } from 'class-transformer';
import { PersonnelService } from 'src/personnel/personnel.service';
import { ServiceCategoryService } from 'src/service-category/service-category.service';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service) private serviceRepository: Repository<Service>,

    @Inject(forwardRef(() => PersonnelService))
    private personnelService: PersonnelService,

    private serviceCategoryService: ServiceCategoryService,
  ) {}

  async create(company: Company, createServiceDto: CreateServiceDto) {
    const { serviceCategoryId, ...dto } = createServiceDto;

    const serviceCategory = await this.serviceCategoryService.findOne(
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
      // relations: {personnel: {services: true}}
      // Relations depends on what is needed in the client in the end...
      // But maybe this should be configurable via queryParams
      // relations: { personnel: true },
    });
  }

  findOne(id: number, company: Company) {
    return this.serviceRepository.findOne({
      where: { id, company },
    });
  }

  async findOneStructured(id: number, company: Company) {
    const service = await this.serviceRepository.findOne({
      where: { id, company },
      relations: { personnel: true, serviceCategory: true },
    });

    if (!service) {
      throw new NotFoundException();
    }

    return service;
  }

  async update(
    id: number,
    company: Company,
    updateServiceDto: UpdateServiceDto,
  ) {
    const service = await this.serviceRepository.findOne({
      where: { id, company },
    });

    if (!service) {
      throw new NotFoundException();
    }

    const updatedService = { ...service, ...updateServiceDto };

    return this.serviceRepository.save(updatedService);
  }

  async updateCategory(
    id: number,
    serviceCategoryId: number,
    company: Company,
  ) {
    const service = await this.serviceRepository.findOne({
      where: { id, company },
    });

    if (!service) {
      throw new NotFoundException();
    }

    const serviceCategory = await this.serviceCategoryService.findOne(
      company,
      serviceCategoryId,
    );
    // Failure is handled inside serviceCategoryService.findOne, however this is not quite consistent

    const updatedService: Service = { ...service, serviceCategory };

    // Todo: use instanceToPlain, because now the serviceCategory is added to return
    return this.serviceRepository.save(updatedService);
  }

  async addPersonnelToService(
    company: Company,
    id: number,
    personnelId: number,
  ) {
    const service = await this.serviceRepository.findOne({
      where: { id, company },
      relations: { personnel: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Since personnel relation gets loaded, it should be defined in the following,
    // but unsure if using ! instead of ? would be more correct
    const personnelAlreadyAdded = service.personnel!.some(
      (p) => p.id === personnelId,
    );
    if (!personnelAlreadyAdded) {
      const personnel = await this.personnelService.findOne(
        personnelId,
        company,
      );

      if (!personnel) {
        throw new NotFoundException('Personnel not found');
      }

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
    const service = await this.serviceRepository.findOne({
      where: { id, company },
      relations: { personnel: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (service.personnel) {
      service.personnel = service.personnel.filter((p) => p.id !== personnelId);
    }

    return this.serviceRepository.save(service);
  }

  async remove(id: number, company: Company) {
    const service = await this.serviceRepository.findOne({
      where: { id, company },
    });

    if (service) {
      return this.serviceRepository.remove(service);
    } else {
      throw new NotFoundException();
    }
  }
}
