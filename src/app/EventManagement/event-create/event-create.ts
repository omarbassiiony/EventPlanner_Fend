import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './event-create.html',
  styleUrls: ['./event-create.css'],
  providers: [EventService]
})
export class EventCreate implements OnInit {
  currentUser: any;
  isLoading: boolean = false;

  // Event form fields
  event = {
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  };

  // Minimum date (today)
  minDate: string = '';

  constructor(private router: Router, private eventService: EventService) {}

  ngOnInit(): void {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/login']);
      return;
    }
    this.currentUser = JSON.parse(userStr);

    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

onSubmit(): void {
  if (!this.validateForm()) {
    return;
  }

  this.isLoading = true;

  const eventData = {
    title: this.event.title,
    date: this.event.date,
    time: this.event.time,
    location: this.event.location,
    description: this.event.description
  };

  this.eventService.createEvent(eventData).subscribe({
    next: (response) => {
      this.isLoading = false;
      if (response.success) {
        alert('Event created successfully!');
        this.router.navigate(['/events/my-events']);
      } else {
        alert('Failed to create event: ' + response.message);
      }
    },
    error: (error) => {
      this.isLoading = false;
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  });
}

  validateForm(): boolean {
    // Check if all fields are filled
    if (!this.event.title.trim()) {
      alert('Please enter an event title');
      return false;
    }

    if (!this.event.date) {
      alert('Please select an event date');
      return false;
    }

    if (!this.event.time) {
      alert('Please select an event time');
      return false;
    }

    if (!this.event.location.trim()) {
      alert('Please enter an event location');
      return false;
    }

    if (!this.event.description.trim()) {
      alert('Please enter an event description');
      return false;
    }

    // Validate date is not in the past
    const selectedDate = new Date(this.event.date + 'T' + this.event.time);
    const now = new Date();
    
    if (selectedDate < now) {
      alert('Event date and time cannot be in the past');
      return false;
    }

    return true;
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    }
  }
}