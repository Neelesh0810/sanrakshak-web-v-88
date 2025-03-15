
import React from 'react';

export type ResourceType = 'need' | 'offer';

interface RequestTypeSelectorProps {
  type: ResourceType;
  setType: (type: ResourceType) => void;
}

const RequestTypeSelector: React.FC<RequestTypeSelectorProps> = ({ type, setType }) => {
  return (
    <div className="flex">
      <button
        type="button"
        onClick={() => setType('need')}
        className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-white text-black"
      >
        I Need Help
      </button>
    </div>
  );
};

export default RequestTypeSelector;
