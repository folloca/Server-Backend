import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from './default.entity';
import { UserEntity } from './user.entity';
import { EstateEntity } from './estate.entity';

@Entity('estate_like')
export class EstateLikeEntity extends DefaultEntity {
  @PrimaryGeneratedColumn({
    name: 'estate_like_id',
    type: 'integer',
    comment: '공간 좋아요 인덱스',
  })
  estateLikeId: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.estateLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  userId: UserEntity;

  @ManyToOne(() => EstateEntity, (estate: EstateEntity) => estate.estateLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'estate_id', referencedColumnName: 'estateId' }])
  estateId: EstateEntity;
}
