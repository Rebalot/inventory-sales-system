import { Category } from "./category.type";

export interface ProductPayload {
    name: string;
    category: Category;
    price: number;
    stock: number;
    sku: string;
}

export interface Product extends ProductPayload {
    id: string;
}

export interface UpdateProductPayload{
    id: string;
    name?: string;
    category?: Category;
    price?: number;
    stock?: number;
    sku?: string;
}