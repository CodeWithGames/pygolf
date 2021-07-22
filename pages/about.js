import Link from 'next/link';

export default function About() {
  return (
    <div>
      <h1>About</h1>
      <h2>What is code golfing?</h2>
      <p>Code golfing is a competition in which a programming challenge is
      solved in the fewest number of characters.</p>
      <h2>Why Python?</h2>
      <p>Python syntax is generally quite concise and intuitive, making it
      an ideal candidate for recreational code golfing.</p>
      <h2>Can I create challenges?</h2>
      <p>
        Yes, anyone with an account can create challenges at{' '}
        <Link href="/create">
          <a className="url">/create</a>
        </Link>
        .
      </p>
      <h2>Can I contribute to the site?</h2>
      <p>
        Yes, Pygolf is open source. You can find our GitHub repository here:
        {' '}
        <a
          className="url"
          href="https://github.com/csaye/pygolf"
          target="_blank"
          rel="noopener noreferrer"
        >
          csaye/pygolf
        </a>
        .
      </p>
    </div>
  );
}
