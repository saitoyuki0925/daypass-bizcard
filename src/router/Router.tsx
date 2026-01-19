import { memo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CardPage } from '../components/page/CardPage';
import { Register } from '../components/page/Register';
import { Home } from '../components/page/Home';

export const Router = memo(() => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cards/register" element={<Register />} />
      <Route path="/cards/:id" element={<CardPage />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
});
