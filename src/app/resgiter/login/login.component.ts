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
  isLockedOut = false;
  lockoutSeconds: number = 0;
  lockoutInterval: any;

  // Variables pour les messages d'erreur
  emailError: boolean = false;
  passwordError: boolean = false;
  ribError: boolean = false;
  registerEmailError: boolean = false;
  registerPasswordError: boolean = false;
  confirmPasswordError: boolean = false;
// Dans votre classe LoginComponent
passwordRequirements = {
  minLength: false,
  hasUpper: false,
  hasLower: false,
  hasNumber: false,
  hasSpecial: false
};


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
          <p style="color: #64748b; font-size: 14px; text-align: center; margin-bottom: 20px; font-weight: 400; line-height: 1.5;">
            Entrez votre adresse email pour recevoir un lien de réinitialisation
          </p>
          <input
            type="email"
            id="swal-email"
            class="swal2-input"
            placeholder="Email"
            style="height: 40px; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0 12px; font-size: 14px; width: 100%; margin: 0; box-shadow: none;"
          >
          <div
            id="swal-error"
            class="text-danger"
            style="color: #ef4444; font-size: 12px; text-align: left; font-weight: 500; min-height: 20px; margin-top: 5px; margin-bottom: 10px;"
          ></div>
        </div>
      `,
      width: '400px',
      showConfirmButton: true,
      confirmButtonText: 'Envoyer',
      showCloseButton: true,
      showLoaderOnConfirm: true,

      // Styles personnalisés pour SweetAlert
      customClass: {
        popup: 'lstb-popup',
        title: 'lstb-title',
        confirmButton: 'lstb-confirm-button',
        closeButton: 'lstb-close-button',
        loader: 'lstb-loader'
      },

      // Styles CSS injectés
      backdrop: `
        rgba(0,0,0,0.4)
        url()
        center
        no-repeat
      `,

      // Styles pour les boutons
      buttonsStyling: true,
      confirmButtonColor: '#1e3a8a',

      // Styles pour le loader
      loaderHtml: '',

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
      allowOutsideClick: () => !Swal.isLoading(),

      // Injecter des styles CSS personnalisés
      didOpen: () => {
        // Injecter des styles CSS personnalisés dans le document
        const style = document.createElement('style');
        style.textContent = `
          .lstb-popup {
            border-radius: 12px;
            font-family: 'Roboto', 'Segoe UI', sans-serif;
          }
          .lstb-title {
            color: #1e293b;
            font-size: 20px;
            font-weight: 600;
          }
          .lstb-confirm-button {
            background: linear-gradient(90deg, #1e3a8a 0%, #0f766e 100%) !important;
            border-radius: 6px !important;
            font-weight: 500 !important;
            padding: 10px 24px !important;
            box-shadow: none !important;
          }
          .lstb-confirm-button:hover {
            opacity: 0.9 !important;
          }
          .lstb-close-button {
            color: #64748b !important;
          }
          .lstb-close-button:hover {
            color: #1e293b !important;
          }
          .swal2-input:focus {
            border-color: #0f766e !important;
            box-shadow: none !important;
          }
          .swal2-loader {
            border-color: #1e3a8a transparent #1e3a8a transparent !important;
          }
        `;
        document.head.appendChild(style);
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.authService.forgotPassword(result.value.email).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Email envoyé!',
              text: 'Un lien de réinitialisation a été envoyé à votre adresse email',
              confirmButtonText: 'OK',
              customClass: {
                popup: 'lstb-popup',
                title: 'lstb-title',
                confirmButton: 'lstb-confirm-button'
              },
              confirmButtonColor: '#1e3a8a'
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: err.message || 'Une erreur est survenue lors de l\'envoi',
              confirmButtonText: 'OK',
              customClass: {
                popup: 'lstb-popup',
                title: 'lstb-title',
                confirmButton: 'lstb-confirm-button'
              },
              confirmButtonColor: '#ef4444'
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
validatePassword(password: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

updatePasswordRequirements(password: string): void {
  this.passwordRequirements = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[@$!%*?&]/.test(password)
  };
}
  // Méthode pour vérifier si les mots de passe correspondent
  checkPasswords(): void {
    this.passwordMismatch = this.registerForm.password !== this.registerForm.confirmPassword;
  }
  /*onSubmit(): void {
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
  }*/

onSubmit(): void {
  if (this.isLockedOut) return;

  this.authService.login(this.loginForm.email, this.loginForm.password).subscribe({
    next: (response) => {
      this.router.navigate(['/home']).then(() => window.location.reload());
    },
    error: (err) => {
      console.log('Structure complète de l\'erreur:', err); // Debug crucial
      
      // Extraction robuste de remainingSeconds
      const remainingSeconds = err?.error?.remainingSeconds 
                           || err?.originalError?.remainingSeconds 
                           || null;

      console.log('Temps restant extrait:', remainingSeconds); // Debug

      if (remainingSeconds !== null && remainingSeconds > 0) {
        this.startLockoutTimer(remainingSeconds);
        
        // Affiche le compte à rebours
        Swal.fire({
          icon: 'warning',
          title: 'Compte bloqué',
          html: `Trop de tentatives. Réessayez dans <b>${remainingSeconds}</b> secondes.`,
          timer: remainingSeconds * 1000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        const errorMessage = err?.error?.message 
                          || err?.originalError?.message 
                          || 'Erreur de connexion';
        Swal.fire('Erreur', errorMessage, 'error');
      }
    }
  });
}
startLockoutTimer(seconds: number) {
  console.log('Chrono démarré pour', seconds, 'secondes');
  this.isLockedOut = true;
  this.lockoutSeconds = seconds;

  this.lockoutInterval = setInterval(() => {
    this.lockoutSeconds--;
    if (this.lockoutSeconds <= 0) {
      clearInterval(this.lockoutInterval);
      this.isLockedOut = false;
    }
  }, 1000);
}


  // Méthode pour soumettre le formulaire d'inscription
  onRegister(): void {
  // Validation des champs
  this.ribError = this.registerForm.rib === '';
  this.registerEmailError = this.registerForm.email === '';
  this.registerPasswordError = this.registerForm.password === '';
  this.confirmPasswordError = this.registerForm.confirmPassword === '';

  // Vérification des règles de mot de passe
  if (this.registerForm.password) {
    this.updatePasswordRequirements(this.registerForm.password);
    const isPasswordValid = Object.values(this.passwordRequirements).every(v => v);

    if (!isPasswordValid) {
      Swal.fire({
        icon: 'error',
        title: 'Mot de passe invalide',
        html: `
          <p>Votre mot de passe doit contenir:</p>
          <ul style="text-align: left; padding-left: 20px;">
            <li>Minimum 8 caractères</li>
            <li>Au moins une majuscule</li>
            <li>Au moins une minuscule</li>
            <li>Au moins un chiffre</li>
            <li>Au moins un caractère spécial (@$!%*?&)</li>
          </ul>
        `,
        confirmButtonText: 'OK'
      });
      return;
    }
  }


  if (this.ribError || this.registerEmailError || this.registerPasswordError || 

      this.confirmPasswordError || this.passwordMismatch) {
    return;
  }

  // Appel au service
  this.clientService.register({
    rib: this.registerForm.rib,
    email: this.registerForm.email,
    password: this.registerForm.password
  }).subscribe({
    next: () => {
      Swal.fire({
         icon: 'info',
        title: 'Email de vérification envoyé',
        text: 'Veuillez vérifier votre boîte mail pour compléter votre inscription',
        timer: 3000,
        showConfirmButton: false
      }).then(() => {
        this.activeTab = 'login';
      });
    },
    error: (err) => {
      let errorMessage = 'Erreur lors de l\'inscription';
      if (err.error?.message) errorMessage = err.error.message;
      else if (err.message) errorMessage = err.message;

      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: errorMessage,
      });
    }
  });

  }}

