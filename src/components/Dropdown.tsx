import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  id: string;
  label: string;
  sublabel?: string;
  status?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedId?: string;
  onSelect: (id: string) => void;
  placeholder: string;
  disabled?: boolean;
  loading?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedId,
  onSelect,
  placeholder,
  disabled = false,
  loading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(option => option.id === selectedId);

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className={`
          w-full min-w-64 px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm
          transition-all duration-200 ease-in-out
          ${disabled || loading 
            ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
            : 'hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer'
          }
          ${isOpen ? 'border-blue-400 ring-2 ring-blue-500' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {selectedOption ? (
              <div>
                <div className="font-medium text-gray-900 truncate">
                  {selectedOption.label}
                </div>
                {selectedOption.sublabel && (
                  <div className="text-sm text-gray-500 truncate">
                    {selectedOption.sublabel}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {isOpen && !disabled && !loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {option.label}
                    </div>
                    {option.sublabel && (
                      <div className="text-sm text-gray-500 truncate">
                        {option.sublabel}
                      </div>
                    )}
                    {option.status && (
                      <div className="flex items-center mt-1">
                        <span className={`
                          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                          ${option.status === 'active' ? 'bg-green-100 text-green-800' : 
                            option.status === 'running' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'}
                        `}>
                          {option.status}
                        </span>
                      </div>
                    )}
                  </div>
                  {selectedId === option.id && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};