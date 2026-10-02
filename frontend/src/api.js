import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  timeout: 35000,
});

export async function fetchFAQs(search = '') {
  const { data } = await client.get('/faqs', { params: search ? { search } : {} });
  return data.faqs;
}

export async function askAssistant(question) {
  const { data } = await client.post('/ask-ai', { question });
  return data;
}
