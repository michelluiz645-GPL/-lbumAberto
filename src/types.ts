/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'usuario' | 'cliente' | 'adm';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  reputation: number; // 0 to 5
  avatar: string;
  balance: number; // For simulation purposes
}

export interface Sticker {
  id: string;
  name: string;
  album: string;
  rarity: 'Comum' | 'Rara' | 'Lendária' | 'Brilhante';
  price: number; // Current listed price
  suggestedPrice: number; // Safety threshold price (to spot "preços abusivos")
  ownerId: string;
  ownerName: string;
  imageUrl: string;
  code: string; // e.g. "BRA-10", "ARG-10"
  status: 'disponivel' | 'negociando' | 'vendida';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isToxic?: boolean; // Flagged by moderator flow or automatic checks
}

export interface Negotiation {
  id: string;
  stickerId: string;
  stickerName: string;
  stickerCode: string;
  stickerPrice: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  priceOffered: number;
  status: 'pending' | 'accepted' | 'declined' | 'countered';
  messages: ChatMessage[];
  lastUpdated: string;
}

export interface SafetyReport {
  id: string;
  type: 'abusivo' | 'comportamento' | 'golpe';
  description: string;
  source: string; // 'Filtro Automático' or user action
  targetId: string; // Sticker ID or Negotiation ID
  targetName: string; // e.g. the sticker code or buyer name
  timestamp: string;
  status: 'pendente' | 'resolvido' | 'arquivado';
  severity: 'alta' | 'media' | 'baixa';
  contextDetails?: string;
}
