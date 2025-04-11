import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  userRole: string = '';
  isAgent: boolean = false;
  isClient: boolean = false;
  userName: string = '';
  constructor(private authService:AuthService,) { }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.isAgent = this.authService.isAgent();
    this.isClient = this.authService.isClient();
  }

  ShowHideCollapse(a:string){
    var elt = document.getElementById(a) ;
    console.log(elt)
      if (elt != null){
        if (elt.classList.contains("show")){
          elt.classList.remove('show')
        }
          else {
            elt.classList.add('show')
          }
          elt.classList.toggle('show')
        }

  }

}
