// Configuration centrale de l'API
// En développement local : proxy Vite redirige /api → localhost:5001
// En production (Vercel) : les fonctions serverless sont à /api directement

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export default API_BASE_URL;
