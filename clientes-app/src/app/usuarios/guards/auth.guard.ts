import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // las clases guard sirven apara a;adir un extra de seguridad al aplicativo gestionado por la parte de angular
  constructor(private authService: AuthService,
    private router: Router) { }
  canActivate(

    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.authService.isAuthenticated()) {

      //valido con el metodo si el token ya expiro
      if (this.isTokenExpirado()) {
        this.authService.logOut();
        this.router.navigate(['/login']);
        return false;
      }
      return true;

    }

    this.router.navigate(['/login']);
    return false;
  }


  isTokenExpirado(): boolean {
    let token = this.authService.token;
    let payload = this.authService.obtenerDatosToken(token);
    let now = new Date().getTime() / 1000; //obtengo la hora en segundos

    if (payload.exp < now) {
      return true  //verifico si el token aun no a expirado
    }
    return false


  }

}
