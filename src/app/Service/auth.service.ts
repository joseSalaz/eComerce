import { Injectable } from '@angular/core';
import { AuthConfig, OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { UsuarioGoogle } from '../Interface/usuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly perfilUrl = '/api/usuario/perfil';

  constructor(
    private oauthService: OAuthService,
    private http: HttpClient,) 
    {
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
public get estaAutenticado(): boolean {
  return this.oauthService.hasValidAccessToken();
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
  public obtenerPerfilUsuario(): Observable<UsuarioGoogle> {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) {
      throw new Error('No hay claims de identidad disponibles');
    }
    const usuario: UsuarioGoogle = {
      email: claims['email'],
      EBB: claims['identificador de google'],
    };
    return this.http.post<UsuarioGoogle>(this.perfilUrl, usuario);
  }
}
  
  

