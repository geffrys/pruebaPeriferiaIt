import { Injectable } from '@angular/core';
import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private readonly STORAGE_KEY = 'contacts';

  constructor() { }

  getContacts(): Contact[] {
    try {
      const contactsJson = localStorage.getItem(this.STORAGE_KEY);
      return contactsJson ? JSON.parse(contactsJson) : [];
    } catch (error) {
      console.error('Error al obtener contactos del localStorage:', error);
      return [];
    }
  }


  private saveContacts(contacts: Contact[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(contacts));
    } catch (error) {
      console.error('Error al guardar contactos en localStorage:', error);
    }
  }


  addContact(contact: Contact): void {
    if (!contact.name || !contact.lastName || !contact.phone) {
      throw new Error('Todos los campos del contacto son requeridos');
    }

    const contacts = this.getContacts();
    
    const existingContact = contacts.find(c => 
      c.name.toLowerCase() === contact.name.toLowerCase() && 
      c.lastName.toLowerCase() === contact.lastName.toLowerCase()
    );

    if (existingContact) {
      throw new Error('Ya existe un contacto con ese nombre y apellido');
    }

    contacts.push(contact);
    this.saveContacts(contacts);
  }


  findContactByName(name: string): Contact | undefined {
    if (!name) {
      return undefined;
    }

    const contacts = this.getContacts();
    return contacts.find(contact => 
      contact.name.toLowerCase().includes(name.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(name.toLowerCase())
    );
  }


  deleteContact(contact: Contact): boolean {
    const contacts = this.getContacts();
    const initialLength = contacts.length;
    
    const updatedContacts = contacts.filter(c => 
      !(c.name === contact.name && 
        c.lastName === contact.lastName && 
        c.phone === contact.phone)
    );

    if (updatedContacts.length < initialLength) {
      this.saveContacts(updatedContacts);
      return true;
    }
    
    return false;
  }


  updateContact(oldContact: Contact, newContact: Contact): boolean {
    const contacts = this.getContacts();
    const index = contacts.findIndex(c => 
      c.name === oldContact.name && 
      c.lastName === oldContact.lastName && 
      c.phone === oldContact.phone
    );

    if (index !== -1) {
      contacts[index] = { ...newContact };
      this.saveContacts(contacts);
      return true;
    }
    
    return false;
  }


  clearAllContacts(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
