import { Category } from '@prisma/client';

export interface ProductPayload {
    name: string;
    category: Category;
    price: number;
    stock: number;
    sku: string;
}

export interface ProductResponse extends ProductPayload {
    id: string;
}

export interface PaginatedProducts {
    items: ProductResponse[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

export interface UpdateProductPayload {
    id: string;
    name?: string;
    category?: Category;
    price?: number;
    stock?: number;
    sku?: string;
}

export interface ProductQuery {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    category?: Category;
}