import { IsNumber, IsString } from "class-validator";
import { Category } from "../types/category.type";

export class UpdateProductDto {
    @IsString()
    name?: string;
    
    @IsString()
    category?: Category;
    
    @IsNumber()
    price?: number;
    
    @IsNumber()
    stock?: number;
    
    @IsString()
    sku?: string;
    
}

