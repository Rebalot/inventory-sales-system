
export interface GetProductsQuery {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    category?: string;
}