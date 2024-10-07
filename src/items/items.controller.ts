import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, BadRequestException, Query, ParseArrayPipe } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ItemStatus } from './entities/item.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get('search')
  searchByIds(@Query('ids', new ParseArrayPipe({ items: Number, separator: ',' })) ids: number[]) {
    //return this.itemsService.searchByIds(ids);
    return this.itemsService.searchByIdsNativeQuery(ids)
  }

  
  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.findOne(id);
  }
  @Get(':title')
  findOneByTitle(@Param('title') title: string) {
    return this.itemsService.findOneByTitle(title);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN, Role.MANAGER])
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
