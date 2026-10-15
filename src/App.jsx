import React, { Suspense, lazy } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AuthModal } from './components/AuthModal';
import { InstantCheckoutModal } from './components/InstantCheckoutModal';

// Code-split Views via React.lazy for high performance & instant initial load
const HomeView = lazy(() => import('./views/HomeView').then(m => ({ default: m.HomeView })));
const ShopView = lazy(() => import('./views/ShopView').then(m => ({ default: m.ShopView })));
const ProductDetailView = lazy(() => import('./views/ProductDetailView').then(m => ({ default: m.ProductDetailView })));
const CheckoutView = lazy(() => import('./views/CheckoutView').then(m => ({ default: m.CheckoutView })));
const OrderSuccessView = lazy(() => import('./views/OrderSuccessView').then(m => ({ default: m.OrderSuccessView })));
const UserDashboardView = lazy(() => import('./views/UserDashboardView').then(m => ({ default: m.UserDashboardView })));
const AdminDashboardView = lazy(() => import('./views/AdminDashboardView').then(m => ({ default: m.AdminDashboardView })));
const PublicInvoiceView = lazy(() => import('./views/PublicInvoiceView').then(m => ({ default: m.PublicInvoiceView })));
const StoryGeneratorView = lazy(() => import('./views/StoryGeneratorView').then(m => ({ default: m.StoryGeneratorView })));
const LicensesView = lazy(() => import('./views/LicensesView').then(m => ({ default: m.LicensesView })));
const AboutView = lazy(() => import('./views/AboutView').then(m => ({ default: m.AboutView })));
const DownloadAppView = lazy(() => import('./views/DownloadAppView').then(m => ({ default: m.DownloadAppView })));

// Loading spinner fallback with Dyari aesthetic
const ViewLoadingFallback = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 p-8 animate-fadeIn">
    <div className="w-9 h-9 border-3 border-forest/20 border-t-forest rounded-full animate-spin"></div>
    <p className="text-xs font-semibold text-warmgray tracking-wide">Memuat halaman...</p>
  </div>
);

const MainLayout = () => {
  const { currentView } = useStore();

  const renderView = () => {
    return (
      <Suspense fallback={<ViewLoadingFallback />}>
        {(() => {
          switch (currentView) {
            case 'home':
              return <HomeView />;
            case 'shop':
              return <ShopView />;
            case 'licenses':
              return <LicensesView />;
            case 'download':
              return <DownloadAppView />;
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
        })()}
      </Suspense>
    );
  };

  const showFooter = ['home', 'shop', 'licenses', 'download', 'about', 'product-detail'].includes(currentView);
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
