import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity.js';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity.js';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { CouponsService } from '../coupons/coupons.service.js';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents) private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private readonly couponService: CouponsService
  ) { }
  async create(createTransactionDto: CreateTransactionDto) {

    await this.productRepository.manager.transaction(async (transacrionEntityManager) => {
      const transaction = new Transaction();
      const total = createTransactionDto.contents.reduce((total, item) => total + (item.quantity * item.price), 0)
      // transaction.total = createTransactionDto.total;
      transaction.total = total;
      // await this.transactionRepository.save(transaction)
      // await transacrionEntityManager.save(transaction)

      // logica para aplicar cupones
      if (createTransactionDto.coupon) {
        const coupon = await this.couponService.applyCoupon(createTransactionDto.coupon);

        const discount = (coupon.percentage / 100) * total;
        transaction.discount = discount;
        transaction.coupon = coupon.name;
        transaction.total -= discount;
      }


      for (const contents of createTransactionDto.contents) {
        // const product = await this.productRepository.findOneBy({ id: contents.productId });
        const product = await transacrionEntityManager.findOneBy(Product, { id: contents.productId });

        const errors = [];

        //// mi codigo: validacion que si existe el producto
        if (!product) {
          errors.push(`El producto con ID ${contents.productId} no existe.`)
          throw new NotFoundException(errors);
        }

        if (contents.quantity > product.inventory) {
          errors.push(`El articulo ${product.name} excede la cantidad disponible`);
          throw new BadRequestException(errors);
        }

        product.inventory -= contents.quantity;
        // como borramos el cascade a producto del entity, ahora debemos guardar manualmente el product
        await transacrionEntityManager.save(product);

        // await this.transactionContentsRepository.save({ ...contents, transaction, product });
        // await transacrionEntityManager.save({ ...contents, transaction, product });

        // Creamos instancia de TransactionContents
        const transactionContent = new TransactionContents();
        transactionContent.price = contents.price;
        transactionContent.product = product;
        transactionContent.quantity = contents.quantity;
        transactionContent.transaction = transaction;

        await transacrionEntityManager.save(transaction) // nota: esto se puede sacar del bucle, solo lo necesitamos guardar 1 vez
        await transacrionEntityManager.save(transactionContent);
      }
    })



    return "Venta almacenada correctamente";
  }

  findAll(transactionDate?: string) {
    const options: FindManyOptions<Transaction> = {
      relations: {
        contents: true
      }
    }

    if (transactionDate) {
      const date = parseISO(transactionDate);

      if (!isValid(date)) {
        throw new BadRequestException('Fecha no valida')
      }

      const start = startOfDay(date)
      const end = endOfDay(date)
      // console.log(start)
      // console.log(end)
      options.where = {
        transactionDate: Between(start, end)
      }

    }

    return this.transactionRepository.find(options);
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id
      },
      relations: {
        contents: true
      }
    })

    if (!transaction) {
      throw new NotFoundException('Transaccion no encontrada');
    }

    return transaction;
  }

  // PENDIENTE! controller y service
  // update(id: number, updateTransactionDto: UpdateTransactionDto) {
  //   return `This action updates a #${id} transaction`;
  // }

  async remove(id: number) {
    const transaction = await this.findOne(id);

    for (const contents of transaction.contents) {
      const product = await this.productRepository.findOneBy({ id: contents.product.id });
      // mi codigo: en nuevas versiones product no puede ser null, verificamos con un if aunque es un caso que nunca pueda pasar!
      if (!product) {
        throw new NotFoundException(`No se encontró el producto con ID ${contents.product.id} para restaurar stock.`);
      }
      //
      product.inventory += contents.quantity;
      await this.productRepository.save(product);


      const transactionContents = await this.transactionContentsRepository.findOneBy({ id: contents.id });
      // mi codigo: mismo caso, transactionContents no puede ser null, verificamos aunque no pueda pasar
      if (!transactionContents) {
        throw new BadRequestException('No habia contents en la transaccion');
      }
      //
      await this.transactionContentsRepository.remove(transactionContents);

      /*
      // solucion sin modificar el entity
       const contentIds = transaction.contents.map(content => content.id);
       if (contentIds.length > 0) {
         await this.transactionContentsRepository.delete(contentIds);
       }
      */
    }

    await this.transactionRepository.remove(transaction);
    return { message: "Venta eliminada" };
  }
}
