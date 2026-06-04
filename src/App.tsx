/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import BuyerDashboard from './components/BuyerDashboard';
import ClientDashboard from './components/ClientDashboard';
import AdminPanel from './components/AdminPanel';
import { User, Sticker, Negotiation, SafetyReport } from './types';
import { DEMO_USERS, INITIAL_STICKERS, INITIAL_NEGOTIATIONS, INITIAL_REPORTS } from './data';
import { Shield, Sparkles, LogOut, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Session tracking
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState<boolean>(false);

  // Global persistence states (simulated client-side)
  const [stickers, setStickers] = useState<Sticker[]>(INITIAL_STICKERS);
  const [negotiations, setNegotiations] = useState<Negotiation[]>(INITIAL_NEGOTIATIONS);
  const [reports, setReports] = useState<SafetyReport[]>(INITIAL_REPORTS);

  // Quick administrative shortcut from landing header
  const handleQuickAdminBypass = () => {
    setCurrentUser(DEMO_USERS.adm);
    setShowLogin(false);
  };

  // Login completion handler
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Sticker listing creation (Client flow)
  const handleAddSticker = (newStickerInfo: Omit<Sticker, 'id' | 'ownerId' | 'ownerName' | 'status'>) => {
    if (!currentUser) return;
    
    const configuredSticker: Sticker = {
      ...newStickerInfo,
      id: `st_${Date.now()}`,
      ownerId: currentUser.id,
      ownerName: currentUser.name.split(' (')[0],
      status: 'disponivel'
    };

    setStickers((prev) => [configuredSticker, ...prev]);
  };

  // Sticker listed price updating (Client flow or Admin enforcement flow)
  const handleUpdateStickerPrice = (stickerId: string, newPrice: number) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === stickerId ? { ...s, price: newPrice } : s))
    );
  };

  // Initiating a new offer bid (Buyer flow)
  const handleNewNegotiation = (stickerId: string, offerPrice: number, firstMessageText: string) => {
    if (!currentUser) return;

    const sticker = stickers.find((s) => s.id === stickerId);
    if (!sticker) return;

    const newNegId = `neg_${Date.now()}`;
    const buyerShort = currentUser.name.split(' (')[0];

    const newNeg: Negotiation = {
      id: newNegId,
      stickerId: sticker.id,
      stickerName: sticker.name,
      stickerCode: sticker.code,
      stickerPrice: sticker.price,
      buyerId: currentUser.id,
      buyerName: buyerShort,
      sellerId: sticker.ownerId,
      sellerName: sticker.ownerName,
      priceOffered: offerPrice,
      status: 'pending',
      lastUpdated: 'Agora',
      messages: [
        {
          id: `msg_init_${Date.now()}`,
          senderId: currentUser.id,
          senderName: buyerShort,
          text: firstMessageText,
          timestamp: 'Agora'
        }
      ]
    };

    setNegotiations((prev) => [...prev, newNeg]);
    
    // Set sticker state to busy
    setStickers((prev) =>
      prev.map((s) => (s.id === stickerId ? { ...s, status: 'negociando' } : s))
    );

    // Dynamic auto-answer simulation to make the negotiations super interactive!
    setTimeout(() => {
      setNegotiations((prev) =>
        prev.map((n) => {
          if (n.id !== newNegId) return n;
          return {
            ...n,
            messages: [
              ...n.messages,
              {
                id: `msg_reply_${Date.now()}`,
                senderId: sticker.ownerId,
                senderName: sticker.ownerName,
                text: `Opa ${buyerShort}! Obrigado pelo contato comercial. Deixei seu valor marcado de R$ ${offerPrice.toFixed(2)} registrado aqui na minha central! Me passe seu CEP para eu calcular o frete da figurinha no envelope com plástico de proteção.`,
                timestamp: 'Agora mesmo'
              }
            ]
          };
        })
      );
    }, 2500);
  };

  // Messaging exchange handler with smart reactive simulated feedback
  const handleSendMessage = (negotiationId: string, text: string) => {
    if (!currentUser) return;

    const userShortName = currentUser.name.split(' (')[0];

    setNegotiations((prev) =>
      prev.map((n) => {
        if (n.id !== negotiationId) return n;
        
        let toxicFlag = false;
        const lowerTxt = text.toLowerCase();
        
        // Tag toxic flags in conversations internally
        if (lowerTxt.includes('lixo') || lowerTxt.includes('burro') || lowerTxt.includes('vagabundo') || lowerTxt.includes('roubo') || lowerTxt.includes('otário') || lowerTxt.includes('golpe') || lowerTxt.includes('zap') || lowerTxt.includes('por fora')) {
          toxicFlag = true;
        }

        return {
          ...n,
          messages: [
            ...n.messages,
            {
              id: `msg_${Date.now()}`,
              senderId: currentUser.id,
              senderName: userShortName,
              text: text,
              isToxic: toxicFlag,
              timestamp: 'Agora'
            }
          ]
        };
      })
    );
  };

  // Accepting a purchase offer: includes wallet balance transfers (Gabriel to Roberto and vice versa)
  const handleAcceptNegotiation = (negotiationId: string) => {
    const activeNeg = negotiations.find((n) => n.id === negotiationId);
    if (!activeNeg) return;

    // Check money transfer criteria
    const price = activeNeg.priceOffered;

    // Update statuses
    setNegotiations((prev) =>
      prev.map((n) => (n.id === negotiationId ? { ...n, status: 'accepted' } : n))
    );

    setStickers((prev) =>
      prev.map((s) => (s.id === activeNeg.stickerId ? { ...s, ownerId: activeNeg.buyerId, ownerName: activeNeg.buyerName, status: 'vendida', price: price } : s))
    );

    // Transfer money: deduct buyer profile (if Gabriel), credit Roberto's balance
    if (activeNeg.buyerId === 'u_buyer') {
      DEMO_USERS.usuario.balance -= price;
    }
    if (activeNeg.sellerId === 'u_seller') {
      DEMO_USERS.cliente.balance += price;
    }

    alert(`🎉 Negociação Concluída! A figurinha ${activeNeg.stickerCode} foi transferida e R$ ${price.toFixed(2)} foram computados na carteira do vendedor com sucesso.`);
  };

  const handleDeclineNegotiation = (negotiationId: string) => {
    setNegotiations((prev) =>
      prev.map((n) => (n.id === negotiationId ? { ...n, status: 'declined' } : n))
    );
    
    // Release sticker back to market
    const activeNeg = negotiations.find((n) => n.id === negotiationId);
    if (activeNeg) {
      setStickers((prev) =>
        prev.map((s) => (s.id === activeNeg.stickerId ? { ...s, status: 'disponivel' } : s))
      );
    }
  };

  // Create a safety safety report from user dashboard triggers
  const handleRegisterSafetyReport = (info: {
    type: 'abusivo' | 'comportamento' | 'golpe';
    description: string;
    context: string;
    targetName: string;
    targetId: string;
  }) => {
    const isAlreadyReported = reports.some((r) => r.description === info.description && r.status === 'pendente');
    if (isAlreadyReported) return;

    const newRep: SafetyReport = {
      id: `rep_${Date.now()}`,
      type: info.type,
      description: info.description,
      source: 'Filtro de IA Automático',
      targetId: info.targetId,
      targetName: info.targetName,
      timestamp: 'Hoje ás ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'pendente',
      severity: info.type === 'golpe' ? 'alta' : info.type === 'comportamento' ? 'alta' : 'media',
      contextDetails: info.context
    };

    setReports((prev) => [newRep, ...prev]);
  };

  // Administration response controls
  const handleResolveReport = (reportId: string, actionType: 'notificar' | 'suspender_anuncio' | 'banir' | 'arquivar') => {
    
    const targetReport = reports.find((r) => r.id === reportId);
    if (!targetReport) return;

    // Apply specific actions according to type
    if (actionType === 'suspender_anuncio') {
      // 1. Regular abusive prices: Find the matching sticker or listing and set its price back to suggested, or delete.
      if (targetReport.type === 'abusivo') {
        const matchingSticker = stickers.find((s) => s.code === targetReport.targetName.split(' ')[0]);
        if (matchingSticker) {
          handleUpdateStickerPrice(matchingSticker.id, matchingSticker.suggestedPrice);
          alert(`🔨 Medida Geral: O preço da figurinha ${matchingSticker.code} foi normalizado administrativamente de R$ ${matchingSticker.price.toFixed(2)} para R$ ${matchingSticker.suggestedPrice.toFixed(2)} (Valor sugerido de mercado).`);
        } else {
          // Fallback reverse price of st_5 (Erandir Common) which has code MC-ERA
          handleUpdateStickerPrice('st_5', 2.00);
          alert(`🔨 Preços Abusivos Fiscalizados: O preço do anúncio foi normalizado para R$ 2,00.`);
        }
      } else {
        alert('🔨 Anúncio suspenso ou retirado do catálogo para fiscalização.');
      }
    } else if (actionType === 'notificar') {
      alert(`✉️ Punição de Conduta: Foi enviado um aviso formal disciplinar para a conta infratora. Reputação decrementada.`);
    } else if (actionType === 'banir') {
      alert(`💀 Bloqueio Máximo: Conta e carteiras associadas foram banidas de participar de negociações no ÁlbumAberto por comportamento irregular repetido.`);
    }

    // Mark report as resolved
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resolvido' } : r))
    );
  };

  const handleLandingStickerClick = (sticker: Sticker) => {
    setShowLogin(true);
  };

  return (
    <div className="min-h-screen relative flex flex-col font-sans selection:bg-brand-green selection:text-slate-900 bg-[#020617] text-white">
      {/* Frosted Glass Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-[30%] right-[10%] w-[25%] h-[25%] bg-yellow-400/5 rounded-full blur-[80px] pointer-events-none"></div>
      </div>
      
      {/* Main content layer */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* RENDER THE RIGHT SCREEN BASED ON ACTIVE SESSION ROLE OR DEFAULT LANDING */}
      {!currentUser ? (
        <LandingPage
          stickers={stickers}
          onOpenLogin={() => setShowLogin(true)}
          onQuickAdmin={handleQuickAdminBypass}
          onExploreSticker={handleLandingStickerClick}
        />
      ) : (
        <>
          {/* USER DASBOARD SESSIONS */}
          {currentUser.role === 'usuario' && (
            <BuyerDashboard
              user={currentUser}
              stickers={stickers}
              negotiations={negotiations}
              onLogout={handleLogout}
              onNewNegotiation={handleNewNegotiation}
              onSendMessage={handleSendMessage}
              onTriggerTriggerSafetyReport={handleRegisterSafetyReport}
            />
          )}

          {currentUser.role === 'cliente' && (
            <ClientDashboard
              user={currentUser}
              stickers={stickers}
              negotiations={negotiations}
              onLogout={handleLogout}
              onAddSticker={handleAddSticker}
              onUpdateStickerPrice={handleUpdateStickerPrice}
              onAcceptNegotiation={handleAcceptNegotiation}
              onDeclineNegotiation={handleDeclineNegotiation}
              onSendMessage={handleSendMessage}
              onTriggerSafetyReport={handleRegisterSafetyReport}
            />
          )}

          {/* ADMIN INTERFACE */}
          {currentUser.role === 'adm' && (
            <AdminPanel
              user={currentUser}
              reports={reports}
              stickers={stickers}
              negotiations={negotiations}
              onLogout={handleLogout}
              onResolveReport={handleResolveReport}
            />
          )}
        </>
      )}

      {/* LOGIN POPUP MODAL */}
      {showLogin && (
        <LoginForm
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      </div>
    </div>
  );
}
