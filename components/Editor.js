import { useEffect, useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-plain_text';
import 'ace-builds/src-noconflict/theme-monokai';
import styles from '../styles/Editor.module.css';

export default function Editor(props) {
  const { title, description, target } = props.data;

  const [code, setCode] = useState('');
  const [output, setOutput] = useState({ error: false, text: '' });
  const [running, setRunning] = useState(false);

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

  // attempts to submit current code
  async function submit() {
    setRunning(true);
    const inCode = code;
    const out = await runCode(inCode);
    setOutput(out);
    // log output
    if (out.error) console.log(`error: ${out.text}`)
    else if (out.text !== target) console.log('output did not match target');
    else {
      console.log(`passed with ${inCode.length} characters:`);
      console.log(inCode);
    }
    setRunning(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className={styles.actions}>
          <button onClick={run}>Run</button>
          <p>{code.length} characters</p>
          <button onClick={submit}>Submit</button>
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
    </div>
  );
}
