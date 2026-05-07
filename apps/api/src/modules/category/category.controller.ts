import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './category.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return { data: categories, message: 'Categories list', statusCode: 200 };
  }
}
