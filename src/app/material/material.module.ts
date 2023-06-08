import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatTreeModule} from '@angular/material/tree';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { MatDividerModule } from '@angular/material/divider';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { NuevaComponent } from '../orders/nueva/nueva.component';
import { VerificacionComponent } from '../auth/verificacion/verificacion.component';
import { InicioComponent } from '../components/inicio/inicio.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatTreeModule,
    MatListModule,
    MatDatepickerModule,
    MatGridListModule,
    MatSelectModule,
    MatTableModule,
    MatNativeDateModule,
    MatStepperModule,
    MatMenuModule,
    MatDialogModule,
    MatSelectCountryModule,
    MatBadgeModule,
    MatTooltipModule,
    CdkStepperModule,
    MatProgressBarModule,
    FormsModule,
    MatTabsModule,
    MatDividerModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule
  ],

  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatTreeModule,
    MatListModule,
    MatDatepickerModule,
    MatGridListModule,
    MatSelectModule,
    MatTableModule,
    MatNativeDateModule,
    MatStepperModule,
    MatMenuModule,
    MatDialogModule,
    MatSelectCountryModule,
    MatBadgeModule,
    MatTooltipModule,
    CdkStepperModule,
    MatProgressBarModule,
    FormsModule,
    MatTabsModule,
    MatDividerModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule
  ]
})
export class MaterialModule { }

