import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './sign-up.routes';
import { SignUpComponent } from './sign-up.component';
import {CustomMaterialModule} from '../../app.module';

@NgModule({
  declarations: [
    SignUpComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CustomMaterialModule
  ],
})
export class SignUpModule {
  public static routes = routes;
}
