import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Item, ItemStatus } from './entities/item.entity';
import { EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) { }

  create(createItemDto: CreateItemDto) {
    return this.itemRepository.save(createItemDto);
  }

  searchByIds(ids: number[]) {
    return this.itemRepository.find({ where: {
      id: In(ids)
    } });
  }

  searchByIdsNativeQuery(ids: number[]) {
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(',');
    const query = `SELECT * FROM item WHERE id IN (${placeholders})`;
    console.log(query)
    return this.itemRepository.query(query, ids);
  } 

  findAll() {
    return this.itemRepository.find();
  }

  findOne(id: number) {
    return this.itemRepository.findOneBy({ id });
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return this.itemRepository.save({
      id, ...updateItemDto
    })
  }

  async remove(id: number) {
    const item = await this.itemRepository.findOneBy({ id })
    if (!item) {
      throw new NotFoundException(`Not found: id=${id}`)
    }

    return this.itemRepository.delete({ id })
  }

  async updateItemStatus(id: number, status: ItemStatus) {
    // id should not empty
    if (!id) {
      throw new NotFoundException(`id should not empty`)
    }

    // item should found
    const item = await this.itemRepository.findOneBy({ id })
    if (!item) {
      throw new NotFoundException(`not found: id=${id}`)
    }
    // Update item status
    item.status = status; // Use the status passed from the controller
    return await this.itemRepository.save(item);
  }

}
