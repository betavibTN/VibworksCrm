import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SplitterModule } from 'primeng/splitter';
import { AutoFocusModule } from 'primeng/autofocus';
import { MessagesModule } from 'primeng/messages';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Message, MessageService } from 'primeng/api';
import { AuthService } from '../authServices/auth.service';
import { AuthResponse } from '../loginModels/AuthResponse';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    InputIconModule,
    ReactiveFormsModule,
    IconFieldModule,
    InputTextModule,
    MessagesModule,
    PasswordModule,
    AutoFocusModule,
    ButtonModule,
    SplitterModule,
    CardModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  messages: Message[] = [];
  submitted: boolean = false; // Track if the form has been submitted
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,private router:Router
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    // Additional initialization logic can go here if needed
  }
  onLogin() {
    if (this.loginForm.invalid) {
      return; // Prevent submission if the form is invalid
    }

    this.loading = true; // Show spinner
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response: AuthResponse) => {
        this.loading = false; // Hide spinner
        console.log('Login valid:', response);
        localStorage.setItem('accessToken', response.token); // Store token
        this.messageService.add({
          severity: 'success',
          summary: 'Logged In Successfully ',
          detail: 'Welcome ' + response.user.userName,
        });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false; // Hide spinner
        console.log('Login valid:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Invalid credentials.',
        });
      },
    });
  }
  onSubmit(): void {
    this.submitted = true; // Set submitted to true when the form is submitted

    // Clear previous messages
    this.messages = [];

    if (this.loginForm.valid) {
      console.log('Login valid:', this.loginForm.value);
      this.onLogin();

      // Handle successful login logic here
    } else {
      // Populate messages if form is invalid
      if (this.loginForm.get('username')?.invalid) {
        this.messages.push({
          severity: 'error',
          summary: 'Error',
          detail: 'Username is required.',
        });
      }
      if (this.loginForm.get('password')?.invalid) {
        this.messages.push({
          severity: 'error',
          summary: 'Error',
          detail: 'Password is required.',
        });
      }
    }
  }
}
