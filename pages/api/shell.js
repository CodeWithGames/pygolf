import { PythonShell } from 'python-shell';

export default async function handler(req, res) {
  // retrieve code from query
  const code = req.query.code;
  // run python code in promise
  const runPromise = new Promise((resolve, reject) => {
    PythonShell.runString(code, null, (e, r) => {
      resolve({ error: e, result: r });
    });
  });
  // return promise results
  const result = await runPromise;
  res.status(200).json(result);
}
