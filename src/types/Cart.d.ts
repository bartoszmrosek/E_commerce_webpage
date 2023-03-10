import { CartProduct } from "./CartProduct";

export type Cart = {
    id: number;
    products: CartProduct[];
    total: number;
    discountedTotal: number;
    totalProducts: number;
    totalQuantity: number;
};
