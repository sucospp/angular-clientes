import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  public regiones: Region[];
  // public titulo: string = "Crear Cliente";
  public errores: string[];


  constructor(private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.cargarCliente();
  }

  public cargarCliente(): void {
    // me suscribo para obtener los clientes
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.clienteService.getCLiente(id).subscribe((cliente) => this.cliente = cliente)
      }

    });
    //me suscribo para obtener las regiones
    this.clienteService.getRegiones().subscribe(regiones => this.regiones=regiones);

  }





  public create(): void {
    console.log(this.cliente);

    console.log("clicked");
    console.log(this.cliente);

    this.clienteService.create(this.cliente)
      .subscribe(cliente => {
        this.router.navigate(["/clientes"])
        swal.fire('Nuevo Cliente', `El cliente : ${cliente.nombre} a sido creado con exito`, 'success')

      },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Codigo de error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      );

  }


  public update(): void {
    console.log(this.cliente);

    this.cliente.facturas=null;
    
    this.clienteService.update(this.cliente)
      .subscribe(json => {
        this.router.navigate(["/clientes"])
        swal.fire('Actualizar Cliente', `${json.mensaje} : ${json.cliente.nombre}`, 'success')


      },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Codigo de error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      );

  }


  //comparo para poder asignar el valor de region del cliente a la lista desplegable
  compararRegion(ob1: Region, ob2: Region) : boolean {

    if(ob1 === undefined && ob2===undefined) {
      return true;
    }
    return (ob1===null || ob2===null || ob1===undefined || ob2===undefined)? false : ob1.id===ob2.id;

  }
}