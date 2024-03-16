import { Injectable } from '@angular/core';
import { Auth,createUserWithEmailAndPassword,signInWithPopup,GoogleAuthProvider } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth :Auth) { }

  liginWhitgogle(){
    return signInWithPopup(this.auth,new GoogleAuthProvider());
  }

}
