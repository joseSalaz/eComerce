import { Injectable } from '@angular/core';
import { Auth,signInWithPopup,GoogleAuthProvider,signOut } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth :Auth) { }

  loginWhitgogle(){
    return signInWithPopup(this.auth,new GoogleAuthProvider());
  }

  logout(){
    return this.auth.signOut().then(()=>{
      sessionStorage.removeItem('username');
    })
  }

}
