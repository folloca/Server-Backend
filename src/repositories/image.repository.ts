import { TypeormRepository } from '../custom/decorator/typeorm-repository.decorator';
import { Repository } from 'typeorm';
import { EstateImageEntity } from '../database/entities';
import * as path from 'path';

@TypeormRepository(EstateImageEntity)
export class EstateImageRepository extends Repository<EstateImageEntity> {
  private managerConnection = this.manager.connection;

  async getImageData(estateId: number) {
    const imageData = await this.findBy({ estateId });
    return await Promise.all(
      imageData.map(
        (el) =>
          `${path.join(__dirname, '..', '..', '..', 'storage', 'estate')}/${
            el.imageName
          }`,
      ),
    );
  }

  async createImageData(estateId: number, filenames: string[]) {
    const data = filenames.map((filename) => {
      return { estateId, imageName: filename };
    });
    await this.save(data);
  }

  async deleteImageData(estateId) {}
}
