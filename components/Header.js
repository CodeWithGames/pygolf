import Link from 'next/link';

import firebase from 'firebase/app';

import styles from '../styles/Header.module.css';

export default function Header() {
  return (
    <div className={styles.container}>
      <Link href="/challenges">
        <a>Challenges</a>
      </Link>
      {
        firebase.auth().currentUser ?
        <>
          <Link href="/create">
            <a>Create</a>
          </Link>
          <button onClick={() => firebase.auth().signOut()}>Sign Out</button>
        </> :
        <Link href="/">
          <a>Home</a>
        </Link>
      }
    </div>
  );
}
