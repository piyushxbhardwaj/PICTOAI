import { useState } from 'react';
import { useApp } from '../context/useApp';
import { X, Mail, Lock, User, AlertCircle, Loader } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register, playSfx } = useApp();
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    playSfx('click');

    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      playSfx('error');
      return;
    }

    if (mode === 'signup' && !name) {
      setError('Please enter your name.');
      setLoading(false);
      playSfx('error');
      return;
    }

    try {
      let res;
      if (mode === 'login') {
        res = await login(email, password);
      } else {
        res = await register(name, email, password);
      }

      if (res.success) {
        onClose();
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setError(res.message || 'Authentication failed. Please check inputs.');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    playSfx('click');
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cyber-border-glow bg-cyber-dark p-8 shadow-glow-lg">
        
        {/* Glow circle overlay */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl"></div>

        {/* Close Button */}
        <button
          onClick={() => { playSfx('click'); onClose(); }}
          onMouseEnter={() => playSfx('hover')}
          className="absolute top-4 right-4 text-zinc-400 hover:text-primary transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            {mode === 'login' ? 'Access your creative workbench' : 'Join PictoAI to start generating art'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-start space-x-2 rounded-xl bg-red-950/20 border border-red-500/30 p-4 text-sm text-red-400 animate-shake">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-cyber-black border border-zinc-800 focus:border-primary focus:shadow-glow rounded-xl py-3 pl-11 pr-4 text-white placeholder-zinc-600 outline-none transition-all duration-300"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-cyber-black border border-zinc-800 focus:border-primary focus:shadow-glow rounded-xl py-3 pl-11 pr-4 text-white placeholder-zinc-600 outline-none transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cyber-black border border-zinc-800 focus:border-primary focus:shadow-glow rounded-xl py-3 pl-11 pr-4 text-white placeholder-zinc-600 outline-none transition-all duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => playSfx('hover')}
            className="w-full flex justify-center items-center py-3.5 bg-primary hover:bg-primary-hover text-cyber-black font-bold rounded-xl transition-all duration-300 shadow-glow disabled:opacity-50"
          >
            {loading ? (
              <Loader className="h-5 w-5 animate-spin text-cyber-black" />
            ) : (
              mode === 'login' ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>

        {/* Toggle Footer */}
        <div className="mt-8 text-center text-sm text-zinc-500 relative z-10">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
                <button type="button" onClick={toggleMode} className="text-primary hover:underline font-semibold">
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
                <button type="button" onClick={toggleMode} className="text-primary hover:underline font-semibold">
                Sign In
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
