import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutService } from '../services/logoutService';

export function useHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout(): void {
    logoutService(navigate);
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
