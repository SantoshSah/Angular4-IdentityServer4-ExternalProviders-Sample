import {
    Component,
    OnInit
  } from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
  import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
  import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
  import { AuthService } from '../../shared/auth.service';
  import {confirmPasswordValidator} from '../../shared/validators/confirm-password.validator';
  
  @Component({
    selector: 'sign-up',
    styleUrls: [ './sign-up.component.css' ],
    templateUrl: './sign-up.component.html'
  })
  export class SignUpComponent implements OnInit {
    public localState: any;
    loader: boolean;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    isExternalSignup: boolean = false;
    externalData: any;
    jwtHelper: JwtHelper = new JwtHelper();
    error: string = "";

    signUpForm: FormGroup;
    constructor(public route: ActivatedRoute,private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
      this.signUpForm = this.formBuilder.group({
        name: ['', Validators.required],
        //email: ['',Validators.compose([Validators.required,Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
        email:['',Validators.email],
        //TODO:: Could not find regex for +##-(###)-###-####, hoever, i have found its closest that validates #-(###)-###-####
        phoneNumber: ['',Validators.compose([Validators.required,Validators.pattern(/^([0-9]( |-)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-)?([0-9]{3}( |-)?[0-9]{4}|[a-zA-Z0-9]{7})$/)])],
        password: ['', Validators.required],
        confirmpassword: ['',Validators.compose([Validators.required,confirmPasswordValidator('password')])],
        industry: ['', Validators.required],
        storeWebAddress: ['', Validators.required],
      });
    }
    
    hasPasswordConfirmed() {
      console.log(1);
      return false;
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

        this.externalData = JSON.parse(localStorage.getItem("externalSignupData"));
        if(this.externalData) {
          this.name = this.externalData.name;
          this.email = this.externalData.email;
          this.signUpForm.controls.password.disable();
          this.signUpForm.controls.confirmpassword.disable();
          this.isExternalSignup = true;
        }
    }

    googleSignOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });
    }

    public signup(name, phoneNumber, email, password, industry, storeWebAddress) {
      console.log(email);
      this.loader = true;
      this.error = "";
      if(this.isExternalSignup) {

        let externalSignupModel = {
          name: name,
          phoneNumber: phoneNumber,
          email: email,
          provider: this.externalData.provider,
          providerKey: this.externalData.id,
          industry: industry,
          storeWebAddress: storeWebAddress
        };

        this.authService.externalSignup(externalSignupModel)
          .subscribe(data => { 
            this.loader = false;
            if(data.error) {
              this.error = data.error;
              return;
            }
            localStorage.removeItem("externalSignupData");

            //get local token to call api
            this.authService.externalLogin(this.externalData.id_token,this.externalData.provider)
            .subscribe(data => {
                localStorage.setItem('token',data.access_token);
                localStorage.setItem('name',this.jwtHelper.decodeToken(data.access_token).name);
                this.router.navigate(['/user-account']);
            }, error => {
                console.log('ERROR:',error);
                
            });
            
        }, error => {
            console.log('ERROR:',error);
        });
    
      } else {
        
        let signupModel = {
          name: name,
          phoneNumber: phoneNumber,
          email: email,
          password: password,
          confirmPassword: password,
          industry: industry,
          storeWebAddress: storeWebAddress
        };
  
        this.authService.signup(signupModel)
          .subscribe(data => { 
            this.loader = false;
            if(data.error) {
              this.error = data.error;
              return;
            }
            this.router.navigate(['/user-account/sign-in']);
          }, error => {
              console.log('ERROR:',error);
              this.loader = false;
          });
      }
      
    }

    public cancel() {
      this.isExternalSignup = false;
      localStorage.removeItem("externalSignupData");
      this.router.navigate(['/user-account']);
    }
  
  }

  