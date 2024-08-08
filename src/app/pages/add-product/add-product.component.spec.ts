import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreateProduct } from '@productModules/application/CreateProduct';
import { EditProduct } from '@productModules/application/EditProduct';
import { ValidateIfExistProduct } from '@productModules/application/ValidateIfExistProduct';
import { Product } from '@productModules/domain/models/product.model';
import { ProductResponse } from '@productModules/domain/models/productCreated.model';
import { of } from 'rxjs';
import { AddProductComponent } from './add-product.component';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let createService: Partial<CreateProduct>;
  let editService: Partial<EditProduct>;
  let validateIfExistProductService: Partial<ValidateIfExistProduct>;
  let product: Product;
  let productResponse: ProductResponse;

  beforeEach(async () => {
    createService = {
      execute() {
        return of(productResponse);
      },
    };
    editService = {
      execute() {
        return of(productResponse);
      },
    };
    validateIfExistProductService = {
      execute() {
        return of(false);
      },
    };

    product = {
      id: '111',
      name: 'ITEM 1',
      date_release: new Date(),
      date_revision: new Date(),
      description: 'Description Item 1',
      logo: (Math.random() * 100).toString(),
    };
    productResponse = {
      message: 'Product created successfully',
      data: product,
    };

    await TestBed.configureTestingModule({
      imports: [
        AddProductComponent,
        RouterModule.forRoot([]),
        ReactiveFormsModule,
      ],
      providers: [
        { provide: CreateProduct, useValue: createService },
        { provide: EditProduct, useValue: editService },
        {
          provide: ValidateIfExistProduct,
          useValue: validateIfExistProductService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form on init', () => {
    const keys = [
      'id',
      'name',
      'description',
      'logo',
      'date_release',
      'date_revision',
    ];

    expect(Object.keys(component.form.getRawValue())).toEqual(keys);
  });

  it('should set product on edit', () => {
    component.product = product;
    component.ngOnInit();
    expect(component.form.getRawValue()).toEqual(product);
  });

  it('should update date_revision on release change', fakeAsync(() => {
    component.form.patchValue({ date_release: new Date() });
    tick(500);
    expect(component.form.get('date_revision')?.value).not.toBeNull();
  }));

  it('should not save if form is not valid', () => {
    const createProductSpy = jest.spyOn(component as any, 'create');
    const editProductSpy = jest.spyOn(component as any, 'edit');
    component.onSaveForm();
    expect(createProductSpy.mock.calls).toHaveLength(0);
    expect(editProductSpy.mock.calls).toHaveLength(0);
  });

  it('should edit product on save', () => {
    const createProductSpy = jest.spyOn(component as any, 'create');
    const editProductSpy = jest.spyOn(component as any, 'edit');
    component.form.patchValue(product);
    component.product = product;
    component.onSaveForm();
    expect(createProductSpy.mock.calls).toHaveLength(0);
    expect(editProductSpy.mock.calls).toHaveLength(1);
  });

  it('should create product on save', () => {
    const createProductSpy = jest.spyOn(component as any, 'create');
    const editProductSpy = jest.spyOn(component as any, 'edit');
    component.form.patchValue(product);
    component.onSaveForm();
    expect(createProductSpy.mock.calls).toHaveLength(1);
    expect(editProductSpy.mock.calls).toHaveLength(0);
  });

  it('should get product from router state', () => {
    const router = TestBed.inject(Router) as any;
    const mockNavigationExtras = {
      state: {
        data: product,
      },
    };

    jest.spyOn(router, 'getCurrentNavigation').mockReturnValue({
      extras: mockNavigationExtras,
    });

    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const p = {
      ...product,
      date_release: new Date(product.date_release)
        .toISOString()
        .substring(0, 10),
      date_revision: new Date(product.date_revision)
        .toISOString()
        .substring(0, 10),
    };
    expect(component.product).toEqual(p);
  });
});
