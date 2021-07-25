import Link from 'next/link';

import firebase from 'firebase/app';

import styles from '../styles/Challenge.module.css';

export default function Challenge(props) {
  const { id, title, description, creator, created } = props.data;

  return (
    <div className={styles.container}>
      <div className={styles.meta}>
        <Link href={`/challenge/${id}`}>
          <a>
            <h1>{title}</h1>
            <p>{description}</p>
          </a>
        </Link>
        <Link href={`/user/${creator.uid}`}>
          <a className="url">@{creator.username}</a>
        </Link>
      </div>
    </div>
  );
}
