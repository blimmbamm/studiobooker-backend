import { IsBeforeEnd } from '../validators/is-start-before-end.validator';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateWorkingTimeDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  weekday?: string;

  @IsBeforeEnd('end')
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'start must be in HH:mm format',
  })  
  start: string;
  
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'end must be in HH:mm format',
  })  
  end: string;
}
