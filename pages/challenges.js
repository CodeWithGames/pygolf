import Link from 'next/link';

import firebase from 'firebase/app';

import { useCollectionData } from 'react-firebase-hooks/firestore';

export default function Challenges() {
  const challengesRef = firebase.firestore().collection('challenges');
  const [challenges] = useCollectionData(challengesRef, { idField: 'id' });

  if (!challenges) return <div>Loading...</div>;

  return (
    <div>
      {
        challenges.map(challenge =>
          <div key={challenge.id}>
            <Link href={`/challenge/${challenge.id}`}>
              <a>{challenge.title}</a>
            </Link>
          </div>
        )
      }
    </div>
  );
}
