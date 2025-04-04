import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { In, Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Personnel } from 'src/personnel/entities/personnel.entity';
import { plainToInstance } from 'class-transformer';
import { PersonnelService } from 'src/personnel/personnel.service';

@Injectable()
export class ServiceService {
  constructor(
    // @InjectRepository(Personnel)
    // private personnelRepository: Repository<Personnel>,
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
    private personnelService: PersonnelService,
  ) {}

  async create(company: Company, createServiceDto: CreateServiceDto) {
    // First, check list of personnel to be part of the requesting company
    await this.personnelService.validate(company, createServiceDto.personnel);

    // If ok, create service
    const newService = this.serviceRepository.create({
      company,
      ...createServiceDto,
    });

    const savedService = this.serviceRepository.save(newService);
    return plainToInstance(Service, savedService);
  }

  findAll(company: Company) {
    return this.serviceRepository.find({
      where: { company },
      // Relations depends on what is needed in the client in the end...
      // But maybe this should be configurable via queryParams
      // relations: { personnel: true },
    });
  }

  /**
   * Errors if any of the ids belong to other company than provided one
   */
  async validate(company: Company, services: Service[] | undefined) {
    const ids = services?.map((p) => p.id);
    if (!ids || ids.length === 0) return;

    const servicesWithCompany = await this.serviceRepository.find({
      where: { id: In(ids) },
      relations: { company: true },
    });

    if (servicesWithCompany.some((p) => p.company.id !== company.id)) {
      throw new UnauthorizedException(
        'Some services do not belong to the company',
      );
    }
  }

  findOne(id: number, company: Company) {
    return this.serviceRepository.findOne({
      where: { id, company },
    });
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

    await this.personnelService.validate(company, updateServiceDto.personnel);

    const updatedService = { ...service, ...updateServiceDto };

    return this.serviceRepository.save(updatedService);
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
