import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import Link from 'next/link';

import firebase from 'firebase/app';

import styles from '../styles/Challenge.module.css';

export default function Challenge(props) {
  const { id, title, description, creator, created, stars } = props.data;

  const uid = firebase.auth().currentUser?.uid;

  // toggles star status of challenge
  async function toggleStar() {
    // get starred status
    const starred = stars.includes(uid);
    const starStatus = starred ?
    firebase.firestore.FieldValue.arrayRemove(uid) :
    firebase.firestore.FieldValue.arrayUnion(uid);
    // update challenge doc in firebase
    const challengeRef = firebase.firestore().collection('challenges').doc(id);
    await challengeRef.update({ stars: starStatus });
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
        <Link href={`/user/${creator}`}>
          <a className="url">@{creator}</a>
        </Link>
      </div>
      {
        firebase.auth().currentUser &&
        <div>
          <div onClick={toggleStar} className={styles.star}>
            {
              stars.includes(uid) ?
              <StarIcon className={styles.staricon} /> :
              <StarBorderIcon />
            }
          </div>
        </div>
      }
    </div>
  );
}
