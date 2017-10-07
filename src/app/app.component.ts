/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation  
} from '@angular/core';
import { AppState } from './app.service';
import { AuthService } from './shared/auth.service';

declare const FB:any;
declare const gapi:any;
/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  template: `
    <nav>
      <a [routerLink]=" ['./home'] "
        routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}">
        Home
      </a>

      <a [routerLink]=" ['./user-account'] "
      routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}">
      User Account
      </a>

      <span *ngIf="authService.authenticated()">
       {{authService.getUserName()}}
      </span>

      <button md-button color="red" *ngIf="authService.authenticated()" (click)="authService.logOut()" >
      Log Out
      </button>
    </nav>

    <main style="margin-top:20px">
      <router-outlet></router-outlet>
    </main>
  `
})

export class AppComponent implements OnInit {
  public angularclassLogo = 'assets/img/angularclass-avatar.png';
  public name = 'Angular 2 Webpack Starter';
  public url = 'https://twitter.com/AngularClass';

  constructor(
    public appState: AppState, public authService: AuthService
  ) {

      FB.init({
              appId      : '1571352759575292',
              cookie     : true,  // enable cookies to allow the server to access
                                  // the session
              xfbml      : true,  // parse social plugins on this page
              version    : 'v2.10', // use graph api version 2.5,
              status     : true
          });
        
      gapi.load('auth2', function () {
          var auth2 = gapi.auth2.init({
              client_id: '746808954149-mu74s1grf761cam0o3p3r696vk8dq4an.apps.googleusercontent.com',
              cookiepolicy: 'single_host_origin'
          });
      });    
  }
  
  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}

/**
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
