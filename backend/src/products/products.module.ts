import { Module } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity.js';
import { Product } from './entities/product.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
