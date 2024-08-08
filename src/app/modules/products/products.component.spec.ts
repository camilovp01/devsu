import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductsComponent } from './products.component';

describe('ProductsComponent', () => {
  const product = { id: '4' };
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let mockService: Partial<ProductService>;

  beforeEach(async () => {
    mockService = {
      getProducts() {
        return of([]);
      },
    };

    await TestBed.configureTestingModule({
      imports: [ProductsComponent, RouterModule.forRoot([])],
      providers: [{ provide: ProductService, useValue: mockService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize datasource', () => {
    jest.spyOn(mockService, 'getProducts');
    component.ngOnInit();
    expect(mockService.getProducts).toHaveBeenCalledTimes(1);
  });

  it('should go to edit page', () => {
    const router = TestBed.inject(Router);

    const navigateSpy = jest.spyOn(router, 'navigate');

    component.editProduct(product as Product);
    expect(navigateSpy).toHaveBeenCalledWith(['/edit', product.id], {
      state: { data: product },
    });
  });
});
