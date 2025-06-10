import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent {




verificationStatus: 'pending' | 'success' | 'error' = 'pending';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.verifyToken(token);
    } else {
      this.verificationStatus = 'error';
      this.errorMessage = 'Token de vérification manquant';
      this.showErrorAlert();
    }
  }

  verifyToken(token: string): void {
  this.clientService.verifyEmail(token).subscribe({
    next: (response) => {
      this.verificationStatus = 'success';
      this.showSuccessAlert(response);
    },
    error: (err) => {
      this.verificationStatus = 'error';
      this.errorMessage = err.error?.message || err.message || 'Erreur lors de la vérification';
      this.showErrorAlert();
    }
  });
}


 /* showSuccessAlert(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Email vérifié!',
      text: message,
      confirmButtonText: 'Se connecter',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
    });
  }
*/

showSuccessAlert(message: any): void {
  // Extraire le vrai message s’il est dans un objet
  const textMessage =
    typeof message === 'string'
      ? message
      : message?.message || 'Votre email a été vérifié avec succès.';

  Swal.fire({
    icon: 'success',
    title: 'Email vérifié!',
    text: textMessage,
    confirmButtonText: 'Se connecter',
    allowOutsideClick: false
  }).then((result) => {
    if (result.isConfirmed) {
      this.router.navigate(['/login']);
    }
  });
}




  showErrorAlert(): void {
    Swal.fire({
      icon: 'error',
      title: 'Erreur de vérification',
      text: this.errorMessage,
      confirmButtonText: 'OK',
      allowOutsideClick: false
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}











