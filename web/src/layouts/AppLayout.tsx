import { Outlet } from 'react-router-dom';
import BaseAppLayout from './BaseAppLayout';

const AppLayout: React.FC = () => {
  return (
    <BaseAppLayout>
      <div className="flex-grow overflow-auto">
        <div className="max-w-screen-lg w-full mx-auto pt-5 sm:px-5">
          <Outlet />
        </div>
      </div>
    </BaseAppLayout>
  );
};

export default AppLayout;
