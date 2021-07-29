import Link from 'next/link';
import Image from 'next/image';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import GolfCourseIcon from '@material-ui/icons/GolfCourse';
import PersonIcon from '@material-ui/icons/Person';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

import { useEffect, useState } from 'react';
import signInWithGoogle from '../util/signInWithGoogle.js';
import firebase from 'firebase/app';

import styles from '../styles/Header.module.css';

export default function Header(props) {
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
      {
        firebase.auth().currentUser &&
        <Link href={`/user/${firebase.auth().currentUser.uid}`}>
          <a className={styles.link}>Profile</a>
        </Link>
      }
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
        <Tooltip title="Sign Out" arrow>
          <IconButton
            className={styles.iconbutton}
            onClick={() => firebase.auth().signOut()}
          >
            <ExitToAppIcon />
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
    </div>
  );
}
