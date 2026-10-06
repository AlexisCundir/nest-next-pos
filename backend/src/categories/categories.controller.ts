import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, BadRequestException, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { IdValidationPipe } from '../common/pipes/id-validation/id-validation.pipe.js';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService
  ) { }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', IdValidationPipe) id: string,
    @Query('products') products?: string
  ) {
    return this.categoriesService.findOne(+id, products);
  }

  @Patch(':id')
  update(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', IdValidationPipe) id: string) {
    return this.categoriesService.remove(+id);
  }
}
