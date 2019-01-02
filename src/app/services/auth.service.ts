import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

export interface IPresent {
  dateOpened: Date,
  picture: string,
  rating: number,
  thanked: boolean,
  userID: string,
  whatItWas: string,
  whoFrom: string,
  whoTo: string
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  get presentsCollection() {
    return this.afs.collection<IPresent>('presents',
    (ref) => ref.where('userID', '==', this.user.uid));
  }

  get presents(): Observable<IPresent[]> {
    return this.presentsCollection.snapshotChanges()
      .pipe(map(this.collectionID));
  }

  collectionID(docChangeAction) {
    return docChangeAction.map((a) => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data};
    });
  }

  get user() {
    return this.afAuth.auth.currentUser;
  }

  register(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  login(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.afAuth.auth.signOut()
      .then(() => this.router.navigate['login'])
      .catch((error) => console.log("An error occured logging out: " + error));
  }

}
