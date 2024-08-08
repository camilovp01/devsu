import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreateProduct } from '@productModules/application/CreateProduct';
import { EditProduct } from '@productModules/application/EditProduct';
import { ValidateIfExistProduct } from '@productModules/application/ValidateIfExistProduct';
import { Product } from '@productModules/domain/models/product.model';
import { finalize, map, Observable } from 'rxjs';
import { currentDateValidator } from '../../validators/current-date.validator';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
  form!: FormGroup;
  loading: boolean = false;
  product!: Product;

  constructor(
    private formBuilder: FormBuilder,
    private createProduct: CreateProduct,
    private editProduct: EditProduct,
    private validateIfExistProduct: ValidateIfExistProduct,
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
        asyncValidators: [this.validateIdProduct()],
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
      this.edit();
    } else {
      this.create();
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

  private create() {
    this.loading = true;
    this.createProduct
      .execute(this.form.getRawValue())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => this.form.reset());
  }

  private edit() {
    this.loading = true;
    this.editProduct
      .execute(this.form.getRawValue())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe();
  }

  private validateIdProduct(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.validateIfExistProduct
        .execute(control.value)
        .pipe(map((existId) => (existId ? { uniqueId: true } : null)));
    };
  }
}
