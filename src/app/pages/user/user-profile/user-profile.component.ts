import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Service/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  displayname: string = '';
  photoURL: string = '';
  email: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.sesion$.subscribe(userProfile => {
      if (userProfile?.usu?.length > 0) {
        const profileData = userProfile.usu[0];
        this.displayname = profileData.name || '';
        this.email = profileData.email;
        this.photoURL = profileData.picture;
      }
    });
  }
}
