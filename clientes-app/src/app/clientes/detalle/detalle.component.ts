import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from '../detalle/modal.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from '../../usuarios/auth.service';
import { FacturaService } from 'src/app/facturas/services/factura.service';
import { Factura } from 'src/app/facturas/models/factura';

import {URL_BACKEND} from '../../config/config'   //agrego la ruta configurada para acceder a los servicios publicados


@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;


  titulo: string = "Detalle Cliente";

  public imagenSeleccionada: File;

  public urlBackend: string = URL_BACKEND;


  progreso: number = 0;

  constructor(private clienteService: ClienteService,
    public modalService: ModalService,
    public authService: AuthService,
    private facturaService: FacturaService) { }

  //private activatedRoute: ActivatedRoute  se inyecta si se quiere obtener los parametros de forma independiente



  ngOnInit(): void {
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
  }


  seleccionarFoto(event) {
    this.imagenSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.imagenSeleccionada);
    if (this.imagenSeleccionada.type.indexOf('image') < 0) {
      swal.fire('Error debe seleccionar una imagen', `debe seleccionar una Foto`, 'error');
      this.imagenSeleccionada = null;

    }

  }

  subirFoto() {

    if (this.imagenSeleccionada) {
      this.clienteService.subirFoto(this.imagenSeleccionada, this.cliente.id).subscribe(
        //mando el evento del progreso para poder obtener el porcentaje de subida
        event => {
          //this.cliente = cliente;

          //obtengo el progreso para poder mostrarlo
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);

          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;

            //envio la notificacion de que se subio una foto 
            this.modalService.notificarUpload.emit(this.cliente);

            swal.fire('la foto se a subido con exito', response.mensaje, 'success');


          }

        });

    } else {

      swal.fire('Error debe seleccionar una Foto', `debe seleccionar una Foto`, 'error');

    }


  }



  cerrarModal() {
    this.modalService.cerrarModal();
    this.imagenSeleccionada = null;
    this.progreso = 0;
  }

  delete(factura: Factura) {

    swal.fire({
      title: 'Esta Seguro?',
      text: `Seguro que desea eliminar la factura! ${factura.descripcion} `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar Factura!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaService.delete(factura.id).subscribe(
          response => {
            this.cliente.facturas = this.cliente.facturas.filter(fact => fact !== factura)
            swal.fire(
              'Factura Eliminada!',
              `Factura  ${factura.descripcion}   eliminada con extito`,
              'success'
            )

          }
        )


      }
    }

    )
  }

}
