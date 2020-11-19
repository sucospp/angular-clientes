"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HeaderComponent = void 0;
var core_1 = require("@angular/core");
var sweetalert2_1 = require("sweetalert2");
var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(authService, router) {
        this.authService = authService;
        this.router = router;
        this.title = 'App Angular Spring';
    }
    HeaderComponent.prototype.logOut = function () {
        var nombre = this.authService.usuario.username;
        this.authService.logOut();
        sweetalert2_1["default"].fire('Log Out', "Hola " + nombre + " usted a cerrado sesion con exito", 'success');
        this.router.navigate(['/login']);
    };
    HeaderComponent = __decorate([
        core_1.Component({
            selector: 'app-header',
            templateUrl: './header.component.html'
        })
    ], HeaderComponent);
    return HeaderComponent;
}());
exports.HeaderComponent = HeaderComponent;
