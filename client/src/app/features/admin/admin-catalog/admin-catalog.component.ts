import { Component, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ShopService } from '../../../core/services/shop.service';
import { Product } from '../../../shared/models/product';
import { ShopParams } from '../../../shared/models/shopParams';
import { CustomTableComponent } from '../../../shared/components/custom-table/custom-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormComponent } from '../product-form/product-form.component';
import { AdminService } from '../../../core/services/admin.service';
import { firstValueFrom } from 'rxjs';
import { DialogService } from '../../../core/services/dialog.service';
import { Router } from '@angular/router';
import { UpdateQuantityComponent } from '../update-quantity/update-quantity.component';

@Component({
  selector: 'app-admin-catalog',
  standalone: true,
  imports: [
    CustomTableComponent,
    MatButtonModule
  ],
  templateUrl: './admin-catalog.component.html',
  styleUrl: './admin-catalog.component.scss'
})
export class AdminCatalogComponent {
  products: Product[] = [];
  private shopService = inject(ShopService);
  productParams = new ShopParams();
  private dialog = inject(MatDialog);
  private adminService = inject(AdminService);
  private dialogService = inject(DialogService);
  private router = inject(Router);
  totalItems = 0;

  columns = [
    { field: 'id', header: 'No.' },
    { field: 'name', header: 'Product name' },
    { field: 'type', header: 'Type' },
    { field: 'brand', header: 'Brand' },
    { field: 'quantityInStock', header: 'Quantity' },
    { field: 'price', header: 'Price', pipe: 'currency', pipeArgs: 'USD' }
  ];

  actions = [
    {
      label: 'View',
      icon: 'visibility',
      tooltip: 'View product',
      action: (row: any) => {
        this.router.navigateByUrl(`/shop/${row.id}`)
      }
    },
    {
      label: 'Edit',
      icon: 'edit',
      tooltip: 'Edit product',
      action: (row: any) => {
        this.openEditDialog(row)
      }
    },
    {
      label: 'Delete',
      icon: 'delete',
      tooltip: 'Delete product',
      action: (row: any) => {
        this.openConfirmDialog(row.id)
      }
    },
    {
      label: 'Update quantity',
      icon: 'add_circle',
      tooltip: 'Update quantity in stock',
      action: (row: any) => {
        this.openQuantityDialog(row);
      }
    },
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.shopService.getProducts(this.productParams).subscribe({
      next: response => {
        if (response.data) {
          this.products = response.data;
          this.totalItems = response.count;
        }
      }
    })
  }

  openCreateDialog() {
    const dialog = this.dialog.open(ProductFormComponent, {
      minWidth: '500px',
      data: {
        title: 'Create product'
      }
    });
    dialog.afterClosed().subscribe({
      next: async result => {
        if (result) {
          const product = await firstValueFrom(this.adminService.createProduct(result.product));
          if (product) {
            this.products.push(product);
          }
        }
      }
    })
  }

  openEditDialog(product: Product) {
    const dialog = this.dialog.open(ProductFormComponent, {
      minWidth: '500px',
      data: {
        title: 'Edit product',
        product
      }
    })
    dialog.afterClosed().subscribe({
      next: async result => {
        if (result) {
          await firstValueFrom(this.adminService.updateProduct(result.product));
          const index = this.products.findIndex(p => p.id === result.product.id);
          if (index !== -1) {
            this.products[index] = result.product;
          }
        }
      }
    })
  }

  async openConfirmDialog(id: number) {
    const confirmed = await this.dialogService.confirm(
      'Confirm delete product',
      'Are you sure you want to delete this product? This cannot be undone'
    );
    if (confirmed) this.onDelete(id);
  }

  onDelete(id: number) {
    this.adminService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(x => x.id !== id);
      }
    })
  }

  openQuantityDialog(product: Product) {
    const dialog = this.dialog.open(UpdateQuantityComponent, {
      minWidth: '500px',
      data: {
        quantity: product.quantityInStock,
        name: product.name
      }
    })
    dialog.afterClosed().subscribe({
      next: async result => {
        if (result) {
          console.log(result);
          await firstValueFrom(this.adminService.updateStock(product.id, result.updatedQuantity));
          const index = this.products.findIndex(p => p.id === product.id);
          if (index !== -1) {
            this.products[index].quantityInStock = result.updatedQuantity;
          }
        }
      }
    })
  }

  onPageChange(event: PageEvent) {
    this.productParams.pageNumber = event.pageIndex + 1;
    this.productParams.pageSize = event.pageSize;
    this.loadProducts();
  }
}