import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './category.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}

  async findAll() {
    return this.categoriesRepo.findAll();
  }
}
