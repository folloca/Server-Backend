import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { DateColumnEntity } from './date-column.entity';
import { UserEntity } from './user.entity';
import { LinkingEntity } from './linking.entity';

@Entity('linking_request')
export class LinkingRequestEntity extends DateColumnEntity {
  @PrimaryGeneratedColumn({
    name: 'linking_request_id',
    type: 'integer',
    comment: '링킹 신청 인덱스',
  })
  linkingRequestId: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.linkingRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  userId: number;

  @ManyToOne(
    () => LinkingEntity,
    (linking: LinkingEntity) => linking.linkingRequests,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn([{ name: 'linking_id', referencedColumnName: 'linkingId' }])
  linkingId: LinkingEntity;

  @Column({
    name: 'participate_message',
    type: 'text',
    nullable: false,
    comment: '참여 의사 메시지',
  })
  @IsString()
  @IsNotEmpty()
  participateMessage: string;
}
