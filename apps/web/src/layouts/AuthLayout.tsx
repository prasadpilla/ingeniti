import { Link, Outlet } from 'react-router-dom';

const RootLayout: React.FC = () => {
  return (
    <main className="flex h-screen">
      <div className={'flex flex-col flex-grow max-w-full'}>
        <div className="flex flex-col border-t">
          <header className="flex h-16 shrink-0 items-center border-b px-4 md:px-6 sticky top-0  z-50">
            <Link className="flex items-center gap-1" to="#">
              <img src="/logo.jpeg" alt="Logo" className="h-6 w-6 rounded-md" />
              <span className="font-semibold">inGeniti</span>
            </Link>
          </header>
        </div>
        <div className="overflow-auto h-full">
          <div className="pt-5 w-full md:w-3/4 lg:w-2/3 sm:w-11/12 mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
};

export default RootLayout;
