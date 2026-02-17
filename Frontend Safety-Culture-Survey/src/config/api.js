// API Configuration
// ใช้ relative URL เพื่อให้ทำงานได้ทั้ง dev และ production
const isDevelopment = import.meta.env.DEV;

// Development: ใช้ http://localhost:5000
// Production/Docker: ใช้ relative path (nginx จะ proxy ไป backend)
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000' 
  : '';

export default API_BASE_URL;
