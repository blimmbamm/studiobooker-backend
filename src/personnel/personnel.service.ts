import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { In, Repository } from 'typeorm';
import { Personnel } from './entities/personnel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { plainToInstance } from 'class-transformer';
import { ServiceService } from 'src/service/service.service';

@Injectable()
export class PersonnelService {
  constructor(
    @InjectRepository(Personnel)
    private personnelRepository: Repository<Personnel>,
    private serviceService: ServiceService,
  ) {}

  async create(company: Company, createPersonnelDto: CreatePersonnelDto) {
    // Check if added services belong to company
    await this.serviceService.validate(company, createPersonnelDto.services);

    // If okay, create new personnel
    const newPersonnel = this.personnelRepository.create({
      company,
      ...createPersonnelDto,
    });

    const savedPersonnel = await this.personnelRepository.save(newPersonnel);
    return plainToInstance(Personnel, savedPersonnel);
  }

  findAll(company: Company) {
    return this.personnelRepository.find({
      where: { company },
      relations: { services: true },
    });
  }

  /**
   * Errors if any of the ids belong to other company than provided one
   */
  async validate(company: Company, personnel: Personnel[] | undefined) {
    const ids = personnel?.map((p) => p.id);
    if (!ids || ids.length === 0) return;

    const personnelWithCompany = await this.personnelRepository.find({
      where: { id: In(ids) },
      relations: { company: true },
    });

    if (personnelWithCompany.some((p) => p.company.id !== company.id)) {
      throw new UnauthorizedException(
        'Some personnel do not belong to the company',
      );
    }
  }

  findOne(id: number, company: Company) {
    return this.personnelRepository.findOne({ where: { id, company } });
  }

  async update(
    id: number,
    company: Company,
    updatePersonnelDto: UpdatePersonnelDto,
  ) {
    const personnel = await this.personnelRepository.findOne({
      where: { id, company },
    });

    if (!personnel) {
      throw new NotFoundException();
    }

    // Check that to be added services are valid = belong to company
    await this.serviceService.validate(company, personnel.services);

    const updatedPersonnel = { ...personnel, ...updatePersonnelDto };

    return this.personnelRepository.save(updatedPersonnel);
  }

  async remove(id: number, company: Company) {
    const personnel = await this.personnelRepository.findOne({
      where: { id, company },
    });

    if (personnel) {
      return this.personnelRepository.remove(personnel);
    } else {
      throw new NotFoundException();
    }
  }
}
