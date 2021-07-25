import Link from 'next/link';
import Image from 'next/image';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Modal from '@material-ui/core/Modal';
import GolfCourseIcon from '@material-ui/icons/GolfCourse';
import PersonIcon from '@material-ui/icons/Person';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

import { useEffect, useState } from 'react';
import signInWithGoogle from '../util/signInWithGoogle.js';
import firebase from 'firebase/app';

import styles from '../styles/Header.module.css';

export default function Header(props) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  // updates username in firebase
  async function changeUsername() {
    const uid = firebase.auth().currentUser.uid;
    const usersRef = firebase.firestore().collection('users');
    const userRef = usersRef.doc(uid);
    await userRef.update({ username: newUsername });
    setProfileOpen(false);
  }

  // update new username when user data changes
  useEffect(() => {
    setNewUsername(props.userData?.username ?? '');
  }, [props.userData])

  return (
    <div className={styles.container}>
      <Link href="/">
        <a className={styles.logo}>
          <Image
            src="/img/logo.png"
            width="40px"
            height="40px"
          />
        </a>
      </Link>
      <h1>Pygolf</h1>
      <span className={styles.divider} />
      <Link href="/challenges">
        <a className={styles.link}>Challenges</a>
      </Link>
      {
        firebase.auth().currentUser &&
        <Link href="/create">
          <a className={styles.link}>Create</a>
        </Link>
      }
      <Link href="/about">
        <a className={styles.link}>About</a>
      </Link>
      {
        firebase.auth().currentUser ?
        <Tooltip title="Profile" arrow>
          <IconButton
            className={styles.iconbutton}
            onClick={() => setProfileOpen(true)}
          >
            <PersonIcon />
          </IconButton>
        </Tooltip> :
        <Tooltip title="Sign In" arrow>
          <IconButton
            className={styles.iconbutton}
            onClick={signInWithGoogle}
          >
            <PersonOutlineIcon />
          </IconButton>
        </Tooltip>
      }
      <Modal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      >
        <div className="modal">
          <h1>Your Profile</h1>
          <Tooltip title="Sign Out" arrow>
            <IconButton
              onClick={() => {
                firebase.auth().signOut();
                setProfileOpen(false);
              }}
            >
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
          <form onSubmit={e => {
            e.preventDefault();
            changeUsername();
          }}>
            <label htmlFor="input-username">Username</label>
            <input
              id="input-username"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              autoComplete="off"
              required
            />
            <button>Change Username</button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
