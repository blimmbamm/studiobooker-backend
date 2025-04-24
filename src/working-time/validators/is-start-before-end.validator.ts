import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

function parseTimeHHMM(time: string): [number, number] | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);
  if (!match) return null;

  const [, hourStr, minuteStr] = match;
  return [parseInt(hourStr, 10), parseInt(minuteStr, 10)];
}

export function IsBeforeEnd(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBeforeEnd',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          console.log(value, args)
          const [relatedPropertyName] = args.constraints as string[];
          const relatedValue: string = (args.object as any)[relatedPropertyName];

          if(!value || !relatedValue) {
            return true;
          }

          const startTime = parseTimeHHMM(value);
          const endTime = parseTimeHHMM(relatedValue);

          if(!startTime || !endTime) return true;

          const [startH, startM] = startTime;
          const [endH, endM] = endTime;

          const startMinutes = startH * 60 + startM;
          const endMinutes = endH * 60 + endM;

          return startMinutes < endMinutes;
        },
        defaultMessage: () => "Affe"
      },
    });

    // Try other approach from class-validator docs!!
  };
}
