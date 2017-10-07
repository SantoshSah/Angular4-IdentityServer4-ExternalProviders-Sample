import {Component, EventEmitter, Output } from '@angular/core';
import {FacebookResponse} from '../../models/facebook-response';

declare const FB:any;

@Component({
    selector: 'facebook-login',
    templateUrl: 'facebooklogin.html'
})

export class FacebookLoginComponent {
    @Output() facebookSignInSuccess = new EventEmitter<FacebookResponse>();
    constructor() {
    }

    onFacebookLoginClick() {
        let facebookResponse: FacebookResponse = {};
        FB.login((result: any) => {
            if(result){
                let authResponse: any = result.authResponse;
                if(!authResponse)
                    return;
                facebookResponse.status = result.status;
                facebookResponse.userID = authResponse.userID;
                facebookResponse.accessToken = authResponse.accessToken;
                facebookResponse.expiresIn = authResponse.expiresIn;
                facebookResponse.signedRequest = authResponse.signedRequest;
            }
            
            FB.api('/me', { locale: 'en_US', fields: 'name, email' }, (response:any)=> {
                facebookResponse.email = response.email;
                facebookResponse.name = response.name;
                this.facebookSignInSuccess.emit(facebookResponse);
            });
          }, { scope: 'email,public_profile' });
    }
}