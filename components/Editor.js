import { useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import styles from '../styles/Editor.module.css';

export default function Editor() {
  const [code, setCode] = useState('');

  return (
    <AceEditor
      value={code}
      onChange={val => setCode(val)}
      mode="python"
      theme="monokai"
    />
  );
}
