import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FormComponent } from './clientes/form.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteService } from './clientes/cliente.service';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import localeES from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FacturasComponent } from './facturas/facturas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';


//aplico las configuraciones de espana a la aplicacion
registerLocaleData(localeES, 'es');


const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  { path: 'directivas', component: DirectivaComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'clientes/page/:page', component: ClientesComponent },
  { path: 'clientes/form', component: FormComponent,  canActivate:[AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}  },
  { path: 'clientes/form/:id', component: FormComponent, canActivate:[AuthGuard, RoleGuard] , data: {role: 'ROLE_ADMIN'} }, //aplico la clase guardia para seguridad
  { path: 'login', component: LoginComponent },
  { path: 'facturas/:id',component: DetalleFacturaComponent, canActivate:[AuthGuard, RoleGuard] , data: {role: 'ROLE_USER'} },
  { path: 'facturas/form/:clienteId', component: FacturasComponent, canActivate:[AuthGuard, RoleGuard] , data: {role: 'ROLE_ADMIN'} }

  //{ path: 'clientes/ver/:id', component: DetalleComponent } pasa a ser utilizado con modal en lugar de utilizarse con ventanas separadas






];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent

  ],
  imports: [

    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [ClienteService, 
    {provide: LOCALE_ID, useValue:'es'},
  {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi:true}, //agrego el interceptor de headers como proveedor 
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true},],//agrego el interceptor de errores como proveedor 

  bootstrap: [AppComponent]
})
export class AppModule { }
