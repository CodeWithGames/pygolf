import { useState } from 'react';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';

import styles from '../styles/Create.module.css';

export default function Create() {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('');

  const router = useRouter();

  // creates a challenge
  async function createChallenge() {
    // clean up target
    const cleanTarget = target[target.length - 1] === '\n' ?
    target.slice(0, target.length - 1) : target;
    // add doc in firebase
    const uid = firebase.auth().currentUser.uid;
    const challengesRef = firebase.firestore().collection('challenges');
    const challengeRef = await challengesRef.add({
      creator: uid,
      title: title,
      description: description,
      target: cleanTarget,
      created: new Date()
    });
    // navigate to challenge page
    router.push(`/challenge/${challengeRef.id}`);
  }

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
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <label htmlFor="input-description">Description</label>
          <textarea
            placeholder="What should the program do?"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            required
          />
          <button>Next</button>
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
            placeholder="What should the program output be?"
            value={target}
            onChange={e => setTarget(e.target.value)}
            rows={16}
            required
          />
          <button type="button" onClick={() => setStep(0)}>Back</button>
          <button>Create</button>
        </form>
      }
    </div>
  );
}
