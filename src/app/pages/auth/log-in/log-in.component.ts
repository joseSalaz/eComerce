import { Component } from '@angular/core';
import { AuthService } from '../../../Service/auth.service';
import { response } from 'express';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
constructor(
  private authService:AuthService,
  private router : Router
){
}
  onclick(){
    this.authService.liginWhitgogle()
    .then(response=>{
      console.log(response);
      this.router.navigate(['/inicio'])
      
    })
    .catch(error=>console.log(error));
  }
}
