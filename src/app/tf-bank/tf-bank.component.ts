import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tf-bank',
  templateUrl: './tf-bank.component.html',
  styleUrls: ['./tf-bank.component.scss']
})
export class TFBankComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  selectPackStudent() {
    // Méthode 1 (recommandée): Navigation relative
    this.router.navigate(['../PackStudent'], { relativeTo: this.route });
    
    // Méthode 2: Navigation absolue
    // this.router.navigate(['/home/PackStudent']);
    
    console.log('Redirection vers packstudent');
  }
  selectPackElyssa() {
    // Méthode 1 (recommandée): Navigation relative
    this.router.navigate(['../PackElyssa'], { relativeTo: this.route });
    
    // Méthode 2: Navigation absolue
    // this.router.navigate(['/home/PackStudent']);
    
    console.log('Redirection vers packelyssa');
  }
}