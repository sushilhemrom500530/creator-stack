import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  private products: any[] = [];

  async create(createProductDto: CreateProductDto) {
    const product = {
      id: String(this.products.length + 1),
      ...createProductDto,
      createdAt: new Date(),
    };
    this.products.push(product);
    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const startIndex = (page - 1) * limit;
    const items = this.products.slice(startIndex, startIndex + limit);
    return {
      items,
      total: this.products.length,
      page,
      limit,
      totalPages: Math.ceil(this.products.length / limit),
    };
  }

  async findOne(id: string) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async remove(id: string) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.products.splice(index, 1);
    return { message: 'Product deleted successfully' };
  }
}
