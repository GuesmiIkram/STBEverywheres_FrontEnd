import { Component } from '@angular/core';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DigiCorpV1';
  constructor(private breadcrumbService: BreadcrumbService) {}

}
