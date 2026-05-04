import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  EyeOff, 
  Activity, 
  HardDrive, 
  BookOpen, 
  Lock, 
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StrengthCriterion {
  id: string;
  label: string;
  test: (pass: string) => boolean;
}

const CRITERIA: StrengthCriterion[] = [
  { id: 'length', label: '8-12+ characters', test: (p) => p.length >= 8 },
  { id: 'upper', label: 'Uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { id: 'lower', label: 'Lowercase letter', test: (p) => /[a-z]/.test(p) },
  { id: 'number', label: 'Number (0-9)', test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'Special character (@$!%*?&)', test: (p) => /[@$!%*?&]/.test(p) },
];

export default function App() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const analysis = useMemo(() => {
    const results = CRITERIA.map(c => ({
      ...c,
      passed: c.test(password)
    }));
    
    const passedCount = results.filter(r => r.passed).length;
    let strength: 'Weak' | 'Medium' | 'Strong' | 'Very Strong' | 'Empty' = 'Empty';
    let colorClass = 'text-gray-400';
    let bgClass = 'bg-gray-400';

    if (password.length === 0) {
      strength = 'Empty';
    } else if (passedCount <= 2) {
      strength = 'Weak';
      colorClass = 'text-danger';
      bgClass = 'bg-danger';
    } else if (passedCount <= 4) {
      strength = 'Medium';
      colorClass = 'text-warning';
      bgClass = 'bg-warning';
    } else {
      strength = password.length > 12 && passedCount === 5 ? 'Very Strong' : 'Strong';
      colorClass = 'text-success';
      bgClass = 'bg-success';
    }

    return { results, passedCount, strength, colorClass, bgClass };
  }, [password]);

  return (
    <div className="min-h-screen flex flex-col bg-dark text-white selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass px-6 py-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">SentinelCheck</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <NavLink icon={<Activity size={18} />} label="Dashboard" />
            <NavLink icon={<BookOpen size={18} />} label="Security Guides" />
            <NavLink icon={<HardDrive size={18} />} label="System Health" />
          </div>

          <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all font-medium text-sm border border-white/5">
            Admin Portal
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-12 px-6">
        <div className="max-w-2xl w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Analyze Your <span className="text-primary">Shield</span>
            </h1>
            <p className="text-gray-400 max-w-md mx-auto">
              Real-time cryptographic strength analysis for your digital assets. 
              Secure your future with Sentinel technology.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 md:p-10 relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[100px] transition-colors duration-700 ${analysis.bgClass} opacity-20`} />
            
            <div className="relative space-y-8">
              {/* Input Group */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <label className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Lock size={14} /> Password Input
                  </label>
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security key..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-mono"
                    id="password-input"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <AnimatePresence>
                      {password && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          {analysis.strength === 'Weak' && <ShieldAlert className="text-danger" />}
                          {analysis.strength === 'Medium' && <AlertTriangle className="text-warning" />}
                          {['Strong', 'Very Strong'].includes(analysis.strength) && <ShieldCheck className="text-success" />}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Strength Level */}
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Current Status</span>
                    <h3 className={`text-3xl font-bold tracking-tight ${analysis.colorClass}`}>
                      {analysis.strength === 'Empty' ? 'Awaiting Input' : analysis.strength}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-mono font-bold leading-none">
                      {Math.round((analysis.passedCount / 5) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Segmented Progress Bar */}
                <div className="flex gap-2 h-2.5">
                  {[1, 2, 3, 4].map((segment) => {
                    const isActive = (analysis.passedCount / 5) * 4 >= segment;
                    return (
                      <div key={segment} className="flex-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full ${analysis.bgClass}`}
                          initial={{ width: 0 }}
                          animate={{ width: isActive ? '100%' : '0%' }}
                          transition={{ duration: 0.5, ease: "circOut" }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Criteria Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                {analysis.results.map((criterion, idx) => (
                  <motion.div
                    key={criterion.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                    className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
                      criterion.passed 
                        ? 'bg-success/10 border border-success/20 text-success' 
                        : 'bg-white/5 border border-white/5 text-gray-500'
                    }`}
                  >
                    {criterion.passed ? (
                      <CheckCircle2 size={20} className="shrink-0" />
                    ) : (
                      <XCircle size={20} className="shrink-0 opacity-40" />
                    )}
                    <span className="text-sm font-medium">{criterion.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tips Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <TipCard 
              title="Avoid Patterns" 
              desc="Don't use common sequences like '123' or 'abc'."
            />
            <TipCard 
              title="Identity Check" 
              desc="Exclude names, birthdays, or public info."
            />
            <TipCard 
              title="Rotate Often" 
              desc="Update your keys every 90 days for max safety."
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/5 mt-12 bg-black/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2 opacity-60">
              <Shield size={20} className="text-primary" />
              <span className="font-bold tracking-tight">SentinelCheck v2.4.0</span>
            </div>
            <p className="text-sm text-gray-500 text-center md:text-left">
              Advanced security evaluation for professional environments. <br />
              © 2026 Sentinel Security Systems. All rights reserved.
            </p>
          </div>
          
          <div className="flex gap-12">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-gray-400 uppercase">Product</span>
              <FooterLink label="Enterprise" />
              <FooterLink label="API Docs" />
              <FooterLink label="Status" />
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-gray-400 uppercase">Privacy</span>
              <FooterLink label="Terms" />
              <FooterLink label="Cookie Policy" />
              <FooterLink label="Contact" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ icon, label }: { icon: ReactNode, label: string }) {
  return (
    <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
      <span className="group-hover:text-primary transition-colors">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
}

function TipCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-6 glass rounded-2xl space-y-2 hover:border-primary/30 transition-colors group cursor-default">
      <div className="flex items-center gap-2 text-primary">
        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        <h4 className="font-bold text-sm uppercase tracking-wider">{title}</h4>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
      {label}
    </a>
  );
}
