import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, AlertCircle, RefreshCw } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthOpen, setIsAuthOpen, authMode, setAuthMode, setUser, showToast, addCustomer } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthOpen) return null;

  const handleSwitchMode = (mode) => {
    setAuthMode(mode);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanName = formData.name.trim();

    if (authMode === 'register') {
      if (!cleanName) {
        setErrorMessage('Nama lengkap wajib diisi.');
        return;
      }
      if (formData.password.length < 6) {
        setErrorMessage('Kata sandi minimal 6 karakter.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage('Konfirmasi kata sandi tidak cocok.');
        return;
      }
      if (!formData.agree) {
        setErrorMessage('Anda wajib menyetujui Syarat & Kebijakan Privasi.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (authMode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password: formData.password })
        }).catch(() => null);

        if (!res) {
          throw new Error('Tidak dapat terhubung ke server backend API.');
        }

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setErrorMessage(data.message || 'Email atau kata sandi tidak sesuai.');
          setIsLoading(false);
          return;
        }

        const loggedUser = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || '',
          avatar: data.user.avatar || '',
          stats: { products: 0, orders: 0, downloads: 0 }
        };

        setUser(loggedUser);
        if (data.token) localStorage.setItem('dyari_auth_token', data.token);

        showToast('Berhasil Masuk', `Selamat datang kembali, ${data.user.name}!`);
        setIsAuthOpen(false);
      } else {
        // Register Mode
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            phone: formData.phone.trim() || '',
            password: formData.password
          })
        }).catch(() => null);

        if (!res) {
          throw new Error('Tidak dapat terhubung ke server backend API.');
        }

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setErrorMessage(data.message || 'Pendaftaran gagal. Email mungkin sudah terdaftar.');
          setIsLoading(false);
          return;
        }

        const newMember = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || '',
          avatar: data.user.avatar || '',
          stats: { products: 0, orders: 0, downloads: 0 }
        };

        setUser(newMember);
        if (data.token) localStorage.setItem('dyari_auth_token', data.token);

        // Integrasikan data member baru ke daftar pelanggan di panel admin
        if (addCustomer) {
          addCustomer({
            id: `CUST-${data.user.id}`,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || '-',
            totalSpent: 0,
            orderCount: 0,
            joinedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: 'Aktif'
          });
        }

        showToast('Pendaftaran Berhasil', 'Akun member Anda telah aktif dan tersimpan di database.');
        setIsAuthOpen(false);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-dyari-lg p-7 sm:p-8 shadow-2xl border border-dyariborder relative animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={() => { setIsAuthOpen(false); setErrorMessage(''); }}
          className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-sage text-warmgray hover:text-forest transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1.5 mb-5">
          <div className="inline-flex items-center justify-center gap-1.5 text-2xl font-heading font-extrabold text-forest">
            <span className="w-7 h-7 rounded-full bg-matcha flex items-center justify-center text-forest text-xs font-black">
              dy
            </span>
            <span>dyari<span className="text-coral">.</span>in</span>
          </div>

          {authMode === 'login' ? (
            <>
              <h3 className="text-xl font-heading font-bold text-forest pt-1">Masuk ke Akun Member 👋</h3>
              <p className="text-xs text-warmgray">Akses produk digital & lisensi aktif milikmu.</p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-heading font-bold text-forest pt-1">Daftar Akun Member Baru ✦</h3>
              <p className="text-xs text-warmgray">Buat akun untuk menyimpan lisensi dan riwayat pembelian.</p>
            </>
          )}
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Dimas Aditya"
                className="w-full bg-[#FAFBF9] rounded-dyari-sm border border-dyariborder px-3.5 py-2.5 text-xs text-forest focus:outline-none focus:border-forest"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-forest mb-1">Alamat Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="nama@email.com"
              className="w-full bg-[#FAFBF9] rounded-dyari-sm border border-dyariborder px-3.5 py-2.5 text-xs text-forest focus:outline-none focus:border-forest"
            />
          </div>

          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">Nomor WhatsApp (Opsional)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className="w-full bg-[#FAFBF9] rounded-dyari-sm border border-dyariborder px-3.5 py-2.5 text-xs text-forest focus:outline-none focus:border-forest"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-forest mb-1">Kata Sandi</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimal 6 karakter"
              className="w-full bg-[#FAFBF9] rounded-dyari-sm border border-dyariborder px-3.5 py-2.5 text-xs text-forest focus:outline-none focus:border-forest"
            />
          </div>

          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">Konfirmasi Kata Sandi</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Ulangi kata sandi"
                className="w-full bg-[#FAFBF9] rounded-dyari-sm border border-dyariborder px-3.5 py-2.5 text-xs text-forest focus:outline-none focus:border-forest"
              />
              
              <label className="flex items-start gap-2.5 mt-3 text-xs text-warmgray cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agree}
                  onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                  className="mt-0.5 accent-forest rounded"
                  required
                />
                <span>Saya menyetujui Syarat & Kebijakan Privasi dyari.in</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-forest text-white hover:bg-forest-light py-2.5 rounded-dyari-sm font-bold text-xs transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>{authMode === 'login' ? 'Masuk ke Akun' : 'Daftar Sekarang'}</span>
            )}
          </button>
        </form>

        {/* Switch Link */}
        <div className="mt-5 text-center text-xs text-warmgray border-t border-[#F0F4F1] pt-4">
          {authMode === 'login' ? (
            <p>
              Belum punya akun member?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('register')}
                className="text-forest font-bold hover:underline cursor-pointer"
              >
                Daftar Akun
              </button>
            </p>
          ) : (
            <p>
              Sudah punya akun member?{' '}
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className="text-forest font-bold hover:underline cursor-pointer"
              >
                Masuk di sini
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
