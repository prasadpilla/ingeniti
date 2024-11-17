import React, { ReactNode, useEffect, useRef } from 'react';

interface CustomDropdownProps {
  trigger: ReactNode;
  items: { id: string; name: string; selected: boolean }[]; // Updated to include selection state
  onItemToggle: (id: string) => void; // Function to handle item selection
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ trigger, items, onItemToggle, isOpen, onOpenChange }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      onOpenChange(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative w-full border-none" ref={dropdownRef}>
      <div
        onClick={(e) => {
          e.preventDefault();
          onOpenChange(!isOpen);
        }}
      >
        {trigger}
      </div>
      {isOpen && (
        <div className="absolute top-full mt-2 bg-background border rounded-md text-sm shadow-lg z-10 w-full left-1/2 transform -translate-x-1/2 max-h-60 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="cursor-pointer hover:bg-accent p-2 m-[0.5] flex items-center"
              onClick={() => onItemToggle(item.id)} // Toggle selection on click
            >
              <input type="checkbox" checked={item.selected} readOnly className="mr-2" />
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
