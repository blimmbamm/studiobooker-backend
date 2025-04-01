import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { EntityNotFoundError, In, Repository } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Personnel } from 'src/personnel/entities/personnel.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Personnel)
    private personnelRepository: Repository<Personnel>,
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
  ) {}

  async create(company: Company, createServiceDto: CreateServiceDto) {
    // Check list of personnel to be part of the requesting company
    const personnelIds = createServiceDto.personnel?.map(
      (personnel) => personnel.id,
    );
    if (personnelIds) {
      const personnel = await this.personnelRepository.find({
        where: { id: In(personnelIds) },
        relations: { company: true },
      });
      if (personnel.some((p) => p.company.id !== company.id)) {
        throw new UnauthorizedException(); // or badrequest
      }
    }
    const newService = this.serviceRepository.create({
      company,
      ...createServiceDto,
    });
    return this.serviceRepository.save(newService);
  }

  findAll(company: Company) {
    return this.serviceRepository.find({
      where: { company },
      relations: { personnel: true },
    });
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
    let service = await this.serviceRepository.findOne({
      where: { id, company },
      // relations: { personnel: true },
    });
    if (!service) {
      throw new NotFoundException();
    }
    service = { ...service, ...updateServiceDto };

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
