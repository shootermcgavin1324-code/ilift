// Animated Button Components
// Reusable buttons with press feedback and animations

'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const variants = {
  primary: 'bg-yellow-400 text-black border-yellow-500 hover:bg-yellow-300',
  secondary: 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700',
  success: 'bg-green-500 text-white border-green-600 hover:bg-green-400',
  danger: 'bg-red-500 text-white border-red-600 hover:bg-red-400',
};

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-6 py-4 text-lg',
};

export function AnimatedButton({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading,
  icon,
  className = '',
  disabled,
  ...props 
}: AnimatedButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.15 }}
      className={`
        ${variants[variant]} 
        ${sizes[size]}
        font-black rounded-xl border-2 transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
        />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </motion.button>
  );
}

// Pressable Card - gives tactile feedback on press
interface PressableCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function PressableCard({ children, onClick, className = '', disabled }: PressableCardProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      transition={{ duration: 0.15 }}
      onClick={disabled ? undefined : onClick}
      className={`
        bg-gray-900 border border-gray-700 rounded-xl
        transition-colors cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

// Pulse Dot - animated indicator
interface PulseDotProps {
  color?: 'green' | 'yellow' | 'red' | 'blue';
  size?: 'sm' | 'md' | 'lg';
}

const dotColors = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
};

const dotSizes = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-3 h-3',
};

export function PulseDot({ color = 'green', size = 'md' }: PulseDotProps) {
  return (
    <span className={`relative flex ${dotSizes[size]}`}>
      <span className={`${dotColors[color]} ${dotSizes[size]} rounded-full animate-ping`} />
      <span className={`${dotColors[color]} ${dotSizes[size]} rounded-full absolute inline-flex`} />
    </span>
  );
}

// Number Counter - animates numerical changes
interface NumberCounterProps {
  value: number;
  previousValue?: number;
  duration?: number;
}

export function NumberCounter({ value, previousValue, duration = 0.5 }: NumberCounterProps) {
  return (
    <motion.span
      key={value}
      initial={previousValue !== undefined ? { opacity: 0, y: -10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration }}
    >
      {value.toLocaleString()}
    </motion.span>
  );
}