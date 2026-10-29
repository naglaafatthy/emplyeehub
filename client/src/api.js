import axios from 'axios';
 
// One axios "copy" for the whole app: every request starts with this address.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});
 
// GET http://localhost:5000/api/employees
export async function getEmployees() {
  const res = await api.get('/employees');
  return res.data; // { items: [...], total, page, pages }
}

