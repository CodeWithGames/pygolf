import Challenge from '../../components/Challenge.js';
import Modal from '@material-ui/core/Modal';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import { useCollectionData, useDocument } from 'react-firebase-hooks/firestore';

import styles from '../../styles/User.module.css';

export default function User(props) {
  const [userData, setUserData] = useState(undefined);
  const [editing, setEditing] = useState('');
  const [newUsername, setNewUsername] = useState('');

  // retrieve user id from router
  const router = useRouter();
  const { id } = router.query;

  // retrieve user doc
  const usersRef = firebase.firestore().collection('users');
  const [userDoc] = useDocument(usersRef.doc(id));

  // retrieve user challenges
  const challengesRef = firebase.firestore().collection('challenges');
  const [userChallenges] = useCollectionData(
    challengesRef
    .where('creator', '==', id ?? 'null')
    .orderBy('created', 'desc'),
    { idField: 'id' }
  );

  // updates username in firebase
  async function changeUsername() {
    const uid = firebase.auth().currentUser.uid;
    const userRef = usersRef.doc(uid);
    await userRef.update({ username: newUsername });
    setEditing(false);
  }

  // update new username when user data changes
  useEffect(() => {
    setNewUsername(props.userData?.username ?? '');
  }, [props.userData])

  // return without user data
  if (userDoc === undefined) return <div>Loading...</div>;
  if (!userDoc.exists) return <div>User not found</div>;

  return (
    <div className={styles.container}>
      {
        firebase.auth().currentUser?.uid === id ?
        <>
          <h1
            className={styles.username}
            onClick={() => setEditing(true)}
          >
            {userDoc.data().username}
          </h1>
          <Modal
            open={editing}
            onClose={() => setEditing(false)}
          >
            <div className={`modal ${styles.modal}`}>
              <h1>Username</h1>
              <form onSubmit={e => {
                e.preventDefault();
                changeUsername();
              }}>
                <input
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  autoComplete="off"
                  required
                />
                <button className="btn btn-primary">
                  Update
                </button>
              </form>
            </div>
          </Modal>
        </> :
        <h1>{userDoc.data().username}</h1>
      }
      <hr />
      <p>Joined {userDoc.data().joined.toDate().toLocaleDateString()}</p>
      {
        userChallenges &&
        <>
          <p>{userChallenges.length} challenges</p>
          <p>
            {userChallenges.reduce((acc, val) => acc + val.starCount, 0)}
            {' '}stars
          </p>
        </>
      }
      <div className={styles.challengelist}>
        {
          userChallenges &&
          userChallenges.map(challenge =>
            <Challenge data={challenge} key={challenge.id} />
          )
        }
      </div>
    </div>
  );
}
