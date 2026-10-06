import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from '../../categories/entities/category.entity.js';
import { Category as CategoryEntity } from "../../categories/entities/category.entity.js";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 60 })
    name: string

    @Column({ type: 'varchar', length: 120, nullable: true, default: 'default.svg' })
    image: string

    @Column({ type: 'decimal' })
    price: number

    @Column({ type: 'int' })
    inventory: number

    // eager = trae todos lso datos relacionados
    // @ManyToOne(() => Category, { eager: true })
    // category: Category

    @ManyToOne(() => Category)
    category: Category

    // @ManyToOne(() => CategoryEntity, (category: any) => category.products)
    // category: Category;

    @Column({ type: 'int' })
    categoryId: number
}
