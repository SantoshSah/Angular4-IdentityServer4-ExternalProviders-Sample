import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './user-account.routes';
import { UserAccountComponent } from './user-account.component';

import { AuthService } from '../shared/auth.service';
import {CustomMaterialModule} from '../app.module';

//import { AuthGuard } from './shared/guard/auth.guard';

@NgModule({
  declarations: [
    UserAccountComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CustomMaterialModule
  ],

  providers: [
    AuthService
  ]
})
export class UserAccountModule {
  public static routes = routes;
}
