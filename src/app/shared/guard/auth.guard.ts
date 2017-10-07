import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
 
@Injectable()
export class AuthGuard implements CanActivate {
 
    constructor(private router: Router) { }
 
    canActivate() {
        if (tokenNotExpired()) {
            return true;
        }
 
        // not logged in so redirect to login page
        this.router.navigate(['/unauthorize']);
        return false;
    }
}