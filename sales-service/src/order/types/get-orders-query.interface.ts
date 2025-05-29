import { OrderStatus } from "@prisma/client";

export interface GetOrdersQuery {
    page: number;
    limit: number;
    search?: string;
    status?: OrderStatus;
    date?: {
        gte: string | Date;
        lte: string | Date;	
    };
}