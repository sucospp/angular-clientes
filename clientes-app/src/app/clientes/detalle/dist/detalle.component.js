"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DetalleComponent = void 0;
var core_1 = require("@angular/core");
var sweetalert2_1 = require("sweetalert2");
var http_1 = require("@angular/common/http");
var config_1 = require("../../config/config"); //agrego la ruta configurada para acceder a los servicios publicados
var DetalleComponent = /** @class */ (function () {
    function DetalleComponent(clienteService, modalService, authService, facturaService) {
        this.clienteService = clienteService;
        this.modalService = modalService;
        this.authService = authService;
        this.facturaService = facturaService;
        this.titulo = "Detalle Cliente";
        this.urlBackend = config_1.URL_BACKEND;
        this.progreso = 0;
    }
    //private activatedRoute: ActivatedRoute  se inyecta si se quiere obtener los parametros de forma independiente
    DetalleComponent.prototype.ngOnInit = function () {
        /* ya no va devido a que el detalle ahora se maneja por un modal y no es independiente
        
            this.activatedRoute.paramMap.subscribe(params => {
        
              let id: number = +params.get('id');
        
              if (id) {
                this.clienteService.getCLiente(id).subscribe(cliente => {
        
                  this.cliente = cliente;
        
                });
              }
        
            });
            */
    };
    DetalleComponent.prototype.seleccionarFoto = function (event) {
        this.imagenSeleccionada = event.target.files[0];
        this.progreso = 0;
        console.log(this.imagenSeleccionada);
        if (this.imagenSeleccionada.type.indexOf('image') < 0) {
            sweetalert2_1["default"].fire('Error debe seleccionar una imagen', "debe seleccionar una Foto", 'error');
            this.imagenSeleccionada = null;
        }
    };
    DetalleComponent.prototype.subirFoto = function () {
        var _this = this;
        if (this.imagenSeleccionada) {
            this.clienteService.subirFoto(this.imagenSeleccionada, this.cliente.id).subscribe(
            //mando el evento del progreso para poder obtener el porcentaje de subida
            function (event) {
                //this.cliente = cliente;
                //obtengo el progreso para poder mostrarlo
                if (event.type === http_1.HttpEventType.UploadProgress) {
                    _this.progreso = Math.round((event.loaded / event.total) * 100);
                }
                else if (event.type === http_1.HttpEventType.Response) {
                    var response = event.body;
                    _this.cliente = response.cliente;
                    //envio la notificacion de que se subio una foto 
                    _this.modalService.notificarUpload.emit(_this.cliente);
                    sweetalert2_1["default"].fire('la foto se a subido con exito', response.mensaje, 'success');
                }
            });
        }
        else {
            sweetalert2_1["default"].fire('Error debe seleccionar una Foto', "debe seleccionar una Foto", 'error');
        }
    };
    DetalleComponent.prototype.cerrarModal = function () {
        this.modalService.cerrarModal();
        this.imagenSeleccionada = null;
        this.progreso = 0;
    };
    DetalleComponent.prototype["delete"] = function (factura) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: 'Esta Seguro?',
            text: "Seguro que desea eliminar la factura! " + factura.descripcion + " ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar Factura!'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.facturaService["delete"](factura.id).subscribe(function (response) {
                    _this.cliente.facturas = _this.cliente.facturas.filter(function (fact) { return fact !== factura; });
                    sweetalert2_1["default"].fire('Factura Eliminada!', "Factura  " + factura.descripcion + "   eliminada con extito", 'success');
                });
            }
        });
    };
    __decorate([
        core_1.Input()
    ], DetalleComponent.prototype, "cliente");
    DetalleComponent = __decorate([
        core_1.Component({
            selector: 'detalle-cliente',
            templateUrl: './detalle.component.html',
            styleUrls: ['./detalle.component.css']
        })
    ], DetalleComponent);
    return DetalleComponent;
}());
exports.DetalleComponent = DetalleComponent;
