import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../products/entities/product.entity.js";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number

    @Column('decimal')
    total: number

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)" })
    transactionDate: Date

    @OneToMany(() => TransactionContents, (transaction) => transaction.transaction)
    contents: TransactionContents[]
}

@Entity()
export class TransactionContents {
    @PrimaryGeneratedColumn()
    id: number

    @Column('int')
    quantity: number

    @Column('decimal')
    price: number

    // entity modificado para eliminar dependencia de cacada a productos
    // @ManyToOne(() => Product, (product) => product.id, { eager: true, cascade: true })
    // product: Product
    @ManyToOne(() => Product, { eager: true })
    product: Product

    // @ManyToOne(() => Transaction, (transaction) => transaction.contents, { cascade: true })
    // transaction: Transaction
    @ManyToOne(() => Transaction, (transaction) => transaction.contents)
    transaction: Transaction
}