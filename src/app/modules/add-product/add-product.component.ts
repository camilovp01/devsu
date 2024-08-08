import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { filter, finalize } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { currentDateValidator } from '../../validators/current-date.validator';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
  form!: FormGroup;
  loading: boolean = false;
  product!: Product;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    const productToEdit = this.router.getCurrentNavigation()?.extras?.state;

    if (productToEdit?.['data']) {
      this.product = {
        ...productToEdit['data'],
        date_release: new Date(productToEdit['data'].date_release)
          .toISOString()
          .substring(0, 10),
        date_revision: new Date(productToEdit['data'].date_revision)
          .toISOString()
          .substring(0, 10),
      };
    }
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
        asyncValidators: [this.productService.validateUniqueProductId()],
        updateOn: 'blur',
      }),
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200),
      ]),
      logo: new FormControl(null, Validators.required),
      date_release: new FormControl(null, [
        Validators.required,
        currentDateValidator(),
      ]),
      date_revision: new FormControl(
        { value: null, disabled: true },
        Validators.required
      ),
    });

    if (this.product) {
      this.form.patchValue(this.product);
      this.prodctId?.disable();
    }

    this.dateRelease?.valueChanges.subscribe((value) => {
      this.dateRevision?.setValue(this.calculateNextYear(value));
    });
  }

  onSaveForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.product) {
      this.editProduct();
    } else {
      this.createProduct();
    }
  }

  get prodctId() {
    return this.form.get('id');
  }

  get name() {
    return this.form.get('name');
  }

  get description() {
    return this.form.get('description');
  }

  get logo() {
    return this.form.get('logo');
  }

  get dateRelease() {
    return this.form.get('date_release');
  }

  get dateRevision() {
    return this.form.get('date_revision');
  }

  private calculateNextYear(currentDate: string) {
    const initialDate = new Date(currentDate);
    const nextYear = new Date(currentDate);
    nextYear.setFullYear(initialDate.getFullYear() + 1);
    return nextYear.toISOString().substring(0, 10);
  }

  private createProduct() {
    this.loading = true;
    this.productService
      .addProduct(this.form.getRawValue())
      .pipe(
        finalize(() => (this.loading = false)),
        filter((response) => !!response?.status && response.status === 200)
      )
      .subscribe(() => this.form.reset());
  }

  private editProduct() {
    this.loading = true;
    this.productService
      .editProduct(this.form.getRawValue())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe();
  }
}
