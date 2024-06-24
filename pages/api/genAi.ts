import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const apiKey: string | undefined = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { input } = req.body;

      if (!input) {
        res.status(400).json({ error: 'Input is required' });
        return;
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: "Generate 5 mcq questions related to coding with increasing difficulty level\nDO NOT OUTPUT ANYTHING EXCEPT THE JSON IN THAT SPECIFIC FORMAT\nIt should be in the JSON format like the below:\n\n[\n    {\n      \"question\": \"What is the capital of France?\",\n      \"options\": [\"Berlin\", \"Madrid\", \"Paris\", \"Rome\"],\n      \"answer\": \"Paris\"\n    },\n    {\n      \"question\": \"Which planet is known as the Red Planet?\",\n      \"options\": [\"Earth\", \"Mars\", \"Jupiter\", \"Saturn\"],\n      \"answer\": \"Mars\"\n    },\n    {\n      \"question\": \"What is the largest mammal in the world?\",\n      \"options\": [\"Elephant\", \"Blue Whale\", \"Giraffe\", \"Hippopotamus\"],\n      \"answer\": \"Blue Whale\"\n    },\n    {\n      \"question\": \"What is the tallest mountain in the world?\",\n      \"options\": [\"Mount Everest\", \"K2\", \"Kangchenjunga\", \"Lhotse\"],\n      \"answer\": \"Mount Everest\"\n    }\n  ]\n"
                },
              ],
            },
          ],
          ...generationConfig,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error:', (error as any).response ? (error as any).response.data : (error as any).message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
