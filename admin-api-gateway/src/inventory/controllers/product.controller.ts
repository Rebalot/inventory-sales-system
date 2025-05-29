import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { HttpAuthGuard } from "src/auth/guards/http-auth.guard";
import { User } from "src/auth/types/user.interface";
import { ProductServiceClient } from "../services/product.service";
import { CreateProductDto } from "../dto/create-product.dto";
import { UpdateProductDto } from "../dto/update-product.dto";
import { GetProductsQuery } from "../types/get-products-query.interface";

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('api/inventory')
export class ProductController {
  constructor(private readonly productService: ProductServiceClient) {}

    //Product
    @Get('/get-products')
  async getProducts(@Query() query: GetProductsQuery) {
    const products = await this.productService.getProducts(query);
    return products;
  }

  @Post('/create-product')
  @UseGuards(HttpAuthGuard)
  async createProduct(@Body() productData: CreateProductDto) {
    const product = await this.productService.createProduct(productData);
    console.log('ProductController createProduct', product);
    return product;
  }
  
  @Patch('/update-product/:id')
  @UseGuards(HttpAuthGuard)
  async updateProduct(@Param('id') id: string, @Body() productData: UpdateProductDto) {
    console.log()
    const product = await this.productService.updateProduct({id, ...productData});
    return product;
  }

  @Delete('/delete-product/:id')
  @UseGuards(HttpAuthGuard)
  async deleteProduct(@Param('id') id: string) {
    const productDeleted = await this.productService.deleteProduct(id);
    return productDeleted;
  }

}