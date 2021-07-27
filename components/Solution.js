import Link from 'next/link';

import styles from '../styles/Solution.module.css';

export default function Solution(props) {
  const { id, length } = props.data;

  return (
    <div className={styles.container}>
      <Link href={`/user/${id}`}>
        <a className="url">@{id}</a>
      </Link>
      <span>•</span>
      <p>{length} characters</p>
    </div>
  );
}
