import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  toasts: any[] = [];

  show(header: string, body: string, classname) {
    this.toasts.push({ header, body, classname });
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t != toast);
  }
}
