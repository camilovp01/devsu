import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ProductsComponent implements OnInit {
  pageSizeOptions: number[] = [5, 10, 20];
  search = new FormControl('', { nonNullable: true });
  pageSize = new FormControl(this.pageSizeOptions[0], { nonNullable: true });
  loading: boolean = false;
  products: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.productService
      .getProducts()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((products) => {
        this.products = products;
      });
  }

  editProduct(product: Product) {
    console.log("asasa");
    
    this.router.navigate(['/edit', product.id], { state: { data: product } });
  }

  removeProduct(_t22: Product) {
    throw new Error('Method not implemented.');
  }
}
