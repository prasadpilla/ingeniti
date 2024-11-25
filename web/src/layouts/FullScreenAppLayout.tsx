import { Outlet } from 'react-router-dom';
import BaseAppLayout from './BaseAppLayout';

const FullScreenAppLayout: React.FC = () => {
  return (
    <BaseAppLayout>
      <div className="flex-grow overflow-auto">
        <div className="w-full mx-auto px-2 pt-2">
          <Outlet />
        </div>
      </div>
    </BaseAppLayout>
  );
};

export default FullScreenAppLayout;
