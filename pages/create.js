import { useState } from 'react';

import firebase from 'firebase/app';

export default function Create() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('');

  function createChallenge() {
    const uid = firebase.auth().currentUser.uid;
    const challengesRef = firebase.firestore().collection('challenges');
    challengesRef.add({
      creator: uid,
      title: title,
      description: description,
      target: target
    });
  }

  return (
    <div>
      <h1>New Challenge</h1>
      <form onSubmit={e => {
        e.preventDefault();
        createChallenge();
      }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <textarea
          value={target}
          onChange={e => setTarget(e.target.value)}
          required
        />
        <button>Create</button>
      </form>
    </div>
  );
}
