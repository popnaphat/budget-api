import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, BadRequestException } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ItemStatus } from './entities/item.entity';
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/:status')
  async updateItemStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: string // รับ status เป็น string แทน
  ) {
    // ตรวจสอบว่า status เป็นค่าใน ItemStatus หรือไม่
    if (!(status in ItemStatus)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    // แปลง status เป็น ItemStatus enum
    const itemStatus: ItemStatus = ItemStatus[status as keyof typeof ItemStatus];

    return await this.itemsService.updateItemStatus(id, itemStatus);
  }

}
