import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  activeTab: 'login' | 'register' = 'login';
  
  loginForm = {
    email: '',
    password: ''
  };
  
  registerForm = {
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  };

  errorMessage: string = '';

  onSubmit(): void {
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
            this.errorMessage = 'Erreur lors de la récupération des tokens';
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la connexion :', err);
        this.errorMessage = 'Identifiants incorrects';
      },
    });
  }
  
  onRegister(): void {
    // Vérifiez que les mots de passe correspondent
    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    
    // Implémentez votre logique d'inscription ici
    console.log('Tentative d\'inscription avec:', this.registerForm);
    // Exemple: this.authService.register(this.registerForm);
  }
}