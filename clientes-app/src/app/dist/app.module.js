"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var app_component_1 = require("./app.component");
var paginator_component_1 = require("./paginator/paginator.component");
var header_component_1 = require("./header/header.component");
var footer_component_1 = require("./footer/footer.component");
var form_component_1 = require("./clientes/form.component");
var directiva_component_1 = require("./directiva/directiva.component");
var clientes_component_1 = require("./clientes/clientes.component");
var cliente_service_1 = require("./clientes/cliente.service");
var router_1 = require("@angular/router");
var http_1 = require("@angular/common/http");
var forms_1 = require("@angular/forms");
var es_1 = require("@angular/common/locales/es");
var common_1 = require("@angular/common");
var detalle_component_1 = require("./clientes/detalle/detalle.component");
var login_component_1 = require("./usuarios/login.component");
var auth_guard_1 = require("./usuarios/guards/auth.guard");
var role_guard_1 = require("./usuarios/guards/role.guard");
var token_interceptor_1 = require("./usuarios/interceptors/token.interceptor");
var auth_interceptor_1 = require("./usuarios/interceptors/auth.interceptor");
var detalle_factura_component_1 = require("./facturas/detalle-factura.component");
var facturas_component_1 = require("./facturas/facturas.component");
var animations_1 = require("@angular/platform-browser/animations");
var autocomplete_1 = require("@angular/material/autocomplete");
var input_1 = require("@angular/material/input");
var form_field_1 = require("@angular/material/form-field");
//aplico las configuraciones de espana a la aplicacion
common_1.registerLocaleData(es_1["default"], 'es');
var routes = [
    { path: '', redirectTo: '/clientes', pathMatch: 'full' },
    { path: 'directivas', component: directiva_component_1.DirectivaComponent },
    { path: 'clientes', component: clientes_component_1.ClientesComponent },
    { path: 'clientes/page/:page', component: clientes_component_1.ClientesComponent },
    { path: 'clientes/form', component: form_component_1.FormComponent, canActivate: [auth_guard_1.AuthGuard, role_guard_1.RoleGuard], data: { role: 'ROLE_ADMIN' } },
    { path: 'clientes/form/:id', component: form_component_1.FormComponent, canActivate: [auth_guard_1.AuthGuard, role_guard_1.RoleGuard], data: { role: 'ROLE_ADMIN' } },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'facturas/:id', component: detalle_factura_component_1.DetalleFacturaComponent, canActivate: [auth_guard_1.AuthGuard, role_guard_1.RoleGuard], data: { role: 'ROLE_USER' } },
    { path: 'facturas/form/:clienteId', component: facturas_component_1.FacturasComponent, canActivate: [auth_guard_1.AuthGuard, role_guard_1.RoleGuard], data: { role: 'ROLE_ADMIN' } }
    //{ path: 'clientes/ver/:id', component: DetalleComponent } pasa a ser utilizado con modal en lugar de utilizarse con ventanas separadas
];
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                header_component_1.HeaderComponent,
                footer_component_1.FooterComponent,
                directiva_component_1.DirectivaComponent,
                clientes_component_1.ClientesComponent,
                form_component_1.FormComponent,
                paginator_component_1.PaginatorComponent,
                detalle_component_1.DetalleComponent,
                login_component_1.LoginComponent,
                detalle_factura_component_1.DetalleFacturaComponent,
                facturas_component_1.FacturasComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                http_1.HttpClientModule,
                router_1.RouterModule.forRoot(routes),
                forms_1.FormsModule,
                animations_1.BrowserAnimationsModule,
                forms_1.ReactiveFormsModule,
                autocomplete_1.MatAutocompleteModule,
                input_1.MatInputModule,
                form_field_1.MatFormFieldModule
            ],
            providers: [cliente_service_1.ClienteService,
                { provide: core_1.LOCALE_ID, useValue: 'es' },
                { provide: http_1.HTTP_INTERCEPTORS, useClass: token_interceptor_1.TokenInterceptor, multi: true },
                { provide: http_1.HTTP_INTERCEPTORS, useClass: auth_interceptor_1.AuthInterceptor, multi: true },],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
