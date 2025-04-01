import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonnelDto } from './dto/create-personnel.dto';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { Repository } from 'typeorm';
import { Personnel } from './entities/personnel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class PersonnelService {
  constructor(
    @InjectRepository(Personnel)
    private personnelRepository: Repository<Personnel>,
  ) {}

  create(company: Company, createPersonnelDto: CreatePersonnelDto) {
    const newPersonnel = this.personnelRepository.create({
      company,
      ...createPersonnelDto,
    });
    return this.personnelRepository.save(newPersonnel);
  }

  findAll(company: Company) {
    return this.personnelRepository.find({
      where: { company },
      relations: { services: true },
    });
  }

  findOne(id: number, company: Company) {
    return this.personnelRepository.findOne({ where: { id, company } });
  }

  async update(
    id: number,
    company: Company,
    updatePersonnelDto: UpdatePersonnelDto,
  ) {
    let personnel = await this.personnelRepository.findOne({
      where: { id, company },
    });

    if (!personnel) {
      throw new NotFoundException();
    }

    personnel = { ...personnel, ...updatePersonnelDto };

    return this.personnelRepository.save(personnel);
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
