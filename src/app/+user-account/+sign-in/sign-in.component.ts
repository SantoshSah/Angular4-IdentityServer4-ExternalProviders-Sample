
  import {
    Component,
    OnInit,
    NgZone
  } from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
  import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
  import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
  import { AuthService } from '../../shared/auth.service';
  import {GoogleSignInSuccess} from 'angular-google-signin';
  import {FacebookLoginComponent} from './facebooklogin.component';
  import {FacebookResponse} from '../../models/facebook-response';

  @Component({
    selector: 'sign-in',
    styleUrls: [ './sign-in.component.css' ],
    templateUrl: './sign-in.component.html'
  })
  export class SignInComponent implements OnInit {
    loginForm: FormGroup;
    authLoader: boolean;
    error: string = "";
    public localState: any;
    jwtHelper: JwtHelper = new JwtHelper();
    private googleClientId: string = '746808954149-mu74s1grf761cam0o3p3r696vk8dq4an.apps.googleusercontent.com';

    constructor(public route: ActivatedRoute,private formBuilder: FormBuilder
      , private authService : AuthService, private router: Router
      , private ngZone: NgZone) {
        this.loginForm = this.formBuilder.group({
            email: ['',Validators.compose([Validators.required,Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
            password: ['', Validators.required]
          });
    }
  
    public ngOnInit() {
      
      this.route
        .data
        .subscribe((data: any) => {
          /**
           * Your resolved data from route.
           */
          this.localState = data.yourData;
        });
        
        //route to account if already authenticated
        if(this.authService.authenticated())
            this.router.navigate(['/user-account']);
    }

    private login(username,password) {
      
      this.authLoader = true;
      this.error = "";
      this.authService.login(username,password)
          .subscribe(data => { 
            localStorage.setItem('token',data.access_token);
            localStorage.setItem('name',this.jwtHelper.decodeToken(data.access_token).name);
          
            this.authLoader = false;
            this.router.navigate(['/user-account']);
          },
          error => {
            console.log('ERROR:',error);
            this.authLoader = false;
            this.error = "Invalid username or password.";
          }
      );
    }

    onGoogleSignIn() {
      console.log('onGoogleSignInSuccess1');
      /*
      var profile = googleUser.getBasicProfile();
      var id_token = googleUser.getAuthResponse().id_token;
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
      console.log('id_token: ' + id_token);
      */
    }

    googleSignOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });
    }

    onGoogleSignInSuccess(event: GoogleSignInSuccess) {
      console.log('onGoogleSignInSuccess');

      if(this.authService.authenticated())
          return ;
      let googleUser: gapi.auth2.GoogleUser = event.googleUser;
      let id: string = googleUser.getId();
      let profile: gapi.auth2.BasicProfile = googleUser.getBasicProfile();
      let id_token = googleUser.getAuthResponse().id_token;

      // console.log('ID: ' +
      //   profile
      //     .getId()); // Do not send to your backend! Use an ID token instead.
      // console.log('Name: ' + profile.getName());

      // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      // console.log('Name: ' + profile.getName());
      // console.log('Image URL: ' + profile.getImageUrl());
      // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
      // console.log('id_token: ' + id_token);
       

      this.externalLoginHandler(profile.getId(), profile.getName(), profile.getEmail(), 'google', id_token);
    }

    onFacebookSignInSuccess(facebookResponse: FacebookResponse) {
      this.externalLoginHandler(facebookResponse.userID, facebookResponse.name, facebookResponse.email, 'facebook', facebookResponse.accessToken);
    }

    externalLoginHandler(id: any, name: string, email: string, provider: string, id_token: string) {
        this.error = "";
        this.authService.hasEmailRegistered(email, provider, id)
        .subscribe(data => {
            if(data.hasRegistered == true) {

                //get local token to call api
                this.authService.externalLogin(id_token, provider)
                .subscribe(data => {
                    localStorage.setItem('token',data.access_token);
                    localStorage.setItem('name',this.jwtHelper.decodeToken(data.access_token).name);
                    localStorage.setItem('provider', provider);
                    localStorage.setItem('providerToken', id_token)
                    
                    this.ngZone.run(() => {
                        this.router.navigate(['/user-account']);
                    })
                }, error => {
                    console.log('ERROR:',error);
                });   
            } else { // signup first
                let externalSignupData = {
                  id: id,
                  name: name,
                  email: email,
                  provider: provider,
                  id_token: id_token
                };
                localStorage.setItem('externalSignupData',JSON.stringify(externalSignupData));
                this.ngZone.run(() => {
                  this.router.navigate(['/user-account/sign-up']);
                })
            }
        })
    }

  }

  