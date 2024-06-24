import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { question, answer } = req.body;

  try {
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt: `Question: ${question}\nAnswer: ${answer}\nProvide a detailed explanation:`,
      max_tokens: 100,
    });

    const explanation = response.choices[0].text.trim();
    res.status(200).json({ explanation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check answer' });
  }
}
