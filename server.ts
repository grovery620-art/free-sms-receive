import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Types ---
interface SMS {
  id: string;
  from: string;
  text: string;
  timestamp: number;
}

interface PhoneNumber {
  id: string;
  number: string;
  country: string;
  countryCode: string;
  smsCount: number;
  expiresAt: number;
  messages: SMS[];
}

// --- Mock Data & Simulation ---
let numbers: PhoneNumber[] = [
  { id: '1', number: '+1 202 555 0123', country: 'USA', countryCode: 'US', smsCount: 12, expiresAt: Date.now() + 3600000, messages: [] },
  { id: '2', number: '+44 7700 900123', country: 'UK', countryCode: 'GB', smsCount: 8, expiresAt: Date.now() + 1800000, messages: [] },
  { id: '3', number: '+1 416 555 0199', country: 'Canada', countryCode: 'CA', smsCount: 5, expiresAt: Date.now() + 2400000, messages: [] },
  { id: '4', number: '+91 98765 43210', country: 'India', countryCode: 'IN', smsCount: 25, expiresAt: Date.now() + 5400000, messages: [] },
  { id: '5', number: '+49 151 23456789', country: 'Germany', countryCode: 'DE', smsCount: 3, expiresAt: Date.now() + 1200000, messages: [] },
  { id: '6', number: '+52 55 1234 5678', country: 'Mexico', countryCode: 'MX', smsCount: 1, expiresAt: Date.now() + 4200000, messages: [] },
  { id: '7', number: '+61 412 345 678', country: 'Australia', countryCode: 'AU', smsCount: 7, expiresAt: Date.now() + 3000000, messages: [] },
  { id: '8', number: '+591 71234567', country: 'Bolivia', countryCode: 'BO', smsCount: 2, expiresAt: Date.now() + 3600000, messages: [] },
];

const mockSenders = ['Google', 'WhatsApp', 'Telegram', 'Netflix', 'Amazon', 'Microsoft', 'Uber', 'Airbnb', 'PayPal', 'Twitter'];
const mockTexts = [
  'Your verification code is: 482910',
  'G-928374 is your Google verification code.',
  'WhatsApp code: 123-456. Do not share this code.',
  'Your Telegram code: 99281',
  'Your Netflix verification code is 102938. It expires in 10 minutes.',
  'Use 554433 to verify your Amazon account.',
  'Microsoft: Use 1029 for account security.',
  'Your Uber code is 7721. Welcome back!',
  'PayPal: 002938 is your security code. Don\'t share it.',
  'Your Twitter verification code is 882716.'
];

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: '*' }
  });

  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use('/api/', limiter);

  // --- API Routes ---
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/numbers', (req, res) => {
    res.json(numbers.map(({ messages, ...rest }) => rest));
  });

  app.get('/api/numbers/:id', (req, res) => {
    const number = numbers.find(n => n.id === req.params.id);
    if (!number) return res.status(404).json({ error: 'Number not found' });
    res.json(number);
  });

  // Webhook Placeholder for real providers
  app.post('/webhook/sms', (req, res) => {
    const { to, from, text } = req.body;
    const number = numbers.find(n => n.number.replace(/\s/g, '') === to.replace(/\s/g, ''));
    
    if (number) {
      const newSMS: SMS = {
        id: Math.random().toString(36).substr(2, 9),
        from,
        text,
        timestamp: Date.now()
      };
      number.messages.unshift(newSMS);
      number.smsCount++;
      io.to(number.id).emit('new-sms', newSMS);
    }
    
    res.status(200).send('OK');
  });

  // --- Simulation Logic ---
  setInterval(() => {
    const randomNum = numbers[Math.floor(Math.random() * numbers.length)];
    const newSMS: SMS = {
      id: Math.random().toString(36).substr(2, 9),
      from: mockSenders[Math.floor(Math.random() * mockSenders.length)],
      text: mockTexts[Math.floor(Math.random() * mockTexts.length)],
      timestamp: Date.now()
    };
    
    randomNum.messages.unshift(newSMS);
    randomNum.smsCount++;
    
    // Limit to last 50 messages
    if (randomNum.messages.length > 50) {
      randomNum.messages = randomNum.messages.slice(0, 50);
    }

    io.to(randomNum.id).emit('new-sms', newSMS);
  }, 15000); // New SMS every 15 seconds for simulation

  // Cron job simulation: Refresh numbers every hour
  setInterval(() => {
    const now = Date.now();
    numbers.forEach(n => {
      if (n.expiresAt < now) {
        n.expiresAt = now + 3600000; // Extend for demo
        n.messages = [];
        n.smsCount = 0;
      }
    });
  }, 60000);

  // --- Socket.io ---
  io.on('connection', (socket) => {
    socket.on('join-number', (numberId) => {
      socket.join(numberId);
    });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
