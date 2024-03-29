import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export abstract class DateColumnEntity {
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    comment: '생성 일자',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    comment: '수정 일자',
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    comment: '삭제 일자',
  })
  deletedAt?: Date | null;
}
