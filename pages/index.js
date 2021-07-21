import Link from 'next/link';

import firebase from 'firebase/app';

import styles from '../styles/Index.module.css';

export default function Index() {
  // opens google sign in popup
  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  return (
    <div>
      <h1>Pygolf</h1>
      {
        firebase.auth().currentUser ?
        <Link href="/challenges">
          <a>Challenges</a>
        </Link> :
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      }
    </div>
  );
}
