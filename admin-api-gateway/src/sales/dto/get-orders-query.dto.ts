import { Transform } from "class-transformer";

export class GetOrdersQuery {
    page!: number;
    limit!: number;
    search?: string;
    status?: string;
    
    @Transform(({ value }) => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    })
    date?: { gte: string; lte: string }
}