import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { Order } from '../../../shared/models/order';
import { OrderParams } from '../../../shared/models/orderParams';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DialogService } from '../../../core/services/dialog.service';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from "../../../shared/components/custom-table/custom-table.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatTooltip,
    MatIcon,
    CommonModule,
    CustomTableComponent
],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  private adminService = inject(AdminService);
  private dialogService = inject(DialogService);
  private router = inject(Router);
  orderParams = new OrderParams();
  totalItems = 0;

  columns = [
    { field: 'id', header: 'No.' },
    { field: 'buyerEmail', header: 'Buyer Email' },
    { field: 'orderDate', header: 'Order Date', pipe: 'date', pipeArgs: { year: 'numeric', month: 'short', day: 'numeric' } },
    { field: 'total', header: 'Total', pipe: 'currency', pipeArgs: 'USD' },
    { field: 'status', header: 'Status' }
  ];

  actions = [
    {
      label: 'View',
      icon: 'visibility',
      tooltip: 'View Order',
      action: (row: any) => {
        this.router.navigateByUrl(`/orders/${row.id}`)
      }
    },
    {
      label: 'Refund',
      icon: 'undo',
      tooltip: 'Refund Order',
      disabled: (row: any) => row.status === 'Refunded',
      action: (row: any) => {
        this.openConfirmDialog(row.id);
      }
    }
  ];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.adminService.getOrders(this.orderParams).subscribe({
      next: response => {
        if (response.data) {
          this.orders = response.data;
          this.totalItems = response.count;
        }
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.orderParams.pageNumber = event.pageIndex + 1;
    this.orderParams.pageSize = event.pageSize;
    this.loadOrders();
  }

  onAction(action: (row: any) => void, row: any) {
    action(row);
  }

  async openConfirmDialog(id: number) {
    const confirmed = await this.dialogService.confirm(
      'Confirm refund',
      'Are you sure you want to issue this refund? This cannot be undone'
    );
    if (confirmed) this.refundOrder(id);
  }

  refundOrder(id: number) {
    this.adminService.refundOrder(id).subscribe({
      next: order => {
        this.orders = this.orders.map(o => o.id === id ? order : o);
        this.loadOrders(); // Update displayed data after refund
      }
    });
  }
}