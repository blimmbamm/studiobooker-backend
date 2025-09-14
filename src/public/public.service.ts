import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { ServiceCategoryService } from '../service-category/service-category.service';
import { CompanyInfoService } from '../company-info/company-info.service';
import { ServiceService } from '../service/service.service';
import { PersonnelService } from '../personnel/personnel.service';
import { AvailableSlotsQueryWithCompanyDto } from '../appointment/dto/available-slots-query.dto';
import { AppointmentService } from '../appointment/appointment.service';
import { CreateAppointmentWithCompanyDto } from '../appointment/dto/create-appointment.dto';

@Injectable()
export class PublicService {
  constructor(
    private companyService: CompanyService,
    private serviceCategoryService: ServiceCategoryService,
    private serviceService: ServiceService,
    private appointmentService: AppointmentService,
  ) {}

  async findStudioStructured(companyId: number) {
    const company = await this.companyService.findOneWithRelations(companyId, {
      companyInfo: true,
    });

    if (!company) {
      throw new NotFoundException();
    }

    const { companyInfo } = company;

    const services = await this.serviceCategoryService.findAll(company, {
      services: { activated: true },
    });

    return { companyId, services, ...companyInfo };
  }

  async findPersonnelByService({
    companyId,
    serviceId,
  }: {
    companyId: number;
    serviceId: number;
  }) {
    const company = await this.companyService.findOne(companyId);

    if (!company) {
      throw new NotFoundException();
    }

    // return this.personnelService.findAllWithService(company, serviceId);
    return this.serviceService.findServicePersonnel(company, serviceId);
  }

  async findAvailableAppointmentSlots({
    companyId,
    ...dto
  }: AvailableSlotsQueryWithCompanyDto) {
    const company = await this.companyService.findOne(companyId);

    if (!company) throw new NotFoundException();

    return this.appointmentService.findAvailableSlots(company, dto);
  }

  async createAppointment({
    companyId,
    ...dto
  }: CreateAppointmentWithCompanyDto) {
    const company = await this.companyService.findOne(companyId);

    if (!company) throw new NotFoundException();

    return this.appointmentService.createAppointment(company, dto);
  }
}
