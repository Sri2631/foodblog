import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title: string = 'Welcome to Food Blog!';
  subtitle: string = 'Discover, share, and enjoy delicious recipes from around the world.';

  constructor() {}

  ngOnInit(): void {
    // Perform any necessary initialization here
  }
}
