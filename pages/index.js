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
        <p>Create and share Python code golf challenges.</p>
        <h2>What is code golfing?</h2>
        <p>Code golfing is a competition in which a programming challenge is
        solved in the fewest number of characters.</p>
        <Image
          src="/img/undraw/golf.svg"
          width="300"
          height="300"
        />
        <h2>Why Python?</h2>
        <p>Python syntax is generally quite concise and intuitive, making it
        an ideal candidate for recreational code golfing.</p>
        <h2>Can I create challenges?</h2>
        <p>
          Yes, anyone with an account can create challenges at{' '}
          <Link href="/create">
            <a className="url">/create</a>
          </Link>
          .
        </p>
        <h2>Can I contribute to the site?</h2>
        <p>
          Yes, Pygolf is open source. You can find our GitHub repository here:
          {' '}
          <a
            className="url"
            href="https://github.com/csaye/pygolf"
            target="_blank"
            rel="noopener noreferrer"
          >
            csaye/pygolf
          </a>
          .
        </p>
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
