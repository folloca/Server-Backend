import { TypeormRepository } from '../custom/decorator/typeorm-repository.decorator';
import { Repository } from 'typeorm';
import { EstateImageEntity, ProposalImageEntity } from '../database/entities';
import * as path from 'path';

@TypeormRepository(EstateImageEntity)
export class EstateImageRepository extends Repository<EstateImageEntity> {
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
}

@TypeormRepository(ProposalImageEntity)
export class ProposalImageRepository extends Repository<ProposalImageEntity> {
  async getImageData(proposalId: number) {
    return await this.findBy({ proposalId });
  }

  async createImageData(proposalId: number, filenames: string[]) {
    const data = filenames.map((filename) => {
      return { proposalId, imageName: filename };
    });
    await this.save(data);
  }

  async deleteImageData(proposalId: number) {
    await this.delete({ proposalId });
  }
}
