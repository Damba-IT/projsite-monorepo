// Direct entry point for Vercel
// This is a special file that Vercel will recognize for deployment

import { app } from './dist/index.js';

// Export a handler function that Vercel can use
export default async function handler(req, res) {
  try {
    // Convert Node.js req/res to Web standard Request/Response
    const response = await app.fetch(req);
    
    // Copy status
    res.statusCode = response.status;
    
    // Copy headers
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }
    
    // Send body
    const body = await response.arrayBuffer();
    res.end(Buffer.from(body));
  } catch (error) {
    console.error('Error handling request:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error', message: error.message }));
  }
} 