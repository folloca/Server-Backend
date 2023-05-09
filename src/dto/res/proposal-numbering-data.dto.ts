import { Expose } from 'class-transformer';

export class ProposalNumberingDataDto {
  @Expose({ name: 'mapNumbering' })
  mapTagNumber: number;

  @Expose()
  detailDescription: string;
}
