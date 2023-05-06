import { Expose, Transform } from 'class-transformer';
import * as path from 'path';
import dayjs from 'dayjs';

export class SingleEstateProposalListDto {
  @Expose()
  proposalId: number;

  @Expose()
  plannerName: string;

  @Expose()
  proposalIntroduction: string;

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
  @Transform(({ value }) => (value === null ? null : value.split(',')))
  hashTags: string[];

  @Expose()
  totalLikes: number;

  @Expose()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm'))
  createdAt: string;

  @Expose()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm'))
  updatedAt: string;
}
