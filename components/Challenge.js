import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import Link from 'next/link';

import firebase from 'firebase/app';

import styles from '../styles/Challenge.module.css';

export default function Challenge(props) {
  const { id, title, description, creator, created } = props.data;

  // toggles star status of challenge
  async function toggleStar() {
    const starred = props.userData.stars.includes(id);
    // update user doc in firebase
    const uid = firebase.auth().currentUser.uid;
    const userRef = firebase.firestore().collection('users').doc(uid);
    const stars = starred ?
    firebase.firestore.FieldValue.arrayRemove(id) :
    firebase.firestore.FieldValue.arrayUnion(id);
    await userRef.update({ stars });
  }

  return (
    <div className={styles.container}>
      <div className={styles.meta}>
        <Link href={`/challenge/${id}`}>
          <a>
            <h1>{title}</h1>
            <p>{description}</p>
          </a>
        </Link>
        <Link href={`/user/${creator.uid}`}>
          <a className="url">@{creator.username}</a>
        </Link>
      </div>
      {
        props.userData &&
        <div>
          <div onClick={toggleStar} className={styles.star}>
            {
              props.userData.stars.includes(id) ?
              <StarIcon className={styles.staricon} /> :
              <StarBorderIcon />
            }
          </div>
        </div>
      }
    </div>
  );
}
