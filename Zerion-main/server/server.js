import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { ruleBasedExtraction } from '../src/lib/ruleEngine.js'; // Optional: Use shared logic

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/**
 * Endpoint: POST /analyze-transcript
 * Purpose: Process raw text and return structured action items.
 */
app.post('/analyze-transcript', async (req, res) => {
  const { transcript, mode = 'ai' } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: 'Transcript is required' });
  }

  console.log(`[Backend] Processing transcript in ${mode} mode...`);

  // Option 1: Node + Express Gateway Logic
  try {
    if (mode === 'rules') {
      // Use local rule engine (Phase 1)
      const actionItems = ruleBasedExtraction(transcript);
      return res.json({ actionItems });
    }

    // Option 1 (Python Bridge): Calling Python ML engine via child_process
    // In a real scenario, you'd call: python ml_engine.py "transcript text"
    // For this design, we simulate the structure:
    exec('python ml/ml_engine.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`Exec error: ${error}`);
        // Fallback to Rule Engine if Python fails in dev
        return res.json({ actionItems: ruleBasedExtraction(transcript), source: 'fallback-rules' });
      }
      try {
        const result = JSON.parse(stdout);
        res.json({ actionItems: result.actionItems });
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse ML response' });
      }
    });

  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 [Node/Express API] server running at http://localhost:${PORT}`);
});
