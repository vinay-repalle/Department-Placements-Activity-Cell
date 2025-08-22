import NotificationBell from './NotificationBell';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* ... existing navbar content ... */}
          
          <div className="flex items-center">
            <NotificationBell />
            {/* ... existing user menu ... */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 