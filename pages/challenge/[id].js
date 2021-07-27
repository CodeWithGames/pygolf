import Loading from '../../components/Loading.js';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';

import dynamic from 'next/dynamic';
const Editor = dynamic(import('../../components/Editor.js'), { ssr: false });

export default function Challenge() {
  const [challengeData, setChallengeData] = useState(undefined);

  const router = useRouter();
  const { id } = router.query;

  // retrieves challenge data from firebase
  async function getChallengeData() {
    const challengesRef = firebase.firestore().collection('challenges');
    const challengeDoc = await challengesRef.doc(id).get();
    setChallengeData(
      challengeDoc.exists ? { id, ...challengeDoc.data() } : null
    );
  }

  // retrieve challenge data on start
  useEffect(() => {
    if (id) getChallengeData();
  }, [id]);

  if (challengeData === undefined) return <Loading />;
  if (challengeData === null) return <div>Challenge not found</div>;

  return <Editor data={challengeData} />;
}
