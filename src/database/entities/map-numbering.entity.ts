import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { DateColumnEntity } from './date-column.entity';
import { EstateEntity } from './estate.entity';

@Entity('map_numbering')
export class MapNumberingEntity extends DateColumnEntity {
  @PrimaryGeneratedColumn({
    name: 'map_numbering_id',
    type: 'integer',
    comment: '평면도 넘버링 인덱스',
  })
  mapNumberingId: number;

  @ManyToOne(
    () => EstateEntity,
    (estate: EstateEntity) => estate.mapNumberings,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn([{ name: 'estate_id', referencedColumnName: 'estateId' }])
  estateId: EstateEntity;

  @Column({
    name: 'numbering',
    type: 'integer',
    nullable: false,
    comment: '평면도 넘버링 번호',
  })
  @IsNumber()
  @IsNotEmpty()
  numbering: number;

  @Column({
    name: 'x_coordinate',
    type: 'float',
    nullable: false,
    comment: 'x 좌표',
  })
  @IsNumber()
  @IsNotEmpty()
  xCoordinate: number;

  @Column({
    name: 'y_coordinate',
    type: 'float',
    nullable: false,
    comment: 'y 좌표',
  })
  @IsNumber()
  @IsNotEmpty()
  yCoordinate: number;
}
