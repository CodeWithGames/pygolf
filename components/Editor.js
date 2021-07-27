import AceEditor from 'react-ace';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Modal from '@material-ui/core/Modal';

import firebase from 'firebase/app';
import { useEffect, useState } from 'react';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-plain_text';
import 'ace-builds/src-noconflict/theme-monokai';
import styles from '../styles/Editor.module.css';

export default function Editor(props) {
  const { title, description, target, id } = props.data;

  const [tab, setTab] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState({ error: false, text: '' });
  const [running, setRunning] = useState(false);
  const [submission, setSubmission] = useState(undefined);

  // runs given python code at shell endpoint
  async function runCode(inCode) {
    // reset output
    setOutput({ error: false, text: '...' });
    // request endpoint
    const res = await fetch(`/api/shell?code=${encodeURIComponent(inCode)}`);
    const data = await res.json();
    // return data based on response
    const text = data.error ?
    (data.error.traceback ?? 'unknown error') :
    (data.result ? data.result.join('\n') : '');
    return { error: !!data.error, text: text };
  }

  // runs current code and puts result in output
  async function run() {
    const out = await runCode(code); // run code
    setOutput(out); // set output
  }

  // attempts to submit current code
  async function submit() {
    setRunning(true);
    const inCode = code;
    const out = await runCode(inCode);
    setOutput(out);
    // if no error and target matched, set submission
    if (!out.error && out.text === target) setSubmission(inCode);
    setRunning(false);
  }

  // submits current submission to leaderboard
  async function submitToLeaderboard() {
    // get reference to solution doc
    const challengesRef = firebase.firestore().collection('challenges');
    const challengeRef = challengesRef.doc(id);
    const uid = firebase.auth().currentUser.uid;
    const solutionRef = challengeRef.collection('solutions').doc(uid);
    // set solution doc
    await solutionRef.set({ text: submission, length: submission.length });
    setSubmission(undefined);
    setTab(1);
  }

  return (
    <div className={styles.container}>
      <Tabs value={tab} onChange={(e, val) => setTab(val)}>
        <Tab label="Editor" />
        <Tab label="Leaderboard" />
      </Tabs>
      {
        tab === 0 &&
        <>
          <div className={styles.toolbar}>
            <h1>{title}</h1>
            <p>{description}</p>
            <div className={styles.actions}>
              <button onClick={run} className="btn btn-secondary">Run</button>
              <p>{code.length} characters</p>
              <button onClick={submit} className="btn btn-primary">
                Submit
                </button>
            </div>
          </div>
          <AceEditor
            name="code-editor"
            value={code}
            onChange={val => setCode(val)}
            mode="python"
            theme="monokai"
            wrapEnabled={true}
            showPrintMargin={false}
            readOnly={running}
            width="100%"
            height="auto"
          />
          <div className={styles.console}>
            <div className={styles.output}>
              <h1>Output</h1>
              <AceEditor
                name="output-editor"
                className={styles.editor}
                value={output.text}
                mode="plain_text"
                theme="monokai"
                wrapEnabled={true}
                showPrintMargin={false}
                highlightActiveLine={false}
                readOnly={true}
                width="100%"
                height="148px"
              />
            </div>
            <div className={styles.output}>
              <h1>Target</h1>
              <AceEditor
                name="target-editor"
                className={styles.editor}
                value={target}
                mode="plain_text"
                theme="monokai"
                wrapEnabled={true}
                showPrintMargin={false}
                highlightActiveLine={false}
                readOnly={true}
                width="100%"
                height="148px"
              />
            </div>
          </div>
          <Modal
            open={!!submission}
            onClose={() => setSubmission(undefined)}
          >
            <div className="modal">
              <h1>Solved</h1>
              <p>Completed in {submission?.length} characters</p>
              <button
                className="btn btn-primary"
                onClick={submitToLeaderboard}
              >
                Submit to Leaderboard
              </button>
            </div>
          </Modal>
        </>
      }
      {
        tab === 1 &&
        <h1>Leaderboard</h1>
      }
    </div>
  );
}
