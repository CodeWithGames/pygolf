import dynamic from 'next/dynamic';
const Editor = dynamic(import('../components/Editor.js'), { ssr: false });

import styles from '../styles/Index.module.css';

export default function Index() {
  return (
    <div>
      <Editor />
    </div>
  );
}
