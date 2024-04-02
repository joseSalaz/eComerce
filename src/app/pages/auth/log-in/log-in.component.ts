import { Component } from '@angular/core';
import { AuthService } from '../../../Service/auth.service';
import { response } from 'express';
import { error } from 'console';
import { Router } from '@angular/router';
import { Session } from 'inspector';
import { sesioncosntans } from '../../../constans/sesion.constans';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  constructor(
    private authService: AuthService,
  ){}
  

login() {
  this.authService.login();
}
}
