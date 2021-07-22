import Link from 'next/link';

import firebase from 'firebase/app';

import styles from '../styles/Index.module.css';

export default function Index() {
  // creates user doc if none exists
  async function createUserDoc() {
    // retrieve user doc
    const currentUser = firebase.auth().currentUser;
    const uid = currentUser.uid;
    const usersRef = firebase.firestore().collection('users');
    const userRef = usersRef.doc(uid);
    const userDoc = await userRef.get();
    // if no user doc exists
    if (!userDoc.exists) {
      // create user doc
      userRef.set({
        username: uid.slice(0, 16),
        joined: new Date()
      });
    }
  }

  // opens google sign in popup
  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
    await createUserDoc();
  }

  return (
    <div>
      <h1>Pygolf</h1>
      {
        !firebase.auth().currentUser &&
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      }
    </div>
  );
}
