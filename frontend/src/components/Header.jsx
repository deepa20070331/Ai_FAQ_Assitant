import { ArrowUpRight, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Answerdesk home">
        <span className="brand-mark"><Sparkles size={17} strokeWidth={2.4} /></span>
        <span>answerdesk<span className="brand-period">.</span></span>
      </a>
      <nav className="top-nav" aria-label="Main navigation">
        <a className="nav-link active" href="#knowledge">Knowledge base</a>
        <a className="nav-link" href="#assistant">AI assistant</a>
      </nav>
      <a className="help-link" href="#assistant">Get an answer <ArrowUpRight size={15} /></a>
    </header>
  );
}
