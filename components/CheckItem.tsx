import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface CheckItemProps {
  label: string;
  isChecked: boolean;
  onToggle: () => void;
}

export const CheckItem: React.FC<CheckItemProps> = ({ label, isChecked, onToggle }) => {
  return (
    <div 
      className="flex items-start gap-3 group cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors"
      onClick={onToggle}
    >
      <div className="relative flex-shrink-0 mt-1">
        <motion.div
          className={`w-5 h-5 rounded border-2 ${isChecked ? 'bg-purple-600 border-purple-500' : 'border-slate-500 group-hover:border-purple-400'} flex items-center justify-center transition-colors`}
          whileTap={{ scale: 0.9 }}
        >
          {isChecked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Check size={14} className="text-white" strokeWidth={3} />
            </motion.div>
          )}
        </motion.div>
      </div>
      <span className={`text-sm leading-relaxed select-none transition-all ${isChecked ? 'text-slate-500 line-through decoration-purple-500/50' : 'text-slate-200 group-hover:text-white'}`}>
        {label}
      </span>
    </div>
  );
};