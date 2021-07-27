import Link from 'next/link';

import { useEffect, useState } from 'react';
import getUsername from '../util/getUsername.js';

import styles from '../styles/Solution.module.css';

export default function Solution(props) {
  const { id, length } = props.data;

  const [username, setUsername] = useState('');

  // get username on start
  useEffect(() => {
    getUsername(id).then(u => setUsername(u));
  }, []);

  return (
    <div className={styles.container}>
      <Link href={`/user/${id}`}>
        <a className="url">@{username}</a>
      </Link>
      <span>•</span>
      <p>{length} characters</p>
    </div>
  );
}
