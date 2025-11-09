import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
export const getNewsArticles = () => api.get('/news');
export const createNewsArticle = (data) => api.post('/news', data);
export const updateNewsArticle = (id, data) => api.put(`/news/${id}`, data);
export const deleteNewsArticle = (id) => api.delete(`/news/${id}`);

export default api
