"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FacturaService = void 0;
var core_1 = require("@angular/core");
var config_1 = require("../../config/config"); //agrego la ruta configurada para acceder a los servicios publicados
var FacturaService = /** @class */ (function () {
    function FacturaService(http) {
        this.http = http;
        this.urlEndPoint = config_1.URL_BACKEND + '/api/facturas';
    }
    FacturaService.prototype.getFactura = function (id) {
        return this.http.get(this.urlEndPoint + "/" + id);
    };
    FacturaService.prototype["delete"] = function (id) {
        return this.http["delete"](this.urlEndPoint + "/" + id);
    };
    FacturaService.prototype.filtrarProductos = function (term) {
        return this.http.get(this.urlEndPoint + "/filtrar-productos/" + term);
    };
    FacturaService.prototype.create = function (factura) {
        return this.http.post("" + this.urlEndPoint, factura);
    };
    FacturaService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], FacturaService);
    return FacturaService;
}());
exports.FacturaService = FacturaService;
