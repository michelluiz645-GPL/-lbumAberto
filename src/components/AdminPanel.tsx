/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Hammer, AlertTriangle, MessageSquare, Check, X, Bell, UserX, HelpCircle, LogOut, Info, ArrowRight, Skull } from 'lucide-react';
import { SafetyReport, Sticker, Negotiation, User } from '../types';

interface AdminPanelProps {
  user: User;
  reports: SafetyReport[];
  stickers: Sticker[];
  negotiations: Negotiation[];
  onLogout: () => void;
  onResolveReport: (reportId: string, actionType: 'notificar' | 'suspender_anuncio' | 'banir' | 'arquivar') => void;
}

export default function AdminPanel({
  user,
  reports,
  stickers,
  negotiations,
  onLogout,
  onResolveReport
}: AdminPanelProps) {
  const [filterType, setFilterType] = useState<'todos' | 'abusivo' | 'comportamento' | 'golpe'>('todos');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(
    reports.length > 0 ? reports[0].id : null
  );

  // Filter reports
  const filteredReports = reports.filter((rep) => {
    if (filterType === 'todos') return true;
    return rep.type === filterType;
  });

  const selectedReport = reports.find((r) => r.id === selectedReportId);

  // Quick lookup calculations for stats widgets
  const totalStickers = stickers.length;
  const countAbusiveAlerts = reports.filter((r) => r.type === 'abusivo' && r.status === 'pendente').length;
  const countToxicAlerts = reports.filter((r) => r.type === 'comportamento' && r.status === 'pendente').length;
  const countScamAlerts = reports.filter((r) => r.type === 'golpe' && r.status === 'pendente').length;

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-slate-100 pb-12">
      
      {/* Admin Safety Bar with glowing yellow styling representing surveillance */}
      <nav className="sticky top-0 z-40 bg-white/5 backdrop-blur-md border-b border-white/10 py-5 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-blue-600 rounded-lg flex items-center justify-center font-black text-base text-white shadow-lg shadow-green-500/10">
            Á
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Álbum<span className="text-yellow-400">Aberto</span> <span className="text-[10px] font-mono bg-brand-yellow/10 text-brand-yellow border border-[#facc15]/30 px-2 py-0.5 rounded">Mesa Administrativa Interna</span>
            </h2>
            <p className="text-[9px] text-white/40 font-mono tracking-widest uppercase mt-0.5">AGENTE DE FISCALIZAÇÃO: {user.name.toUpperCase()}</p>
          </div>
        </div>

        {/* Profile Info & Logout */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          
          <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-white/10">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-green animate-ping" />
            <span className="text-[11px] font-mono text-brand-green">CONEXÃO AUDITADA SEGURA</span>
          </div>

          <div className="flex items-center gap-2">
            <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-brand-yellow" />
            <div>
              <p className="text-xs font-bold text-white leading-tight">{user.name.split(' (')[0]}</p>
              <p className="text-[9px] text-brand-yellow font-mono font-semibold">Nível 5 Moderador</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs px-3.5 py-2 rounded-xl border border-red-500/15 duration-200 ml-2"
            title="Sair do Canal de Auditoria"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Sair do Painel</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 mt-6 space-y-6">
        
        {/* TOP STATUS ROW WRITTEN PROUDLY WITH CORES VERDE, AMARELO, AZUL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* STAT 1: Abusive Price Warnings */}
          <div className="glass-card rounded-2xl p-4.5 border-l-4 border-brand-yellow relative overflow-hidden">
            <div className="absolute top-2 right-2 text-brand-yellow/20">
              <AlertTriangle size={32} />
            </div>
            <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">PREÇOS ABUSIVOS SINALIZADOS</p>
            <p className="text-2xl font-extrabold text-brand-yellow font-mono mt-1">{countAbusiveAlerts} pendentes</p>
            <p className="text-[11px] text-gray-400 mt-1">Margens absurdas auditadas ao vivo</p>
          </div>

          {/* STAT 2: Toxic behavior alerts */}
          <div className="glass-card rounded-2xl p-4.5 border-l-4 border-brand-green relative overflow-hidden">
            <div className="absolute top-2 right-2 text-brand-green/20">
              <MessageSquare size={32} />
            </div>
            <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">AVISOS DE CHAT TÓXICO</p>
            <p className="text-2xl font-extrabold text-brand-green font-mono mt-1">{countToxicAlerts} ativos</p>
            <p className="text-[11px] text-gray-400 mt-1">Insultos flagrados nos chats</p>
          </div>

          {/* STAT 3: FRAUD BLOCK (GOLPES) */}
          <div className="glass-card rounded-2xl p-4.5 border-l-4 border-brand-blue relative overflow-hidden">
            <div className="absolute top-2 right-2 text-brand-blue/20">
              <Shield size={32} />
            </div>
            <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">SUSPEITAS DE FRAUDE / GOLPE</p>
            <p className="text-2xl font-extrabold text-brand-blue font-mono mt-1">{countScamAlerts} detectados</p>
            <p className="text-[11px] text-gray-400 mt-1">Links ou pagamentos por fora bloqueados</p>
          </div>

          {/* STAT 4: VOLUME */}
          <div className="glass-card rounded-2xl p-4.5 border-l-4 border-white/10 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-white/10">
              <Bell size={32} />
            </div>
            <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">TOTAL HISTÓRICO DE FIGURINHAS</p>
            <p className="text-2xl font-extrabold text-white font-mono mt-1">{totalStickers} itens</p>
            <p className="text-[11px] text-gray-400 mt-1">Segurança de escopo a 100%</p>
          </div>

        </div>

        {/* CORE CONSOLE COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* QUEUE SIDEBAR (Left column) */}
          <section className="lg:col-span-6 space-y-4">
            
            <div className="glass-card rounded-2xl p-4 space-y-4">
              
              {/* Filter Tabs matching verde, amarelo, azul */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Shield size={14} className="text-brand-yellow animate-pulse" />
                  Filas de Ocorrências Ativas
                </h3>

                <div className="flex gap-1 overflow-x-auto">
                  <button
                    onClick={() => setFilterType('todos')}
                    className={`text-[10px] px-2.5 py-1 rounded font-mono ${filterType === 'todos' ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:bg-white/5'}`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFilterType('abusivo')}
                    className={`text-[10px] px-2.5 py-1 rounded font-mono flex items-center gap-1 ${filterType === 'abusivo' ? 'bg-brand-yellow/20 text-brand-yellow font-bold' : 'text-gray-400 hover:bg-white/5'}`}
                  >
                    Preços
                  </button>
                  <button
                    onClick={() => setFilterType('comportamento')}
                    className={`text-[10px] px-2.5 py-1 rounded font-mono flex items-center gap-1 ${filterType === 'comportamento' ? 'bg-brand-green/20 text-brand-green font-bold' : 'text-gray-400 hover:bg-white/5'}`}
                  >
                    Abusos
                  </button>
                  <button
                    onClick={() => setFilterType('golpe')}
                    className={`text-[10px] px-2.5 py-1 rounded font-mono flex items-center gap-1 ${filterType === 'golpe' ? 'bg-brand-blue/20 text-brand-blue font-bold' : 'text-gray-400 hover:bg-white/5'}`}
                  >
                    Golpes
                  </button>
                </div>
              </div>

              {/* Warnings loop */}
              {filteredReports.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  <p>✓ Nenhuma ocorrência pendente nesta categoria.</p>
                  <p className="mt-1">A plataforma ÁlbumAberto está saudável e monitorada.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                  {filteredReports.map((rep) => {
                    const isSelected = selectedReportId === rep.id;
                    return (
                      <button
                        key={rep.id}
                        onClick={() => setSelectedReportId(rep.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3.5 ${
                          isSelected
                            ? 'bg-zinc-900 border-brand-yellow glow-yellow/10'
                            : 'bg-slate-950/40 border-white/5 hover:border-white/10'
                        }`}
                      >
                        {/* Icon aligned with alert type colors */}
                        <div className={`p-2.5 rounded-lg shrink-0 ${
                          rep.type === 'abusivo' ? 'bg-brand-yellow/10 text-brand-yellow' :
                          rep.type === 'comportamento' ? 'bg-brand-green/10 text-brand-green' :
                          'bg-brand-blue/10 text-brand-blue'
                        }`}>
                          {rep.type === 'abusivo' ? <AlertTriangle size={15} /> :
                           rep.type === 'comportamento' ? <MessageSquare size={15} /> :
                           <Shield size={15} />}
                        </div>

                        {/* Content text metadata */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-[9px] font-mono text-gray-400 uppercase">{rep.source}</span>
                            <span className={`text-[8.5px] px-1.5 py-0.2 rounded uppercase font-mono ${rep.status === 'pendente' ? 'bg-brand-yellow/10 text-brand-yellow' : 'bg-slate-900 text-gray-400'}`}>
                              {rep.status}
                            </span>
                          </div>

                          <h4 className="font-bold text-xs truncate mt-1 text-white">{rep.targetName}</h4>
                          <p className="text-[11px] text-gray-400 mt-1 leading-snug line-clamp-2">{rep.description}</p>
                          
                          <div className="mt-2.5 flex items-center justify-between text-[9px] font-mono text-gray-500">
                            <span>Surgido em: {rep.timestamp}</span>
                            <span className={`font-bold uppercase ${rep.severity === 'alta' ? 'text-red-400' : rep.severity === 'media' ? 'text-brand-yellow' : 'text-gray-400'}`}>
                              Severidade {rep.severity}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

            </div>
          </section>

          {/* AUDIT & DIRECT MODERATION ACTIONS (Right Column) */}
          <section className="lg:col-span-6 space-y-4">
            {selectedReport ? (
              <div className="glass-card rounded-2xl p-5 space-y-5">
                
                {/* Header detail info */}
                <div className="border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      selectedReport.type === 'abusivo' ? 'bg-brand-yellow' :
                      selectedReport.type === 'comportamento' ? 'bg-brand-green' :
                      'bg-brand-blue'
                    }`} />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Visualizar Caso #{selectedReport.id}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 font-mono">Sinalizado por: {selectedReport.source} às {selectedReport.timestamp}</p>
                </div>

                {/* Core description block */}
                <div className="bg-slate-950/70 p-4 rounded-xl border border-white/5">
                  <h4 className="text-[10px] text-gray-400 font-mono uppercase font-bold mb-1">DETALHES DA DETECÇÃO</h4>
                  <p className="text-xs text-white leading-relaxed font-semibold">{selectedReport.description}</p>
                  
                  {selectedReport.contextDetails && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <h4 className="text-[10px] text-gray-400 font-mono uppercase font-bold mb-1">CONTEXTO CAPTURADO</h4>
                      <p className="text-xs font-mono text-brand-yellow bg-slate-900 p-2 rounded border border-white/5 whitespace-pre-wrap leading-relaxed">{selectedReport.contextDetails}</p>
                    </div>
                  )}
                </div>

                {/* Simulated Audit logs inside conversation if report has chat metadata */}
                {selectedReport.type === 'comportamento' && (
                  <div className="bg-slate-950/80 p-4.5 rounded-xl border border-white/5 space-y-3">
                    <h4 className="text-[10px] text-gray-400 font-mono uppercase font-bold border-b border-white/5 pb-1 flex items-center justify-between">
                      <span>Log da Conversa Monitorada</span>
                      <span className="text-red-400 text-[8px] uppercase">Contém ofensas</span>
                    </h4>

                    {/* Show a helpful copy of our mock conversation with highlighted toxic words */}
                    <div className="space-y-2 text-[11px] max-h-36 overflow-y-auto">
                      <div className="p-2 bg-slate-900/60 rounded border border-white/5">
                        <strong className="text-brand-blue font-mono">Pedro:</strong> "Você está <span className="text-brand-yellow font-bold underline">louco</span> cobrando 250 em uma figurinha comum! Isso é <span className="text-brand-yellow font-bold underline">roubo</span>!"
                      </div>
                      <div className="p-2 bg-slate-900/60 rounded border border-white/5">
                        <strong className="text-brand-green font-mono">Roberto:</strong> "Não compre se está sem dinheiro, <span className="text-brand-yellow font-bold underline">otário</span>. O preço é o que eu quiser."
                      </div>
                      <div className="p-2 bg-slate-900/80 rounded border-brand-yellow/30 bg-brand-yellow/5">
                        <strong className="text-brand-blue font-mono">Pedro:</strong> "Vou denunciar sua conta por golpe, seu moleque <span className="text-brand-yellow font-bold underline">vagabundo</span>!"
                      </div>
                    </div>
                  </div>
                )}

                {/* Action panel with 3 massive choices requested: Avoid scam, toxic, abusive pricing. */}
                {selectedReport.status === 'pendente' ? (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Ações de Resolução de Segurança</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      
                      {/* Action 1: Warnings */}
                      <button
                        onClick={() => onResolveReport(selectedReport.id, 'notificar')}
                        className="bg-brand-blue/15 hover:bg-brand-blue/20 text-brand-blue text-xs font-bold p-3 rounded-xl border border-brand-blue/25 transition duration-200 flex items-center gap-2"
                      >
                        <Bell size={15} />
                        <div>
                          <p className="text-left font-bold text-xs">Notificar Usuários</p>
                          <p className="text-left text-[9px] text-gray-400 font-normal">Aplicar multa ou advertência formal</p>
                        </div>
                      </button>

                      {/* Action 2: Lower Price or Cancel sticker listing */}
                      <button
                        onClick={() => onResolveReport(selectedReport.id, 'suspender_anuncio')}
                        className="bg-brand-yellow/15 hover:bg-brand-yellow/20 text-brand-yellow text-xs font-bold p-3 rounded-xl border border-brand-yellow/25 transition duration-200 flex items-center gap-2"
                      >
                        <Hammer size={15} />
                        <div>
                          <p className="text-left font-bold text-xs">Regular Preço Abusivo</p>
                          <p className="text-left text-[9px] text-gray-400 font-normal">Zerar margem ou retirar anúncio</p>
                        </div>
                      </button>

                      {/* Action 3: Suspend/Ban account */}
                      <button
                        onClick={() => onResolveReport(selectedReport.id, 'banir')}
                        className="bg-red-500/15 hover:bg-red-500/20 text-red-400 text-xs font-bold p-3 rounded-xl border border-red-500/25 transition duration-200 flex items-center gap-2 sm:col-span-2"
                      >
                        <UserX size={15} />
                        <div>
                          <p className="text-left font-bold text-xs">Ação Máxima: Suspender Cadastro</p>
                          <p className="text-left text-[9px] text-gray-400 font-normal">Banir perpetuamente carteiras toxicologistas ou golpistas</p>
                        </div>
                      </button>

                    </div>

                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => onResolveReport(selectedReport.id, 'arquivar')}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-gray-400 text-xs py-2 rounded-lg font-mono transition text-center"
                      >
                        Verificado: Arquivar Caso sem punições
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="p-4 bg-brand-green/10 rounded-xl border border-brand-green/20 text-center space-y-2">
                    <span className="text-brand-green text-sm font-extrabold uppercase font-mono tracking-widert">✔ OCORRÊNCIA PACIFICADA</span>
                    <p className="text-xs text-gray-400">Esta notificação foi analisada e arquivada pela Mesa Moderadora do ÁlbumAberto.</p>
                  </div>
                )}

              </div>
            ) : (
              <div className="glass-card rounded-2xl p-10 text-center text-gray-500 text-xs font-mono">
                Selecione uma denúncia de preço, comportamento ou golpe ao lado para auditar conversas e tomar decisões de segurança.
              </div>
            )}

            {/* General informative guidelines */}
            <div className="glass-card rounded-2xl p-4.5 space-y-2.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Info size={14} className="text-brand-blue" />
                Guia Único ADM de Conduta
              </h4>
              <ul className="space-y-1.5 text-[11px] text-gray-400">
                <li>• <strong>Preços Inflacionados:</strong> Bloquear anúncios que cobram acima de 300% do sugerido da figurinha sem o selo comemorativo certificado.</li>
                <li>• <strong>Comportamento Hostil:</strong> Frases contendo xingamentos geram advertência amarela inicial; reincidentes perdem reputação comercial.</li>
                <li>• <strong>Indício de Golpes:</strong> Links fraudulentos geram suspensão sumária. O ÁlbumAberto garante transações apenas no chat nativo.</li>
              </ul>
            </div>

          </section>

        </div>

      </div>

    </div>
  );
}
