import OpenAI from 'openai';

export type MulterFile = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeFoodText(text: string): Promise<{
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
} | null> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content:
          'Analyze the food described in the following text and estimate its nutritional content. ' +
          `Text: "${text}". ` +
          'Return the result as a compact JSON object with the following keys: name (short meal name), calories (kcal), protein (g), carbs (g), fats (g). ' +
          'Example: {"name": "Chicken Salad", "calories": 420, "protein": 32, "carbs": 18, "fats": 12}. ' +
          'Do not add any explanation, only the JSON.',
      },
    ],
  });

  const content = response.choices[0].message.content ?? '';
  const json = content.match(/\{.*\}/s)?.[0];
  return json ? JSON.parse(json) : null;
}

export async function analyzeFoodImage(prompt?: string, imageFile?: MulterFile) {
  if (!imageFile) throw new Error('No image file provided');
  const base64 = imageFile.buffer.toString('base64');
  const mimeType = imageFile.mimetype as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
  console.log('Prompt for AI analysis:', prompt);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${base64}` },
          },
          {
            type: 'text',
            text:
              'Analyze the food in the image and estimate its nutritional content.' +
              (prompt
                ? ` The user provided the following additional context, use it to improve your estimate: "${prompt}".`
                : '') +
              ' Return the result as a compact JSON object with the following keys: name (short meal name), calories (kcal), protein (g), carbs (g), fats (g). Example: {"name": "Chicken Salad", "calories": 420, "protein": 32, "carbs": 18, "fats": 12}. Do not add any explanation, only the JSON.',
          },
        ],
      },
    ],
  });

  const content = response.choices[0].message.content ?? '';
  const json = content.match(/\{.*\}/s)?.[0];
  return json ? JSON.parse(json) : null;
}

export async function aiCoach(question: string, history: { isUser: boolean; message: string }[]) {
  console.log('Received question for AI Coach:', question);
  console.log('Received history for AI Coach:', history);
  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    {
      role: 'system',
      content:
        'You are an AI Coach for Fitness and Sports. Answer only questions related to athletic topics like training, nutrition, motivation, and health. If the question is not athletic, politely respond that you only answer athletic questions. You can respond in English or German, but primarily in English. Answer concisely and informatively and shortly.',
    },
    ...history.map((h) => ({
      role: (h.isUser ? 'user' : 'assistant') as 'user' | 'assistant',
      content: h.message,
    })),
    question ? { role: 'user', content: question } : null,
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
  });

  return response.choices[0].message.content ?? '';
}

export async function speechToText(audioBuffer: Buffer, mimeType: string): Promise<string> {
  const { toFile } = await import('openai');
  // Strip codec parameters, e.g. "audio/webm;codecs=opus" → "audio/webm"
  const baseType = mimeType.split(';')[0].trim();
  const ext = baseType.includes('webm')
    ? 'webm'
    : baseType.includes('ogg')
      ? 'ogg'
      : baseType.includes('mp4') || baseType.includes('m4a')
        ? 'mp4'
        : baseType.includes('mpeg') || baseType.includes('mp3')
          ? 'mp3'
          : baseType.includes('wav')
            ? 'wav'
            : 'webm';
  const file = await toFile(audioBuffer, `audio.${ext}`, { type: baseType });
  const transcription = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
  });
  return transcription.text;
}
