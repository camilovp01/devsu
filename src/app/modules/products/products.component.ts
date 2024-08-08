import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, finalize } from 'rxjs';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

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
  ],
})
export class ProductsComponent implements OnInit {
  pageSizeOptions: number[] = [5, 10, 20];
  search = new FormControl('', { nonNullable: true });
  pageSize = new FormControl(this.pageSizeOptions[0], { nonNullable: true });
  loading: boolean = false;
  products: Product[] = [];
  selectedProduct: any = null;
  productsFiltered: Product[] = [];
  showMenu: boolean = false;
  itemsPerPage = 5;
  paginatedProducts: Product[] = [];
  currentPage = 1;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.productService
      .getProducts()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((products) => {
        this.products = products;
        this.productsFiltered = this.products;
        this.paginate(this.currentPage);
      });
    this.search.valueChanges.pipe(debounceTime(300)).subscribe((search) => {
      this.productsFiltered = this.products.filter((product) => {
        let matchesSearch = true;

        const searchStr = search.toString().toLowerCase();
        matchesSearch = Object.values(product).some((value) =>
          value.toString().toLowerCase().includes(searchStr)
        );

        return matchesSearch;
      });
    });
  }

  editProduct(product: Product) {
    this.router.navigate(['/edit', product.id], { state: { data: product } });
  }

  removeProduct(_t22: Product) {
    throw new Error('Method not implemented.');
  }

  toggleMenu(product: any, event: MouseEvent) {
    event.stopPropagation();
    this.showMenu = true;
    this.selectedProduct = this.selectedProduct === product ? null : product;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.paginate(page);
  }

  onItemsPerPageChange(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.paginate(this.currentPage);
  }

  paginate(page: number) {
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.productsFiltered.slice(start, end);
  }
}
