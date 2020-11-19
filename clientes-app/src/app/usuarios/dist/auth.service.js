"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var usuario_1 = require("./usuario");
var config_1 = require("../config/config"); //agrego la ruta configurada para acceder a los servicios publicados
var AuthService = /** @class */ (function () {
    function AuthService(http) {
        this.http = http;
    }
    Object.defineProperty(AuthService.prototype, "usuario", {
        get: function () {
            if (this._usuario != null) {
                return this._usuario;
            }
            else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
                this._usuario = JSON.parse(sessionStorage.getItem('usuario'));
                return this._usuario;
            }
            return new usuario_1.Usuario();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "token", {
        get: function () {
            if (this._token != null) {
                return this._token;
            }
            else if (this._usuario == null && sessionStorage.getItem('token') != null) {
                this._token = sessionStorage.getItem('token');
                return this._token;
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    AuthService.prototype.login = function (usuario) {
        var urlEndpoint = config_1.URL_BACKEND + '/oauth/token';
        var credenciales = btoa('angularapp' + ':' + '1234');
        var httpHeaders = new http_1.HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + credenciales });
        var params = new URLSearchParams();
        params.set('grant_type', 'password');
        params.set('username', usuario.username);
        params.set('password', usuario.password);
        console.log(params.toString());
        return this.http.post(urlEndpoint, params.toString(), { headers: httpHeaders });
    };
    //almaceno el usuario en la sesion del cliente
    AuthService.prototype.guardarUsuario = function (accessToken) {
        var objetoPayload = this.obtenerDatosToken(accessToken);
        this._usuario = new usuario_1.Usuario();
        this._usuario.nombre = objetoPayload.nombre;
        this._usuario.apellido = objetoPayload.apellido;
        this._usuario.email = objetoPayload.email;
        this._usuario.username = objetoPayload.user_name;
        this._usuario.roles = objetoPayload.authorities;
        sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
    };
    //almaceno el token en la sesion del cliente
    AuthService.prototype.guardarToken = function (accessToken) {
        this._token = accessToken;
        sessionStorage.setItem('token', accessToken);
    };
    AuthService.prototype.obtenerDatosToken = function (accessToken) {
        if (accessToken != null) {
            return JSON.parse(atob(accessToken.split(".")[1]));
        }
        return null;
    };
    AuthService.prototype.isAuthenticated = function () {
        var payload = this.obtenerDatosToken(this.token);
        if (payload != null && payload.user_name && payload.user_name.length > 0) {
            return true;
        }
        return false;
    };
    AuthService.prototype.logOut = function () {
        this._token = null;
        this._usuario = null;
        //remueve todas las variables de sesion
        sessionStorage.clear();
        //elimina por item
        //sessionStorage.removeItem('token');
        //sessionStorage.removeItem('usuario');
    };
    AuthService.prototype.hasRole = function (role) {
        if (this.usuario.roles.includes(role)) {
            return true;
        }
        return false;
    };
    AuthService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
