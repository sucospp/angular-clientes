"use strict";
exports.__esModule = true;
exports.Factura = void 0;
var Factura = /** @class */ (function () {
    function Factura() {
        this.items = [];
    }
    //metodo para calcular el total de la factura
    Factura.prototype.calcularGranTotal = function () {
        var _this = this;
        this.total = 0;
        this.items.forEach(function (item) { return _this.total += item.calcularImporte(); });
        return this.total;
    };
    return Factura;
}());
exports.Factura = Factura;
