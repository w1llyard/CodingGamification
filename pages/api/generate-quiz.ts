import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests are allowed' });
  }

  try {
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt: 'Generate 5 general coding questions with answers and explanations',
      max_tokens: 150,
    });

    const questions = response.choices[0].text.trim().split('\n\n').map((q: string) => ({
      question: q,
      answer: '',
      explanation: '',
    }));

    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
}
