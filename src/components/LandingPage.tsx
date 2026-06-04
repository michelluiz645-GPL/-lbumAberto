/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Sparkles, TrendingUp, Users, Search, RefreshCw, MessageCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Sticker } from '../types';

interface LandingPageProps {
  stickers: Sticker[];
  onOpenLogin: () => void;
  onQuickAdmin: () => void;
  onExploreSticker: (sticker: Sticker) => void;
}

export default function LandingPage({
  stickers,
  onOpenLogin,
  onQuickAdmin,
  onExploreSticker
}: LandingPageProps) {
  // Take 4 attractive stickers to display as a featured preview
  const featuredStickers = stickers.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

      {/* Modern Glassmorphism Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/5 border-b border-white/10 py-5 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Custom SVG Stylized Sticker Album Logo with our Colors */}
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-600 rounded-lg flex items-center justify-center font-black text-xl text-white shadow-lg shadow-green-500/10">
            Á
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-none">
              Álbum<span className="text-yellow-400">Aberto</span>
            </h1>
            <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mt-0.5">Marketplace</p>
          </div>
        </div>

        {/* Buttons in top right corner: ADM e LOGIN */}
        <div className="flex items-center gap-3">
          <button
            id="btn-nav-admin"
            onClick={onQuickAdmin}
            className="hidden sm:flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full text-xs font-bold px-4 py-2 shadow-lg shadow-yellow-400/20 transition-all cursor-pointer"
          >
            <Shield size={14} className="animate-pulse" />
            PAINEL ADMIN
          </button>
          
          <button
            id="btn-nav-login"
            onClick={onOpenLogin}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-xs font-bold transition-all cursor-pointer text-white"
          >
            <Users size={14} />
            LOGIN
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center justify-center text-center relative z-10">
        
        {/* Banner Quick Admin Mobile Helper */}
        <div className="sm:hidden mb-6">
          <button
            onClick={onQuickAdmin}
            className="flex items-center gap-2 bg-yellow-400/10 backdrop-blur-xl border border-yellow-400/20 text-yellow-400 text-xs px-4 py-2 rounded-full"
          >
            <Shield size={12} />
            Acessar Canal Administrativo
          </button>
        </div>

        {/* Hero Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs font-bold mb-6">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          2,451 NEGOCIAÇÕES ATIVAS AGORA
        </div>

        {/* Primary Slogan */}
        <h2 className="text-5xl md:text-7xl font-black tracking-tight max-w-4xl text-white leading-none mb-6">
          A MAIOR ARENA DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-yellow-400 to-blue-500">COLECIONÁVEIS.</span>
        </h2>

        <p className="text-base md:text-lg text-white/60 max-w-2xl mb-10 leading-relaxed">
          Compre, venda e negocie figurinhas raras em tempo real com segurança total e fiscalização profissional contra golpes de mercado.
        </p>

        {/* Premium Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center w-full max-w-md sm:max-w-none">
          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-blue-600 py-4 px-8 rounded-xl font-bold text-sm tracking-widest shadow-lg shadow-blue-500/20 hover:brightness-110 transition-all text-white flex items-center justify-center gap-3 cursor-pointer"
          >
            Começar a Colecionar
            <ArrowRight size={18} />
          </button>
          
          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold transition-all text-white flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search size={18} />
            Buscar Figurinhas de Interesse
          </button>
        </div>

        {/* Dynamic Glass Bento Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-20 text-left">
          
          {/* Actor 1: Navegador / Usuário */}
          <div className="glass-card hover:border-brand-blue/30 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-bl-full pointer-events-none group-hover:bg-brand-blue/10 transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-6 border border-brand-blue/20">
              <Search className="text-brand-blue" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Navegadores & Colecionadores</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Encontre o que precisa com filtros instantâneos. Saiba imediatamente quais figurinhas estão à venda ou sendo negociadas sob demanda.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-brand-blue bg-brand-blue/5 py-1 px-3.5 rounded-lg w-max">
              <span>Busca de figurinhas de interesse</span>
            </div>
          </div>

          {/* Actor 2: Comprador / Cliente Vendedor */}
          <div className="glass-card hover:border-brand-green/30 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/5 rounded-bl-full pointer-events-none group-hover:bg-brand-green/10 transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center mb-6 border border-brand-green/20">
              <MessageCircle className="text-brand-green" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Compra, Venda e Chat</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Negocie valores em tempo real diretamente num chat integrado. Faça contrapropostas que atualizam as condições em um clique.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-brand-green bg-brand-green/5 py-1 px-3.5 rounded-lg w-max">
              <span>Negociações seguras ao vivo</span>
            </div>
          </div>

          {/* Actor 3: ADM */}
          <div className="glass-card hover:border-brand-yellow/30 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-yellow/5 rounded-bl-full pointer-events-none group-hover:bg-brand-yellow/10 transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-brand-yellow/10 flex items-center justify-center mb-6 border border-brand-yellow/20">
              <Shield className="text-brand-yellow" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Fiscalização Unificada</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nossos ADMs monitoram ativamente preços abusivos marcando sugestões e bloqueando discursos tóxicos ou tentativas de golpes.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-brand-yellow bg-brand-yellow/5 py-1 px-3.5 rounded-lg w-max">
              <span>Auditoria e controle de golpes</span>
            </div>
          </div>

        </div>

        {/* Featured Sticker Section (Visual Demo of Modern Cards) */}
        <div className="w-full mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 text-left">
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white">As Mais Cobiçadas do Momento</h3>
              <p className="text-gray-400 text-sm">Visual do álbum com preços sugeridos e ofertas de clientes</p>
            </div>
            <button
              onClick={onOpenLogin}
              className="mt-4 sm:mt-0 text-brand-green hover:text-brand-green text-sm font-semibold flex items-center gap-2 group"
            >
              Ver todas disponíveis
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredStickers.map((sticker) => {
              const hasPricedArrogantly = sticker.price > sticker.suggestedPrice * 3;
              return (
                <div
                  key={sticker.id}
                  onClick={() => onExploreSticker(sticker)}
                  className="glass-card hover:scale-105 transition-all duration-300 rounded-2xl overflow-hidden border border-white/5 hover:border-brand-emerald/20 cursor-pointer group text-left flex flex-col h-full"
                >
                  {/* Sticker Visual Header - Color matched according to rarity */}
                  <div className="relative h-44 bg-slate-950 flex items-center justify-center overflow-hidden">
                    {/* Glowing effect inside sticker */}
                    <div className={`absolute inset-0 bg-radial from-brand-blue/10 via-transparent to-brand-dark`} />
                    
                    {sticker.rarity === 'Lendária' && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-brand-yellow/15 via-transparent to-brand-green/10" />
                    )}

                    {/* Actual dynamic sticker graphic placeholder representing dynamic design */}
                    <div className="relative z-10 w-28 h-36 bg-slate-900 border-2 border-brand-green/35 rounded-xl shadow-xl p-2 flex flex-col justify-between overflow-hidden">
                      {sticker.rarity === 'Lendária' && (
                        <div className="absolute inset-0 border border-brand-yellow/30 bg-gradient-to-b from-brand-yellow/5 to-transparent animate-pulse" />
                      )}
                      
                      <div className="flex justify-between items-center text-[8px] font-mono font-bold text-gray-400">
                        <span className="text-brand-yellow bg-slate-950 px-1 py-0.5 rounded border border-white/10 uppercase">
                          {sticker.rarity}
                        </span>
                        <span className="text-white font-bold">{sticker.code}</span>
                      </div>

                      <div className="my-auto text-center">
                        <p className="text-[10px] font-bold text-white leading-tight uppercase font-mono max-w-full truncate">{sticker.name.split(' - ')[0]}</p>
                        <p className="text-[8px] text-brand-blue font-mono font-bold mt-0.5">{sticker.album}</p>
                      </div>

                      <div className="border-t border-white/10 pt-1 flex justify-between items-center text-[7px] font-mono text-gray-500">
                        <span>ÁLBOUM</span>
                        <span className="text-brand-green">OK</span>
                      </div>
                    </div>

                    {/* Quick Rarity Badge */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                      <span className={`w-2 h-2 rounded-full ${sticker.rarity === 'Lendária' ? 'bg-brand-yellow animate-ping' : sticker.rarity === 'Brilhante' ? 'bg-brand-blue' : 'bg-brand-green'}`} />
                      <span className="text-[9px] font-mono text-gray-300">{sticker.rarity}</span>
                    </div>
                  </div>

                  {/* Sticker Stats / Prices */}
                  <div className="p-4 bg-slate-950/40 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm group-hover:text-brand-green transition-colors line-clamp-1">
                        {sticker.name}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-mono mt-1 flex items-center justify-between">
                        <span>Cód: <strong className="text-gray-200">{sticker.code}</strong></span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-dark text-brand-blue border border-white/5">{sticker.album}</span>
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-1">
                      {/* Price gouging visual alert demo if price is abusive */}
                      {hasPricedArrogantly ? (
                        <div className="flex items-center gap-1.5 bg-brand-yellow/10 text-brand-yellow text-[10px] py-1 px-2 rounded-lg border border-brand-yellow/20 mb-1">
                          <AlertTriangle size={12} className="shrink-0" />
                          <span>Preço inflacionado (Alerta de Preço Abusivo)</span>
                        </div>
                      ) : null}

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-gray-400 block font-mono">VALOR ANUNCIADO</span>
                          <span className="text-sm font-bold text-brand-green font-mono">R$ {sticker.price.toFixed(2)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-gray-400 block font-mono">SUGERIDO</span>
                          <span className="text-[11px] font-bold text-gray-300 font-mono">R$ {sticker.suggestedPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Pledge Banner */}
        <div className="w-full glass-card border-brand-green/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-left gap-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-green/10 rounded-2xl border border-brand-green/20 shrink-0">
              <Shield className="text-brand-green" size={28} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Compromisso Fiscal ÁlbumAberto</h4>
              <p className="text-sm text-gray-400 max-w-xl">
                Nossa exclusiva inteligência anti-abuso cruza dados de mercado sugeridos pra manter a economia saudável. Transações flagradas com comportamento tóxico são suspensas instantaneamente por nossa mesa administrativa.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 shrink-0 w-full md:w-auto">
            <button
              onClick={onQuickAdmin}
              className="flex-1 md:flex-none border border-brand-yellow/20 hover:border-brand-yellow text-brand-yellow text-xs font-semibold px-4 py-2.5 rounded-xl transition font-mono whitespace-nowrap text-center"
            >
              Auditar Sistema
            </button>
            <button
              onClick={onOpenLogin}
              className="flex-1 md:flex-none bg-brand-green hover:opacity-90 text-brand-dark text-xs font-bold px-6 py-2.5 rounded-xl transition text-center"
            >
              Fazer Login Segura
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-xs text-gray-500 font-mono flex flex-col sm:flex-row items-center justify-between max-w-7xl w-full mx-auto">
        <p>© 2026 ÁlbumAberto Plataforma de Trocas e Negócios. Todos os direitos reservados.</p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <span className="text-brand-green">Verde (Sucesso)</span>
          <span className="text-brand-yellow">Amarelo (Segurança)</span>
          <span className="text-brand-blue">Azul (Comunidade)</span>
          <span className="text-white">Preto (Elegância)</span>
        </div>
      </footer>
    </div>
  );
}
