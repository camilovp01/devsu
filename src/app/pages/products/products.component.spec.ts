import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DeleteProduct } from '@app/modules/products/application/DeleteProduct';
import { GetProducts } from '@productModules/application/GetProducts';
import { Product } from '@productModules/domain/models/product.model';
import { of } from 'rxjs';
import { ProductsComponent } from './products.component';

describe('ProductsComponent', () => {
  const product = { id: '1' } as Product;
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let getProductsService: Partial<GetProducts>;
  let deleteProductService: Partial<DeleteProduct>;

  beforeEach(async () => {
    getProductsService = {
      execute() {
        return of([]);
      },
    };
    deleteProductService = {
      execute() {
        return of();
      },
    };

    await TestBed.configureTestingModule({
      imports: [ProductsComponent, RouterModule.forRoot([])],
      providers: [
        { provide: GetProducts, useValue: getProductsService },
        { provide: DeleteProduct, useValue: deleteProductService },
      ],
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
    jest.spyOn(getProductsService, 'execute');
    component.ngOnInit();
    expect(getProductsService.execute).toHaveBeenCalledTimes(1);
  });

  it('should go to edit page', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.editProduct(product as Product);
    expect(navigateSpy).toHaveBeenCalledWith(['/edit', product.id], {
      state: { data: product },
    });
  });

  it('should showModal to be true when showConfirmRemove is called', () => {
    component.showConfirmRemove(product);
    expect(component.showModal).toBeTruthy();
  });

  it('should showModal to be false when closeModal is called', () => {
    component.closeModal();
    expect(component.showModal).toBeFalsy();
  });

  it('should showMenu  to be true when toggleMenu is called', () => {
    component.toggleMenu(product, { stopPropagation: () => true } as any);
    expect(component.showMenu).toBeTruthy();
  });

  it('When onPageChange is called', () => {
    const page = 5;
    component.onPageChange(page);
    expect(component.currentPage).toEqual(page);
  });

  it('When onItemsPerPageChange is called', () => {
    const itemsPerPage = 10;
    component.onItemsPerPageChange(itemsPerPage);
    expect(component.itemsPerPage).toEqual(itemsPerPage);
  });
});
