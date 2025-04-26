import { Router } from 'express';
import { runCode } from '../controllers/code';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/run', protect, runCode);

export default router; 