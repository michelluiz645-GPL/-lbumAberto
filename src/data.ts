/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Sticker, Negotiation, SafetyReport } from './types';

// Predefined Demo Users
export const DEMO_USERS: Record<string, User> = {
  usuario: {
    id: 'u_buyer',
    name: 'Gabriel Silva (Comprador)',
    email: 'comprador@albumaberto.com',
    role: 'usuario',
    reputation: 4.8,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
    balance: 350.00,
  },
  cliente: {
    id: 'u_seller',
    name: 'Roberto Souza (Vendedor)',
    email: 'vendedor@albumaberto.com',
    role: 'cliente',
    reputation: 4.9,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120',
    balance: 1420.00,
  },
  adm: {
    id: 'u_admin',
    name: 'Amanda Costa (Moderadora)',
    email: 'admin@albumaberto.com',
    role: 'adm',
    reputation: 5.0,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    balance: 0,
  },
};

// Initial stickers active list
export const INITIAL_STICKERS: Sticker[] = [
  {
    id: 'st_1',
    name: 'Neymar Jr. - Extra Gold',
    album: 'Copa do Mundo 2026',
    rarity: 'Lendária',
    price: 450.00,
    suggestedPrice: 380.00,
    ownerId: 'u_seller',
    ownerName: 'Roberto Souza',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=300',
    code: 'LEG-NEY',
    status: 'disponivel',
  },
  {
    id: 'st_2',
    name: 'Lionel Messi - Chrome Legend',
    album: 'Lendas do Futebol',
    rarity: 'Lendária',
    price: 600.00,
    suggestedPrice: 550.00,
    ownerId: 'u_seller',
    ownerName: 'Roberto Souza',
    imageUrl: 'https://images.unsplash.com/photo-1540747737956-378721752670?auto=format&fit=crop&q=80&w=300',
    code: 'LEG-MES',
    status: 'disponivel',
  },
  {
    id: 'st_3',
    name: 'Kylian Mbappé - Brilhante',
    album: 'Copa do Mundo 2026',
    rarity: 'Brilhante',
    price: 180.00,
    suggestedPrice: 150.00,
    ownerId: 'u_seller',
    ownerName: 'Roberto Souza',
    imageUrl: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=300',
    code: 'FRA-07',
    status: 'negociando',
  },
  {
    id: 'st_4',
    name: 'Vinícius Júnior - Brilhante',
    album: 'Copa do Mundo 2026',
    rarity: 'Brilhante',
    price: 140.00,
    suggestedPrice: 120.00,
    ownerId: 'st_other_1',
    ownerName: 'Lucas Lima',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=300',
    code: 'BRA-11',
    status: 'disponivel',
  },
  {
    id: 'st_5',
    name: 'Erandir Silva - Comum',
    album: 'Mundial de Clubes',
    rarity: 'Comum',
    price: 250.00, // Preço abusivo proposital! Suggested: 2.00
    suggestedPrice: 2.00,
    ownerId: 'u_seller', // Roberto has this
    ownerName: 'Roberto Souza',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=300',
    code: 'MC-ERA',
    status: 'disponivel',
  },
  {
    id: 'st_6',
    name: 'Cristiano Ronaldo - Eterno',
    album: 'Lendas do Futebol',
    rarity: 'Lendária',
    price: 890.00, // Outro para fiscalização de pico ou aceito
    suggestedPrice: 500.00,
    ownerId: 'st_other_2',
    ownerName: 'Mariana Duarte',
    imageUrl: 'https://images.unsplash.com/photo-1540747737956-378721752670?auto=format&fit=crop&q=80&w=300',
    code: 'LEG-CR7',
    status: 'disponivel',
  },
  {
    id: 'st_7',
    name: 'Alisson Becker - Parede Azul',
    album: 'Copa do Mundo 2026',
    rarity: 'Comum',
    price: 3.50,
    suggestedPrice: 3.00,
    ownerId: 'st_other_1',
    ownerName: 'Lucas Lima',
    imageUrl: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=300',
    code: 'BRA-01',
    status: 'disponivel',
  },
  {
    id: 'st_8',
    name: 'De Paul - Meia de Aço',
    album: 'Copa do Mundo 2026',
    rarity: 'Comum',
    price: 15.00,
    suggestedPrice: 4.50,
    ownerId: 'u_seller',
    ownerName: 'Roberto Souza',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=300',
    code: 'ARG-07',
    status: 'disponivel',
  }
];

