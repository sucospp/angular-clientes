"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FacturasComponent = void 0;
var core_1 = require("@angular/core");
var factura_1 = require("./models/factura");
var forms_1 = require("@angular/forms");
var operators_1 = require("rxjs/operators");
var item_factura_1 = require("./models/item-factura");
var sweetalert2_1 = require("sweetalert2");
var FacturasComponent = /** @class */ (function () {
    function FacturasComponent(clienteService, activatedRoute, facturaService, router) {
        this.clienteService = clienteService;
        this.activatedRoute = activatedRoute;
        this.facturaService = facturaService;
        this.router = router;
        this.titulo = 'Nueva Factura';
        this.factura = new factura_1.Factura();
        this.autoCompleteControl = new forms_1.FormControl();
    }
    FacturasComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.paramMap.subscribe(function (params) {
            var clienteId = +params.get('clienteId');
            _this.clienteService.getCLiente(clienteId).subscribe(function (cliente) { return _this.factura.cliente = cliente; });
        });
        this.productosFiltrados = this.autoCompleteControl.valueChanges
            .pipe(
        //startWith(''), quito porque no dese mostrar todos los productos al inicio
        operators_1.map(function (value) { return typeof value === 'string' ? value : value.nombre; }), //verifico si los valores ingredsados son de tipo string
        operators_1.flatMap(function (value) { return value ? _this._filter(value) : []; }) //filtro solamente si los valores devueltos por el servidor no son nulos
        );
    };
    FacturasComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        return this.facturaService.filtrarProductos(filterValue);
    };
    FacturasComponent.prototype.mostrarNombre = function (producto) {
        return producto ? producto.nombre : undefined;
    };
    FacturasComponent.prototype.seleccionarProducto = function (event) {
        //obtengo el producto ingresado por el cliente
        var producto = event.option.value;
        console.log(producto);
        //al seleccionar un producto verifico si el priducto ya esta en la factura para no duplicar
        if (this.existeItem(producto.id)) {
            this.incrementaCantidad(producto.id);
        }
        else {
            //agrego el producto al item de la factura
            var nuevoItem = new item_factura_1.ItemFactura();
            nuevoItem.producto = producto;
            //agrego el item a la factura
            this.factura.items.push(nuevoItem);
        }
        //
        this.autoCompleteControl.setValue('');
        event.option.focus();
        event.option.deselect();
    };
    //actualiza la cantidad del producto en el caso de que el cliente suba el numero de productos en la interfaz
    FacturasComponent.prototype.actualizarCantidad = function (id, event) {
        var cantidad = event.target.value;
        //en el caso de que se ponga la cantidad 0 en un prodicto este se elimina de la factura
        if (cantidad == 0) {
            return this.eliminarItemFactura(id);
        }
        this.factura.items = this.factura.items.map(function (item) {
            if (id === item.producto.id) {
                item.cantidad = cantidad;
            }
            return item;
        });
    };
    //verifica si el producto existe para posteriormente subir solamente la cantidad y no volverlo a agregar a la factura
    FacturasComponent.prototype.existeItem = function (id) {
        var existe = false;
        this.factura.items.forEach(function (item) {
            if (id === item.producto.id) {
                existe = true;
            }
        });
        return existe;
    };
    //incrementa la cantidad de unn producto si este es seleccionado y ya se encuentra en la factura
    FacturasComponent.prototype.incrementaCantidad = function (id) {
        this.factura.items.forEach(function (item) {
            if (id === item.producto.id) {
                ++item.cantidad;
            }
        });
    };
    //metodo para eliminar item de la factura
    FacturasComponent.prototype.eliminarItemFactura = function (id) {
        this.factura.items = this.factura.items.filter(function (item) {
            return id !== item.producto.id;
        });
    };
    FacturasComponent.prototype.create = function (facturaForm) {
        var _this = this;
        console.log(this.factura);
        //si la factura no tiene elementos muestro un error
        if (this.factura.items.length == 0) {
            this.autoCompleteControl.setErrors({ 'invalid': true });
        }
        //valido si los datos del form son validos y si la factura tiene items para poder crearla
        if (facturaForm.form.valid && this.factura.items.length > 0) {
            this.facturaService.create(this.factura).subscribe(function (factura) {
                sweetalert2_1["default"].fire(_this.titulo, "Factura " + factura.descripcion + " creada con exito", 'success');
                _this.router.navigate(['/facturas', factura.id]);
            });
        }
    };
    FacturasComponent = __decorate([
        core_1.Component({
            selector: 'app-facturas',
            templateUrl: './facturas.component.html'
        })
    ], FacturasComponent);
    return FacturasComponent;
}());
exports.FacturasComponent = FacturasComponent;
