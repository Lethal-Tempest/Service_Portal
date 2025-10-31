import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Briefcase, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';

const HeaderLoginDropdown = () => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const go = (role) => {
    setOpen(false);
    navigate({ pathname: '/login', search: `?role=${role}` });
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative">
      <Button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="login-role-menu"
      >
        <LogIn className="w-4 h-4" />
        Login
        <ChevronDown className="w-4 h-4" />
      </Button>

      {open && (
        <div
          id="login-role-menu"
          ref={menuRef}
          role="menu"
          aria-label="Choose role to login"
          className="absolute right-0 mt-2 w-48 rounded-lg border bg-white shadow-lg z-50 p-1"
        >
          <button
            role="menuitem"
            onClick={() => go('customer')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-left"
          >
            <User className="w-4 h-4" />
            Customer login
          </button>
          <button
            role="menuitem"
            onClick={() => go('worker')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-left"
          >
            <Briefcase className="w-4 h-4" />
            Worker login
          </button>
        </div>
      )}
    </div>
  );
};

export default HeaderLoginDropdown;
