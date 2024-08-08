import { Inject, Injectable } from '@angular/core';
import { Product } from '@productModules/domain/models/product.model';
import { ProductRepository } from '@productModules/domain/ports/ProductRepository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetProducts {
  constructor(
    @Inject('IProductRepository') private productRepository: ProductRepository
  ) {}

  execute(): Observable<Product[]> {
    try {
      return this.productRepository.getProducts();
    } catch (error) {
      throw error;
    }
  }
}
