import { Routes } from '@angular/router';
import { AddProductComponent } from './modules/add-product/add-product.component';
import { ProductsComponent } from './modules/products/products.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'add', component: AddProductComponent },
  { path: 'products', component: ProductsComponent },
  { path: '**', redirectTo: 'products' },
];
