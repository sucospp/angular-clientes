import { Component } from "@angular/core";
import { AuthService } from '../usuarios/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent{
title: string='App Angular Spring'

constructor(public authService: AuthService, private router: Router){ 
}

logOut(): void{
    let nombre : string =this.authService.usuario.username;
    this.authService.logOut();
    
    Swal.fire('Log Out', `Hola ${nombre} usted a cerrado sesion con exito`,'success' );
    this.router.navigate(['/login']);
}

}