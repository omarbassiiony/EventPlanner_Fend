import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    // Validate input
    if (!this.email || !this.password) {
      alert('Email and password are required!');
      return;
    }

    this.isLoading = true;
    
    const credentials = {
      email: this.email,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          console.log('Login successful:', response);
          
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(response.data));
          
          alert('Login successful!');
          
          // Navigate to sign-up page (change this to your desired route)
          this.router.navigate(['/sign-up']);
        } else {
          alert('Login failed: ' + response.message);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        
        if (error.error && error.error.message) {
          alert('Login failed: ' + error.error.message);
        } else {
          alert('Login failed. Please check your connection and try again.');
        }
      }
    });
  }
}