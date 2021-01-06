import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  contactForm: FormGroup;

  get name() { return this.contactForm.get('name') }
  get email() { return this.contactForm.get('email') }
  get message() { return this.contactForm.get('message') }
  get honeyPot() { return this.contactForm.get('honeyPot') }

  isLoading: boolean = false;
  submitted: boolean = false;
  responseMessage!: string;
  isError: boolean = false;

  constructor(public fb: FormBuilder, private http: HttpClient) {
    this.contactForm  = this.fb.group({
      'name': ['', [
        Validators.required
      ]],
      'email': ['', [
        Validators.required,
        Validators.email
      ]],
      'message': ['', [
        Validators.required
      ]],
      'honeyPot': ['', []]
    });
  }

  ngOnInit(): void {
  }

  // TODO: prevent contact form from being submitted twice (maybe check if it has been submitted in the last few minutes)
  submit() {
    if (this.contactForm.status == 'VALID' && this.honeyPot!.value == '') {
      this.contactForm.disable();
      var formData: any = new FormData();
      formData.append('name', this.name!.value);
      formData.append('email', this.email!.value);
      formData.append('message', this.message!.value);
      this.isLoading = true;
      this.submitted = false;
      this.http
        .post('https://script.google.com/macros/s/AKfycbxhRqLooRi1g2LKeFM0fCVs93FGJNT8UqYo6yl6_w/exec', formData)
        .toPromise()
        .then( (response: any) => {
          if (response['result'] == 'success') {
            this.responseMessage = `Thanks for the message! We'll get back to you soon!`;
            this.isError = false;
          } else {
            this.responseMessage = 'Oops! Something went wrong... Reload the page and try again.';
            this.isError = true;
          }
          this.contactForm.enable();
          this.submitted = true;
          this.isLoading = false;
        })
        .catch( (error) => {
          this.responseMessage = 'Oops! An error occurred... Reload the page and try again.';
          this.contactForm.enable();
          this.submitted = true;
          this.isLoading = false;
          this.isError = true;
          console.error(error);
        });
    }
  }

}