// Initial active negotiations
export const INITIAL_NEGOTIATIONS: Negotiation[] = [
  {
    id: 'neg_1',
    stickerId: 'st_3',
    stickerName: 'Kylian Mbappé - Brilhante',
    stickerCode: 'FRA-07',
    stickerPrice: 180.00,
    buyerId: 'u_buyer',
    buyerName: 'Gabriel Silva',
    sellerId: 'u_seller',
    sellerName: 'Roberto Souza',
    priceOffered: 165.00,
    status: 'pending',
    lastUpdated: '12:45',
    messages: [
      {
        id: 'msg_1_1',
        senderId: 'u_buyer',
        senderName: 'Gabriel Silva',
        text: 'Olá Roberto! Vi que anunciou o Mbappé brilhante por 180. Aceita fechar por 165 agora?',
        timestamp: '12:40'
      },
      {
        id: 'msg_1_2',
        senderId: 'u_seller',
        senderName: 'Roberto Souza',
        text: 'Opa Gabriel, tudo bem? 165 fica um pouco apertado porque ela está conservada no plástico individual. Consegue subir para 170?',
        timestamp: '12:43'
      },
      {
        id: 'msg_1_3',
        senderId: 'u_buyer',
        senderName: 'Gabriel Silva',
        text: 'Fechado em 170 se me mandar um brinde surpresa!',
        timestamp: '12:45'
      }
    ]
  },
  {
    id: 'neg_2',
    stickerId: 'st_5',
    stickerName: 'Erandir Silva - Comum',
    stickerCode: 'MC-ERA',
    stickerPrice: 250.00,
    buyerId: 'u_buyer_other',
    buyerName: 'Pedro Antunes',
    sellerId: 'u_seller',
    sellerName: 'Roberto Souza',
    priceOffered: 240.00,
    status: 'pending',
    lastUpdated: '11:32',
    messages: [
      {
        id: 'msg_2_1',
        senderId: 'u_buyer_other',
        senderName: 'Pedro Antunes',
        text: 'Você está louco cobrando 250 em uma figurinha comum! Isso é roubo!',
        timestamp: '11:28',
        isToxic: true
      },
      {
        id: 'msg_2_2',
        senderId: 'u_seller',
        senderName: 'Roberto Souza',
        text: 'Não compre se está sem dinheiro, otário. O preço é o que eu quiser colocar.',
        timestamp: '11:30',
        isToxic: true
      },
      {
        id: 'msg_2_3',
        senderId: 'u_buyer_other',
        senderName: 'Pedro Antunes',
        text: 'Vou denunciar sua conta por golpe, seu moleque vagabundo!',
        timestamp: '11:32',
        isToxic: true
      }
    ]
  }
];

// Security Reports (for Admin interface)
export const INITIAL_REPORTS: SafetyReport[] = [
  {
    id: 'rep_1',
    type: 'abusivo',
    description: 'Figurinha comum MC-ERA listada com 12.400% acima do preço sugerido de mercado.',
    source: 'Filtro Automático de Margem',
    targetId: 'st_5',
    targetName: 'MC-ERA (Roberto Souza)',
    timestamp: '2026-06-04 11:15',
    status: 'pendente',
    severity: 'media',
    contextDetails: 'Preço sugerido: R$ 2,00. Preço anunciado: R$ 250,00.'
  },
  {
    id: 'rep_2',
    type: 'comportamento',
    description: 'Discurso ofensivo e agressivo detectado no chat de negociação.',
    source: 'Filtro de Toxicidade de Textos',
    targetId: 'neg_2',
    targetName: 'Chat #neg_2 (Roberto x Pedro)',
    timestamp: '2026-06-04 11:33',
    status: 'pendente',
    severity: 'alta',
    contextDetails: 'Palavras sinalizadas: "louco", "roubo", "otário", "vagabundo".'
  },
  {
    id: 'rep_3',
    type: 'golpe',
    description: 'Solicitação de pagamento por link fora da plataforma detectada.',
    source: 'Monitor de Links Externos',
    targetId: 'neg_1',
    targetName: 'Chat #neg_1 (Roberto x Gabriel)',
    timestamp: '2026-06-04 10:20',
    status: 'resolvido',
    severity: 'alta',
    contextDetails: 'Nenhum link malicioso real encontrado, resolvido após verificação de reputação positiva.'
  }
];
