import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mascot } from '@/components/Mascot';
import { User } from '@/types';
import { storageService } from '@/services/storageService';
import loginPgGif from '@/assets/loginpg.gif';
import { Check, X } from 'lucide-react';

interface AuthViewProps {
  onLogin: (user: User) => void;
}

export const AuthView = ({ onLogin }: AuthViewProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Password validation helpers
  const passwordChecks = {
    minLength: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(check => check);

  // Username validation helpers
  const usernameChecks = {
    minLength: username.length >= 5,
    validChars: /^[a-zA-Z_]*$/.test(username),
  };

  const isUsernameValid = Object.values(usernameChecks).every(check => check) || username === '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !username)) {
      setError('Please fill in all fields');
      return;
    }

    // Username validation for sign up
    if (!isLogin) {
      if (username.length < 5) {
        setError('Username must be at least 5 characters');
        return;
      }
      // Username should only contain letters and underscores
      if (!/^[a-zA-Z_]+$/.test(username)) {
        setError('Username can only contain letters and underscores');
        return;
      }
    }

    // Password validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    // Password must contain at least 1 letter, 1 number, and 1 special character
    if (!/[a-zA-Z]/.test(password)) {
      setError('Password must contain at least 1 letter');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least 1 number');
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      setError('Password must contain at least 1 special character (!@#$%^&* etc)');
      return;
    }

    // Create/login user (simplified - just uses local storage)
    const user: User = {
      id: crypto.randomUUID(),
      username: isLogin ? email.split('@')[0] : username,
      email,
      createdAt: new Date().toISOString(),
    };

    storageService.setUser(user);
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo & Mascot */}
        <div className="text-center mb-8">
          <Mascot mood="happy" size="xl" image={loginPgGif} />
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black text-primary mt-4"
          >
            AptiDude
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground font-semibold mt-2"
          >
            Learn aptitude the fun way! 🎮
          </motion.p>
        </div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-3xl p-6 shadow-lg border border-border"
        >
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                isLogin
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                !isLogin
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="space-y-2"
              >
                <label className="block text-sm font-bold text-foreground mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                />
                {username && (
                  <div className="space-y-1 text-xs mt-2">
                    <div className={`flex items-center gap-2 ${usernameChecks.minLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {usernameChecks.minLength ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      At least 5 characters
                    </div>
                    <div className={`flex items-center gap-2 ${usernameChecks.validChars ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {usernameChecks.validChars ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      Only letters and underscores
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
              />
              {password && !isLogin && (
                <div className="space-y-1 text-xs mt-2">
                  <div className={`flex items-center gap-2 ${passwordChecks.minLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {passwordChecks.minLength ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    At least 8 characters
                  </div>
                  <div className={`flex items-center gap-2 ${passwordChecks.hasLetter ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {passwordChecks.hasLetter ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    At least 1 letter
                  </div>
                  <div className={`flex items-center gap-2 ${passwordChecks.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {passwordChecks.hasNumber ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    At least 1 number
                  </div>
                  <div className={`flex items-center gap-2 ${passwordChecks.hasSpecial ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {passwordChecks.hasSpecial ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    At least 1 special character (!@#$%^&* etc)
                  </div>
                </div>
              )}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-destructive text-sm font-semibold text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!isLogin && (!isUsernameValid || !isPasswordValid)}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-level mt-2 transition-all ${
                !isLogin && (!isUsernameValid || !isPasswordValid)
                  ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              {isLogin ? 'Log In' : 'Create Account'}
            </motion.button>
          </form>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-muted-foreground text-sm font-semibold mb-4">
            Why learn with AptiDude?
          </p>
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <span className="text-2xl">🎮</span>
              <p className="text-xs text-muted-foreground font-semibold mt-1">Gamified</p>
            </div>
            <div className="text-center">
              <span className="text-2xl">🤖</span>
              <p className="text-xs text-muted-foreground font-semibold mt-1">AI-Powered</p>
            </div>
            <div className="text-center">
              <span className="text-2xl">📈</span>
              <p className="text-xs text-muted-foreground font-semibold mt-1">Track Progress</p>
            </div>
            <div className="text-center">
              <span className="text-2xl">🏆</span>
              <p className="text-xs text-muted-foreground font-semibold mt-1">Compete</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
