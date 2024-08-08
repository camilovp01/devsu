import {
  HttpClient,
  HttpEvent,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly urlBase = `${environment.api_url}`;

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http
      .get<Product[]>(`${this.urlBase}bp/products`)
      .pipe(map((data: any) => data.data));
  }

  addProduct(body: Product): Observable<{ status: number; body: any } | any> {
    return this.http
      .post(`${this.urlBase}bp/products`, body, { observe: 'events' })
      .pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            return { status: event.status, body: event.body };
          }
          return event;
        })
      );
  }

  editProduct(body: Product) {
    return this.http.put<Product>(
      `${this.urlBase}bp/products/${body.id}`,
      body
    );
  }

  removeProduct(id: string) {
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.delete(`${this.urlBase}bp/products`, {
      params,
      responseType: 'text',
    });
  }

  validateUniqueProductId(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.http
        .get<boolean>(
          `${this.urlBase}bp/products/verification/${control.value}`
        )
        .pipe(
          map((existId) => (existId ? { uniqueId: true } : null)),
          catchError(() => of(null))
        );
    };
  }
}
