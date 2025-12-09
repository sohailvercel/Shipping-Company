import React from 'react';

interface AnimatedBackgroundProps {
  type: 'waves' | 'particles' | 'gradient' | 'geometric';
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  type,
  className = ''
}) => {
  const getBackgroundStyle = () => {
    switch (type) {
      case 'waves':
        return {
          background: 'linear-gradient(-45deg, #1e3a8a, #3b82f6, #1e40af, #1d4ed8)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite'
        };
      case 'particles':
        return {
          background: 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1e40af 0%, transparent 50%), radial-gradient(circle at 40% 80%, #1d4ed8 0%, transparent 50%)',
          animation: 'particleFloat 20s ease-in-out infinite'
        };
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          animation: 'gradientPulse 8s ease-in-out infinite'
        };
      case 'geometric':
        return {
          background: 'linear-gradient(45deg, #1e3a8a, #3b82f6, #1e40af)',
          backgroundSize: '300% 300%',
          animation: 'geometricShift 12s ease infinite'
        };
      default:
        return {};
    }
  };

  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={getBackgroundStyle()}
    >
      {/* CSS Animations */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
          75% { transform: translateY(-30px) rotate(270deg); }
        }
        
        @keyframes gradientPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes geometricShift {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
