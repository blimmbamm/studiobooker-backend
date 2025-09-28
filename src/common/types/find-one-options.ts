import { FindOneOptions, FindOptionsWhere } from 'typeorm';

export type FindOneOptionsWithoutCompany<TEntity> = Omit<
  FindOneOptions<TEntity>,
  'where'
> & {
  where?: Omit<FindOptionsWhere<TEntity>, 'company'>;
};
