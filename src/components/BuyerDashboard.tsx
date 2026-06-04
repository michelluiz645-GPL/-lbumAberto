/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Filter, Shield, MessageSquare, Landmark, LogOut, CheckCircle, Clock, AlertTriangle, Send } from 'lucide-react';
import { Sticker, Negotiation, User } from '../types';

interface BuyerDashboardProps {
  user: User;
  stickers: Sticker[];
  negotiations: Negotiation[];
  onLogout: () => void;
  onNewNegotiation: (stickerId: string, offerPrice: number, firstMessage: string) => void;
  onSendMessage: (negotiationId: string, text: string) => void;
  onTriggerTriggerSafetyReport: (info: { type: 'abusivo' | 'comportamento' | 'golpe'; description: string; context: string; targetName: string; targetId: string }) => void;
}

export default function BuyerDashboard({
  user,
  stickers,
  negotiations,
  onLogout,
  onNewNegotiation,
  onSendMessage,
  onTriggerTriggerSafetyReport
}: BuyerDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  
  // Negotiation creation form states
  const [customOffer, setCustomOffer] = useState<string>('');
  const [initMessage, setInitMessage] = useState('');

  // Active chat section states
  const [activeNegotiationId, setActiveNegotiationId] = useState<string | null>(
    negotiations.length > 0 ? negotiations[0].id : null
  );
  const [chatInput, setChatInput] = useState('');

  // Filter listings where owner is NOT current user (Gabriel Silva doesn't want to buy his own stuff, Roberto's things are shown)
  const filteredStickers = stickers.filter((st) => {
    const matchesSearch = st.name.toLowerCase().includes(searchTerm.toLowerCase()) || st.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = rarityFilter === 'all' || st.rarity === rarityFilter;
    const isOthers = st.ownerId !== user.id;
    return matchesSearch && matchesRarity && isOthers;
  });

  const activeNegotiation = negotiations.find((n) => n.id === activeNegotiationId);

  // Send messaging handler with automatic simulated response & anti-abuse checks
  const handleChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeNegotiationId) return;

    const messageText = chatInput.trim();
    
    // Call main message sender
    onSendMessage(activeNegotiationId, messageText);
    setChatInput('');

    // --- PROACTIVE SAFETY CHECKS (Anti-comportamento tóxico e anti-golpe) ---
    const lowerTxt = messageText.toLowerCase();
    
    // 1. Toxicity check
    if (lowerTxt.includes('lixo') || lowerTxt.includes('burro') || lowerTxt.includes('vagabundo') || lowerTxt.includes('roubo') || lowerTxt.includes('otário') || lowerTxt.includes('golpista')) {
      onTriggerTriggerSafetyReport({
        type: 'comportamento',
        description: `Discurso inadequado detectado no chat com ${activeNegotiation?.sellerName}. Usuário enviou termos agressivos.`,
        context: `Mensagem censurada: "${messageText}"`,
        targetName: `Chat #${activeNegotiationId} (Gabriel x ${activeNegotiation?.sellerName})`,
        targetId: activeNegotiationId
      });
    }

    // 2. Scam check (outside payment link)
    if (lowerTxt.includes('por fora') || lowerTxt.includes('pagamento externo') || lowerTxt.includes('link') || lowerTxt.includes('whatsapp') || lowerTxt.includes('manda o zap') || lowerTxt.includes('transferência direta')) {
      onTriggerTriggerSafetyReport({
        type: 'golpe',
        description: `Indício de golpe fora do fluxo seguro do ÁlbumAberto detectado no chat com ${activeNegotiation?.sellerName}.`,
        context: `Mensagem sinalizada: "${messageText}"`,
        targetName: `Chat #${activeNegotiationId} (Gabriel x ${activeNegotiation?.sellerName})`,
        targetId: activeNegotiationId
      });
    }
  };

  const startNegotiationFlow = (sticker: Sticker) => {
    setSelectedSticker(sticker);
    setCustomOffer(sticker.price.toString());
    setInitMessage(`Olá ${sticker.ownerName}, tenho muito interesse na sua figurinha ${sticker.code}. Aceita fechar por um valor amigável?`);
  };

  const submitNewNegotiation = () => {
    if (!selectedSticker) return;
    const price = parseFloat(customOffer);
    if (isNaN(price) || price <= 0) return;

    // --- Price Abuse Check (If buyer tries to list something or seller charges too much) ---
    // But since this is buyer making a bidding offer:
    if (price > selectedSticker.suggestedPrice * 3) {
      onTriggerTriggerSafetyReport({
        type: 'abusivo',
        description: `Valor ofertado na figurinha ${selectedSticker.code} está absurdamente inflacionado em relação ao mercado.`,
        context: `Preço sugerido: R$ ${selectedSticker.suggestedPrice.toFixed(2)}. Valor da Proposta: R$ ${price.toFixed(2)}.`,
        targetName: `${selectedSticker.code} (${selectedSticker.ownerName})`,
        targetId: selectedSticker.id
      });
    }

    onNewNegotiation(selectedSticker.id, price, initMessage);
    setSelectedSticker(null);
    
    // Select newly created negotiation if possible
    setTimeout(() => {
      // Find the created negotiation id (last one added)
      if (negotiations.length > 0) {
        setActiveNegotiationId(negotiations[negotiations.length - 1].id);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-slate-100 pb-12">
      
      {/* Top Navigation Bar with glass design */}
      <nav className="sticky top-0 z-40 bg-white/5 backdrop-blur-md border-b border-white/10 py-5 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-blue-600 rounded-lg flex items-center justify-center font-black text-base text-white shadow-lg shadow-green-500/10">
            Á
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Álbum<span className="text-yellow-400">Aberto</span> <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue border border-[#3b82f6]/20">Portal do Comprador</span>
            </h2>
            <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase mt-0.5">BEM-VINDO, {user.name.toUpperCase()}</p>
          </div>
        </div>

        {/* Right Info and Actions */}
        <div className="flex items-center justify-between md:justify-end gap-4">
          
          {/* Simulated Wallet */}
          <div className="flex items-center gap-2.5 bg-slate-900/60 border border-white/10 px-4 py-2 rounded-xl">
            <div className="p-1 bg-brand-green/10 text-brand-green rounded">
              <Landmark size={14} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-mono">SALDO CARTEIRA</p>
              <p className="text-sm font-bold text-brand-green font-mono">R$ {user.balance.toFixed(2)}</p>
            </div>
          </div>

          {/* User Profile */}
          <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-4">
            <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-brand-green" />
            <div>
              <p className="text-xs font-semibold text-white leading-tight">{user.name.split(' (')[0]}</p>
              <p className="text-[10px] text-brand-yellow font-mono">⭐ {user.reputation} Reputação</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs px-3 py-2 rounded-xl border border-red-500/20 duration-200"
            title="Sair da Conta"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Browse Stickers Market (Matches "usuarios: navegar em busca da figurinhas de interesse") */}
        <section className="lg:col-span-7 space-y-6">
          
          {/* Filtering Header Box with glass-card design */}
          <div className="glass-card rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Search size={14} className="text-brand-green" />
                Coleções e Figurinhas Disponíveis
              </h3>
              <span className="text-[10px] bg-slate-900/80 px-2 py-0.5 rounded text-brand-blue border border-white/5 font-mono">
                {filteredStickers.length} figurinhas encontradas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Search input */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar por nome ou código (ex: BRA-11)"
                  className="w-full bg-slate-900/60 border border-white/10 focus:border-brand-green rounded-xl py-2 pl-8 pr-3 text-xs text-white focus:outline-none transition"
                />
                <Search size={14} className="absolute left-2.5 top-2.5 text-gray-500" />
              </div>

              {/* Rarity filter dropdown */}
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-gray-400" />
                <select
                  value={rarityFilter}
                  onChange={(e) => setRarityFilter(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 focus:border-brand-green rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition font-sans"
                >
                  <option value="all">Todas as Raridades</option>
                  <option value="Lendária">Lendárias</option>
                  <option value="Brilhante">Brilhante</option>
                  <option value="Comum">Comum</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stickers Grid */}
          {filteredStickers.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center text-gray-400">
              <p className="text-base mb-1 font-bold">Nenhuma figurinha disponível encontrada</p>
              <p className="text-xs text-gray-500">Tente ajustar seus termos de pesquisa ou filtros de raridade.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredStickers.map((sticker) => {
                const isAbusive = sticker.price > sticker.suggestedPrice * 3;
                return (
                  <div
                    key={sticker.id}
                    className="glass-card hover:border-white/15 rounded-xl overflow-hidden p-3 flex gap-3 align-middle transition duration-300"
                  >
                    {/* Small Mini Sticker Image placeholder */}
                    <div className="relative w-20 h-28 bg-slate-950 border border-white/5 rounded-lg flex flex-col justify-between p-1.5 shrink-0 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 to-transparent" />
                      
                      <div className="flex justify-between items-center text-[7px] font-mono font-bold text-gray-400">
                        <span className="text-brand-yellow font-bold">{sticker.code}</span>
                        <span className="bg-slate-900 px-1 py-0.2 rounded scale-90">{sticker.rarity[0]}</span>
                      </div>

                      <div className="text-center my-auto">
                        <p className="text-[9px] font-extrabold text-white leading-tight uppercase font-mono tracking-tight text-ellipsis overflow-hidden truncate">
                          {sticker.name.split(' - ')[0]}
                        </p>
                        <p className="text-[6px] text-brand-green font-mono uppercase mt-0.5">{sticker.album.split(' ')[0]}</p>
                      </div>

                      <div className="text-[6px] text-gray-500 font-mono flex justify-between">
                        <span>Aberto</span>
                        <span className="text-brand-green font-bold">✓</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${
                            sticker.rarity === 'Lendária' ? 'bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/20' :
                            sticker.rarity === 'Brilhante' ? 'bg-brand-blue/15 text-brand-blue border border-brand-blue/20' :
                            'bg-brand-green/15 text-brand-green border border-brand-green/20'
                          }`}>
                            {sticker.rarity}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Dono: <strong className="text-slate-200">{sticker.ownerName.split(' ')[0]}</strong></span>
                        </div>
                        <h4 className="font-bold text-white text-sm mt-1">{sticker.name}</h4>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">Cód: {sticker.code} • {sticker.album}</p>
                      </div>

                      <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-gray-400 block font-mono">VALOR</span>
                          <span className="text-sm font-extrabold text-brand-green font-mono">R$ {sticker.price.toFixed(2)}</span>
                          {isAbusive && (
                            <span className="text-[8px] text-brand-yellow font-mono block animate-pulse">⚠️ Preço Inflacionado</span>
                          )}
                        </div>
                        
                        <button
                          onClick={() => startNegotiationFlow(sticker)}
                          className="bg-brand-blue hover:opacity-90 text-slate-900 font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition"
                        >
                          <MessageSquare size={12} />
                          Propor Troca
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: Ongoing active negotiations (Matches "clientes: possiveis negociaçoes em tempo real") */}
        <section className="lg:col-span-5 space-y-6">
          
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-white/5 pb-2">
              <MessageSquare size={14} className="text-brand-blue" />
              Minhas Negociações Ativas
            </h3>

            {negotiations.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                <p>Nenhuma negociação em andamento.</p>
                <p className="mt-1">Escolha uma figurinha ao lado para fazer uma proposta e começar a negociar.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {negotiations.map((neg) => {
                  const isActive = activeNegotiationId === neg.id;
                  return (
                    <button
                      key={neg.id}
                      onClick={() => setActiveNegotiationId(neg.id)}
                      className={`w-full text-left p-3 rounded-xl border transition ${
                        isActive
                          ? 'bg-brand-blue/5 border-brand-blue glow-blue/10 text-white'
                          : 'bg-slate-950/40 border-white/5 hover:border-white/10 text-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-gray-400 uppercase">Figurinha {neg.stickerCode}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                          neg.status === 'accepted' ? 'bg-brand-green/20 text-brand-green border border-brand-green/30' :
                          neg.status === 'declined' ? 'bg-red-500/10 text-red-400 border border-red-500/25' :
                          'bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20'
                        }`}>
                          {neg.status === 'accepted' ? 'Aceito ✓' : neg.status === 'declined' ? 'Recusado' : 'Aguardando'}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs truncate mt-0.5">{neg.stickerName}</h4>
                      <p className="text-[10px] text-gray-400 mt-1 font-mono flex justify-between">
                        <span>Vendedor: <strong className="text-gray-300">{neg.sellerName}</strong></span>
                        <span className="text-brand-green font-semibold">Oferta: R$ {neg.priceOffered.toFixed(2)}</span>
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Chat Box Area */}
          {activeNegotiation ? (
            <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-[400px]">
              
              {/* Chat Header */}
              <div className="bg-slate-950/85 p-3.5 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                    Negociando com {activeNegotiation.sellerName}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                    {activeNegotiation.stickerName} ({activeNegotiation.stickerCode})
                  </p>
                </div>

                <div className="bg-slate-900 border border-white/10 px-2 py-1 rounded text-right">
                  <span className="text-[8px] text-gray-500 block font-mono leading-none">OFERTADO</span>
                  <span className="text-xs font-bold text-brand-green font-mono leading-none">R$ {activeNegotiation.priceOffered.toFixed(2)}</span>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/20">
                {activeNegotiation.messages.map((msg) => {
                  const isMe = msg.senderId === user.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-mono mb-0.5">
                        <span>{msg.senderName.split(' ')[0]}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      
                      <div className={`p-2.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-brand-blue text-slate-950 rounded-tr-none font-medium'
                          : 'bg-slate-900 border border-white/10 text-slate-200 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>

                      {/* Flag notification in chat for demonstration */}
                      {msg.isToxic && (
                        <span className="text-[9px] text-brand-yellow font-mono mt-1 flex items-center gap-1">
                          <AlertTriangle size={10} />
                          Fiscalizado: Termos inadequados ou links externos sinalizados.
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleChatSend} className="bg-slate-950/80 p-3 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Envie uma mensagem ('lixo', 'golpe', 'zap' simulam auditoria de ADM)"
                  className="flex-1 bg-slate-900 border border-white/10 focus:border-brand-blue rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                />
                
                <button
                  type="submit"
                  className="bg-brand-blue hover:opacity-90 text-slate-900 p-2.5 rounded-xl transition shrink-0"
                  title="Enviar"
                >
                  <Send size={14} />
                </button>
              </form>

            </div>
          ) : (
            <div className="glass-card rounded-2xl p-8 text-center text-gray-500 text-xs text-mono">
              Selecione uma das negotiations ativas para ver as mensagens de chat e atualizar ofertas.
            </div>
          )}

        </section>
      </div>

      {/* NEW NEGOTIATION MODAL OVERLAY */}
      {selectedSticker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-slate-900 px-5 py-4 border-b border-white/5">
              <h3 className="font-bold text-white text-base">Iniciar Proposta de Negociação</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedSticker.name} ({selectedSticker.code})</p>
            </div>

            <div className="p-5 space-y-4">
              
              {/* Sticker Mini Summary Card */}
              <div className="flex gap-3 bg-slate-900/60 p-3 rounded-xl border border-white/5">
                <div className="w-12 h-16 bg-slate-950 border border-white/10 rounded flex flex-col justify-between p-1">
                  <span className="text-[7px] text-gray-500 font-mono">{selectedSticker.code}</span>
                  <p className="text-[7px] text-center text-white truncate uppercase font-bold">{selectedSticker.name.split(' - ')[0]}</p>
                  <span className="text-[6px] text-brand-yellow font-mono text-right font-bold">1/1</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{selectedSticker.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Dono Atual: {selectedSticker.ownerName}</p>
                  <div className="flex gap-3 mt-1.5 font-mono text-[10px]">
                    <span className="text-gray-400">Anunciado: <strong className="text-brand-green">R$ {selectedSticker.price.toFixed(2)}</strong></span>
                    <span className="text-gray-400">Sugerido: <strong className="text-slate-200">R$ {selectedSticker.suggestedPrice.toFixed(2)}</strong></span>
                  </div>
                </div>
              </div>

              {/* Offer field */}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                  Seu Valor de Proposta (R$)
                </label>
                <input
                  type="number"
                  value={customOffer}
                  onChange={(e) => setCustomOffer(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 focus:border-brand-green rounded-xl py-2 px-3 text-sm text-brand-green font-bold font-mono focus:outline-none"
                  placeholder="0.00"
                />
                <p className="text-[9px] text-slate-500 font-sans mt-1">
                  Evite propor valores excessivamente inflacionados/abusivos para evitar notificações de auditoria.
                </p>
              </div>

              {/* First Message */}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                  Mensagem Inicial
                </label>
                <textarea
                  rows={3}
                  value={initMessage}
                  onChange={(e) => setInitMessage(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 focus:border-brand-green rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  placeholder="Escreva algo amigável para o dono..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedSticker(null)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 border border-white/5 text-gray-400 text-xs py-2.5 rounded-xl font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={submitNewNegotiation}
                  className="flex-1 bg-brand-green text-slate-900 text-xs py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle size={14} />
                  Enviar Proposta
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
