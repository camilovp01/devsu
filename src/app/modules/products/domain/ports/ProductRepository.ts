import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductResponse } from '../models/productCreated.model';

export interface ProductRepository {
  create(product: Product): Observable<ProductResponse>;
  getProducts(): Observable<Product[]>;
  update(product: Product): Observable<ProductResponse>;
  delete(id: string): void;
  validateUniqueProductId(id: string): Observable<boolean>;
}
