import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [MatButtonModule, MatInputModule, MatToolbarModule, MatCardModule, MatIconModule],
  exports: [MatButtonModule, MatInputModule, MatToolbarModule, MatCardModule, MatIconModule],
})
export class MaterialModule {}
