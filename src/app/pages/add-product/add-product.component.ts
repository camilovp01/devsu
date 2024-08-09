import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { ModalComponent } from '@app/components/modal/modal.component';
import {
  FormValidationMessage,
  messagesErrors,
} from '@app/validators/form-messages.validator';
import { CreateProduct } from '@productModules/application/CreateProduct';
import { EditProduct } from '@productModules/application/EditProduct';
import { ValidateIfExistProduct } from '@productModules/application/ValidateIfExistProduct';
import { Product } from '@productModules/domain/models/product.model';
import { finalize, map, Observable, Subject, takeUntil } from 'rxjs';
import { currentDateValidator } from '../../validators/current-date.validator';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ModalComponent],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  loading: boolean = false;
  product!: Product;
  showMessage: boolean = false;
  messageConfirmCreateUpdate: string = '';
  messagesErrors: FormValidationMessage[] = messagesErrors;
  destroy$: Subject<boolean> = new Subject<boolean>();

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
    this.initForm();
    if (this.product) {
      this.form.patchValue(this.product);
      this.productId?.disable();
    }

    this.dateRelease?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.dateRevision?.setValue(this.calculateNextYear(value));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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

  get productId() {
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

  private initForm(): void {
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
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe(() => {
        this.showMessage = true;
        this.messageConfirmCreateUpdate = '¡Producto creado exitósamente!';
        this.form.reset();
      });
  }

  private edit() {
    this.loading = true;
    this.editProduct
      .execute(this.form.getRawValue())
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe(() => {
        this.showMessage = true;
        this.messageConfirmCreateUpdate = '¡Producto editado exitósamente!';
      });
  }

  private validateIdProduct(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.validateIfExistProduct.execute(control.value).pipe(
        takeUntil(this.destroy$),
        map((existId) => (existId ? { uniqueId: true } : null))
      );
    };
  }
}
