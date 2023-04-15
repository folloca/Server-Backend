import { TypeormRepository } from '../custom/decorator/typeorm-repository.decorator';
import { Repository } from 'typeorm';
import { EstateImageEntity } from '../database/entities';

@TypeormRepository(EstateImageEntity)
export class EstateImageRepository extends Repository<EstateImageEntity> {
  private managerConnection = this.manager.connection;

  async createImageData(
    estateId: number,
    fileName: string,
    originalName: string,
  ) {
    // const query = this.create();
  }

  async deleteImageData(estateId) {}
}
