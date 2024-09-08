import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { AdminOrdersComponent } from "./admin-orders/admin-orders.component";
import { AdminCatalogComponent } from "./admin-catalog/admin-catalog.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatTabsModule,
    AdminOrdersComponent,
    AdminCatalogComponent
],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

}
