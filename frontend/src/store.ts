import { create } from "zustand";
import { devtools } from "zustand/middleware"
import { Product, ShoppingCart } from "./scheams";

interface Store {
    total: number
    contents: ShoppingCart
    addToCart: (product: Product) => void
}

// este es un state, guarda en memoria el total y contents, la funcion addToCart activa el hook para modificar este state
export const useStore = create<Store>()(devtools((set, get) => ({
    total: 0,
    contents: [],
    addToCart: (product) => {
        // recibe un product, crea const productId y const ...data con la informacion de ese product
        const { id: productId, categoryId, ...data } = product;
        // creamos una instancia de contents, originalmente vacia
        let contents: ShoppingCart = [];
        // buscamos si el product id ya esta en el array
        // al principio el array esta vacio, luego se ira llenando y no queremos duplicados del mismo product
        // findIndex retorna -1 si no existe, si existe devuelve la posicion en el array
        const duplicated = get().contents.findIndex(item => item.productId === productId)

        // si duplicated es -1 el product es nuevo, por else lo agregamos al contents instanciado vacio
        if (duplicated >= 0) {
            // duplicated no es =-1 entonces debemos sumar 1 al quantity del product ya existente

            // antes verificamos que a medida que se agreguen duplicateds no sobrepasemos el stock del producto
            // verificamos que la cantidad del contents en el estado no sea mayor o igual al stock de inventario
            // si eso pasa mandamos un return para que termine todo y el hook no haga nada, caso contrario continua
            if (get().contents[duplicated].quantity >= get().contents[duplicated].inventory) return

            // PARA SUMAR AL QUANTITY DEL PRODUCT EXISTENTE:
            // obtenemos el contents del estado y con map iteramos sobre cada elemento
            // .maps = itera sobre un array y crear uno nuevo modificando cada uno de sus elementos mediante una función callback
            // en el callback hacemos un if ternario para preguntar por el mismo productId en cada item y asi encontrar el duplicado
            contents = get().contents.map(item => item.productId === productId ? {
                // si lo encontramos lo modificamos copiando ...item y cambiando quantity a +=1
                ...item,
                quantity: item.quantity + 1,
                // si no lo encontramos devolvemos el mismo item para que la copia .map guarde todos los datos del content del estado
            } : item)

        } else {
            // si no hay duplicados llenamos el contents instanciado vacio asi:
            // primero obtenemos el contents del estado ...get().contents
            // NOTA: los ... "desfragmetnan" el array u objeto en sus componente para copiar a otro array u objeto
            // ahora nuestro contents tiene los datos del estado, luego le agregamos el nuevo producto {...data, quantity, productId}
            contents = [...get().contents, {
                ...data,
                // como es la primera vez q tenemos este product (no es duplicado), quantity es =1
                // las siguientes veces pasara por el if y no por el else
                quantity: 1,
                productId
            }];
        }

        // guardamos este contents en el estado con set()
        set(() => ({
            contents
        }))
    }
})))