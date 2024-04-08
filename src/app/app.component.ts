import { Component, OnInit } from '@angular/core';
import { BanksService } from './services/banks.service';
import { Bank } from './models/bank';
import { Client } from './models/clients';
import { ClientsService } from './services/clients.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {

  title = 'bank';

  banks: Bank[] = [];
  bank = new Bank();

  bankState = "create";
  clientState = "create";

  clients: Client[] = [];
  client = new Client();

  constructor(private banksService: BanksService, private clientService: ClientsService) { }

  ngOnInit(): void {
    //recoge los bancos
    this.banksService.getBanks().subscribe(data => {
      this.banks = data.map(doc => {
        return {
          ...doc.payload.doc.data() as Bank,
          id: doc.payload.doc.id
        };
      });
    });

    //recoge los clientes
    this.clientService.getClients().subscribe(data => {
      this.clients = data.map(doc => {
        return {
          ...doc.payload.doc.data() as Client,
          id: doc.payload.doc.id
        };
      });
    });

    this.limpiarBanco();
    this.limpiarCliente();
  }

  limpiarBanco() {
    this.bank = new Bank();
    this.bank.clientes = 0;
  }

  verifyInsertBanco() {
    if (this.bank.nombre == null || this.bank.nombre == "" || this.bank.nombre == " ") {
      alert("Escriba un nombre válido")
      return;
    }

    if (this.bank.direccion == null || this.bank.direccion == "" || this.bank.direccion == " ") {
      alert("Escriba una dirección válida")
      return;
    }

    if (this.bank.estado == null) {
      alert("Asigne un estado");
      return;
    }
    this.insertarBanco();
  }

  insertarBanco() {
    this.banksService.createBank(this.bank);
    this.limpiarBanco();
    alert("Banco Registrado Exitosamente!!!");
  }

  verifyUpdateBanco() {
    if (this.bank.nombre == null || this.bank.nombre == "" || this.bank.nombre == " ") {
      alert("Escriba un nombre válido")
      return;
    }

    if (this.bank.direccion == null || this.bank.direccion == "" || this.bank.direccion == " ") {
      alert("Escriba una dirección válida")
      return;
    }

    if (this.bank.estado == null) {
      alert("Asigne un estado");
      return;
    }
    this.actualizarBanco();
  }

  actualizarBanco() {
    this.banksService.updateBank(this.bank);
    this.limpiarBanco();
    this.bankState = "create";
    alert("Banco Actualizado Exitosamente!!!");
  }

  seleccionarBanco(banco: Bank) {
    this.bank = banco;
    this.bankState = "modify";
  }

  limpiarCliente() {
    this.client = new Client();
    this.clientState = "create";
  }

  insertarCliente() {
    this.clientService.createClient(this.client);
    this.limpiarCliente();
    alert("Cliente Registrado Exitosamente!!!");
  }

  verifyUpdateClient() {
    if (this.client.nombre && this.client.apellidos && this.client.correo && this.validarCorreoElectronico(this.client.correo) && this.verifyPhone(this.client.telefono) && this.esNumeroTelefonoValido(this.client.telefono) && this.client.banco != null) {
      this.actualizarCliente();
    }
  }

  actualizarCliente() {
    this.clientService.updateClient(this.client);
    this.limpiarCliente();
    this.clientState = "create";
    alert("Cliente Actualizado Exitosamente!!!");
  }

  borrarCliente() {
    this.clientService.deleteClient(this.client.id);
    this.dropClients();
    this.limpiarCliente();
    alert("Cliente Eliminado Exitosamente!!!");

  }

  seleccionarCliente(cliente: Client) {
    this.client = cliente;
    this.clientState = "modify";
  }

  //busca el nombre del banco por su Id para mostrarlo en la tabla
  bancoPorId(id: string) {
    let nombreBanco: string | null = null; // Valor predeterminado en caso de que no se encuentre ningún banco con el ID

    this.banks.forEach(banco => {
      if (banco.id === id) {
        nombreBanco = banco.nombre;
      }
    });

    return nombreBanco;
  }

  //aumentar clientes según el banco
  addClients() {
    this.banksService.aumentarClientes(this.client.banco);
  }

  //resta clientes según el banco
  dropClients() {
    this.banksService.disminuirClientes(this.client.banco);
  }

  verifyInsertClient() {
    if (this.client.nombre == null || this.client.nombre == "" || this.client.nombre == " ") {
      alert("Escriba un nombre válido");
      return;
    }

    if (this.client.apellidos == null || this.client.apellidos == "" || this.client.apellidos == " ") {
      alert("Escriba un apellido válido");
      return;
    }

    if (this.client.correo == null || this.client.correo == "" || this.client.correo == " ") {
      alert("Escriba un correo válido");
      return;
    }

    if (this.validarCorreoElectronico(this.client.correo) == false) {
      alert("Asegurese de incluir el @dominio.org");
      return;
    }

    if (this.client.telefono == null) {
      alert("Ingrese un teléfono válido");
      return;
    }

    if (this.verifyPhone(this.client.telefono) == false) {
      alert("Los números de teléfono son de 10 digitos");
      return;
    }

    if (this.esNumeroTelefonoValido(this.client.telefono) == false) {
      alert("Sólo se aceptan números, no letras");
      return;
    }

    if (this.client.banco == null) {
      alert("Elige el banco a inscribirse");
      return;
    }

    this.addClients();
    this.insertarCliente();
  }

  verifyPhone(telefono: string) {
    if (telefono.length == 10) {
      return true;
    }
    return false;
  }

  esNumeroTelefonoValido(numero: string) {
    // Definir un patrón de número de teléfono válido que consista solo en dígitos
    const patron = /^\d{10}$/; // Este patrón permite uno o más dígitos, pero no acepta letras ni caracteres especiales

    // Verificar si el número coincide con el patrón
    return patron.test(numero);
  }

  validarCorreoElectronico(correo: string) {
    // Expresión regular para validar un correo electrónico
    var regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Comprobamos si el correo coincide con la expresión regular
    return regexCorreo.test(correo);
  }
}
