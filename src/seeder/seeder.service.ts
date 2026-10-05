import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity.js';
import { Repository, DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity.js';
import { categories } from './data/categories.js';
import { products } from './data/products.js';

@Injectable()
export class SeederService {
    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectDataSource() private readonly dataSource: DataSource
    ) { }

    async onModuleInit() {
        const connection = this.dataSource;
        if (!connection) {
            throw new Error('DataSource sigue siendo undefined. Revisa la inyección.');
        }
        await connection.dropDatabase();
        await connection.synchronize();
        console.log('¡Base de datos limpiada y sincronizada correctamente!');
    }



    async seed() {
        await this.categoryRepository.save(categories);
        for await (const seedProduct of products) {
            const category = await this.categoryRepository.findOneBy({ id: seedProduct.categoryId });
            if (!category) {
                throw new NotFoundException('categoria no encontrada en los seeders')
            }
            const product = new Product();
            product.name = seedProduct.name;
            product.image = seedProduct.image;
            product.price = seedProduct.price;
            product.inventory = seedProduct.inventory;
            product.category = category;

            await this.productRepository.save(product);
        }
    }
}
