"use strict";
exports.__esModule = true;
exports.ItemFactura = void 0;
var ItemFactura = /** @class */ (function () {
    function ItemFactura() {
        this.cantidad = 1;
    }
    ItemFactura.prototype.calcularImporte = function () {
        return this.cantidad * this.producto.precio;
    };
    return ItemFactura;
}());
exports.ItemFactura = ItemFactura;
