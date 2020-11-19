"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FormComponent = void 0;
var core_1 = require("@angular/core");
var cliente_1 = require("./cliente");
var sweetalert2_1 = require("sweetalert2");
var FormComponent = /** @class */ (function () {
    function FormComponent(clienteService, router, activatedRoute) {
        this.clienteService = clienteService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.cliente = new cliente_1.Cliente();
    }
    FormComponent.prototype.ngOnInit = function () {
        this.cargarCliente();
    };
    FormComponent.prototype.cargarCliente = function () {
        var _this = this;
        // me suscribo para obtener los clientes
        this.activatedRoute.params.subscribe(function (params) {
            var id = params['id'];
            if (id) {
                _this.clienteService.getCLiente(id).subscribe(function (cliente) { return _this.cliente = cliente; });
            }
        });
        //me suscribo para obtener las regiones
        this.clienteService.getRegiones().subscribe(function (regiones) { return _this.regiones = regiones; });
    };
    FormComponent.prototype.create = function () {
        var _this = this;
        console.log(this.cliente);
        console.log("clicked");
        console.log(this.cliente);
        this.clienteService.create(this.cliente)
            .subscribe(function (cliente) {
            _this.router.navigate(["/clientes"]);
            sweetalert2_1["default"].fire('Nuevo Cliente', "El cliente : " + cliente.nombre + " a sido creado con exito", 'success');
        }, function (err) {
            _this.errores = err.error.errors;
            console.error('Codigo de error desde el backend: ' + err.status);
            console.error(err.error.errors);
        });
    };
    FormComponent.prototype.update = function () {
        var _this = this;
        console.log(this.cliente);
        this.cliente.facturas = null;
        this.clienteService.update(this.cliente)
            .subscribe(function (json) {
            _this.router.navigate(["/clientes"]);
            sweetalert2_1["default"].fire('Actualizar Cliente', json.mensaje + " : " + json.cliente.nombre, 'success');
        }, function (err) {
            _this.errores = err.error.errors;
            console.error('Codigo de error desde el backend: ' + err.status);
            console.error(err.error.errors);
        });
    };
    //comparo para poder asignar el valor de region del cliente a la lista desplegable
    FormComponent.prototype.compararRegion = function (ob1, ob2) {
        if (ob1 === undefined && ob2 === undefined) {
            return true;
        }
        return (ob1 === null || ob2 === null || ob1 === undefined || ob2 === undefined) ? false : ob1.id === ob2.id;
    };
    FormComponent = __decorate([
        core_1.Component({
            selector: 'app-form',
            templateUrl: './form.component.html'
        })
    ], FormComponent);
    return FormComponent;
}());
exports.FormComponent = FormComponent;
