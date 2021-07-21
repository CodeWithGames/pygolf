import { useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import styles from '../styles/Editor.module.css';

export default function Editor() {
  const [code, setCode] = useState('');

  // runs python code at shell endpoint
  async function run() {
    const res = await fetch(`/api/shell?code=${encodeURIComponent(code)}`);
    const data = await res.json();
    if (data.error) console.error(data.error.traceback ?? 'unknown error');
    else console.log(data.result.join('\n'));
  }

  return (
    <div>
      <AceEditor
        value={code}
        onChange={val => setCode(val)}
        mode="python"
        theme="monokai"
      />
      <button onClick={run}>Run</button>
    </div>
  );
}
