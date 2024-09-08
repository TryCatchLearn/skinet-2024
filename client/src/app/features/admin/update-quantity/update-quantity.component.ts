import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-update-quantity',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatLabel,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './update-quantity.component.html',
  styleUrl: './update-quantity.component.scss'
})
export class UpdateQuantityComponent {
  data = inject(MAT_DIALOG_DATA);
  updatedQuantity = this.data.quantity;
  private dialogRef = inject(MatDialogRef<UpdateQuantityComponent>);

  updateQuantity() {
    if (this.updatedQuantity > 0) {
      this.dialogRef.close({
        updatedQuantity: this.updatedQuantity
      })
    }
  }
}
