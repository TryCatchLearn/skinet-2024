import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltip,
    MatIcon,
    MatPaginatorModule
  ],
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss']
})
export class CustomTableComponent {
  @Input() columns: { field: string, header: string, pipe?: string, pipeArgs?: any }[] = [];
  @Input() dataSource: any[] = [];
  @Input() actions: { label: string, icon: string, tooltip: string, action: (row: any) => void, disabled?: (row: any) => boolean }[] = [];
  @Input() totalItems: number = 0; 
  @Input() pageSize: number = 5; 
  @Input() pageIndex: number = 0; 

  @Output() pageChange = new EventEmitter<PageEvent>();

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.pageChange.emit(event);
  }

  onAction(action: (row: any) => void, row: any) {
    action(row);
  }

  getCellValue(row: any, column: any) {
    const value = row[column.field];
    if (column.pipe === 'currency') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: column.pipeArgs || 'USD' }).format(value);
    }
    if (column.pipe === 'date') {
      return new Date(value).toLocaleDateString('en-US', column.pipeArgs);
    }
    return value;
  }
}