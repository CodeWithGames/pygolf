import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import firebase from 'firebase/app';

export default function User() {
  const [userData, setUserData] = useState(undefined);

  const router = useRouter();
  const { id } = router.query;

  // retrieves user data from firebase
  async function getUserData() {
    const usersRef = firebase.firestore().collection('users');
    const userDoc = await usersRef.doc(id).get();
    setUserData(userDoc.exists ? userDoc.data() : null);
  }

  // retrieve user data on start
  useEffect(() => {
    if (id) getUserData();
  }, [id]);

  if (userData === undefined) return <div>Loading...</div>;
  if (userData === null) return <div>User not found</div>;

  return (
    <div>
      <h1>{userData.username}</h1>
    </div>
  );
}
