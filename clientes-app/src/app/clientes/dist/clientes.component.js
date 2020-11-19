"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ClientesComponent = void 0;
var core_1 = require("@angular/core");
var sweetalert2_1 = require("sweetalert2");
var operators_1 = require("rxjs/operators");
var config_1 = require("../config/config"); //agrego la ruta configurada para acceder a los servicios publicados
var ClientesComponent = /** @class */ (function () {
    function ClientesComponent(clienteService, activatedRoute, modalService, authService) {
        this.clienteService = clienteService;
        this.activatedRoute = activatedRoute;
        this.modalService = modalService;
        this.authService = authService;
        this.urlBackend = config_1.URL_BACKEND;
    }
    ClientesComponent.prototype.ngOnInit = function () {
        var _this = this;
        //me subscribo al observable para obtener los numeros de pagina para el paginador
        this.activatedRoute.paramMap.subscribe(function (params) {
            //El operador + convierte el String obtenido de params en entero 
            var page = +params.get('page');
            if (!page) {
                page = 0;
            }
            _this.clienteService.getClientes(page).pipe(
            //aplico un tap para obtener los datos transformados en la clase service, esto podria ir en el subscribe tambien
            operators_1.tap(function (response) {
                console.log('ClienteComponent tap 3');
                response.content.forEach(function (cliente) {
                    console.log(cliente.nombre);
                });
            })).subscribe(function (response) {
                _this.clientes = response.content;
                _this.paginador = response;
            });
        });
        //me subscribo al observable notifar para cambiar la foto en la lista una vez que a sido subida
        this.modalService.notificarUpload.subscribe(function (cliente) {
            _this.clientes = _this.clientes.map(function (clienteOriginal) {
                //busco el id del cliente para pasarle la foto actualizada
                if (cliente.id == clienteOriginal.id) {
                    clienteOriginal.foto = cliente.foto;
                }
                return clienteOriginal;
            });
        });
    };
    ClientesComponent.prototype["delete"] = function (cliente) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: 'Esta Seguro?',
            text: "Seguro que desea eliminar el cliente! " + cliente.nombre + "  " + cliente.apellido,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si Eliminar!'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.clienteService["delete"](cliente.id).subscribe(function (response) {
                    _this.clientes = _this.clientes.filter(function (cli) { return cli !== cliente; });
                    sweetalert2_1["default"].fire('Eliminado!', "Cliente  " + cliente.nombre + "  " + cliente.apellido + " eliminado con extito", 'success');
                });
            }
        });
    };
    ClientesComponent.prototype.abrirModal = function (cliente) {
        this.clienteSeleccionado = cliente;
        this.modalService.abrirModal();
    };
    ClientesComponent = __decorate([
        core_1.Component({
            selector: 'app-clientes',
            templateUrl: './clientes.component.html'
        })
    ], ClientesComponent);
    return ClientesComponent;
}());
exports.ClientesComponent = ClientesComponent;
