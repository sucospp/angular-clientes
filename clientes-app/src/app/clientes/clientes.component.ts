import { Component, OnInit } from '@angular/core';
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';
import { Cliente } from './cliente';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router'
import { AuthService } from '../usuarios/auth.service';

import {URL_BACKEND} from '../config/config'   //agrego la ruta configurada para acceder a los servicios publicados


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;
  public urlBackend: string = URL_BACKEND;
  
  constructor(private clienteService: ClienteService,
     private activatedRoute: ActivatedRoute,
      public modalService : ModalService,
      public authService: AuthService) { }

  ngOnInit(): void {
    //me subscribo al observable para obtener los numeros de pagina para el paginador
    this.activatedRoute.paramMap.subscribe(params => {
      //El operador + convierte el String obtenido de params en entero 
      let page: number = +params.get('page');

      if (!page) {
        page = 0;
      }

      this.clienteService.getClientes(page).pipe(
        //aplico un tap para obtener los datos transformados en la clase service, esto podria ir en el subscribe tambien
        tap(response => {
          console.log('ClienteComponent tap 3');
          (response.content as Cliente[]).forEach(cliente => {
            console.log(cliente.nombre);

          }

          )
        })
      ).subscribe(response => {
        this.clientes = response.content as Cliente[];
        this.paginador = response;

      });

    })

    //me subscribo al observable notifar para cambiar la foto en la lista una vez que a sido subida
    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {

        //busco el id del cliente para pasarle la foto actualizada
        if(cliente.id == clienteOriginal.id){
          clienteOriginal.foto=cliente.foto;
        }
        return clienteOriginal;
      })

    })
  }

  delete(cliente: Cliente): void {
    swal.fire({
      title: 'Esta Seguro?',
      text: `Seguro que desea eliminar el cliente! ${cliente.nombre}  ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            swal.fire(
              'Eliminado!',
              `Cliente  ${cliente.nombre}  ${cliente.apellido} eliminado con extito`,
              'success'
            )

          }
        )


      }
    }

    )

  }



  abrirModal(cliente: Cliente){

    this.clienteSeleccionado=cliente;

    this.modalService.abrirModal();
  }
}
