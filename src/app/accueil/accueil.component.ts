import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
  // Define the services array
  services = [
    { name: 'Service 1', icon: 'service1.png' },
    { name: 'Service 2', icon: 'service2.png' },
    { name: 'Service 3', icon: 'service3.png' },
    { name: 'Service 4', icon: 'service4.png' }
  ];

  // Define the cardFeatures array
  cardFeatures = [
    { title: 'Feature 1', description: 'Description for feature 1', icon: 'fas fa-check', iconBg: '#00b2ff' },
    { title: 'Feature 2', description: 'Description for feature 2', icon: 'fas fa-shield-alt', iconBg: '#00b2ff' },
    { title: 'Feature 3', description: 'Description for feature 3', icon: 'fas fa-clock', iconBg: '#00b2ff' },
    { title: 'Feature 4', description: 'Description for feature 4', icon: 'fas fa-user', iconBg: '#00b2ff' }
  ];

  // Define the applications array
  applications = [
    { name: 'App 1', description: 'Description for App 1', icon: 'app1.png' },
    { name: 'App 2', description: 'Description for App 2', icon: 'app2.png' },
    { name: 'App 3', description: 'Description for App 3', icon: 'app3.png' }
  ];

  constructor() {}

  ngOnInit(): void {
    // You can initialize data here if needed
  }
}