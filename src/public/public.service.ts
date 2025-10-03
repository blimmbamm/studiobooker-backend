import { Injectable } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { ServiceCategoryService } from '../service-category/service-category.service';
import { AvailableSlotsQueryWithCompanyDto } from '../appointment/dto/available-slots-query.dto';
import { AppointmentService } from '../appointment/appointment.service';
import { CreateAppointmentWithCompanyDto } from '../appointment/dto/create-appointment.dto';
import { PersonnelService } from '../personnel/personnel.service';

@Injectable()
export class PublicService {
  constructor(
    private companyService: CompanyService,
    private serviceCategoryService: ServiceCategoryService,
    private personnelService: PersonnelService,
    private appointmentService: AppointmentService,
  ) {}

  async findStudioStructured(companyId: number) {
    const company =
      await this.companyService.findByIdWithRelationsOrThrowNotFoundException(
        companyId,
        {
          companyInfo: true,
        },
      );

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
    const company =
      await this.companyService.findByIdOrThrowNotFoundException(companyId);

    const personnel = await this.personnelService.findAllWithFilters(company, {
      serviceId,
      activated: true,
    });

    return personnel.map(({ id, name }) => ({ id, name }));
  }

  async findAvailableAppointmentSlots({
    companyId,
    ...dto
  }: AvailableSlotsQueryWithCompanyDto) {
    const company =
      await this.companyService.findByIdOrThrowNotFoundException(companyId);

    return this.appointmentService.findAvailableSlots(company, dto);
  }

  async createAppointment({
    companyId,
    ...dto
  }: CreateAppointmentWithCompanyDto) {
    const company =
      await this.companyService.findByIdOrThrowNotFoundException(companyId);

    return this.appointmentService.createAppointment(company, dto);
  }
}
