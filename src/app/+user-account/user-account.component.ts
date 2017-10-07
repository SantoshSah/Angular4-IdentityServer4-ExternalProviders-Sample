import {
    Component,
    OnInit,
  } from '@angular/core';
  import { AuthService } from '../shared/auth.service';
  import { CONFIG } from '../shared/config';

console.log('`user-account` component loaded asynchronously');
  @Component({
    selector: 'user-account',
    styleUrls: [ './user-account.component.css' ],
    templateUrl: './user-account.component.html'
  })
  export class UserAccountComponent implements OnInit {
  
    userName: string;
    role: string;

    constructor(
      public authService: AuthService,
    ) {
      

    }

    public ngOnInit() {
      console.log('hello `UserAccount` component');
      if(this.authService.authenticated()) {
        this.getUserAccount();
      }
    }

    public getUserAccount(){
      this.authService.getUserAccount().subscribe(data=>{
         this.userName = data.userName;
      }),error=> console.log(error)
    }
  }
  