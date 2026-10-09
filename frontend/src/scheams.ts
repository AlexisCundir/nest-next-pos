import { z } from 'zod'
import ShoppingCart from '../components/cart/ShoppingCart';

export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    image: z.string(),
    price: z.coerce.number(),
    inventory: z.number(),
    categoryId: z.number()
})

export const CategorySchema = z.object({
    id: z.number(),
    name: z.string()
})

export const CategoriesResponseSchema = z.array(CategorySchema);

export const CategoryWithProductsResponseSchema = CategorySchema.extend({
    products: z.array(ProductSchema)
});

/** Shopping Cart */
const ShoppingCartContentSchema = ProductSchema.pick({
    name: true,
    image: true,
    price: true,
    inventory: true,
}).extend({
    productId: z.number(),
    quantity: z.number()
});
export const ShoppingCartSchema = z.array(ShoppingCartContentSchema);

export type Product = z.infer<typeof ProductSchema>;
export type ShoppingCart = z.infer<typeof ShoppingCartSchema>;