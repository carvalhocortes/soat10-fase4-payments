import express from 'express';
import webhooksRoutes from '@infrastructure/web/routes/webhooks.routes';

const router = express.Router();

// Health check
router.get('/health', async (req, res) => {
  res.status(200).json({
    status: 'OK',
  });
});

// Main routes
router.use('/webhooks', webhooksRoutes);

export default router;
