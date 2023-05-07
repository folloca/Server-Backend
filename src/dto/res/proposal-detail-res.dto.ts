import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';
import * as path from 'path';

export class ProposalDetailResDto {
  @Expose()
  proposalId: number;

  @Expose()
  plannerId: number;

  @Expose()
  totalLikes: number;

  @Expose({ name: 'thumbnail' })
  @Transform(
    ({ value }) =>
      `${path.join(
        __dirname,
        '..',
        '..',
        '..',
        'storage',
        'proposal',
      )}/${value}`,
  )
  thumbnailPath: string;

  @Expose()
  proposalIntroduction: string;

  @Expose()
  proposalDescription: string;

  @Expose()
  opinionOpen: boolean;

  @Expose()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm'))
  createdAt: string;

  @Expose()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm'))
  updatedAt: string;
}
