import { Inject, Injectable } from '@angular/core';
import { ProductRepository } from '@productModules/domain/ports/ProductRepository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ValidateIfExistProduct {
  constructor(
    @Inject('IProductRepository') private productRepository: ProductRepository
  ) {}

  execute(id: string): Observable<boolean> {
    try {
      return this.productRepository.validateUniqueProductId(id);
    } catch (error) {
      throw error;
    }
  }
}
