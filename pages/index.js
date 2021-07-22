import Link from 'next/link';
import signInWithGoogle from '../util/signInWithGoogle.js';

import firebase from 'firebase/app';

import styles from '../styles/Index.module.css';

export default function Index() {
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
