import { Matches } from 'class-validator';
import { IsBeforeEnd } from 'src/working-time/validators/is-start-before-end.validator';

export class UpdateWorkingTimeForPersonnelDto {
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
