import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  create(createItemDto: CreateItemDto) {
    console.log('createItemDto', createItemDto);
    return this.itemRepository.save(createItemDto);
  }

  findAll() {
    return this.itemRepository.find();
  }

  findOne(id: number) {
    return this.itemRepository.findOneBy({ id });
  }

<<<<<<< HEAD
  update(id: number, updateItemDto: UpdateItemDto) {
=======
  update(id: number, updateItemDto: UpdateItemDto) {    
    // => { id, title, contectMobileNo }
    // update item set tile = '', con = '' where id = ?

    // const updateItem = {
    //   id: id,
    //   title: updateItemDto.title,
    //   contactMobileNo = updateItemDto.contactMobileNo
    //   status: updateItemDto.state
    // }

>>>>>>> e0952c823334028e06891fff10461c7c800c7660
    return this.itemRepository.save({ id, ...updateItemDto });
  }

  async remove(id: number) {
<<<<<<< HEAD
    // const item = this.itemRepository.findOneBy({id});
    // if(!item){
    //   throw new NotFoundException(`Not found id: ${id}`)
    // }
    return this.itemRepository.delete({ id });
=======
    // const where = { id: id}
    // find by id
    const item = await this.itemRepository.findOneBy({ id })
    if (!item) {
      throw new NotFoundException(`Not found: id=${id}`)
    }
    return this.itemRepository.delete({ id })
>>>>>>> e0952c823334028e06891fff10461c7c800c7660
  }
}
