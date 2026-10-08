import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma.js'; // Note the .js extension for ESM

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ success: false, message: 'Access denied' });
    return;
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ success: false, message: 'Invalid token' });
      return;
    }
    (req as any).user = user;
    next();
  });
};

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'HealthCopilot AI Backend is running' });
});

// Authentication Routes
app.post('/api/auth/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already in use' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            firstName: name.split(' ')[0] || '',
            lastName: name.split(' ').slice(1).join(' ') || ''
          }
        }
      }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, email: user.email, name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { profile: true } 
    });
    
    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const name = user.profile ? `${user.profile.firstName} ${user.profile.lastName}`.trim() : 'User';
    
    res.json({ success: true, token, user: { id: user.id, email: user.email, name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Sleep Tracking Routes
app.post('/api/sleep', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { duration, quality } = req.body;
    const userId = (req as any).user.userId;

    const sleepRecord = await prisma.sleepRecord.create({
      data: {
        userId,
        duration: parseFloat(duration),
        quality
      }
    });
    
    res.json({ success: true, data: sleepRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/sleep', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const records = await prisma.sleepRecord.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 7
    });
    
    res.json({ success: true, data: records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Symptom Tracking Routes
app.post('/api/symptoms', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, severity, duration, notes } = req.body;
    const userId = (req as any).user.userId;

    const symptomRecord = await prisma.symptom.create({
      data: {
        userId,
        name,
        severity,
        duration,
        notes
      }
    });
    
    res.json({ success: true, data: symptomRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/symptoms', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const records = await prisma.symptom.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 20
    });
    
    res.json({ success: true, data: records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Activity Tracking Routes
app.post('/api/activity', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { steps, calories } = req.body;
    const userId = (req as any).user.userId;
    const record = await prisma.dailyActivity.create({
      data: { userId, steps: parseInt(steps), calories: parseInt(calories) }
    });
    res.json({ success: true, data: record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/activity', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const records = await prisma.dailyActivity.findMany({
      where: { userId }, orderBy: { date: 'desc' }, take: 14
    });
    res.json({ success: true, data: records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Nutrition Tracking Routes
app.post('/api/nutrition', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { calories, protein, carbs, fat } = req.body;
    const userId = (req as any).user.userId;
    const record = await prisma.nutritionRecord.create({
      data: { 
        userId, 
        calories: calories ? parseInt(calories) : null,
        protein: protein ? parseFloat(protein) : null,
        carbs: carbs ? parseFloat(carbs) : null,
        fat: fat ? parseFloat(fat) : null,
      }
    });
    res.json({ success: true, data: record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/nutrition', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const records = await prisma.nutritionRecord.findMany({
      where: { userId }, orderBy: { date: 'desc' }, take: 14
    });
    res.json({ success: true, data: records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Mood Tracking Routes
app.post('/api/mood', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { mood, notes } = req.body;
    const userId = (req as any).user.userId;
    const record = await prisma.moodRecord.create({
      data: { userId, mood, notes }
    });
    res.json({ success: true, data: record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/mood', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const records = await prisma.moodRecord.findMany({
      where: { userId }, orderBy: { date: 'desc' }, take: 14
    });
    res.json({ success: true, data: records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Health Records Routes
app.post('/api/records', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, type, fileUrl } = req.body;
    const userId = (req as any).user.userId;
    const record = await prisma.healthRecord.create({
      data: { userId, title, type, fileUrl: fileUrl || '' }
    });
    res.json({ success: true, data: record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/records', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const records = await prisma.healthRecord.findMany({
      where: { userId }, orderBy: { date: 'desc' }, take: 20
    });
    res.json({ success: true, data: records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Goals Tracking Routes
app.post('/api/goals', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, target, current, type, endDate } = req.body;
    const userId = (req as any).user.userId;
    const record = await prisma.healthGoal.create({
      data: { 
        userId, title, target, type, current: current || '',
        startDate: new Date(),
        endDate: endDate ? new Date(endDate) : null
      }
    });
    res.json({ success: true, data: record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/goals', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const records = await prisma.healthGoal.findMany({
      where: { userId }, orderBy: { startDate: 'desc' }
    });
    res.json({ success: true, data: records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Doctor Prep / Appointments Routes
app.post('/api/appointments', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { doctorName, type, date, notes } = req.body;
    const userId = (req as any).user.userId;
    const record = await prisma.appointment.create({
      data: { userId, doctorName, type, notes, date: new Date(date) }
    });
    res.json({ success: true, data: record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/appointments', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const records = await prisma.appointment.findMany({
      where: { userId }, orderBy: { date: 'asc' }
    });
    res.json({ success: true, data: records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Emergency Contacts Routes
app.post('/api/emergency', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, relationship, phone } = req.body;
    const userId = (req as any).user.userId;
    const record = await prisma.emergencyContact.create({
      data: { userId, name, relationship, phone }
    });
    res.json({ success: true, data: record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/emergency', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const records = await prisma.emergencyContact.findMany({
      where: { userId }
    });
    res.json({ success: true, data: records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Medications Routes
app.post('/api/medications', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, dosage, frequency } = req.body;
    const userId = (req as any).user.userId;
    const record = await prisma.medication.create({
      data: { userId, name, dosage, frequency, startDate: new Date() }
    });
    res.json({ success: true, data: record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/medications', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const records = await prisma.medication.findMany({
      where: { userId }, orderBy: { startDate: 'desc' }
    });
    res.json({ success: true, data: records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// AI Chat Routes
app.post('/api/chat', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    const userId = (req as any).user.userId;
    
    let aiResponseText = "I am having trouble reaching the AI service right now. Please try again.";

    try {
      // Proxy the request to the external AI agent
      const params = new URLSearchParams();
      params.append('message', message);
      
      const aiRes = await fetch('https://ai-agent-v01.onrender.com/chat', {
        method: 'POST',
        body: params
      });

      if (aiRes.ok) {
        const textData = await aiRes.text();
        try {
          const aiJson = JSON.parse(textData);
          aiResponseText = aiJson.response || aiJson.message || aiJson.reply || aiJson.answer || textData;
        } catch(e) {
          aiResponseText = textData;
        }
      } else {
        console.error("External AI Service returned status:", aiRes.status);
      }
    } catch (e) {
      console.error("External AI Service Error:", e);
    }
    
    res.json({ 
      success: true, 
      data: {
        userMessage: { role: 'user', content: message, createdAt: new Date() },
        aiMessage: { role: 'assistant', content: aiResponseText, createdAt: new Date() }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
