import { Expose, Transform } from 'class-transformer';
import * as path from 'path';
import dayjs from 'dayjs';

export class NewUserResDto {
  @Expose()
  userId: number;

  @Expose()
  email: string;

  @Expose()
  @Transform(
    ({ value }) =>
      `${path.join(
        __dirname,
        '..',
        '..',
        '..',
        'storage',
        'profile',
      )}/${value}`,
  )
  profileImagePath: string;

  @Expose()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm'))
  createdAt: string;

  @Expose()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm'))
  updatedAt: string;
}
