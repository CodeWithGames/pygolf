import Header from '../components/Header.js';
import Head from 'next/head';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { firebaseConfig } from '../firebaseConfig.js';

import '../styles/globals.css';

// initialize firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App({ Component, pageProps }) {
  useAuthState(firebase.auth());

  // retrieve user doc
  const uid = firebase.auth().currentUser?.uid;
  const usersRef = firebase.firestore().collection('users');
  const userRef = usersRef.doc(uid ?? 'null');
  const [userData] = useDocumentData(userRef);

  return (
    <>
      <Head>
        <title>Pygolf</title>
        <link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;900&display=swap" rel="stylesheet" />
      </Head>
      <Header userData={userData} />
      <Component {...pageProps} userData={userData} />
    </>
  );
}

export default App;
