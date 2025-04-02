import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styles: [`
    /* Variables (converties en valeurs directes) */
/* Styles pour la page de réinitialisation */
.reset-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f1f5f9;
    padding: 20px;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e3a8a' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  
  .reset-password-card {
    width: 100%;
    max-width: 450px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    padding: 30px;
    position: relative;
    overflow: hidden;
    animation: fadeIn 0.4s ease-out;
  }
  
  .reset-password-card:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #1e3a8a 0%, #0f766e 100%);
  }
  
  .reset-password-card h1 {
    font-size: 22px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 25px;
    text-align: center;
  }
  
  .reset-password-card form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .form-group label {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
  }
  
  .form-group label:after {
    content: '*';
    color: #f59e0b;
    margin-left: 4px;
  }
  
  .form-group input {
    height: 42px;
    padding: 0 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.3s ease;
  }
  
  .form-group input:focus {
    outline: none;
    border-color: #0f766e;
    box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
  }
  
  .form-group input.is-invalid {
    border-color: #ef4444;
    background-color: rgba(239, 68, 68, 0.02);
  }
  
  .form-group .invalid-feedback {
    color: #ef4444;
    font-size: 12px;
    margin-top: 4px;
    font-weight: 500;
  }
  
  .btn {
    height: 44px;
    border: none;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
  }
  
  .btn.btn-primary {
    background: linear-gradient(90deg, #1e3a8a 0%, #0f766e 100%);
    color: #ffffff;
  }
  
  .btn.btn-primary:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  .btn.btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }
  
  .btn.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .spinner {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .spinner i {
    font-size: 16px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @media (max-width: 480px) {
    .reset-password-card {
      padding: 20px;
    }
    
    .reset-password-card h1 {
      font-size: 20px;
    }
    
    .form-group {
      gap: 6px;
    }
  }
  `]
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      Swal.fire('Erreur', 'Token invalide ou manquant', 'error');
      this.router.navigate(['/login']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value 
      ? null 
      : { mismatch: true };
  }

  onSubmit(): void {
    if (this.resetForm.invalid) return;

    this.isLoading = true;
    const newPassword = this.resetForm.value.newPassword;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Votre mot de passe a été réinitialisé avec succès',
          timer: 3000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        Swal.fire('Erreur', err.error?.message || 'Échec de la réinitialisation', 'error');
        this.isLoading = false;
      }
    });
  }
}