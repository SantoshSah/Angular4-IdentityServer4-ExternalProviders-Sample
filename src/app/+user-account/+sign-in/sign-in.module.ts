import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './sign-in.routes';
import { AuthService } from './shared/auth.service';
import { SignInComponent } from './sign-in.component';
import {GoogleSignInComponent} from 'angular-google-signin';
import {FacebookLoginComponent} from './facebooklogin.component';
import {CustomMaterialModule} from '../../app.module';

@NgModule({
  declarations: [
    SignInComponent,
    GoogleSignInComponent,
    FacebookLoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CustomMaterialModule
  ]
})
export class SignInModule {
  public static routes = routes;
}
