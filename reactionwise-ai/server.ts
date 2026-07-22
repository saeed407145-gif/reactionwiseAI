import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini AI instance
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!apiKey,
    timestamp: new Date().toISOString(),
  });
});

// AI Tutor Chat & Mechanism Analysis API
app.post('/api/gemini/tutor', async (req, res) => {
  try {
    const { prompt, reactionContext } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server. Falling back to offline engine.',
        offlineFallback: true,
      });
      return;
    }

    const systemInstruction = `You are ReactionWise AI, an expert Organic Chemistry Professor and Mechanism Tutor.
Your goal is to provide clear, pedagogically sound explanations of organic chemistry reactions, mechanisms, electron arrow pushing, regioselectivity, stereochemistry, pKa trends, and exam pitfalls.
Return your answer in structured JSON format with the following schema:
{
  "title": "Clear concise topic header",
  "keyConcept": "Core principle (e.g. Nucleophilic Addition, Carbocation Rearrangement, Pericyclic [4+2])",
  "summary": "1-2 sentence overview answering the prompt directly.",
  "stepByStep": [
    {
      "step": 1,
      "title": "Short title of step 1",
      "text": "Detailed explanation of reaction step 1.",
      "arrowMovement": "Curved arrow description (e.g., Lone pair on O attacks carbonyl C, C=O pi bond opens onto O)"
    }
  ],
  "examTips": ["Exam tip or common student mistake 1", "Tip 2"],
  "suggestedFollowUps": ["Follow-up question 1", "Follow-up question 2"]
}
Ensure the JSON is strictly valid without markdown surrounding syntax if possible, or clean markdown JSON block.`;

    const userPrompt = reactionContext
      ? `Reaction context: ${JSON.stringify(reactionContext)}\n\nUser Question: ${prompt}`
      : `User Question: ${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text || '';
    let parsedData = null;

    try {
      parsedData = JSON.parse(text);
    } catch {
      // If parsing fails, wrap in structure
      parsedData = {
        title: 'AI Chemistry Explanation',
        keyConcept: 'Organic Chemistry Explanation',
        summary: text,
        stepByStep: [],
        examTips: ['Verify electron pushing arrows for octet compliance.'],
        suggestedFollowUps: ['Can you show the stereochemistry?', 'What happens if we change the solvent?'],
      };
    }

    res.json({ success: true, data: parsedData });
  } catch (error: unknown) {
    console.error('Gemini Tutor Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    res.status(500).json({ error: message, success: false });
  }
});

// AI Reaction Predictor API
app.post('/api/gemini/predict', async (req, res) => {
  try {
    const { reactants, reagents, conditions } = req.body;
    if (!reactants) {
      res.status(400).json({ error: 'Reactants are required' });
      return;
    }

    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
        offlineFallback: true,
      });
      return;
    }

    const systemInstruction = `You are ReactionWise AI Reaction Predictor.
Given starting organic reactants, reagents, and reaction conditions, predict the major product, minor products (if any), mechanism class, and step-by-step electron movement.
Respond strictly in JSON format with this structure:
{
  "majorProduct": "IUPAC name and clear chemical formula/structure representation of major product",
  "reactionType": "Name of reaction or reaction type (e.g. Swern Oxidation, Grignard Addition, E2 Elimination)",
  "regioselectivity": "Markovnikov / Anti-Markovnikov / Zaitsev / Hofmann / Endoselectivity notes",
  "stereochemistry": "Syn / Anti addition, Inversion of configuration, Racemic mixture, Enantioselective, etc.",
  "drivingForce": "Thermodynamic or kinetic driving force",
  "byproducts": "List of minor or inorganic byproducts",
  "mechanismSteps": [
    {
      "step": 1,
      "description": "Step 1 description",
      "electronArrow": "Curved arrow movement"
    }
  ],
  "explanation": "Comprehensive paragraph explaining why this product forms over alternative pathways."
}`;

    const prompt = `Reactants: ${reactants}\nReagents: ${reagents || 'None specified'}\nConditions: ${conditions || 'Standard'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const text = response.text || '';
    let parsedData = null;
    try {
      parsedData = JSON.parse(text);
    } catch {
      parsedData = {
        majorProduct: 'Predicted Product',
        reactionType: 'Organic Transformation',
        regioselectivity: 'Standard selectivity',
        stereochemistry: 'Stereospecific / Regiospecific as dictated by mechanism',
        drivingForce: 'Energetic favorability',
        byproducts: 'Inorganic salts / water',
        mechanismSteps: [],
        explanation: text,
      };
    }

    res.json({ success: true, data: parsedData });
  } catch (error: unknown) {
    console.error('Gemini Predictor Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    res.status(500).json({ error: message, success: false });
  }
});

// Vite middleware for dev / static serving for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
