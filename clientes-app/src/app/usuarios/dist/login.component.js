"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LoginComponent = void 0;
var core_1 = require("@angular/core");
var usuario_1 = require("./usuario");
var sweetalert2_1 = require("sweetalert2");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(authService, router) {
        this.authService = authService;
        this.router = router;
        this.titulo = 'Iniciar Sesion';
        this.usuario = new usuario_1.Usuario();
    }
    LoginComponent.prototype.ngOnInit = function () {
        if (this.authService.isAuthenticated()) {
            sweetalert2_1["default"].fire('Login', "Hola " + this.authService.usuario.username + " tu ya estas autenticado", 'info');
            this.router.navigate(['/clientes']);
        }
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        console.log(this.usuario);
        if (this.usuario.username == null || this.usuario.password == null) {
            sweetalert2_1["default"].fire('error Login', 'Username o password vacio', 'error');
            return;
        }
        this.authService.login(this.usuario).subscribe(function (response) {
            console.log(response);
            // let objetoPayload = (JSON.parse(atob(response.access_token.split(".")[1])));
            // console.log(objetoPayload);
            //llamo al metodo que guarda la sesion en el cliente
            _this.authService.guardarUsuario(response.access_token);
            _this.authService.guardarToken(response.access_token);
            var usuario = _this.authService.usuario;
            _this.router.navigate(['/clientes']);
            sweetalert2_1["default"].fire('Login', "Hola " + usuario.username + ", has iniciado sesion con exito", 'success');
        }, function (err) {
            if (err.status == 400) {
                sweetalert2_1["default"].fire('error Login', 'Username o password incorrecto', 'error');
            }
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.component.html'
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
