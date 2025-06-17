import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000',  // сюда потом вставишь реальный адрес бекенда
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
