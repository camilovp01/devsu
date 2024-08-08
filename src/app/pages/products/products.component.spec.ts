import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GetProducts } from '@productModules/application/GetProducts';
import { Product } from '@productModules/domain/models/product.model';
import { of } from 'rxjs';
import { ProductsComponent } from './products.component';

describe('ProductsComponent', () => {
  const product = { id: '1' };
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let mockService: Partial<GetProducts>;

  beforeEach(async () => {
    mockService = {
      execute() {
        return of([]);
      },
    };

    await TestBed.configureTestingModule({
      imports: [ProductsComponent, RouterModule.forRoot([])],
      providers: [{ provide: GetProducts, useValue: mockService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize', () => {
    jest.spyOn(mockService, 'execute');
    component.ngOnInit();
    expect(mockService.execute).toHaveBeenCalledTimes(1);
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
