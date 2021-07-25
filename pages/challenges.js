import Link from 'next/link';
import Loading from '../components/Loading.js';
import Challenge from '../components/Challenge.js';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import styles from '../styles/Challenges.module.css';

export default function Challenges(props) {
  const challengesRef = firebase.firestore().collection('challenges');
  const [challenges] = useCollectionData(
    challengesRef.orderBy('created', 'desc'), { idField: 'id' }
  );

  if (!challenges) return <Loading />;

  return (
    <div className={styles.container}>
      {
        challenges.map(challenge =>
          <Challenge
            key={challenge.id}
            data={challenge}
            userData={props.userData}
          />
        )
      }
    </div>
  );
}
