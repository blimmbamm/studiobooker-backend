import { IsBoolean, IsOptional, Matches } from 'class-validator';
import { IsBeforeEnd } from 'src/working-time/validators/is-start-before-end.validator';

export class UpdateWorkingTimeCompanySettingDto {
  @IsBeforeEnd('end')
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'start must be in HH:mm format',
  })
  defaultStart: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'end must be in HH:mm format',
  })
  defaultEnd: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
