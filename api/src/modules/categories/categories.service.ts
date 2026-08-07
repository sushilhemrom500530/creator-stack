import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  private categories: any[] = [];

  async create(createCategoryDto: CreateCategoryDto) {
    const category = {
      id: String(this.categories.length + 1),
      ...createCategoryDto,
      createdAt: new Date(),
    };
    this.categories.push(category);
    return category;
  }

  async findAll() {
    return this.categories;
  }

  async findOne(id: string) {
    const category = this.categories.find((c) => c.id === id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async remove(id: string) {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    this.categories.splice(index, 1);
    return { message: 'Category deleted successfully' };
  }
}
