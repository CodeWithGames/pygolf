import firebase from 'firebase/app';

// returns username for given uid
export default async function getUsername(uid) {
  const usersRef = firebase.firestore().collection('users');
  const userDoc = await usersRef.doc(uid).get();
  return userDoc.exists ? userDoc.data().username : undefined;
}
