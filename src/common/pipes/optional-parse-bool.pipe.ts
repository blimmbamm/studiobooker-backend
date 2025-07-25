import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class OptionalParseBoolPipe implements PipeTransform {
  transform(value: unknown): boolean | undefined {
    if (value === undefined || value === '') {
      return undefined;
    }

    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;

    throw new BadRequestException(`Invalid boolean value: ${value}`);
  }
}