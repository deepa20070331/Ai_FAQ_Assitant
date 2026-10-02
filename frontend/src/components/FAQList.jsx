import { useState } from 'react';
import { ArrowUpRight, ChevronDown, CircleHelp } from 'lucide-react';

export default function FAQList({ faqs, onAsk }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!faqs.length) {
    return (
      <div className="empty-faqs">
        <CircleHelp size={20} />
        <p>No matching questions. Try another search, or ask the assistant.</p>
      </div>
    );
  }

  return (
    <div className="faq-list">
      {faqs.map((faq, index) => {
        const id = faq._id || `${faq.category}-${index}`;
        const expanded = expandedId === id;
        return (
          <article className={`faq-item${expanded ? ' expanded' : ''}`} key={id}>
            <button
              className="faq-question"
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpandedId(expanded ? null : id)}
            >
              <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="faq-question-copy">
                <span className="faq-category">{faq.category || 'General'}</span>
                <span className="faq-title">{faq.question}</span>
              </span>
              <ChevronDown className="faq-chevron" size={18} />
            </button>
            {expanded && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
                <button className="text-action" type="button" onClick={() => onAsk(faq.question)}>
                  Explore with AI <ArrowUpRight size={14} />
                </button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
