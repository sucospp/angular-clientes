import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { formatDate, DatePipe, registerLocaleData } from '@angular/common'
import { Router } from '@angular/router';
import { of, Observable, throwError } from "rxjs";
import { map, catchError, tap } from 'rxjs/operators';
//import swal from 'sweetalert2'; se quita porque se utiliza en el intercept
import { Cliente } from './cliente';
import { Region } from './region';
//import { AuthService } from '../usuarios/auth.service'; se quita por interceptor

import {URL_BACKEND} from '../config/config'   //agrego la ruta configurada para acceder a los servicios publicados




@Injectable()
export class ClienteService {
  private urlEndPoint: string = URL_BACKEND + '/api/clientes';

  //quito por el interceptor
  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router/*, private authService: AuthService  se quita por interceptors*/) { }

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

  getRegiones(): Observable<Region[]> {

    return this.http.get<Region[]>(this.urlEndPoint + '/regiones'/*,{headers: this.agregarAutorizationHeader()} quito debido a que se utiliza un interceptor*/)
    /* .pipe
       (catchError(e => {
         this.isNoAuorizado(e);
         return throwError(e);
       })
       );   el pipe se qiuta por debido a la implementacion del interceptor que controla los errores*/

  }

  getClientes(page: number): Observable<any> {
    // return of(CLIENTES);

    //invoco al metodo Get del servidor y mapeo los objetos Clientes para posteriormente darles el formato correcto
    return this.http.get<Cliente[]>(this.urlEndPoint + '/page/' + page).pipe(
      //tap puede realizar operaciones con los datos sin realizarles ningun cambio ni modificacion
      tap((response: any) => {

        console.log('ClienteService tap 1');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);

        }

        )
      }),

      //mapeo para transformar los resultados de la consulta al servidor a objetos de tipo cliente
      map((response: any) => {

        (response.content as Cliente[]).map(cliente => {
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
      }
      ),

      //ejecuto otro tap para ver las diferencias luego de que el map convierte los datos
      tap(response => {
        console.log('ClienteService tap 2');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);

        }

        )
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {

    //invoco al metodo post del servidor y comoo este me devuelve un Cliente debo mapear la respuesta
    return this.http.post(this.urlEndPoint, cliente/*, {headers: this.agregarAutorizationHeader()} quito por que se asigna en interceptor*/)
      .pipe(
        map((response: any) => response.cliente as Cliente),
        catchError(e => {

          //valido con el m[etodo creado para identificar los errores 401 y 403]
          /*
          se quita debido a la implementacion del interceptor que controla los errores
          if (this.isNoAuorizado(e)) {
            return throwError(e);
          }*/

          //validacion tomada del servidor utilizando los mensajes de las anotacions @
          if (e.Status == 400) {
            return throwError(e);

          }

          //validacion con mensajes enviados en el objeto
          if(e.error.mensaje){
            console.error(e.error.mensaje);
          }
                    // swal.fire(e.error.mensaje, e.error.error, 'error')
          return throwError(e);

        })

      )
  }

  getCLiente(id): Observable<Cliente> {
    //invoco al metodo get del servidor en este caso solo me devuelve un cliente
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`/*,{headers: this.agregarAutorizationHeader()} quito debido a que se asigna en un interceptor*/)
      .pipe(
        catchError(e => {
          //valido con el m[etodo creado para identificar los errores 401 y 403]
          /*  Se quita debido a  la implementacion del interceptor que controla los errores
           if (this.isNoAuorizado(e)) {
               return throwError(e);
             }*/

             if(e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);

             }
          // swal.fire('Error al editar', e.error.mensaje, 'error')
          return throwError(e);
        })

      );
  }

  update(cliente: Cliente): Observable<any> {
    // invoco al metodo put del servidor y este me devuelve el cliente modificado
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente/*, {headers: this.agregarAutorizationHeader()} quito por que se asigna en interceptor*/)
      .pipe(
        catchError(e => {


          //valido con el m[etodo creado para identificar los errores 401 y 403]
          /*
           se quita debido a la implementacion del interceptor que controla los errores
          if (this.isNoAuorizado(e)) {
             return throwError(e);
           }*/

          //valido si se ejecuto todo correctamente en el servidor y si no devuelvo los errores
          if (e.Status == 400) {
            return throwError(e);

          }


          if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
          //muestro un mensaje de dialogo de error
          // swal.fire(e.error.mensaje, e.error.error, 'error')
          return throwError(e);

        })
      )
  }

  delete(id: number): Observable<any> {

    //invoco el metodo delete del servidor
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`/*, {headers: this.agregarAutorizationHeader()} quito por que se asiga en interceptor*/)
      .pipe(

        catchError(e => {

          //valido con el m[etodo creado para identificar los errores 401 y 403]
          /*
          se quita   debido a la implementacion del interceptor que controla los errores
          if (this.isNoAuorizado(e)) {
            return throwError(e);
          }*/


          if(e.error.mensaje){
            console.error(e.error.mensaje);
          }
                    // swal.fire(e.error.mensaje, e.error.error, 'error')
          return throwError(e);

        })
      )
  }


  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {

    let formData = new FormData();
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
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true,
      // headers: httpHeaders  quito por el interceptor
    });


    return this.http.request(req)/*.pipe
      (catchError(e => {
        this.isNoAuorizado(e);
        return throwError(e);
      })
      );    se quita debido a la implementacion del interceptor que controla los errores*/
  }
}
