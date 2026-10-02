import { useState } from 'react';
import { ArrowUp, Bot, LoaderCircle, Sparkles } from 'lucide-react';

const suggestions = [
  'How do I reset my password?',
  'Where can I find my invoices?',
  'How do I contact support?',
];

export default function AIChat({ answer, question, error, loading, sources, onAsk }) {
  const [draft, setDraft] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const value = draft.trim();
    if (!value || loading) return;
    onAsk(value);
    setDraft('');
  }

  return (
    <section className="assistant-panel" id="assistant" aria-labelledby="assistant-title">
      <div className="assistant-heading">
        <div className="assistant-title-row">
          <span className="assistant-icon"><Sparkles size={17} /></span>
          <div>
            <p className="panel-kicker">A little help, right now</p>
            <h2 id="assistant-title">Ask the assistant</h2>
          </div>
        </div>
        <span className="online-indicator"><span /> AI READY</span>
      </div>

      <div className="conversation" aria-live="polite">
        {!question && !loading && (
          <div className="welcome-note">
            <span className="bot-avatar"><Bot size={20} /></span>
            <div className="welcome-copy">
              <p>Hi there. What can I help you figure out?</p>
              <span>I’ll look through the help center and give you a clear answer.</span>
            </div>
          </div>
        )}
        {question && (
          <div className="message user-message">
            <span className="message-label">YOU ASKED</span>
            <p>{question}</p>
          </div>
        )}
        {loading && (
          <div className="message assistant-message loading-message">
            <LoaderCircle size={17} className="loading-icon" /> Looking through the help center…
          </div>
        )}
        {answer && !loading && (
          <div className="message assistant-message">
            <span className="message-label">ANSWER</span>
            <p>{answer}</p>
            {sources?.length > 0 && (
              <div className="source-list">
                <span>RELATED ARTICLES</span>
                {sources.map((source, index) => <span className="source-tag" key={`${source.question}-${index}`}>{source.category}</span>)}
              </div>
            )}
          </div>
        )}
        {error && <p className="error-note" role="alert">{error}</p>}
      </div>

      {!question && !loading && (
        <div className="suggestion-area">
          <span className="suggestion-label">TRY ASKING</span>
          <div className="suggestion-list">
            {suggestions.map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => onAsk(suggestion)} disabled={loading}>
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <form className="composer" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="question-input">Ask a question</label>
        <input
          id="question-input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write your question…"
          maxLength={1000}
        />
        <button type="submit" aria-label="Send question" disabled={!draft.trim() || loading}>
          {loading ? <LoaderCircle size={18} className="loading-icon" /> : <ArrowUp size={19} />}
        </button>
      </form>
      <p className="assistant-footnote">AI responses can make mistakes. Check important details.</p>
    </section>
  );
}
