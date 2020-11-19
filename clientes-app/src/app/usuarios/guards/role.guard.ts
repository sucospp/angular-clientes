import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})


export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router : Router) { }
    
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      let role=next.data['role'] as string;
      console.log(role);

      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/login']);

        return false;
      }

      if(this.authService.hasRole(role)){
        return true;
      }
      Swal.fire('Acceso denegado',`Hola ${this.authService.usuario.username} no tienes permisos para este recurso `,'warning');
      this.router.navigate(['/clientes']);

    return false;
  }
  
}
