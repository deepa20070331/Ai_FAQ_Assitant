import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, Check, CircleHelp } from 'lucide-react';
import { askAssistant, fetchFAQs } from './api';
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import FAQList from './components/FAQList.jsx';
import AIChat from './components/AIChat.jsx';

const sampleFAQs = [
  {
    category: 'Account',
    question: 'How do I reset my password?',
    answer: 'Choose “Forgot password” on the sign-in page and enter the email address linked to your account. We’ll send a reset link that expires after 30 minutes. If it doesn’t arrive, check your spam folder.',
  },
  {
    category: 'Billing',
    question: 'Where can I find my invoices?',
    answer: 'Open Settings, then select Billing. Your invoices are listed under Billing history, where you can view or download a PDF for each payment.',
  },
  {
    category: 'Support',
    question: 'How do I contact the support team?',
    answer: 'Send a note to support@example.com with a short description of the issue. Include your account email and any relevant screenshots so the team can help faster.',
  },
  {
    category: 'Workspace',
    question: 'How can I invite someone to my workspace?',
    answer: 'Go to Workspace settings and open the Members tab. Select Invite members, enter their work email addresses, then choose a role before sending the invitations.',
  },
  {
    category: 'Account',
    question: 'Can I change the email on my account?',
    answer: 'Yes. Open Account settings and edit your email address. You’ll need to confirm the new address before it becomes the primary email for sign-in and notifications.',
  },
  {
    category: 'Workspace',
    question: 'How do I manage notification settings?',
    answer: 'Open your profile menu and choose Notifications. You can adjust email and in-app updates there, including weekly summaries and workspace activity.',
  },
];

export default function App() {
  const [faqs, setFaqs] = useState(sampleFAQs);
  const [usingSamples, setUsingSamples] = useState(false);
  const [search, setSearch] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    fetchFAQs()
      .then((items) => {
        if (!isCurrent) return;
        setFaqs(items.length ? items : sampleFAQs);
        setUsingSamples(items.length === 0);
      })
      .catch(() => {
        if (!isCurrent) return;
        setFaqs(sampleFAQs);
        setUsingSamples(true);
      });
    return () => { isCurrent = false; };
  }, []);

  const filteredFAQs = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return faqs;
    return faqs.filter((faq) => `${faq.question} ${faq.answer} ${faq.category}`.toLowerCase().includes(term));
  }, [faqs, search]);

  async function handleAsk(value) {
    setQuestion(value);
    setAnswer('');
    setSources([]);
    setError('');
    setLoading(true);
    try {
      const result = await askAssistant(value);
      setAnswer(result.answer);
      setSources(result.sources || []);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Could not reach the assistant. Check that the backend is running, then try again.');
    } finally {
      setLoading(false);
      document.getElementById('assistant')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  return (
    <div className="app-shell" id="top">
      <Header />
      <main>
        <section className="intro-section">
          <div className="intro-copy">
            <p className="eyebrow"><span /> YOUR TEAM, IN SYNC</p>
            <h1>The answer is<br /><em>already here.</em></h1>
            <p className="intro-description">Find a quick answer in the knowledge base, or ask AI to help connect the dots.</p>
            <a className="intro-link" href="#knowledge">Explore the knowledge base <ArrowUpRight size={15} /></a>
          </div>
          <div className="intro-graphic" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="graphic-center"><CircleHelp size={39} strokeWidth={1.25} /></div>
            <span className="graphic-note note-top"><Check size={13} /> CLEAR ANSWERS</span>
            <span className="graphic-note note-bottom"><BookOpen size={13} /> TEAM KNOWLEDGE</span>
            <span className="graphic-spark spark-one">✳</span>
            <span className="graphic-spark spark-two">✳</span>
          </div>
          <div className="intro-index"><span>01</span><span className="index-line" /><span>02</span></div>
        </section>

        <section className="content-grid" aria-label="Help center">
          <div className="knowledge-panel" id="knowledge">
            <div className="section-heading">
              <div>
                <p className="panel-kicker">THE SHORT ANSWERS</p>
                <h2>Knowledge base <span className="count-badge">{String(filteredFAQs.length).padStart(2, '0')}</span></h2>
              </div>
              <span className={`connection-status${usingSamples ? ' sample-status' : ''}`}>
                <span /> {usingSamples ? 'SAMPLE CONTENT' : 'LIVE LIBRARY'}
              </span>
            </div>
            <SearchBar value={search} onChange={setSearch} />
            <FAQList faqs={filteredFAQs} onAsk={handleAsk} />
            <div className="library-footnote">
              <span><BookOpen size={14} /> A useful place to start</span>
              {usingSamples && <span className="sample-caption">Showing starter FAQs</span>}
            </div>
          </div>
          <AIChat
            answer={answer}
            question={question}
            error={error}
            loading={loading}
            sources={sources}
            onAsk={handleAsk}
          />
        </section>
      </main>
      <footer className="page-footer">
        <span>ANSWERDESK <span className="brand-period">.</span></span>
        <span>Good answers make good work.</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </div>
  );
}
