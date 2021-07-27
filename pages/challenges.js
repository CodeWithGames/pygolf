import Link from 'next/link';
import Loading from '../components/Loading.js';
import Challenge from '../components/Challenge.js';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { useState } from 'react';
import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import styles from '../styles/Challenges.module.css';

export default function Challenges(props) {
  const [tab, setTab] = useState(0);

  // retrieve all challenges
  const challengesRef = firebase.firestore().collection('challenges');
  const [challenges] = useCollectionData(
    challengesRef.orderBy('created', 'desc'), { idField: 'id' }
  );
  // retrieve user challenges
  const uid = firebase.auth().currentUser?.uid;
  const [userChallenges] = useCollectionData(
    challengesRef.where('creator', '==', uid ?? 'null')
    .orderBy('created', 'desc'), { idField: 'id' }
  );
  // retrieve starred challenges
  const [starredChallenges] = useCollectionData(
    challengesRef.where('stars', 'array-contains', uid ?? 'null')
    .orderBy('created', 'desc'), { idField: 'id' }
  );

  return (
    <div className={styles.container}>
      <Tabs value={tab} onChange={(e, val) => setTab(val)}>
        <Tab label="All Challenges" />
        {firebase.auth().currentUser && <Tab label="Your Challenges" />}
        {firebase.auth().currentUser && <Tab label="Starred Challenges" />}
      </Tabs>
      <div className={styles.challengelist}>
        {
          (tab === 0 && challenges) &&
          challenges.map(challenge =>
            <Challenge data={challenge} key={challenge.id} />
          )
        }
        {
          (tab === 1 && userChallenges) &&
          userChallenges.map(challenge =>
            <Challenge data={challenge} key={challenge.id} />
          )
        }
        {
          (tab === 2 && starredChallenges) &&
          starredChallenges.map(challenge =>
            <Challenge data={challenge} key={challenge.id} />
          )
        }
      </div>
    </div>
  );
}
