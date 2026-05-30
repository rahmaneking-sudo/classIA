// Configuration centrale de l'API
// - En développement local : proxy Vite redirige /api → localhost:5001
// - En production (Vercel experimentalServices) : le backend est à /_/backend
//   donc les appels API vont vers /_/backend/api/...

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/_/backend/api' : '/api');

export default API_BASE_URL;
