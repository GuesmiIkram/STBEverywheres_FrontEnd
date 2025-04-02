
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Variables
  activeTab: 'login' | 'register' = 'login';
  loginForm = {
    email: '',
    password: ''
  };
  registerForm = {
    rib: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  passwordMismatch: boolean = false;

  // Variables pour les messages d'erreur
  emailError: boolean = false;
  passwordError: boolean = false;
  ribError: boolean = false;
  registerEmailError: boolean = false;
  registerPasswordError: boolean = false;
  confirmPasswordError: boolean = false;

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private router: Router,

  ) { }

  openForgotPasswordDialog(): void {
    Swal.fire({
      title: 'Mot de passe oublié',
      html: `
        <div class="forgot-password-swal">
          <p>Entrez votre adresse email pour recevoir un lien de réinitialisation</p>
          <input type="email" id="swal-email" class="swal2-input" placeholder="Email">
          <div id="swal-error" class="text-danger" style="min-height: 20px; margin-top: -10px; margin-bottom: 10px;"></div>
        </div>
      `,
      width: '400px',
      showConfirmButton: true,
      confirmButtonText: 'Envoyer',
      showCloseButton: true,
      showLoaderOnConfirm: true, // Affiche un loader pendant l'appel API
      preConfirm: () => {
        const email = (Swal.getPopup()?.querySelector('#swal-email') as HTMLInputElement)?.value;
        const errorEl = Swal.getPopup()?.querySelector('#swal-error');

        // Validation simple
        if (!email) {
          if (errorEl) errorEl.innerHTML = 'L\'email est requis';
          return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          if (errorEl) errorEl.innerHTML = 'Veuillez entrer un email valide';
          return false;
        }

        return { email: email };
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.authService.forgotPassword(result.value.email).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Email envoyé!',
              text: 'Un lien de réinitialisation a été envoyé à votre adresse email',
              confirmButtonText: 'OK'
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: err.message || 'Une erreur est survenue lors de l\'envoi',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }
  ngOnInit(): void {
  }

  // Méthode pour valider un champ spécifique
  validateField(field: string): void {
    switch (field) {
      case 'email':
        this.emailError = this.loginForm.email === '';
        break;
      case 'password':
        this.passwordError = this.loginForm.password === '';
        break;
      case 'rib':
        this.ribError = this.registerForm.rib === '';
        break;
      case 'registerEmail':
        this.registerEmailError = this.registerForm.email === '';
        break;
      case 'registerPassword':
        this.registerPasswordError = this.registerForm.password === '';
        break;
      case 'confirmPassword':
        this.confirmPasswordError = this.registerForm.confirmPassword === '';
        break;
    }
  }

  // Méthode pour vérifier si les mots de passe correspondent
  checkPasswords(): void {
    this.passwordMismatch = this.registerForm.password !== this.registerForm.confirmPassword;
  }

  onSubmit(): void {
    if (!this.loginForm.email || !this.loginForm.password) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs', 'error');
      return;
    }



    this.authService.login(this.loginForm.email, this.loginForm.password).subscribe({
      next: () => {

        this.router.navigate(['/home']);
      },
      error: (err) => {

        Swal.fire('Erreur', err.message || 'Erreur lors de la connexion', 'error');
      }
    });
  }

  // Méthode pour soumettre le formulaire d'inscription
  onRegister(): void {
    // Réinitialiser les messages d'erreur
    this.ribError = this.registerForm.rib === '';
    this.registerEmailError = this.registerForm.email === '';
    this.registerPasswordError = this.registerForm.password === '';
    this.confirmPasswordError = this.registerForm.confirmPassword === '';

    if (this.ribError || this.registerEmailError || this.registerPasswordError || this.confirmPasswordError || this.passwordMismatch) {
      return; // Ne pas soumettre le formulaire si des champs sont vides ou si les mots de passe ne correspondent pas
    }

    // Préparer les données pour l'inscription
    const registerData = {
      rib: this.registerForm.rib,
      email: this.registerForm.email,
      password: this.registerForm.password
    };

    // Appeler la méthode d'inscription du service AuthService
    this.clientService.register(registerData).subscribe({
      next: () => {
        console.log('Inscription réussie.');
        Swal.fire({
          icon: 'success',
          title: 'Inscription réussie',
          text: 'Vous pouvez maintenant vous connecter.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['']);
        });
      },
      error: (err) => {
        console.error('Erreur lors de l\'inscription :', err);

        // Extraire le message d'erreur en fonction de la structure de l'erreur
        let errorMessage = 'Erreur lors de l\'inscription';
        if (err.error && err.error.message) {
          errorMessage = err.error.message; // Si l'erreur contient un message
        } else if (err.message) {
          errorMessage = err.message; // Si l'erreur est une chaîne de caractères
        } else if (err.error && typeof err.error === 'string') {
          errorMessage = err.error; // Si l'erreur est une chaîne de caractères dans err.error
        }

        // Afficher l'alerte avec le message d'erreur
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMessage,
        });
      }
    });
  }

}
