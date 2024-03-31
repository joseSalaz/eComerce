import { Injectable } from '@angular/core';
import { AuthConfig, OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { UsuarioGoogle } from '../Interface/usuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly perfilUrl = '/api/usuario/perfil';

  private sesionSource = new BehaviorSubject<any>(null);

  sesion$ = this.sesionSource.asObservable();


  constructor(
    private oauthService: OAuthService,
    private http: HttpClient,) 
    {
    this.initLogin();
    this.oauthService.events.subscribe((event) => {
      if (event.type === 'token_received') {
        this.sesionSource.next(this.getProfile());
      } else if (event.type === 'logout') {
        this.sesionSource.next(null);
      }
    });
  }

  initLogin() {
    if (typeof window !== 'undefined') {
      const config: AuthConfig = {
        issuer: 'https://accounts.google.com',
        strictDiscoveryDocumentValidation: false,
        clientId:
          '336862279905-jmrsjnmuntnhs4jl5om8ckg69m17rmgh.apps.googleusercontent.com',
        redirectUri: window.location.origin + '/inicio',
        scope: 'openid profile email',
      };

      this.oauthService.configure(config);
      this.oauthService.setupAutomaticSilentRefresh();
      this.oauthService.loadDiscoveryDocumentAndTryLogin().then((result) => {
        if (result) {
          const profile = this.getProfile();
          if (profile) {
            localStorage.setItem('userProfile', JSON.stringify(profile));
            this.sesionSource.next(profile);
          }
        } else {
          this.restoreProfile();
        }
      });
    }
  }

  restoreProfile() {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      this.sesionSource.next(JSON.parse(profile));
    }
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
    localStorage.removeItem('userProfile');
    this.sesionSource.next(null);
  }

  getProfile() {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) {
      return null;
    }
    // Almacena todo el objeto de claims directamente en `usu`
    return {
      usu: [claims]  // Almacena todo el objeto de claims en un array dentro de `usu`
    };
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
  
  

