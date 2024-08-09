import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ModalComponent } from '@app/components/modal/modal.component';
import { TooltipComponent } from '@app/components/tooltip/tooltip.component';
import { DeleteProduct } from '@app/modules/products/application/DeleteProduct';
import { GetProducts } from '@productModules/application/GetProducts';
import { Product } from '@productModules/domain/models/product.model';
import { debounceTime, finalize, Subject, takeUntil } from 'rxjs';
import { PaginatorComponent } from '../../components/paginator/paginator.component';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PaginatorComponent,
    ModalComponent,
    TooltipComponent,
  ],
})
export class ProductsComponent implements OnInit, OnDestroy {
  search = new FormControl('', { nonNullable: true });
  loading: boolean = false;
  products: Product[] = [];
  selectedProduct: any = null;
  showMenu: boolean = false;
  paginatedProducts: Product[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  showModal: boolean = false;
  showRemoveMessage: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private getProducts: GetProducts,
    private deleteProduct: DeleteProduct,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.getProducts
      .execute()
      .pipe(
        finalize(() => (this.loading = false)),
        takeUntil(this.destroy$)
      )
      .subscribe((products) => {
        this.products = products;
        this.paginate(this.currentPage);
      });
    this.searchProduct();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  editProduct(product: Product): void {
    this.router.navigate(['/edit', product.id], { state: { data: product } });
  }

  showConfirmRemove(product: Product): void {
    this.selectedProduct = product;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  toggleMenu(product: any, event: MouseEvent): void {
    event.stopPropagation();
    this.showMenu = true;
    this.selectedProduct = this.selectedProduct === product ? null : product;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.paginate(page);
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.paginate(this.currentPage);
  }

  paginate(page: number): void {
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.products.slice(start, end);
  }

  delete() {
    this.deleteProduct
      .execute(this.selectedProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.products = this.products.filter(
          (product) => product.id !== this.selectedProduct.id
        );
        this.selectedProduct = null;
        this.showModal = false;
        this.showRemoveMessage = true;
        this.paginate(this.currentPage);
      });
  }

  private searchProduct(): void {
    this.search.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((search) => {
        if (!search) {
          this.paginatedProducts = this.products;
          this.paginate(this.currentPage);
          return;
        }
        this.paginatedProducts = this.products.filter((product) => {
          let matchesSearch = true;
          const searchStr = search.toString().toLowerCase();
          matchesSearch = Object.values(product).some((value) =>
            value.toString().toLowerCase().includes(searchStr)
          );

          return matchesSearch;
        });
      });
  }
}
