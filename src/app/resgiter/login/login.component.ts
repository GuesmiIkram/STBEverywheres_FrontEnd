
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

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
    private router: Router
  ) { }

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
    // Réinitialiser les messages d'erreur
    this.emailError = this.loginForm.email === '';
    this.passwordError = this.loginForm.password === '';

    if (this.emailError || this.passwordError) {
      return; // Ne pas soumettre le formulaire si des champs sont vides
    }

    console.log('Tentative de connexion avec email :', this.loginForm.email);
    this.authService.login(this.loginForm.email, this.loginForm.password).subscribe({
      next: () => {
        this.authService.getTokens().subscribe({
          next: () => {
            console.log('Tokens stockés, redirection...');
            this.router.navigate(['/home']);
          },
          error: (err) => {
            console.error('Erreur lors de la récupération des tokens :', err);

            // Afficher une alerte en cas d'erreur
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur s\'est produite lors de la récupération des tokens.',
            });
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la connexion :', err);

        // Extraire le message d'erreur en fonction de la structure de l'erreur
        let errorMessage = 'Erreur lors de la connexion';
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
      },
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
    this.authService.register(registerData).subscribe({
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
