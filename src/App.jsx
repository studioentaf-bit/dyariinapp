import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AuthModal } from './components/AuthModal';
import { InstantCheckoutModal } from './components/InstantCheckoutModal';

// Views
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CheckoutView } from './views/CheckoutView';
import { OrderSuccessView } from './views/OrderSuccessView';
import { UserDashboardView } from './views/UserDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { PublicInvoiceView } from './views/PublicInvoiceView';
import { StoryGeneratorView } from './views/StoryGeneratorView';
import { LicensesView } from './views/LicensesView';
import { AboutView } from './views/AboutView';

const MainLayout = () => {
  const { currentView } = useStore();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'licenses':
        return <LicensesView />;
      case 'about':
        return <AboutView />;
      case 'product-detail':
        return <ProductDetailView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order-success':
        return <OrderSuccessView />;
      case 'dashboard':
        return <UserDashboardView />;
      case 'admin':
        return <AdminDashboardView />;
      case 'invoice':
        return <PublicInvoiceView />;
      case 'story-generator':
        return <StoryGeneratorView />;
      default:
        return <HomeView />;
    }
  };

  const showFooter = ['home', 'shop', 'licenses', 'about', 'product-detail'].includes(currentView);
  const showNav = currentView !== 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-cream text-forest font-sans selection:bg-matcha selection:text-forest">
      {showNav && <Navbar />}

      <main className={`flex-1 ${currentView === 'admin' ? 'h-screen overflow-hidden' : (currentView === 'story-generator' ? 'h-[calc(100vh-4.5rem)] sm:h-[calc(100vh-5rem)] overflow-hidden' : 'pb-16 md:pb-0')}`}>
        {renderView()}
      </main>

      {showFooter && <Footer />}

      {/* Global Interactive Overlays */}
      <InstantCheckoutModal />
      <CartDrawer />
      <AuthModal />
      <Toast />
      {showNav && currentView !== 'story-generator' && <MobileBottomNav />}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
