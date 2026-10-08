import { create } from "zustand";
import { Product } from "./scheams";

interface Store {
    total: number

    addToCart: (product: Product) => void
}


export const useStore = create<Store>(() => ({
    total: 0,
    addToCart: (product) => {
        console.log(product)
    }
}))