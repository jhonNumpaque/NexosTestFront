import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private userIdSource = new BehaviorSubject('0');
  currentValue = this.userIdSource.asObservable();

  constructor() { }

  changeMessage(userId: string) {
    this.userIdSource.next(userId)
  }
}
