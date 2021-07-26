import Link from 'next/link';
import Image from 'next/image';

import signInWithGoogle from '../util/signInWithGoogle.js';
import firebase from 'firebase/app';

import styles from '../styles/Index.module.css';

export default function Index() {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.title}>
          <Image
            src="/img/logo.png"
            width="40px"
            height="40px"
          />
          <h1>Pygolf</h1>
        </div>
        {
          firebase.auth().currentUser ?
          <Link href="/challenges">
            <a className="url">Challenges</a>
          </Link> :
          <button onClick={signInWithGoogle} className="btn btn-primary">
            Sign in with Google
          </button>
        }
      </div>
    </div>
  );
}
