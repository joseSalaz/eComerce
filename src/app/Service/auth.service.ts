import { Injectable } from '@angular/core';
import { AuthConfig, OAuthEvent, OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private oauthService: OAuthService) {
    this.initLogin();
  }

  initLogin() {
    if (typeof window !== 'undefined') {
        const config: AuthConfig = {
            issuer: 'https://accounts.google.com',
            strictDiscoveryDocumentValidation: false,
            clientId: '336862279905-jmrsjnmuntnhs4jl5om8ckg69m17rmgh.apps.googleusercontent.com',
            redirectUri: window.location.origin + '/inicio',
            scope: 'openid profile email',
        }
    
        this.oauthService.configure(config);
        this.oauthService.setupAutomaticSilentRefresh();
        this.oauthService.loadDiscoveryDocumentAndTryLogin();
    }
}


  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  getProfile() {
    return this.oauthService.getIdentityClaims();
  }

  
  
}
