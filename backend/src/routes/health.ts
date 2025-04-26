import { Router } from 'express';
import { sequelize } from '../config/database';

const router = Router();

router.get('/', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: 'success',
      message: 'Server is healthy',
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server is unhealthy',
      database: 'disconnected'
    });
  }
});

export default router; 