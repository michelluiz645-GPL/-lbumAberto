/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Store, Tag, PlusCircle, LogOut, Landmark, Check, X, Shield, ArrowRight, MessageSquare, ListCheck, BookOpen, Send, AlertTriangle } from 'lucide-react';
import { Sticker, Negotiation, User } from '../types';

interface ClientDashboardProps {
  user: User;
  stickers: Sticker[];
  negotiations: Negotiation[];
  onLogout: () => void;
  onAddSticker: (newSticker: Omit<Sticker, 'id' | 'ownerId' | 'ownerName' | 'status'>) => void;
  onUpdateStickerPrice: (stickerId: string, newPrice: number) => void;
  onAcceptNegotiation: (negotiationId: string) => void;
  onDeclineNegotiation: (negotiationId: string) => void;
  onSendMessage: (negotiationId: string, text: string) => void;
  onTriggerSafetyReport: (info: { type: 'abusivo' | 'comportamento' | 'golpe'; description: string; context: string; targetName: string; targetId: string }) => void;
}

export default function ClientDashboard({
  user,
  stickers,
  negotiations,
  onLogout,
  onAddSticker,
  onUpdateStickerPrice,
  onAcceptNegotiation,
  onDeclineNegotiation,
  onSendMessage,
  onTriggerSafetyReport
}: ClientDashboardProps) {
  // Local list of owned stickers
  const myStickers = stickers.filter((s) => s.ownerId === user.id);
  const myNegotiations = negotiations.filter((n) => n.sellerId === user.id);

  // Sticker Creation states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStickerName, setNewStickerName] = useState('');
  const [newStickerCode, setNewStickerCode] = useState('');
  const [newStickerAlbum, setNewStickerAlbum] = useState('Copa do Mundo 2026');
  const [newStickerRarity, setNewStickerRarity] = useState<'Comum' | 'Rara' | 'Lendária' | 'Brilhante'>('Comum');
  const [newStickerPrice, setNewStickerPrice] = useState('');

  // Active chat state
  const [activeNegotiationId, setActiveNegotiationId] = useState<string | null>(
    myNegotiations.length > 0 ? myNegotiations[0].id : null
  );
  const [chatInput, setChatInput] = useState('');
  const activeNegotiation = myNegotiations.find((n) => n.id === activeNegotiationId);

  // Handler to add sticker with anti-abuse warning triggers!
  const handleCreateSticker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStickerName || !newStickerCode || !newStickerPrice) return;

    const price = parseFloat(newStickerPrice);
    if (isNaN(price) || price <= 0) return;

    // Define mock reference standard pricing (suggestedPrice based on rarity)
    let suggested = 2.00;
    if (newStickerRarity === 'Brilhante') suggested = 25.00;
    if (newStickerRarity === 'Rara') suggested = 60.00;
    if (newStickerRarity === 'Lendária') suggested = 400.00;

    // Call add callback
    onAddSticker({
      name: newStickerName,
      code: newStickerCode.toUpperCase(),
      album: newStickerAlbum,
      rarity: newStickerRarity,
      price: price,
      suggestedPrice: suggested,
      imageUrl: 'https://images.unsplash.com/photo-1540747737956-378721752670?auto=format&fit=crop&q=80&w=200'
    });

    // Abusive Price Check! (Price is more than 5 times reference)
    if (price > suggested * 2.5) {
      const markupPct = Math.round(((price - suggested) / suggested) * 100);
      onTriggerSafetyReport({
        type: 'abusivo',
        description: `Figurinha ${newStickerCode.toUpperCase()} comum/raridade definida por valor ${markupPct}% acima do sugerido de mercado.`,
        context: `Valor proposto: R$ ${price.toFixed(2)}. Valor de referência recomendado: R$ ${suggested.toFixed(2)}.`,
        targetName: `${newStickerCode.toUpperCase()} (${user.name.split(' (')[0]})`,
        targetId: `new_st_${Date.now()}`
      });
      
      alert(`⚠️ Alerta Fiscal: O preço de R$ ${price.toFixed(2)} está muito maior que o recomendado (R$ ${suggested.toFixed(2)}). O anúncio foi registrado, mas uma notificação de revisão de Preço Abusivo foi gerada para análise do Administrador.`);
    }

    // Reset states
    setNewStickerName('');
    setNewStickerCode('');
    setNewStickerPrice('');
    setNewStickerRarity('Comum');
    setShowAddModal(false);
  };

  const handleChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeNegotiationId) return;

    const text = chatInput.trim();
    onSendMessage(activeNegotiationId, text);
    setChatInput('');

    // Pre-screen messages for toxic words or external checkout links
    const lowerTxt = text.toLowerCase();
    
    if (lowerTxt.includes('lixo') || lowerTxt.includes('burro') || lowerTxt.includes('vagabundo') || lowerTxt.includes('roubo') || lowerTxt.includes('otário') || lowerTxt.includes('merda')) {
      onTriggerSafetyReport({
        type: 'comportamento',
        description: `Vendedor ${user.name.split(' ')[0]} enviou mensagem inadequada num chat de negociação direta.`,
        context: `Mensagem sinalizada: "${text}"`,
        targetName: `Chat #${activeNegotiationId} (${user.name.split(' ')[0]} x Comprador)`,
        targetId: activeNegotiationId
      });
    }

    if (lowerTxt.includes('por fora') || lowerTxt.includes('pix no zap') || lowerTxt.includes('link') || lowerTxt.includes('direto')) {
      onTriggerSafetyReport({
        type: 'golpe',
        description: `Vendedor ${user.name.split(' ')[0]} sugeriu formas de fechamento ou pagamento por canais externos.`,
        context: `Mensagem enviada com canais externos suspeitos: "${text}"`,
        targetName: `Chat #${activeNegotiationId} (${user.name.split(' ')[0]} x Comprador)`,
        targetId: activeNegotiationId
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-slate-100 pb-12">
      
      {/* Header bar */}
      <nav className="sticky top-0 z-40 bg-white/5 backdrop-blur-md border-b border-white/10 py-5 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-blue-600 rounded-lg flex items-center justify-center font-black text-base text-white shadow-lg shadow-green-500/10">
            Á
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
              Álbum<span className="text-yellow-400">Aberto</span> <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-green/10 text-brand-green border border-[#4ade80]/20">Portal do Cliente Vendedor</span>
            </h2>
            <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mt-0.5 font-sans">PERFIL COMERCIAL: {user.name.toUpperCase()}</p>
          </div>
        </div>

        {/* Balance & Power Options */}
        <div className="flex items-center justify-between md:justify-end gap-4">
          
          {/* Seller Balance Wallet */}
          <div className="flex items-center gap-2.5 bg-slate-900/60 border border-white/10 px-4 py-2 rounded-xl">
            <div className="p-1 bg-brand-yellow/10 text-brand-yellow rounded">
              <Landmark size={14} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-mono">SALDO DISPONÍVEL</p>
              <p className="text-sm font-bold text-brand-green font-mono">R$ {user.balance.toFixed(2)}</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-4">
            <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-brand-yellow" />
            <div>
              <p className="text-xs font-semibold text-white leading-tight">{user.name.split(' (')[0]}</p>
              <p className="text-[10px] text-brand-green font-mono">🛡️ {user.reputation} Reputação</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs px-3 py-2 rounded-xl border border-red-500/20 duration-200"
            title="Sair da Conta Comercial"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Roberto's Sticker Listings & Management */}
        <section className="lg:col-span-7 space-y-6">
          
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Store size={15} className="text-brand-green" />
                Meus Anúncios no Álbum ({myStickers.length})
              </h3>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-brand-green hover:opacity-90 text-slate-950 font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition"
              >
                <PlusCircle size={14} />
                Anunciar Figurinha
              </button>
            </div>

            {/* List Roberto's stickers */}
            <div className="grid grid-cols-1 gap-2.5">
              {myStickers.map((sticker) => {
                const markupAlert = sticker.price > sticker.suggestedPrice * 30; // excessive 100x check
                const isUnderAbundanceCheck = sticker.price > sticker.suggestedPrice * 5;

                return (
                  <div
                    key={sticker.id}
                    className={`p-3.5 bg-slate-950/50 border border-white/5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isUnderAbundanceCheck ? 'border-brand-yellow/20 bg-brand-yellow/5' : ''}`}
                  >
                    <div className="flex gap-3 items-center">
                      <div className="relative w-10 h-14 bg-slate-900 border border-white/10 rounded flex flex-col justify-between p-1">
                        <span className="text-[7px] text-gray-500 font-mono font-bold">{sticker.code}</span>
                        <p className="text-[8px] font-bold text-white truncate text-center uppercase">{sticker.name.split(' - ')[0]}</p>
                        <span className="text-[6px] text-brand-green font-mono text-right">ATIVO</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[8.5px] font-bold font-mono px-1.5 py-0.2 rounded ${
                            sticker.rarity === 'Lendária' ? 'bg-brand-yellow/15 text-brand-yellow' :
                            sticker.rarity === 'Brilhante' ? 'bg-brand-blue/15 text-brand-blue' :
                            'bg-brand-green/15 text-brand-green'
                          }`}>
                            {sticker.rarity}
                          </span>
                          <span className="text-[10px] text-brand-blue font-mono">{sticker.album}</span>
                        </div>
                        <h4 className="font-bold text-sm text-white mt-1">{sticker.name}</h4>
                        <span className="text-xs text-gray-400 font-mono">Margem recomendada: R$ {sticker.suggestedPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-white/5 pt-2.5 sm:pt-0">
                      <div>
                        <p className="text-[9px] text-gray-500 font-mono font-bold uppercase text-right leading-none">PREÇO ANUNCIADO</p>
                        <div className="flex items-center gap-1.5 mt-1 justify-end">
                          <span className="text-xs font-mono text-gray-400">R$</span>
                          <input
                            type="number"
                            defaultValue={sticker.price}
                            onBlur={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val) && val > 0) {
                                onUpdateStickerPrice(sticker.id, val);
                              }
                            }}
                            className="bg-slate-900 border border-white/10 focus:border-brand-green rounded px-2 py-0.5 text-sm font-bold text-brand-green font-mono w-24 text-right focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Display Alert indicators if monitored excessively */}
                      {isUnderAbundanceCheck && (
                        <div className="p-1 px-2.5 bg-brand-yellow/10 rounded-lg text-brand-yellow border border-brand-yellow/20 flex items-center gap-1" title="Em Fiscalização Administradora por margem suspeita">
                          <AlertTriangle size={15} />
                          <span className="text-[9px] font-bold font-mono uppercase hidden sm:inline">ALTA MARGEM</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Safety Reminder footer inside active cabinet */}
            <div className="p-3.5 bg-brand-blue/5 rounded-xl border border-brand-blue/15 flex items-start gap-2.5 text-xs text-brand-blue">
              <Shield size={16} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Política Antifraude do ÁlbumAberto:</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Preços abusivos são fiscalizados automaticamente com base no histórico de venda das figurinhas. Evite marcar valores absurdos para manter sua reputação alta.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* RIGHT COLUMN: Active incoming purchase negotiations (Chats e Propostas com Compradores) */}
        <section className="lg:col-span-5 space-y-6">
          
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-white/5 pb-2">
              <MessageSquare size={14} className="text-brand-blue" />
              Ofertas Recebidas dos Clientes
            </h3>

            {myNegotiations.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs text-mono">
                Você não possui propostas de compra no momento.
              </div>
            ) : (
              <div className="space-y-2">
                {myNegotiations.map((neg) => {
                  const isActive = activeNegotiationId === neg.id;
                  return (
                    <button
                      key={neg.id}
                      onClick={() => setActiveNegotiationId(neg.id)}
                      className={`w-full text-left p-3 rounded-xl border transition ${
                        isActive
                          ? 'bg-brand-blue/5 border-brand-blue text-white'
                          : 'bg-slate-950/40 border-white/5 hover:border-white/10 text-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">FIGURINHA {neg.stickerCode}</span>
                        <span className={`text-[9.5px] px-2 py-0.5 rounded font-mono ${
                          neg.status === 'accepted' ? 'bg-brand-green/20 text-brand-green' :
                          neg.status === 'declined' ? 'bg-red-500/10 text-red-400' :
                          'bg-brand-yellow/15 text-brand-yellow animate-pulse'
                        }`}>
                          {neg.status === 'accepted' ? 'Aceito de Venda ✔' : neg.status === 'declined' ? 'Recusado' : 'Decidir Proposta'}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs truncate mt-0.5">{neg.stickerName}</h4>
                      <p className="text-[10px] text-gray-400 mt-1 font-mono flex justify-between">
                        <span>Comprador: <strong className="text-gray-300">{neg.buyerName}</strong></span>
                        <span className="text-brand-green font-extrabold text-[11px]">R$ {neg.priceOffered.toFixed(2)}</span>
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chat and Action panel for the active negotiation */}
          {activeNegotiation ? (
            <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-[400px]">
              
              {/* Active Header with Accept/Decline Options */}
              <div className="bg-slate-950/90 p-3.5 border-b border-white/5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                      <span className="w-2 h-2 rounded-full bg-brand-green" />
                      Chat de Negociação Completo
                    </h4>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">
                      Comprador: {activeNegotiation.buyerName} • Figurinha: {activeNegotiation.stickerCode}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[8px] text-gray-500 block font-mono">PROPÔS COMPRAR POR:</span>
                    <span className="text-sm font-bold text-brand-yellow font-mono leading-none">R$ {activeNegotiation.priceOffered.toFixed(2)}</span>
                  </div>
                </div>

                {/* Accept/Reject Controls */}
                {activeNegotiation.status === 'pending' ? (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => onDeclineNegotiation(activeNegotiation.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 border border-red-500/20"
                    >
                      <X size={13} />
                      Recusar Oferta
                    </button>
                    <button
                      onClick={() => onAcceptNegotiation(activeNegotiation.id)}
                      className="bg-brand-green hover:opacity-90 text-slate-950 text-xs font-extrabold py-1.5 rounded-lg flex items-center justify-center gap-1"
                    >
                      <Check size={13} />
                      Aceitar Oferta (Faturar)
                    </button>
                  </div>
                ) : (
                  <div className={`p-2 rounded-lg text-center text-xs font-mono ${
                    activeNegotiation.status === 'accepted' ? 'bg-brand-green/10 text-brand-green border border-brand-green/20' : 'bg-slate-900 text-gray-400'
                  }`}>
                    {activeNegotiation.status === 'accepted' ? 'Venda aprovada e liquidada com sucesso! R$ creditados.' : 'Negociação recusada ou encerrada.'}
                  </div>
                )}
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/20">
                {activeNegotiation.messages.map((msg) => {
                  const isMe = msg.senderId === user.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      <p className="text-[9px] text-gray-400 font-mono mb-0.5">
                        {msg.senderName.split(' ')[0]} • <span className="text-gray-500">{msg.timestamp}</span>
                      </p>
                      
                      <div className={`p-2.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-brand-green text-slate-950 rounded-tr-none font-medium'
                          : 'bg-slate-900 border border-white/10 text-slate-200 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>

                      {msg.isToxic && (
                        <div className="mt-1 flex items-center gap-1 text-[8.5px] text-brand-yellow border border-brand-yellow/10 bg-brand-yellow/5 px-1.5 py-0.5 rounded">
                          <AlertTriangle size={10} className="shrink-0" />
                          <span>Auditoria detectou e reportou linguagem hostil ou link externo ao Administrador.</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleChatSend} className="bg-slate-950/80 p-3 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Mensagem (digite 'zap' ou 'pix' para acionar fiscalização)"
                  className="flex-1 bg-slate-900 border border-white/10 focus:border-brand-green rounded-xl p-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-brand-green hover:opacity-90 text-slate-900 p-2 rounded-xl transition shrink-0"
                >
                  <Send size={13} />
                </button>
              </form>

            </div>
          ) : (
            <div className="glass-card rounded-2xl p-8 text-center text-gray-500 text-xs font-mono">
              Selecione uma proposta de compra ativa ao lado para gerenciar o andamento comercial e faturamento em tempo real.
            </div>
          )}

        </section>
      </div>

      {/* ANUNCIAR NEW STICKER MODAL OVERLAY */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
            
            <div className="bg-slate-900 px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Registrar Nova Figurinha</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSticker} className="p-5 space-y-4">
              
              {/* Sticker Name */}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                  Nome da Figurinha
                </label>
                <input
                  type="text"
                  required
                  value={newStickerName}
                  onChange={(e) => setNewStickerName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 focus:border-brand-green rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  placeholder="Ex: Neymar Jr - Chuteira de Ouro"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Sticker Code */}
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Código de Registro
                  </label>
                  <input
                    type="text"
                    required
                    value={newStickerCode}
                    onChange={(e) => setNewStickerCode(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 focus:border-brand-green rounded-xl py-2 px-3 text-xs text-white uppercase focus:outline-none"
                    placeholder="Ex: BRA-10"
                  />
                </div>

                {/* Rarity */}
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    Raridade Declarada
                  </label>
                  <select
                    value={newStickerRarity}
                    onChange={(e) => setNewStickerRarity(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 focus:border-brand-green rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  >
                    <option value="Comum">Comum</option>
                    <option value="Brilhante">Brilhante</option>
                    <option value="Rara">Rara</option>
                    <option value="Lendária">Lendária</option>
                  </select>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                  Preço Praticado de Venda (R$)
                </label>
                <input
                  type="number"
                  required
                  value={newStickerPrice}
                  onChange={(e) => setNewStickerPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 focus:border-brand-green rounded-xl py-2 px-3 text-xs text-white font-bold font-mono focus:outline-none"
                  placeholder="0.00"
                />
                
                {/* Dynamically display standard market pricing to let the user see the safety boundary */}
                <p className="text-[10px] text-gray-400 font-sans mt-1.5">
                  Referência Recomendada: <strong className="text-brand-yellow">
                    {newStickerRarity === 'Comum' ? 'R$ 2,00' :
                     newStickerRarity === 'Brilhante' ? 'R$ 25,00' :
                     newStickerRarity === 'Rara' ? 'R$ 60,00' : 'R$ 400,00'}
                  </strong>. 
                  Valores que excedem 2.5x o sugerido geram alertas automáticos de mitigação abusiva.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 border border-white/5 text-gray-400 text-xs py-2.5 rounded-xl font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-green text-slate-900 text-xs py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1"
                >
                  Confirmar Registro
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
