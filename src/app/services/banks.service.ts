import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Bank } from '../models/bank';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BanksService {

  constructor(private firestore: AngularFirestore) { }

  // método que permite obtener todos los documentos de la colección
  getBanks() {
    return this.firestore.collection('bancos').snapshotChanges();
  }

  //método para buscar un banco por su ID
  getBankById(id: string): Observable<string> {
    alert(id)
    return new Observable<string>(observer => {
      this.firestore.collection('bancos', ref => ref.where('id', '==', id).limit(1))
        .get()
        .subscribe(querySnapshot => {
          if (querySnapshot.size > 0) {
            querySnapshot.forEach(doc => {
              observer.next(doc.id);
            });
          } else {
            observer.error('banco no encontrado');
          }
        });
    });
  }

  //método para insertar un método nuevo en la colección
  createBank(nuevoBanco: Bank) {
    return this.firestore.collection('bancos').add(Object.assign({}, nuevoBanco));
  }

  //métdo para actualizar un documento existente
  updateBank(banco: Bank) {
    this.firestore.doc('bancos/' + banco.id).update(banco);
  }

  //método para aumentar los clientes con respecto al banco
  async aumentarClientes(idBanco: string): Promise<void> {
    const bancoRef = this.firestore.collection('bancos').doc(idBanco).ref;
    try {
      await this.firestore.firestore.runTransaction(async transaction => {
        const doc = await transaction.get(bancoRef);
        if (!doc.exists) {
          throw new Error('Documento de banco no encontrado');
        }
        const data = doc.data() as { clientes: number }; // Utilizamos 'as' para especificar el tipo
        const nuevosClientes = (data.clientes || 0) + 1;
        transaction.update(bancoRef, { clientes: nuevosClientes });
      });
    } catch (error) {
      console.error('Error al aumentar clientes:', error);
      throw error;
    }
  }

  //método para disminuir los clientes con respecto al banco
  async disminuirClientes(idBanco: string): Promise<void> {
    const bancoRef = this.firestore.collection('bancos').doc(idBanco).ref;
    try {
      await this.firestore.firestore.runTransaction(async transaction => {
        const doc = await transaction.get(bancoRef);
        if (!doc.exists) {
          throw new Error('Documento de banco no encontrado');
        }
        const data = doc.data() as { clientes: number }; // Utilizamos 'as' para especificar el tipo
        const nuevosClientes = (data.clientes || 0) - 1;
        transaction.update(bancoRef, { clientes: nuevosClientes });
      });
    } catch (error) {
      console.error('Error al disminuir clientes:', error);
      throw error;
    }
  }
}