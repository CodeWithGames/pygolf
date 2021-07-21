import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import firebase from 'firebase/app';

export default function User() {
  const [userData, setUserData] = useState(undefined);

  const router = useRouter();
  const { username } = router.query;

  // retrieves user data from firebase
  async function getUserData() {
    const usersRef = firebase.firestore().collection('users');
    const snapshot = await usersRef.where('username', '==', username).get();
    if (snapshot.docs.length) setUserData(snapshot.docs[0].data());
    else setUserData(null);
  }

  // retrieve user data on start
  useEffect(() => {
    if (username) getUserData();
  }, [username]);

  if (userData === undefined) return <div>Loading...</div>;
  if (userData === null) return <div>User not found</div>;

  return (
    <div>
      <h1>{userData.username}</h1>
    </div>
  );
}
