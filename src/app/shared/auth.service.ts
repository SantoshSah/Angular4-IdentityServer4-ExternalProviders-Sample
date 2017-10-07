import { Injectable, NgZone } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CONFIG } from '../shared/config';
import { Headers, Http, Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/Rx';

declare const FB:any;

@Injectable()
export class AuthService {

    private headers: Headers;
    private signupLoader: boolean;

    constructor(private http: Http, public authHttp: AuthHttp) {
            this.headers = new Headers();
            // this.headers.append('Content-Type', 'application/json');
             this.headers.append('Accept', 'application/json');
    }

    signup(signupModel: any) {

        this.headers.set('Content-Type', 'application/json');
        return this.http
        .post(CONFIG.accountUrl + 'register', signupModel, { headers: this.headers })
        .map(res => res.json())
        .catch(this.handleError);
    }

    externalSignup(externalSignupModel: any) {
        //console.log('externalSignupModel' + JSON.stringify(externalSignupModel));
        this.headers.set('Content-Type', 'application/json');
        return this.http
        .post(CONFIG.accountUrl + 'externalSignup', externalSignupModel, { headers: this.headers })
        .map(res => res.json())
        .catch(this.handleError);
    }

    login(username: string, password: string) { 
        this.headers.delete('Content-Type')
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded')
        let data = {
            grant_type : 'password',
            username : username,
            password : password,
            client_id : 'API_CLIENT',
            scope : 'allowedscopeapi',
            client_name : 'API_CLIENT.Security.AuthServer.Client.Name',
            client_secret: 'secret#123'
        }
        
        let body = new URLSearchParams();
        body.set('grant_type', data.grant_type);
        body.set('username', data.username);
        body.set('password', data.password);
        body.set('client_id', data.client_id);
        body.set('scope', data.scope);
        body.set('client_name', data.client_name);
        body.set('client_secret', data.client_secret);
        return this.http
          .post(CONFIG.authUrl, body.toString(), { headers: this.headers })
          .map(res => res.json())
          .catch(this.handleError);
    }

    externalLogin(id_token: string, provider: string) { 
        let grantType = null;
        let clientId = null;
        let clientName = null;

        switch (provider) {
            case "google":
                grantType = "googleAuth";
                clientId = "GOOGLE_CLIENT";
                clientName = "GOOGLE_CLIENT.Security.AuthServer.Client.Name";
                break;
            case "facebook":
                grantType = "facebookAuth";
                clientId = "FACEBOOK_CLIENT";
                clientName = "FACEBOOK_CLIENT.Security.AuthServer.Client.Name";
                break;
            default:
                break;
        }

        this.headers.delete('Content-Type')
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded')
        let data = {
            grant_type : grantType,
            id_token : id_token,
            client_id : clientId,
            scope : 'allowedscopeapi',
            client_name : clientName,
            client_secret: 'secret#123'
        }
        
        let body = new URLSearchParams();
        body.set('grant_type', data.grant_type);
        body.set('id_token', data.id_token);
        body.set('client_id', data.client_id);
        body.set('scope', data.scope);
        body.set('client_name', data.client_name);
        body.set('client_secret', data.client_secret);
        return this.http
          .post(CONFIG.authUrl, body.toString(), { headers: this.headers })
          .map(res => res.json())
          .catch(this.handleError);
    }
    
    logOut() {

        let provider = localStorage.getItem('provider');

        localStorage.removeItem('provider');
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('provider');
        localStorage.removeItem('providerToken')

        if(provider == 'google')
            this.googleSignOut();
        else if(provider == 'facebook')
            this.facebookSignOut();            
    }

    googleSignOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
          console.log('User signed out.');
        });
    }

    facebookSignOut() {
        FB.logout(function(response) {
            console.log('the person facebk logout ');
         });
    }
    

    getUserName() {
        return localStorage.getItem('name');
    }
    getValues() { 
        this.authHttp.get(CONFIG.valuesUrl)
            .subscribe(
              data => console.log('values are ' + data),
              err => console.log('server: ' + err),
              () => console.log('Request Complete')
            );
    }

    getUserAccount() : Observable<any>{
        return this.authHttp.get(CONFIG.accountUrl + 'getUserAccount')
        .map(data => data.json());
    }

    hasEmailRegistered(email: string, provider: string, providerKey: string) {
        if(email == undefined) {
            email = "";
        }
        return this.http.get(CONFIG.accountUrl + 'hasEmailRegistered?email=' + email + '&provider=' + provider + '&providerKey=' + providerKey ) 
        .map(data => data.json());
    }

    authenticated() {
        return tokenNotExpired();
    }

    private handleError (error) {
        //console.log(error._body);
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}