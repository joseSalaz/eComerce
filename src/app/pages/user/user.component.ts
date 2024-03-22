import { Component, OnInit } from '@angular/core';
import { sesioncosntans } from '../../constans/sesion.constans';
import { log } from 'console';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  vernombre: boolean = true;
  displayname: string = "";
  photoURL: string = "";
  email:string="";
  constructor(
    private router:Router
  ) {}

  ngOnInit(): void {
    this.checkSession();
  }

  checkSession(): void {
    let usuariotext = sessionStorage.getItem(sesioncosntans.user);
    if (usuariotext) {
      let objusuario = JSON.parse(usuariotext);
      console.log("Usuario:", objusuario);
      this.vernombre = true;
      this.displayname = objusuario.displayName;
      this.photoURL = objusuario.photoURL.replace(/^"(.*)"$/, '$1');
      this.email=objusuario.email;
      console.log("Foto sin comillas"+this.photoURL);
    } else {
      this.vernombre = false;
    }
  }
  prevpage():void{
    this.router.navigate(['/inicio']);
  }
}

