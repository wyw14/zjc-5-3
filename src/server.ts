import express from 'express';
import path from 'path';
import { generateQuestions, GameMode } from './questions';

const app = express();
const PORT = 5003;

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/questions', (req, res) => {
  const mode = (req.query.mode as GameMode) || 'addsub';
  const validModes: GameMode[] = ['addsub', 'mixed', 'multiply'];
  const finalMode = validModes.includes(mode) ? mode : 'addsub';
  const questions = generateQuestions(50, finalMode);
  res.json({ questions, mode: finalMode });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Game server running at http://localhost:${PORT}`);
});
