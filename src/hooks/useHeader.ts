import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Utils/api';

export function useHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout(): void {
    api.post('/auth/logout', {}, { withCredentials: true }).then(() => navigate('/login'));
    setMenuOpen(false);
  }

  function closeMenu(): void {
    setMenuOpen(false);
  }

  function toggleMenu(): void {
    setMenuOpen((prev) => !prev);
  }

  return { menuOpen, toggleMenu, closeMenu, handleLogout };
}
