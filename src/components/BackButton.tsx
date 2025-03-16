
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '../context/ThemeProvider';

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const handleGoBack = () => {
    const returnTo = searchParams.get('returnTo');
    if (returnTo) {
      navigate(`/${returnTo}`);
    } else if (window.history.length > 2) {
      // Only go back in history if there's somewhere to go back to
      navigate(-1);
    } else {
      // If no history or we're at the start, go to landing page
      navigate('/');
    }
  };
  
  return (
    <button
      onClick={handleGoBack}
      className={cn(
        'flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors',
        isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10',
        className
      )}
      aria-label="Go back"
    >
      <ArrowLeft size={16} />
      <span className="text-sm font-medium">Back</span>
    </button>
  );
};

export default BackButton;
