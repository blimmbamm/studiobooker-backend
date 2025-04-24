import { Matches, Validate } from "class-validator";
import { IsBeforeEnd } from "../validators/is-start-before-end.validator";

// @Validate(StartBeforeEndConstraint)
export class CreateWorkingTimeDto {
  weekday: string;
  
  @IsBeforeEnd('end')
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'start must be in HH:mm format',
  })
  start: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'start must be in HH:mm format',
  })
  end: string;
}
