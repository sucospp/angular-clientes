import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, flatMap } from 'rxjs/operators';
import { FacturaService } from './services/factura.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {

  titulo: string = 'Nueva Factura';
  factura: Factura = new Factura();

  autoCompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private facturaService: FacturaService,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId');
      this.clienteService.getCLiente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });
    this.productosFiltrados = this.autoCompleteControl.valueChanges
      .pipe(
        //startWith(''), quito porque no dese mostrar todos los productos al inicio
        map(value => typeof value === 'string' ? value : value.nombre), //verifico si los valores ingredsados son de tipo string
        flatMap(value => value ? this._filter(value) : []) //filtro solamente si los valores devueltos por el servidor no son nulos
      );
  }



  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined {

    return producto ? producto.nombre : undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    //obtengo el producto ingresado por el cliente
    let producto = event.option.value as Producto;
    console.log(producto);

    //al seleccionar un producto verifico si el priducto ya esta en la factura para no duplicar
    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    } else {

      //agrego el producto al item de la factura
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;

      //agrego el item a la factura
      this.factura.items.push(nuevoItem);
    }




    //
    this.autoCompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();


  }


  //actualiza la cantidad del producto en el caso de que el cliente suba el numero de productos en la interfaz
  actualizarCantidad(id: number, event: any): void {
    let cantidad: number = event.target.value as number;

    //en el caso de que se ponga la cantidad 0 en un prodicto este se elimina de la factura
    if (cantidad == 0) {
      return this.eliminarItemFactura(id);
    }

    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        item.cantidad = cantidad;
      }
      return item;

    });
  }

  //verifica si el producto existe para posteriormente subir solamente la cantidad y no volverlo a agregar a la factura
  existeItem(id: number): boolean {
    let existe = false;

    this.factura.items.forEach((item: ItemFactura) => {

      if (id === item.producto.id) {
        existe = true;
      }
    });
    return existe;
  }

  //incrementa la cantidad de unn producto si este es seleccionado y ya se encuentra en la factura
  incrementaCantidad(id: number): void {

    this.factura.items.forEach((item: ItemFactura) => {

      if (id === item.producto.id) {
        ++item.cantidad;
      }
    });

  }

  //metodo para eliminar item de la factura
  eliminarItemFactura(id: number): void {

    this.factura.items = this.factura.items.filter((item: ItemFactura) => {
     return id !== item.producto.id;
    });

  }

  create(facturaForm) : void{
    console.log(this.factura);

    //si la factura no tiene elementos muestro un error
    if(this.factura.items.length ==0){
      this.autoCompleteControl.setErrors({'invalid': true})
    }

    //valido si los datos del form son validos y si la factura tiene items para poder crearla
    if(facturaForm.form.valid && this.factura.items.length >0){
      this.facturaService.create(this.factura).subscribe(factura => {

        Swal.fire(this.titulo,`Factura ${factura.descripcion} creada con exito`,'success');
        this.router.navigate(['/facturas',factura.id]);
      });
    }



  }

}
