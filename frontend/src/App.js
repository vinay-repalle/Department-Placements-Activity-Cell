import { NotificationProvider } from './context/NotificationContext';
import Notifications from './pages/Notifications';

// ... existing imports ...

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          {/* ... existing routes ... */}
          <Route path="/notifications" element={<Notifications />} />
          {/* ... existing routes ... */}
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}

// ... rest of the file ... 