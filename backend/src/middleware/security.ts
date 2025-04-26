import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';

export const securityMiddleware = [
  // Rate limiting
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
  }),

  // Set security HTTP headers
  helmet(),

  // Data sanitization against XSS
  xss(),

  // Prevent parameter pollution
  hpp()
]; 