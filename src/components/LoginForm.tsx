/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Mail, Lock, Shield, ShoppingBag, Store, AlertCircle, ArrowRight } from 'lucide-react';
import { DEMO_USERS } from '../data';
import { User, UserRole } from '../types';

interface LoginFormProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function LoginForm({ onClose, onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handler to perform login check
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos!');
      return;
    }

    if (password !== '123456') {
      setError('Senha incorreta! Use a senha padrão "123456" para testar os usuários.');
      return;
    }

    // Attempt to match with one of our predefined users
    const matchedUser = Object.values(DEMO_USERS).find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matchedUser) {
      setSuccess(`Acesso concedido! Entrando como ${matchedUser.name}...`);
      setTimeout(() => {
        onLoginSuccess(matchedUser);
      }, 900);
    } else {
      setError('E-mail não cadastrado na demonstração. Use um dos atalhos rápidos abaixo!');
    }
  };

  // Helper autofill function requested by user!
  const handleShortcutFill = (role: UserRole) => {
    setError('');
    const demo = DEMO_USERS[role];
    if (demo) {
      setEmail(demo.email);
      setPassword('123456'); // Hardcoded to 123456 as requested
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-md my-8 relative">
        
        {/* Animated Neon border backdrop */}
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-green via-brand-yellow to-brand-blue rounded-3xl blur opacity-30 animate-pulse" />

        {/* Core Glass Login Box */}
        <div id="login-modal" className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 md:p-8 text-left shadow-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-ping mt-1" />
              <h3 className="text-xl font-bold text-white tracking-tight">Bem-vindo de volta !</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 px-2 text-white/55 hover:text-white hover:bg-white/10 rounded-full transition duration-200"
              title="Fechar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Prompt/Guide */}
          <div className="bg-yellow-400/10 backdrop-blur-md border border-yellow-400/25 px-4 py-3 rounded-2xl mb-6 text-xs text-yellow-400 flex items-start gap-2.5">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <p>
              Toda a plataforma ÁlbumAberto usa a senha unificada <strong className="text-white font-mono">123456</strong> para os perfis configurados. Escolha o seu ator abaixo para auto-preencher!
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Email field */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-white/50 ml-1 block" htmlFor="login-email">
                E-mail ou Usuário
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-white/40">
                  <Mail size={16} />
                </span>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colecionador@exemplo.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-green-400 transition-colors font-sans"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-white/50 ml-1 block" htmlFor="login-password">
                Sua Senha
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-white/40">
                  <Lock size={16} />
                </span>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-400 transition-colors font-sans"
                />
              </div>
            </div>

            {/* Status alerts */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs rounded-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                <span>{success}</span>
              </div>
            )}

            {/* Submit */}
            <button
              id="btn-submit-login"
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 py-4 rounded-xl font-bold text-sm tracking-widest shadow-lg shadow-blue-500/20 hover:brightness-110 transition-all text-white flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              ENTRAR NA PLATAFORMA
              <ArrowRight size={16} />
            </button>
          </form>

          {/* REQUIRED CARD BELOW THE LOGIN FORM FOR QUICK AUTOFILL */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <h4 className="text-[10pt] font-bold text-white/60 uppercase tracking-widest mb-3 block font-mono text-center">
              Preenchimento Automático (Atalhos)
            </h4>
            
            <div id="quick-fill-card" className="bg-yellow-400/5 hover:bg-yellow-400/10 backdrop-blur-xl border border-yellow-400/20 p-4 rounded-2xl space-y-2.5 transition-all">
              <p className="text-[11px] text-white/70 text-center font-sans">
                Selecione um ator para injetar credenciais automaticamente:
              </p>

              <div className="grid grid-cols-1 gap-2">
                {/* Shortcut 1: Comprador (usuario) */}
                <button
                  type="button"
                  onClick={() => handleShortcutFill('usuario')}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition text-left text-xs text-white"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                      <ShoppingBag size={12} />
                    </div>
                    <div>
                      <p className="font-semibold text-[11px]">Colecionador (Usuário)</p>
                      <p className="text-[9px] text-white/50 font-mono">comprador@albumaberto.com</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-brand-blue bg-white/5 px-1.5 py-0.5 rounded border border-white/10">AUTO-FILL</span>
                </button>

                {/* Shortcut 2: Vendedor (cliente) */}
                <button
                  type="button"
                  onClick={() => handleShortcutFill('cliente')}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition text-left text-xs text-white"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-brand-green/20 flex items-center justify-center text-brand-green">
                      <Store size={12} />
                    </div>
                    <div>
                      <p className="font-semibold text-[11px]">Cliente Vendedor</p>
                      <p className="text-[9px] text-white/50 font-mono">vendedor@albumaberto.com</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-brand-green bg-white/5 px-1.5 py-0.5 rounded border border-white/10">AUTO-FILL</span>
                </button>

                {/* Shortcut 3: Admin (adm) */}
                <button
                  type="button"
                  onClick={() => handleShortcutFill('adm')}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition text-left text-xs text-white"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-brand-yellow/20 flex items-center justify-center text-brand-yellow">
                      <Shield size={12} />
                    </div>
                    <div>
                      <p className="font-semibold text-[11px]">Administrador (Mesa)</p>
                      <p className="text-[9px] text-white/50 font-mono">admin@albumaberto.com</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-brand-yellow bg-white/5 px-1.5 py-0.5 rounded border border-white/10">AUTO-FILL</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
