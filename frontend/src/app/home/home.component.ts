import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MiddlewareService } from '../middleware/middleware.service';
import { User } from '../models/User';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  midObj = {};
  user: User;

  constructor(
    public auth: AuthService,
    private middleware: MiddlewareService,
  ) {}

  ngOnInit() {
    if (this.auth.loggedIn) {
      console.log(this.auth.userProfile);
      this.user = this.auth.userProfile;
    }
  }

  items = [
    {
      title: 'Blockchain and the Total Loss Process',
      img: '../../assets/Ford_Explorer.jpeg',
      dark: false,
      link: '/home',
    },
    {
      title: 'About the Application',
      img: '../../assets/Ford_GT.jpeg',
      dark: false,
      link: '/home',
    },
    {
      title: '',
      img: '../../assets/Ford_Raptor.jpeg',
      dark: true,
      link: '/home',
    },
    {
      title: '',
      img: '../../assets/Ford_Taurus.jpg',
      dark: true,
      link: '/home',
    },
  ];
}
