"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthInterceptor = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var sweetalert2_1 = require("sweetalert2");
/** Pass untouched request through to the next request handler. */
//Intercptor que verifica los errores 401 y 403
var AuthInterceptor = /** @class */ (function () {
    function AuthInterceptor(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AuthInterceptor.prototype.intercept = function (req, next) {
        var _this = this;
        return next.handle(req).pipe(operators_1.catchError(function (e) {
            if (e.status == 401) {
                //verifico si me encuentro autenticado para realizar el logout
                if (_this.authService.isAuthenticated()) {
                    _this.authService.logOut();
                }
                _this.router.navigate(['/login']);
            }
            //acceso denegado
            if (e.status == 403) {
                sweetalert2_1["default"].fire('Acceso denegado', "Hola " + _this.authService.usuario.username + " no tienes acceso a este recurso", 'warning');
                _this.router.navigate(['/clientes']);
            }
            return rxjs_1.throwError(e);
        }));
    };
    AuthInterceptor = __decorate([
        core_1.Injectable()
    ], AuthInterceptor);
    return AuthInterceptor;
}());
exports.AuthInterceptor = AuthInterceptor;
