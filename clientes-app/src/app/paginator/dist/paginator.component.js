"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PaginatorComponent = void 0;
var core_1 = require("@angular/core");
var PaginatorComponent = /** @class */ (function () {
    function PaginatorComponent() {
    }
    PaginatorComponent.prototype.ngOnInit = function () {
        this.initPaginator();
    };
    //me ejecuta cada vez que cambia el valor inyectado paginador
    PaginatorComponent.prototype.ngOnChanges = function (changes) {
        var paginadorActualizado = changes['paginador'];
        if (paginadorActualizado.previousValue) {
            this.initPaginator();
        }
    };
    PaginatorComponent.prototype.initPaginator = function () {
        var _this = this;
        this.desde = Math.min(Math.max(1, this.paginador.number - 4), this.paginador.totalPages - 5);
        this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number + 4), 6);
        if (this.paginador.totalPages > 5) {
            this.paginas = new Array(this.hasta - this.desde + 1).fill(0).map(function (_valor, indice) { return indice + _this.desde; });
        }
        else {
            this.paginas = new Array(this.paginador.totalPages).fill(0).map(function (_valor, indice) { return indice + 1; });
        }
    };
    __decorate([
        core_1.Input()
    ], PaginatorComponent.prototype, "paginador");
    PaginatorComponent = __decorate([
        core_1.Component({
            selector: 'paginator-nav',
            templateUrl: './paginator.component.html'
        })
    ], PaginatorComponent);
    return PaginatorComponent;
}());
exports.PaginatorComponent = PaginatorComponent;
