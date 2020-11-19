"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ClienteService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
//import { AuthService } from '../usuarios/auth.service'; se quita por interceptor
var config_1 = require("../config/config"); //agrego la ruta configurada para acceder a los servicios publicados
var ClienteService = /** @class */ (function () {
    //quito por el interceptor
    //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    function ClienteService(http, router /*, private authService: AuthService  se quita por interceptors*/) {
        this.http = http;
        this.router = router;
        this.urlEndPoint = config_1.URL_BACKEND + '/api/clientes';
    }
    //agrego el token a los headers de las peticiones
    //en esete caso no se utiliza ya que la aplicacion se optimizo con interceptores
    /*private agregarAutorizationHeader(){
      let token= this.authService.token;
      if(token != null){
        return this.httpHeaders.append('Authorization','Bearer '+ token);
      }
  
      return this.httpHeaders;
    }*/
    //se quita debido a la implementacion del interceptor que controla los errores
    /* private isNoAuorizado(e): boolean {
       if (e.status == 401 ) {
   
         //verifico si me encuentro autenticado para realizar el logout
         if(this.authService.isAuthenticated()){
           this.authService.logOut();
         }
         this.router.navigate(['/login']);
         return true;
       }
   
       //acceso denegado
       if (e.status == 403) {
         swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso`,'warning');
         this.router.navigate(['/clientes']);
         return true;
       }
   
       return false;
     }*/
    ClienteService.prototype.getRegiones = function () {
        return this.http.get(this.urlEndPoint + '/regiones' /*,{headers: this.agregarAutorizationHeader()} quito debido a que se utiliza un interceptor*/);
        /* .pipe
           (catchError(e => {
             this.isNoAuorizado(e);
             return throwError(e);
           })
           );   el pipe se qiuta por debido a la implementacion del interceptor que controla los errores*/
    };
    ClienteService.prototype.getClientes = function (page) {
        // return of(CLIENTES);
        //invoco al metodo Get del servidor y mapeo los objetos Clientes para posteriormente darles el formato correcto
        return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
        //tap puede realizar operaciones con los datos sin realizarles ningun cambio ni modificacion
        operators_1.tap(function (response) {
            console.log('ClienteService tap 1');
            response.content.forEach(function (cliente) {
                console.log(cliente.nombre);
            });
        }), 
        //mapeo para transformar los resultados de la consulta al servidor a objetos de tipo cliente
        operators_1.map(function (response) {
            response.content.map(function (cliente) {
                //doy formato a los textos de la lista de clientes
                cliente.nombre = cliente.nombre.toUpperCase();
                // cliente.apellido = cliente.apellido.toUpperCase(); se da el formato directo en la vista
                //Todos los metodos siguientes para cambiar la fecha realizan lo mismo
                //  let datePipe = new DatePipe('es');
                //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy'); para fromatear en las clases se aplico posteriormente formato en la vista
                // cliente.createAt=formatDate(cliente.createAt,'dd-MM-yyyy','en-US'); es l mismo que el DatePipe de arriba
                return cliente;
            });
            return response;
        }), 
        //ejecuto otro tap para ver las diferencias luego de que el map convierte los datos
        operators_1.tap(function (response) {
            console.log('ClienteService tap 2');
            response.content.forEach(function (cliente) {
                console.log(cliente.nombre);
            });
        }));
    };
    ClienteService.prototype.create = function (cliente) {
        //invoco al metodo post del servidor y comoo este me devuelve un Cliente debo mapear la respuesta
        return this.http.post(this.urlEndPoint, cliente /*, {headers: this.agregarAutorizationHeader()} quito por que se asigna en interceptor*/)
            .pipe(operators_1.map(function (response) { return response.cliente; }), operators_1.catchError(function (e) {
            //valido con el m[etodo creado para identificar los errores 401 y 403]
            /*
            se quita debido a la implementacion del interceptor que controla los errores
            if (this.isNoAuorizado(e)) {
              return throwError(e);
            }*/
            //validacion tomada del servidor utilizando los mensajes de las anotacions @
            if (e.Status == 400) {
                return rxjs_1.throwError(e);
            }
            //validacion con mensajes enviados en el objeto
            if (e.error.mensaje) {
                console.error(e.error.mensaje);
            }
            // swal.fire(e.error.mensaje, e.error.error, 'error')
            return rxjs_1.throwError(e);
        }));
    };
    ClienteService.prototype.getCLiente = function (id) {
        var _this = this;
        //invoco al metodo get del servidor en este caso solo me devuelve un cliente
        return this.http.get(this.urlEndPoint + "/" + id /*,{headers: this.agregarAutorizationHeader()} quito debido a que se asigna en un interceptor*/)
            .pipe(operators_1.catchError(function (e) {
            //valido con el m[etodo creado para identificar los errores 401 y 403]
            /*  Se quita debido a  la implementacion del interceptor que controla los errores
             if (this.isNoAuorizado(e)) {
                 return throwError(e);
               }*/
            if (e.status != 401 && e.error.mensaje) {
                _this.router.navigate(['/clientes']);
                console.error(e.error.mensaje);
            }
            // swal.fire('Error al editar', e.error.mensaje, 'error')
            return rxjs_1.throwError(e);
        }));
    };
    ClienteService.prototype.update = function (cliente) {
        // invoco al metodo put del servidor y este me devuelve el cliente modificado
        return this.http.put(this.urlEndPoint + "/" + cliente.id, cliente /*, {headers: this.agregarAutorizationHeader()} quito por que se asigna en interceptor*/)
            .pipe(operators_1.catchError(function (e) {
            //valido con el m[etodo creado para identificar los errores 401 y 403]
            /*
             se quita debido a la implementacion del interceptor que controla los errores
            if (this.isNoAuorizado(e)) {
               return throwError(e);
             }*/
            //valido si se ejecuto todo correctamente en el servidor y si no devuelvo los errores
            if (e.Status == 400) {
                return rxjs_1.throwError(e);
            }
            if (e.error.mensaje) {
                console.error(e.error.mensaje);
            }
            //muestro un mensaje de dialogo de error
            // swal.fire(e.error.mensaje, e.error.error, 'error')
            return rxjs_1.throwError(e);
        }));
    };
    ClienteService.prototype["delete"] = function (id) {
        //invoco el metodo delete del servidor
        return this.http["delete"](this.urlEndPoint + "/" + id /*, {headers: this.agregarAutorizationHeader()} quito por que se asiga en interceptor*/)
            .pipe(operators_1.catchError(function (e) {
            //valido con el m[etodo creado para identificar los errores 401 y 403]
            /*
            se quita   debido a la implementacion del interceptor que controla los errores
            if (this.isNoAuorizado(e)) {
              return throwError(e);
            }*/
            if (e.error.mensaje) {
                console.error(e.error.mensaje);
            }
            // swal.fire(e.error.mensaje, e.error.error, 'error')
            return rxjs_1.throwError(e);
        }));
    };
    ClienteService.prototype.subirFoto = function (archivo, id) {
        var formData = new FormData();
        formData.append("archivo", archivo);
        formData.append("id", id);
        //quito debido a que se estan utilizando interceptores para optimizar el codigo
        /*
            let httpHeaders= new HttpHeaders();
            let token = this.authService.token;
        
           if(token != null){
             httpHeaders = httpHeaders.append('Authorization','Bearer '+ token);
            }*/
        //utilizo para barras de progreso
        var req = new http_1.HttpRequest('POST', this.urlEndPoint + "/upload", formData, {
            reportProgress: true
        });
        return this.http.request(req); /*.pipe
          (catchError(e => {
            this.isNoAuorizado(e);
            return throwError(e);
          })
          );    se quita debido a la implementacion del interceptor que controla los errores*/
    };
    ClienteService = __decorate([
        core_1.Injectable()
    ], ClienteService);
    return ClienteService;
}());
exports.ClienteService = ClienteService;
