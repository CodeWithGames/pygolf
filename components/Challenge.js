import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import EditIcon from '@material-ui/icons/Edit';
import Modal from '@material-ui/core/Modal';
import Link from 'next/link';

import { useState } from 'react';
import firebase from 'firebase/app';

import styles from '../styles/Challenge.module.css';

export default function Challenge(props) {
  const { id, title, description, creator, created, stars } = props.data;

  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);

  const uid = firebase.auth().currentUser?.uid;

  const challengeRef = firebase.firestore().collection('challenges').doc(id);

  // toggles star status of challenge
  async function toggleStar() {
    // get starred status
    const starred = stars.includes(uid);
    const starStatus = starred ?
    firebase.firestore.FieldValue.arrayRemove(uid) :
    firebase.firestore.FieldValue.arrayUnion(uid);
    // update challenge doc in firebase
    await challengeRef.update({ stars: starStatus });
  }

  // updates challenge in firebase
  async function updateChallenge() {
    await challengeRef.update({
      title: newTitle,
      description: newDescription
    });
    setEditing(false);
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
          {
            creator === firebase.auth().currentUser.uid &&
            <>
              <button onClick={() => setEditing(true)}>
                <EditIcon />
              </button>
              <Modal
                open={editing}
                onClose={() => setEditing(false)}
              >
                <div className="modal">
                  <form onSubmit={e => {
                    e.preventDefault();
                    updateChallenge();
                  }}>
                    <input
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      required
                    />
                    <input
                      value={newDescription}
                      onChange={e => setNewDescription(e.target.value)}
                      required
                    />
                    <button className="btn btn-primary">Update</button>
                  </form>
                </div>
              </Modal>
            </>
          }
        </div>
      }
    </div>
  );
}
