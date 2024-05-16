import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'
import { User } from 'src/app/shared/models/User';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  togglebutton: boolean = false;
  LoginIndex$!: Observable<any>;
  LMessagePrompt$!: Observable<any>;
  isAllowedDevice: boolean = false;

  loginForm = new FormGroup({
    id: new FormControl("", [
      Validators.required,
      Validators.minLength(9)
    ]),
    password: new FormControl("", [
      Validators.required,
    ]),
  })

  constructor(private toastr: ToastrService, private authService: AuthService, private router: Router, private deviceService: DeviceDetectorService) { 
  }

  ngOnInit(): void {
    const deviceInfo = this.deviceService.getDeviceInfo();
    console.log(deviceInfo);
    if (deviceInfo.os === 'Linux') {
      this.isAllowedDevice = true;
    }
    this.authService.cmdFingerprint("default");
    this.authService.userObservable.subscribe((currentUser) => {
      if(currentUser.id){
        this.router.navigate(['dashboard']);
      }
    });
    this.authService.setDefaultLPrompt("Press Scan to Get Started");
    this.LMessagePrompt$ = this.authService.LMessagePrompt();
    this.LMessagePrompt$.subscribe(value => {
      if(value == "Match Found"){
        this.toastr.success('Fingerprint Match Found', 'Success');
        return
      }
    });
  }

  startScan(){
    this.authService.cmdFingerprint("login");
    this.togglebutton = !this.togglebutton;
  }

  login() {
    if (this.loginForm.invalid) {
      this.toastr.error('Please check your form fields.', 'Invalid Input');
      return;
    }
    const user:User = {
      id: this.loginForm.value.id!,
      password: this.loginForm.value.password!,
    }

    this.authService.login(user).subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }

  FingerprintLogin() {
    this.togglebutton = !this.togglebutton;
    this.LoginIndex$ = this.authService.ListenFingerPrintLogin();
    this.LoginIndex$.subscribe(value => {
      if(value != 0){
        this.authService.FingerPrintLogin({FingerprintIndex: value, id: ''}).subscribe(() => {
          this.router.navigateByUrl('/');
        });
        return
      }
      this.toastr.error('No Fingerprint Match Found', 'Error');
    });
    this.authService.cmdFingerprint("default");
  }

}
