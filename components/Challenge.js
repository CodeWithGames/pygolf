import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from '@material-ui/core/Modal';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import getUsername from '../util/getUsername.js';

import styles from '../styles/Challenge.module.css';

export default function Challenge(props) {
  const { id, title, description, creator, created, stars } = props.data;

  const [username, setUsername] = useState('');
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
    await challengeRef.update({
      stars: starStatus,
      starCount: starred ? stars.length - 1 : stars.length + 1
    });
  }

  // updates challenge in firebase
  async function updateChallenge() {
    await challengeRef.update({
      title: newTitle,
      description: newDescription
    });
    setEditing(false);
  }

  // deletes challenge in firebase
  async function deleteChallenge() {
    const message = `Delete ${title}? This action is irreversible.`;
    if (!window.confirm(message)) return;
    await challengeRef.delete();
  }

  // get username on start
  useEffect(() => {
    getUsername(creator).then(u => setUsername(u));
  }, []);

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
          <a className="url">@{username}</a>
        </Link>
        <p>{stars.length} star{stars.length !== 1 && 's'}</p>
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
              <button
                onClick={() => setEditing(true)}
                className={styles.editbutton}
              >
                <EditIcon />
              </button>
              <Modal
                open={editing}
                onClose={() => setEditing(false)}
              >
                <div className={`modal ${styles.modal}`}>
                  <h1>Editing Challenge</h1>
                  <form onSubmit={e => {
                    e.preventDefault();
                    updateChallenge();
                  }}>
                    <label id="input-newtitle">Title</label>
                    <input
                      id="input-newtitle"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      required
                    />
                    <label id="input-newdescription">Description</label>
                    <input
                      id="input-newdescription"
                      value={newDescription}
                      onChange={e => setNewDescription(e.target.value)}
                      required
                    />
                    <button className="btn btn-primary">Update</button>
                  </form>
                  <Tooltip title="Delete" arrow>
                    <IconButton onClick={deleteChallenge}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </Modal>
            </>
          }
        </div>
      }
    </div>
  );
}
