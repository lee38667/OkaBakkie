import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import VendorDetails from './pages/VendorDetails';
import ReservationForm from './pages/ReservationForm';
import MyOrders from './pages/MyOrders';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vendor/:id" element={<VendorDetails />} />
          <Route path="/reserve/:id" element={<ReservationForm />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
