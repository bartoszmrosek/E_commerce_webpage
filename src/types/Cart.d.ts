import { Product } from "./Product";

export type Cart = {
    id: number;
    products: Product[];
    total: number;
    discountedTotal: number;
    totalProducts: number;
    totalQuantity: number;
};
