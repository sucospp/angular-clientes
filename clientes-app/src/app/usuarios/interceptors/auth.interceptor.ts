import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

/** Pass untouched request through to the next request handler. */
//Intercptor que verifica los errores 401 y 403
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
    private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {



    return next.handle(req).pipe(
      catchError(e => {
        if (e.status == 401) {

          //verifico si me encuentro autenticado para realizar el logout
          if (this.authService.isAuthenticated()) {
            this.authService.logOut();
          }
          this.router.navigate(['/login']);
        }

        //acceso denegado
        if (e.status == 403) {
          Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso`, 'warning');
          this.router.navigate(['/clientes']);
        }
        return throwError(e);

      })
    );
  }
}