
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '../context/ThemeProvider';

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const handleGoBack = () => {
    navigate(-1);
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
