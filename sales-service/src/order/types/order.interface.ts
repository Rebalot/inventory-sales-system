
export interface OrderResponse {
    id: string;
    orderNumber: string;
    customerId: string;
    date: Date;
    total: number;
    status: string;
    paymentMethod: string;
    items: OrderItemResponse[];
}
export interface OrderItemResponse {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
}
export interface PaginatedOrders {
    items: OrderResponse[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}