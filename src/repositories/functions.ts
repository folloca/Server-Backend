import { Logger } from '@nestjs/common';

export const executeQueryWithTransaction = async (connection, query) => {
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await query;
    await queryRunner.commitTransaction();
    Logger.log('Transaction commit success');
  } catch (err) {
    await queryRunner.rollbackTransaction();
    Logger.error('Transaction rollback');
  } finally {
    await queryRunner.release();
    Logger.log('Transaction released');
  }
};
