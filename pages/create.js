import Button from '@material-ui/core/button';

import { useState } from 'react';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import styles from '../styles/Create.module.css';

const challengeLimit = 10;

export default function Create(props) {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('');

  const router = useRouter();

  // creates a challenge
  async function createChallenge() {
    // retrieve user challenges
    const challengesRef = firebase.firestore().collection('challenges');
    const uid = firebase.auth().currentUser?.uid;
    const challengesQuery = challengesRef.where('creator', '==', uid ?? 'null');
    const userChallenges = await challengesQuery.get();
    // if challenge limit exceeded, return
    if (userChallenges.docs.length >= challengeLimit) {
      alert('Challenge limit reached. Delete an existing challenge to create more.');
      return;
    }
    // clean up target
    const cleanTarget = target[target.length - 1] === '\n' ?
    target.slice(0, target.length - 1) : target;
    // add challenge doc in firebase
    const challengeRef = await challengesRef.add({
      creator: uid,
      title: title,
      description: description,
      target: cleanTarget,
      created: new Date(),
      stars: []
    });
    // navigate to challenge page
    router.push(`/challenge/${challengeRef.id}`);
  }

  if (!props.userData) return <div>This page requires auth</div>;

  return (
    <div className={styles.container}>
      <h1>New Challenge</h1>
      {
        step === 0 &&
        <form onSubmit={e => {
          e.preventDefault();
          setStep(1);
        }}>
          <label htmlFor="input-title">Title</label>
          <input
            id="input-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoComplete="off"
            maxLength="64"
            required
          />
          <label htmlFor="input-description">Description</label>
          <textarea
            id="input-description"
            placeholder="What should the program do?"
            value={description}
            onChange={e => setDescription(e.target.value)}
            cols={24}
            rows={4}
            maxLength="1024"
            required
          />
          <div className={styles.buttonlist}>
            <button className="btn btn-secondary">Next</button>
          </div>
        </form>
      }
      {
        step === 1 &&
        <form onSubmit={e => {
          e.preventDefault();
          createChallenge();
        }}>
          <label htmlFor="input-target">Target</label>
          <textarea
            id="input-target"
            placeholder="What should the program output be?"
            value={target}
            onChange={e => setTarget(e.target.value)}
            cols={48}
            rows={8}
            required
          />
          <div className={styles.buttonlist}>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="btn btn-secondary"
            >
              Back
            </button>
            <button
              className="btn btn-primary"
            >
              Create
            </button>
          </div>
        </form>
      }
    </div>
  );
}
