import { useEffect, useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-plain_text';
import 'ace-builds/src-noconflict/theme-monokai';
import styles from '../styles/Editor.module.css';

export default function Editor() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState({ error: false, text: '' });

  // runs given python code at shell endpoint
  async function runCode(inCode) {
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
    setOutput({ error: false, text: '' }); // reset output
    const out = await runCode(code); // run code
    setOutput(out); // set output
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
