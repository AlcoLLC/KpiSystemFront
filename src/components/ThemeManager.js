import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function ThemeManager({ children }) {
  const isDark = useSelector((state) => state.theme.isDark);

  useEffect(() => {
    const body = document.body;

    if (isDark) {
      body.classList.add('theme-dark');
    } else {
      body.classList.remove('theme-dark');
    }
  }, [isDark]);

  return children;
}

export default ThemeManager;