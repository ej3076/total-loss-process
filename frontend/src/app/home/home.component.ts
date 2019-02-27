import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
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

  constructor(public auth: AuthService) {}
}
