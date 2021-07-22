import { useEffect, useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-plain_text';
import 'ace-builds/src-noconflict/theme-monokai';
import styles from '../styles/Editor.module.css';

export default function Editor() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState({ error: false, text: '' });

  // runs python code at shell endpoint
  async function run() {
    // reset output
    setOutput({ error: false, text: '' });
    // request endpoint
    const res = await fetch(`/api/shell?code=${encodeURIComponent(code)}`);
    const data = await res.json();
    // set output based on response
    if (data.error) setOutput({
      error: true,
      text: data.error.traceback ?? 'unknown error'
    });
    else setOutput({
      error: false,
      text: data.result ? data.result.join('\n') : ''
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <p>{code.length}</p>
        <button onClick={run}>Run</button>
      </div>
      <AceEditor
        value={code}
        onChange={val => setCode(val)}
        mode="python"
        theme="monokai"
        wrapEnabled={true}
        showPrintMargin={false}
        width="100%"
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
          />
        </div>
      </div>
    </div>
  );
}
