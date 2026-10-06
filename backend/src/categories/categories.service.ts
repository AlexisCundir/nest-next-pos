import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, Repository } from 'typeorm'
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { Category } from './entities/category.entity.js';
import { Product } from '../products/entities/product.entity.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
  ) { }

  create(createCategoryDto: CreateCategoryDto) {
    // const category = new Category();
    // category.name = createCategoryDto.name;
    return this.categoryRepository.save(createCategoryDto);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number, products?: string) {

    // const options: FindManyOptions<Category> = {
    //   where: {
    //     id
    //   }
    // };

    // if (products) {
    //   options.relations = {
    //     products: true
    //     // no funciona porque no hay bidireccionalidad en el entity de category con products
    //   }
    // }

    // const category = await this.categoryRepository.findOne(options)
    const category = await this.categoryRepository.findOne({
      where: { id }
    });

    if (!category) {
      throw new NotFoundException('La categoria no existe')
    }
    // mi codigo: buscamos los productos con la inyeccion de productRepository
    if (products === "true") {
      const categoryProducts = await this.productRepository.find({
        where: {
          category: {
            id
          }
        }
      });
      // ahora retornamos la categoria y el array de productos
      return {
        ...category,
        products: categoryProducts
      };
    }
    return category;

  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    category.name = updateCategoryDto.name;
    return await this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return 'Categoria Eliminada';
  }
}
