import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment.development';
import { Product } from '@productModules/domain/models/product.model';
import { ProductResponse } from '@productModules/domain/models/productCreated.model';
import { ProductRepository } from '@productModules/domain/ports/ProductRepository';
import { Observable, map } from 'rxjs';

@Injectable()
export class ProductService implements ProductRepository {
  private readonly urlBase = `${environment.api_url}`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.urlBase}bp/products`)
      .pipe(map((data: any) => data.data));
  }

  create(body: Product): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.urlBase}bp/products`, body);
  }

  update(product: Product): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(
      `${this.urlBase}bp/products/${product.id}`,
      product
    );
  }

  delete(id: string) {
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.delete(`${this.urlBase}bp/products`, {
      params,
      responseType: 'text',
    });
  }

  validateUniqueProductId(id: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.urlBase}bp/products/verification/${id}`
    );
  }
}
