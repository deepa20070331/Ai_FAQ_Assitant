const axios = require('axios');
const FAQ = require('../models/FAQ');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function getFAQs(req, res) {
  try {
    const filters = {};
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';

    if (search) {
      const safeSearch = escapeRegex(search);
      filters.$or = [
        { question: { $regex: safeSearch, $options: 'i' } },
        { answer: { $regex: safeSearch, $options: 'i' } },
      ];
    }
    if (category) filters.category = category;

    const faqs = await FAQ.find(filters).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ faqs });
  } catch (error) {
    console.error('FAQ lookup failed:', error.message);
    res.status(503).json({ error: 'FAQs are temporarily unavailable. Check the MongoDB connection.' });
  }
}

async function askAI(req, res) {
  const question = typeof req.body.question === 'string' ? req.body.question.trim() : '';
  if (!question) return res.status(400).json({ error: 'Enter a question to get an answer.' });
  if (question.length > 1000) return res.status(400).json({ error: 'Questions must be 1,000 characters or fewer.' });
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    return res.status(503).json({ error: 'Add your OpenAI API key to backend/.env to enable AI answers.' });
  }

  let relatedFAQs = [];
  try {
    const terms = [...new Set(question.toLowerCase().match(/[a-z0-9]{4,}/g) || [])].slice(0, 5);
    if (terms.length) {
      const pattern = terms.map(escapeRegex).join('|');
      relatedFAQs = await FAQ.find({
        $or: [
          { question: { $regex: pattern, $options: 'i' } },
          { answer: { $regex: pattern, $options: 'i' } },
        ],
      }).limit(5).lean();
    }
  } catch (error) {
    console.warn('FAQ context unavailable; continuing without it:', error.message);
  }

  const faqContext = relatedFAQs.length
    ? relatedFAQs.map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')
    : 'No matching saved FAQs were found.';

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a concise, helpful FAQ assistant. Answer using the saved FAQ context when it is relevant. If the context does not contain the answer, say what is unknown rather than inventing company policy.\n\nSaved FAQ context:\n${faqContext}`,
          },
          { role: 'user', content: question },
        ],
        temperature: 0.3,
      },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        timeout: 30000,
      }
    );

    const answer = response.data.choices?.[0]?.message?.content?.trim();
    if (!answer) throw new Error('The AI service returned an empty answer.');
    res.json({ answer, sources: relatedFAQs.map(({ question: faqQuestion, category }) => ({ question: faqQuestion, category })) });
  } catch (error) {
    const status = error.response?.status === 429 ? 429 : 502;
    console.error('AI answer failed:', error.response?.data?.error?.message || error.message);
    res.status(status).json({ error: 'The AI service could not answer right now. Please try again shortly.' });
  }
}

module.exports = { getFAQs, askAI };
