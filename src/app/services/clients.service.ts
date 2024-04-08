import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Client } from '../models/clients';
import { Bank } from '../models/bank';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private firestore: AngularFirestore) { }

  // método que permite obtener todos los documentos de la colección
  getClients() {
    return this.firestore.collection('clientes').snapshotChanges();
  }

  //método para insertar un método nuevo en la colección
  createClient(nuevoCliente: Client) {
    return this.firestore.collection('clientes').add(Object.assign({}, nuevoCliente));
  }

  //métdo para actualizar un documento existente
  updateClient(cliente: Client) {
    this.firestore.doc('clientes/' + cliente.id).update(cliente);
  }

  //método para eliminar un documento
  deleteClient(clienteId: string) {
    this.firestore.doc('clientes/' + clienteId).delete();
  }

}
