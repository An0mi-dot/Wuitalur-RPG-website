/**
 * WUITTER — Rede Social In-Universe de Wuitalur RPG
 * Sincronização Persistente em Nuvem (Supabase DB + WebSocket + Polling), Zero Emojis
 */

const WUITTER_STORAGE_POSTS = 'wuitter_posts_v2';
const WUITTER_STORAGE_ACCOUNTS = 'wuitter_accounts_v2';
const WUITTER_STORAGE_TOKEN = 'mesa_token';

const SUPABASE_CONFIG = {
  url: 'https://qkupdpgcjusbedaoahwi.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdXBkcGdjanVzYmVkYW9haHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNzk1ODAsImV4cCI6MjEwMzc1NTU4MH0.UDc5nE7ZwUyWmwNZKpq7bGrty1N6Uh0bjq2PJtBkVrk'
};

// SVGs Dedicados (100% livres de emojis)
const SVG_ICONS = {
  wLogo: `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4l4.5 16L12 9l4.5 11L21 4"/></svg>`,
  verifiedBlue: `<svg class="w-badge-verified w-badge-blue" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>`,
  verifiedGold: `<svg class="w-badge-verified w-badge-gold" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  comment: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  rewuit: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  like: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  share: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  image: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  settings: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  crown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  arrowLeft: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  calendar: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
};

// Hashes oficiais do Mestre (compatíveis com Mesa Virtual)
const MASTER_HASHES = [
  '3be80f43b640706663346f0b1fb5aa2a9c26e6b6d27a934139854e111355a93b', // Z9K4
  'c43cc5a2574d90e4a87d2ba0db242c99b3cdc0cbfd8c94448724b591320953ef'  // WUI-Z9K4-MAST
];

const MASTER_PLAIN_TOKENS = ['Z9K4', 'WUI-Z9K4-MAST', 'MESTRE', 'MASTER', 'ADM', 'ADMIN', 'GM', 'Z9K4-MAST'];

// Contas Padrão Vinculadas aos Tokens do Sistema
const DEFAULT_ACCOUNTS = [
  {
    id: 'mestre',
    slot: null,
    tokens: MASTER_PLAIN_TOKENS,
    hashes: MASTER_HASHES,
    name: 'Mestre',
    handle: '@mestre',
    bio: 'Narrador e arquiteto de Wuitalur. Controle de eventos globais, anomalias e decretos do destino.',
    avatarLetter: 'M',
    avatarImage: '',
    avatarColor: '#ff1133',
    badge: 'gold',
    isMaster: true
  },
  {
    id: 'char_1',
    followingCount: 38,
    followersCount: 312,
    followingList: ['npc_sara', 'char_2', 'char_3', 'char_4', 'char_5', 'char_6', 'char_7', 'char_8', 'npc_gazeta_paladium'],
    followersList: ['npc_sara', 'char_2', 'char_3', 'char_4', 'char_5', 'char_6', 'char_7', 'char_8'],
    slot: 1,
    tokens: ['X7V2', 'WUI-X7V2-THUL'],
    hashes: ['2dd19af57e1afab99db2a52767841b4188121375b4e107e25f1e19b5a08074b7', '67444813cdcd8add28ec10fe6184264bd4acddcd339083da3cee52779ef2b52f'],
    name: 'Thulita',
    handle: '@thulita',
    bio: 'Investigadora da Guarda & perita em rastreamento etéreo. Sempre em busca de pistas que não façam sentido.',
    avatarLetter: 'T',
    avatarImage: '',
    avatarColor: '#10b981',
    badge: 'none',
    isMaster: false
  },
  {
    id: 'char_2',
    followingCount: 29,
    followersCount: 284,
    followingList: ['npc_sara', 'char_1', 'char_3', 'char_4', 'char_5', 'char_6', 'char_7', 'char_8', 'npc_viktor_cronista'],
    followersList: ['npc_sara', 'char_1', 'char_3', 'char_4', 'char_5', 'char_6', 'char_7', 'char_8'],
    slot: 2,
    tokens: ['N3L8', 'WUI-N3L8-MINE'],
    hashes: ['1c3b0fa0bb6d1186cbfbde84001fd11845b5a68922a1029288319fdffd1325fa', '113917ac98d6019f27deda3d987664c09f8fd5c12da07f5981485dfe2a0b62b2'],
    name: 'Minerva',
    handle: '@minerva',
    bio: 'Médica de campo e estudiosa de patologias arcanas. Café sem açúcar e prontuários em dia.',
    avatarLetter: 'M',
    avatarImage: '',
    avatarColor: '#8b5cf6',
    badge: 'none',
    isMaster: false
  },
  {
    id: 'char_3',
    followingCount: 45,
    followersCount: 198,
    followingList: ['npc_sara', 'char_1', 'char_2', 'char_4', 'char_5', 'char_6', 'char_7', 'char_8', 'npc_leo_mecanico'],
    followersList: ['npc_sara', 'char_1', 'char_2', 'char_4', 'char_5', 'char_6', 'char_7', 'char_8'],
    slot: 3,
    tokens: ['R5K1', 'WUI-R5K1-ERIC'],
    hashes: ['f95666157dd397d4157d44720f05c660446b23b6c3140aa2bcb8ca5761a47f28', '25bf418695fe134c210bdf931fc5893b2d7a292f7ed262c008ecd759cb11983e'],
    name: 'Eric',
    handle: '@eric',
    bio: 'Alquimista tático e especialista em compostos voláteis. Se explodiu, provavelmente fui eu.',
    avatarLetter: 'E',
    avatarImage: '',
    avatarColor: '#ef4444',
    badge: 'none',
    isMaster: false
  },
  {
    id: 'char_4',
    followingCount: 62,
    followersCount: 410,
    followingList: ['npc_sara', 'char_1', 'char_2', 'char_3', 'char_5', 'char_6', 'char_7', 'char_8', 'npc_bichinhos_wui'],
    followersList: ['npc_sara', 'char_1', 'char_2', 'char_3', 'char_5', 'char_6', 'char_7', 'char_8'],
    slot: 4,
    tokens: ['H2Q9', 'WUI-H2Q9-PERA'],
    hashes: ['8b7903ff85b96269fee9ef4165adc18ae24ce32f20e3de2c5daa3ffd17e002bd', '50677632f0e9c26b7573bd471219e6ebea8cfb44cd12c34251a39f8cdfb5d660'],
    name: 'Pera',
    handle: '@pera',
    bio: 'Navegadora e cartógrafa das correntes de éter. Conheço cada beco e cada rota de fuga.',
    avatarLetter: 'P',
    avatarImage: '',
    avatarColor: '#f59e0b',
    badge: 'none',
    isMaster: false
  },
  {
    id: 'char_5',
    followingCount: 25,
    followersCount: 175,
    followingList: ['npc_sara', 'char_1', 'char_2', 'char_3', 'char_4', 'char_6', 'char_7', 'char_8', 'npc_leo_mecanico'],
    followersList: ['npc_sara', 'char_1', 'char_2', 'char_3', 'char_4', 'char_6', 'char_7', 'char_8'],
    slot: 5,
    tokens: ['J8W4', 'WUI-J8W4-WILL'],
    hashes: ['7f42d2ea1b3752c523f50d69830e942858b6c0980c4638bdbaf215d94c76bb73', '8877df43636ee69b3b5e0953869ec2a80c9844ddc6bc9247cf64c29d2a75c09c'],
    name: 'Willian',
    handle: '@willian',
    bio: 'Armeiro e entusiasta de engenhocas mecânicas. Nunca confie em um mecanismo que não faça barulho.',
    avatarLetter: 'W',
    avatarImage: '',
    avatarColor: '#06b6d4',
    badge: 'none',
    isMaster: false
  },
  {
    id: 'char_6',
    followingCount: 12,
    followersCount: 92,
    followingList: ['npc_sara', 'char_1', 'char_2', 'char_3', 'char_4', 'char_5', 'char_7', 'char_8'],
    followersList: ['npc_sara', 'char_1', 'char_2', 'char_3', 'char_4', 'char_5', 'char_7', 'char_8'],
    slot: 6,
    tokens: ['T6D3', 'WUI-T6D3-JOHN'],
    hashes: ['b38466b6c44627df5485939cb241d72a86f54008b87e828a144fdd78aee213cb', '4e6dd809209ad92ce0a547b2b1a5473c610c2c0bb5139bec6ce6fd2b5e65e964'],
    name: 'John Doe',
    handle: '@johndoe',
    bio: 'Observador discreto. Não faço perguntas que eu não queira saber a resposta.',
    avatarLetter: 'J',
    avatarImage: '',
    avatarColor: '#3b82f6',
    badge: 'none',
    isMaster: false
  },
  {
    id: 'char_7',
    followingCount: 41,
    followersCount: 345,
    followingList: ['npc_sara', 'char_1', 'char_2', 'char_3', 'char_4', 'char_5', 'char_6', 'char_8', 'npc_paladium_art'],
    followersList: ['npc_sara', 'char_1', 'char_2', 'char_3', 'char_4', 'char_5', 'char_6', 'char_8'],
    slot: 7,
    tokens: ['Y4M7', 'WUI-Y4M7-ODAR'],
    hashes: ['187542c177a73f8011cb57622b694f3ec8ffd5c11ea61ea1de5378c85ce24451', '397303bab301646c0c74e253491aeb2ffdbe9cfc6f9395dbd9748583b5d81330'],
    name: 'Odara',
    handle: '@odara',
    bio: 'Guardiã de relíquias antigas e intérprete de línguas esquecidas do arquipélago.',
    avatarLetter: 'O',
    avatarImage: '',
    avatarColor: '#ec4899',
    badge: 'none',
    isMaster: false
  },
  {
    id: 'char_8',
    followingCount: 34,
    followersCount: 260,
    followingList: ['npc_sara', 'char_1', 'char_2', 'char_3', 'char_4', 'char_5', 'char_6', 'char_7', 'npc_gov_paladium'],
    followersList: ['npc_sara', 'char_1', 'char_2', 'char_3', 'char_4', 'char_5', 'char_6', 'char_7'],
    slot: 8,
    tokens: ['F9C5', 'WUI-F9C5-CANN'],
    hashes: ['a1a0efb57f6f279826e7419fa6630b4cd85d6bcb8e69cb191916a28d428a72c6', 'dacd72e3e91ae602668271fa5eecbe67ad6efd099ba82a29dddf6e20d3a52926'],
    name: 'Canneth',
    handle: '@canneth',
    bio: 'Especialista em segurança arcana e sobrevivência urbana. Cuidado onde pisa em Paladium.',
    avatarLetter: 'C',
    avatarImage: '',
    avatarColor: '#14b8a6',
    badge: 'none',
    isMaster: false
  },
  {
    id: 'npc_gov_fragktus',
    slot: null,
    tokens: ['FRAGKTUS-GOV', 'GOV-FRAGKTUS', 'ALTO-COMANDO'],
    hashes: [],
    name: 'Governo & Alto Comando de Fragktus',
    handle: '@gov_fragktus',
    bio: 'Gabinete Supremo do Alto Comando Militar e Administração Civil de Fragktus. Defesa territorial, decretos de ordem e comunicados oficiais.',
    avatarLetter: 'F',
    avatarImage: '',
    avatarColor: '#0f766e',
    badge: 'gold',
    isMaster: false
  },
  {
    id: 'npc_gov_paladium',
    slot: null,
    tokens: ['PALADIUM-GOV', 'GOV-PALADIUM'],
    hashes: [],
    name: 'Governo de Paladium',
    handle: '@gov_paladium',
    bio: 'Canal Oficial do Governo & Departamento de Segurança e Ordem de Paladium. Comunicados da Chancelaria, decretos civis, registros penitenciários e mandados de custódia da metrópole.',
    avatarLetter: 'G',
    avatarImage: '',
    avatarColor: '#1e3a8a',
    badge: 'gold',
    isMaster: false
  },
  {
    id: 'npc_sara',
    slot: null,
    tokens: ['SARA-AUGUIL', 'SARA-WUI', 'SARA-VITORINO', 'SARA'],
    hashes: [],
    name: 'Sara Auguil',
    handle: '@sara',
    bio: 'Aluna do Colégio Integrado Primórdio de Fragktus & barista no Café Névoa. Amante de gatos, arte, chás e alquimia. (Desaparecimento catalogado em 01/08/2061).',
    avatarLetter: 'S',
    avatarImage: 'assets/sara_avatar.jpg',
    avatarColor: '#f43f5e',
    badge: 'none',
    followingCount: 14,
    followersCount: '1.428',
    followingList: [
      'char_1', 'char_2', 'char_3', 'char_4', 'char_5', 'char_6', 'char_7', 'char_8',
      'npc_colegio_primordio', 'npc_bichinhos_wui', 'npc_paladium_art', 'npc_leo_mecanico', 'npc_viktor_cronista', 'npc_gazeta_paladium'
    ],
    followersList: [
      'char_1', 'char_2', 'char_3', 'char_4', 'char_5', 'char_6', 'char_7', 'char_8',
      'npc_colegio_primordio', 'npc_bichinhos_wui', 'npc_paladium_art', 'npc_leo_mecanico', 'npc_viktor_cronista'
    ],
    isMaster: false
  },
  {
    id: 'npc_colegio_primordio',
    slot: null,
    tokens: ['COLEGIO-PRIMORDIO', 'PRIMORDIO-FRAGKTUS'],
    hashes: [],
    name: 'Colégio Integrado Primórdio de Fragktus',
    handle: '@colegio_primordio',
    bio: 'Instituição de ensino tradicional de Fragktus. Tradição, disciplina e excelência acadêmica. Sob Direção de Constança Montenegro e Conselho Diretor.',
    avatarLetter: 'P',
    avatarImage: '',
    avatarColor: '#1e293b',
    badge: 'gold',
    isMaster: false
  },
  {
    id: 'npc_paladium_art',
    slot: null,
    tokens: ['PALADIUM-ART'],
    hashes: [],
    name: 'Galeria Paladium | Arte & Conceito',
    handle: '@paladium_art',
    bio: 'Página dedicada aos artistas independentes, murais de rua e ilustrações conceituais do Distrito Alto e Baixo de Paladium. Curadoria visual da metrópole.',
    avatarLetter: 'A',
    avatarImage: '',
    avatarColor: '#8b5cf6',
    badge: 'blue',
    isMaster: false
  },
  {
    id: 'npc_bichinhos_wui',
    slot: null,
    tokens: ['FAUNA-VERDES', 'BICHINHOS-WUI'],
    hashes: [],
    name: 'Fauna das Terras Verdes',
    handle: '@fauna_verdes',
    bio: 'O lado mais fascinante das Terras Verdes e de Wuitalur. Apreciação de mascotes mágicos, furões de éter, corujas mecânicas e fauna silvestre dos viajantes. Envios abertos!',
    avatarLetter: 'F',
    avatarImage: '',
    avatarColor: '#10b981',
    badge: 'blue',
    isMaster: false
  },
  {
    id: 'npc_gazeta_paladium',
    slot: null,
    tokens: ['GAZETA-PALADIUM'],
    hashes: [],
    name: 'A Gazeta de Paladium',
    handle: '@gazeta_paladium',
    bio: 'Jornalismo independente e informes em tempo real. O que o Governo de Paladium esconde nos gabinetes, a nossa equipe apura nos becos, portos e tavernas.',
    avatarLetter: 'G',
    avatarImage: '',
    avatarColor: '#d97706',
    badge: 'blue',
    isMaster: false
  },
  {
    id: 'npc_viktor_cronista',
    slot: null,
    tokens: ['VIKTOR-CRONISTA'],
    hashes: [],
    name: 'Dr. Viktor Ramos',
    handle: '@viktor_cronista',
    bio: 'Pesquisador de flutuações etéreas no Instituto Tecnológico de Paladium. Cético profissional, cronista urbano e consumidor crônico de café amargo.',
    avatarLetter: 'V',
    avatarImage: '',
    avatarColor: '#64748b',
    badge: 'none',
    isMaster: false
  },
  {
    id: 'npc_leo_mecanico',
    slot: null,
    tokens: ['LEO-MECANICO'],
    hashes: [],
    name: 'Léo das Engrenagens',
    handle: '@leo_engrenagens',
    bio: 'Oficina de Reparos (Setor 4 - Distrito Baixo). Conserto caldeiras a vapor, autômatos, próteses de bronze e relógios arcanos. Não vendo peças pro governo.',
    avatarLetter: 'L',
    avatarImage: '',
    avatarColor: '#ea580c',
    badge: 'none',
    isMaster: false
  }
];

class WuitterSystem {
  constructor() {
    this.accounts = [];
    this.posts = [];
    this.myToken = localStorage.getItem(WUITTER_STORAGE_TOKEN) || localStorage.getItem('wuitter_token') || null;
    this.authenticatedAccount = null;
    this.selectedPostingAccountId = null;
    this.activeTab = 'para-voce';
    this.currentView = 'feed'; // 'feed', 'profile', 'explore'
    this.profileAccountId = null;
    this.profileTab = 'posts'; // 'posts', 'replies', 'media'
    this.searchQuery = '';
    this.pendingImageBase64 = '';
    this.activeReplyContext = null;

    // Supabase Cloud & Realtime
    this.supabase = null;
    this.realtimeChannel = null;
    this.localBroadcast = null;
    this.isSyncing = false;
    this.lastCloudSyncTime = 0;

    this.init();
  }

  async init() {
    this.loadLocalCache();
    this.ensureOrganicBaselineEngagement();
    await this.authenticateWithSavedToken();
    this.initSupabaseClient();
    this.bindEvents();
    this.render();

    // Busca imediata do banco de dados na nuvem
    await this.fetchCloudFeed();
    this.ensureOrganicBaselineEngagement();

    // Inicia ouvintes de tempo real, polling contínuo e engajamento orgânico
    this.initRealtimeSubscriptions();
    this.startBackgroundSync();
    this.startOrganicEngagementLoop();
  }

  initSupabaseClient() {
    try {
      if (window.supabase && SUPABASE_CONFIG.url && SUPABASE_CONFIG.key) {
        this.supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
      }
    } catch(err) {
      console.warn('Erro ao inicializar Supabase client:', err);
    }
  }

  // ---- PERSISTÊNCIA NA NUVEM (SUPABASE) ----
  async fetchCloudFeed(silent = false) {
    if (!this.supabase) return;

    try {
      const { data, error } = await this.supabase
        .from('personagens')
        .select('atributos')
        .eq('id', 3)
        .single();

      if (error) {
        if (!silent) console.warn('Erro ao carregar Wuitter do Supabase:', error);
        return;
      }

      if (data && data.atributos) {
        const rawAtributos = typeof data.atributos === 'string' ? JSON.parse(data.atributos) : data.atributos;
        const wData = rawAtributos._wuitter;

        if (wData) {
          let hasChanges = false;

          // Atualiza e mescla posts da nuvem com os posts do universo
          const remotePosts = Array.isArray(wData.posts) ? wData.posts : [];
          const seedPosts = this.getInitialSeedPosts();
          const seedMap = new Map();
          seedPosts.forEach(s => seedMap.set(s.id, s));
          
          const postMap = new Map();
          // 1. Posts do universo (dados atualizados de texto, datas e comentarios oficiais)
          seedPosts.forEach(p => postMap.set(p.id, p));

          // 2. Posts remotos (atualizam curtidas/respostas e trazem novos posts criados por usuarios)
          remotePosts.forEach(p => {
            if (seedMap.has(p.id)) {
              const seed = seedMap.get(p.id);
              postMap.set(p.id, {
                ...seed,
                likes: Math.max(seed.likes || 0, p.likes || 0),
                likedBy: Array.from(new Set([...(seed.likedBy || []), ...(p.likedBy || [])])),
                rewuits: Math.max(seed.rewuits || 0, p.rewuits || 0),
                rewuitedBy: Array.from(new Set([...(seed.rewuitedBy || []), ...(p.rewuitedBy || [])])),
                comments: [
                  ...seed.comments,
                  ...(p.comments || []).filter(c => !seed.comments.some(sc => sc.id === c.id))
                ]
              });
            } else {
              postMap.set(p.id, p);
            }
          });

          // 3. Posts locais criados pelo usuário
          this.posts.forEach(p => {
            if (!postMap.has(p.id)) postMap.set(p.id, p);
          });

          const mergedPosts = Array.from(postMap.values());
          mergedPosts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

          if (JSON.stringify(this.posts) !== JSON.stringify(mergedPosts)) {
            this.posts = mergedPosts;
            this.ensureOrganicBaselineEngagement();
            this.savePostsLocal();
            hasChanges = true;
          }

          // Se a nuvem tinha menos posts que o nosso conjunto completo, atualiza o Supabase
          if (remotePosts.length < mergedPosts.length) {
            this.syncToCloud();
          }

          // Atualiza contas customizadas da nuvem (adicionando, atualizando e removendo excluidas)
          const remoteCustomAccounts = Array.isArray(wData.accounts) ? wData.accounts.filter(a => !a.slot && !a.isMaster && a.name && a.name.toLowerCase() !== 'pindolla') : [];
          const defaultBaseAccounts = this.accounts.filter(a => a.slot || a.isMaster);
          const currentCustomAccounts = this.accounts.filter(a => !a.slot && !a.isMaster);

          if (JSON.stringify(currentCustomAccounts) !== JSON.stringify(remoteCustomAccounts)) {
            this.accounts = [...defaultBaseAccounts, ...remoteCustomAccounts];
            this.saveAccountsLocal();
            hasChanges = true;
          }

          if (hasChanges) {
            this.render();
          }
        }
      }
    } catch(err) {
      if (!silent) console.warn('Exceção ao buscar feed da nuvem:', err);
    }
  }

  async syncToCloud() {
    if (!this.supabase || this.isSyncing) return;
    this.isSyncing = true;

    try {
      // 1. Busca os atributos atuais para não sobrescrever dados da mesa
      const { data: currentRecord } = await this.supabase
        .from('personagens')
        .select('atributos')
        .eq('id', 3)
        .single();

      let atributosObj = {};
      if (currentRecord && currentRecord.atributos) {
        atributosObj = typeof currentRecord.atributos === 'string' ? JSON.parse(currentRecord.atributos) : currentRecord.atributos;
      }

      // Adiciona / atualiza o namespace _wuitter com posts e contas
      atributosObj._wuitter = {
        posts: this.posts.slice(0, 150), // mantem até 150 posts recentes
        accounts: this.accounts.filter(a => !a.slot), // contas customizadas
        updatedAt: Date.now()
      };

      // 2. Grava no Supabase
      await this.supabase
        .from('personagens')
        .update({
          atributos: atributosObj,
          updated_at: new Date().toISOString()
        })
        .eq('id', 3);

      this.lastCloudSyncTime = Date.now();
    } catch(err) {
      console.warn('Erro ao sincronizar Wuitter com a nuvem:', err);
    } finally {
      this.isSyncing = false;
    }
  }

  // ---- SINCRONIZAÇÃO EM TEMPO REAL (WEBSOCKET + POLLING) ----
  initRealtimeSubscriptions() {
    // 1. Canal Local de Navegador (entre abas)
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        this.localBroadcast = new BroadcastChannel('wuitter_local_sync_v3');
        this.localBroadcast.onmessage = (e) => {
          if (e.data) {
            this.handleIncomingSync(e.data);
          }
        };
      }
    } catch(err) {}

    // Storage local cross-tab
    window.addEventListener('storage', (e) => {
      if (e.key === WUITTER_STORAGE_POSTS && e.newValue) {
        try {
          this.posts = JSON.parse(e.newValue);
          this.renderFeed();
        } catch(err) {}
      }
    });

    // 2. Supabase Realtime (Postgres Changes + Broadcast WebSocket)
    if (this.supabase) {
      this.realtimeChannel = this.supabase
        .channel('wuitter_realtime_channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'personagens' }, (payload) => {
          // Atualização recebida do banco de dados na nuvem
          this.fetchCloudFeed(true);
        })
        .on('broadcast', { event: 'wuitter_event' }, (msg) => {
          if (msg && msg.payload) {
            this.handleIncomingSync(msg.payload);
          }
        })
        .subscribe();
    }
  }

  startBackgroundSync() {
    // Polling inteligente a cada 4 segundos como garantia de tempo real
    setInterval(() => {
      this.fetchCloudFeed(true);
    }, 4000);
  }

  broadcastSync(action, payload) {
    const message = {
      action: action,
      payload: payload,
      timestamp: Date.now(),
      senderToken: this.myToken
    };

    if (this.localBroadcast) {
      try { this.localBroadcast.postMessage(message); } catch(e) {}
    }

    if (this.realtimeChannel) {
      try {
        this.realtimeChannel.send({
          type: 'broadcast',
          event: 'wuitter_event',
          payload: message
        });
      } catch(e) {}
    }
  }

  handleIncomingSync(data) {
    if (!data || !data.action) return;

    switch(data.action) {
      case 'NEW_POST': {
        const post = data.payload.post;
        if (post && !this.posts.some(p => p.id === post.id)) {
          this.posts.unshift(post);
          this.savePostsLocal();
          this.renderFeed(post.id);
        }
        break;
      }
      case 'DELETE_POST': {
        const postId = data.payload.postId;
        if (postId) {
          this.posts = this.posts.filter(p => p.id !== postId);
          this.savePostsLocal();
          this.renderFeed();
        }
        break;
      }
      case 'TOGGLE_LIKE': {
        const { postId, likedBy, likes } = data.payload;
        const post = this.posts.find(p => p.id === postId);
        if (post) {
          post.likedBy = likedBy;
          post.likes = likes;
          this.savePostsLocal();
          this.updatePostStatsInDOM(postId);
        }
        break;
      }
      case 'TOGGLE_REWUIT': {
        const { postId, rewuitedBy, rewuits } = data.payload;
        const post = this.posts.find(p => p.id === postId);
        if (post) {
          post.rewuitedBy = rewuitedBy;
          post.rewuits = rewuits;
          this.savePostsLocal();
          this.updatePostStatsInDOM(postId);
        }
        break;
      }
      case 'ADD_COMMENT': {
        const { postId, comment } = data.payload;
        const post = this.posts.find(p => p.id === postId);
        if (post) {
          if (!post.comments) post.comments = [];
          if (!post.comments.some(c => c.id === comment.id)) {
            post.comments.push(comment);
            this.savePostsLocal();
            this.updatePostStatsInDOM(postId);
            const modal = document.getElementById('w-comments-modal');
            if (modal && modal.classList.contains('active')) {
              this.openCommentsModal(postId);
            }
          }
        }
        break;
      }
      case 'UPDATE_ACCOUNT': {
        const acc = data.payload.account;
        if (acc) {
          const index = this.accounts.findIndex(a => a.id === acc.id);
          if (index !== -1) {
            this.accounts[index] = acc;
          } else {
            this.accounts.push(acc);
          }
          this.saveAccountsLocal();
          this.render();
        }
        break;
      }
      case 'DELETE_ACCOUNT': {
        const accountId = data.payload.accountId;
        if (accountId) {
          this.accounts = this.accounts.filter(a => a.id !== accountId);
          if (this.selectedPostingAccountId === accountId) {
            this.selectedPostingAccountId = this.authenticatedAccount ? this.authenticatedAccount.id : null;
          }
          this.saveAccountsLocal();
          this.render();
        }
        break;
      }
      case 'DELETE_COMMENT': {
        const { postId, commentId } = data.payload;
        const post = this.posts.find(p => p.id === postId);
        if (post && post.comments) {
          post.comments = post.comments.filter(c => c.id !== commentId);
          this.savePostsLocal();
          this.updatePostStatsInDOM(postId);
          const modal = document.getElementById('w-comments-modal');
          if (modal && modal.classList.contains('active')) {
            this.openCommentsModal(postId);
          }
        }
        break;
      }
    }
  }

  updatePostStatsInDOM(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;
    const card = document.getElementById(`post_${postId}`);
    if (!card) return;

    const myId = this.authenticatedAccount ? this.authenticatedAccount.id : null;
    const isLiked = myId && post.likedBy && post.likedBy.includes(myId);
    const isRewuited = myId && post.rewuitedBy && post.rewuitedBy.includes(myId);
    const commentsCount = post.comments ? post.comments.length : 0;

    const likeBtn = card.querySelector('.w-action-btn.like');
    if (likeBtn) {
      likeBtn.classList.toggle('active', !!isLiked);
      const span = likeBtn.querySelector('span');
      if (span) span.textContent = post.likes > 0 ? post.likes : '';
    }

    const rewuitBtn = card.querySelector('.w-action-btn.rewuit');
    if (rewuitBtn) {
      rewuitBtn.classList.toggle('active', !!isRewuited);
      const span = rewuitBtn.querySelector('span');
      if (span) span.textContent = post.rewuits > 0 ? post.rewuits : '';
    }

    const replyBtn = card.querySelector('.w-action-btn.reply');
    if (replyBtn) {
      const span = replyBtn.querySelector('span');
      if (span) span.textContent = commentsCount > 0 ? commentsCount : '';
    }

    // Atualiza preview inline de respostas se houver
    let repliesWrap = card.querySelector('.w-inline-replies-wrap');
    if (post.comments && post.comments.length > 0) {
      const contentArea = card.querySelector('.w-wuit-content-area');
      if (contentArea) {
        if (!repliesWrap) {
          repliesWrap = document.createElement('div');
          repliesWrap.className = 'w-inline-replies-wrap';
          contentArea.appendChild(repliesWrap);
        }
        repliesWrap.innerHTML = `
          ${post.comments.slice(-2).map(c => {
            const cAuthor = this.getAccountById(c.authorId);
            const cBadge = this.renderBadgeSvg(cAuthor.badge);
            return `
              <div class="w-inline-reply-item">
                <div class="w-clickable-profile" onclick="window.wuitter.viewProfile('${cAuthor.id}')">
                  ${this.renderAvatarHtml(cAuthor, 'sm')}
                </div>
                <div class="w-inline-reply-body">
                  <div class="w-inline-reply-header">
                    <span class="w-inline-reply-name" onclick="window.wuitter.viewProfile('${cAuthor.id}')">${cAuthor.name}</span>
                    ${cBadge}
                    <span class="w-inline-reply-handle">${cAuthor.handle}</span>
                    <span class="w-wuit-dot">&bull;</span>
                    <span class="w-wuit-time">${c.timeDisplay || c.customDate || this.formatTime(c.timestamp)}</span>
                ${c.replyToHandle ? `<div class="w-reply-to-tag-sm">Respondendo a <span class="w-mention" onclick="window.wuitter.filterByMention('${c.replyToHandle.replace('@', '')}')">${c.replyToHandle}</span></div>` : ''}
                <div class="w-inline-reply-text">${this.formatText(c.text)}</div>
                <div style="margin-top: 4px; display: flex; align-items: center; gap: 8px;">
                  <button class="w-inline-reply-action-btn" onclick="window.wuitter.setReplyContext('${post.id}', '${c.id}')" title="Responder a ${cAuthor.name}">
                    ${SVG_ICONS.comment}
                    <span>Responder</span>
                  </button>
                </div>
              </div>
              </div>
            `;
          }).join('')}
          ${post.comments.length > 2 ? `
            <button class="w-btn-show-more-replies" onclick="window.wuitter.openCommentsModal('${post.id}')">
              Ver todas as ${post.comments.length} respostas
            </button>
          ` : ''}
        `;
      }
    } else if (repliesWrap) {
      repliesWrap.remove();
    }
  }

  // Hash SHA-256 helper
  async sha256(text) {
    if (!text) return '';
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text.trim().toUpperCase());
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch(e) {
      let hash = 0;
      const str = text.trim().toUpperCase();
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return 'fb_' + Math.abs(hash).toString(16);
    }
  }

    getInitialSeedPosts() {
    const now = Date.now();
    return [
      {
        id: 'wuit_seed_colegio_comunicado_1',
        authorId: 'npc_colegio_primordio',
        text: `COMUNICADO OFICIAL À COMUNIDADE ESCOLAR E FAMÍLIAS DE FRAGKTUS

É com profundo pesar e extrema consternação que a Direção do Colégio Integrado Primórdio de Fragktus se manifesta diante dos recentes e alarmantes acontecimentos que abalaram a nossa instituição: o desaparecimento de nossa distinta aluna, Sara Auguil.

Compreendemos a angústia que se instalou nos corações dos familiares, dos colegas de classe e de todo o corpo docente. Em momentos de tamanha incerteza, nossa prioridade inegociável permanece sendo a segurança, a integridade e a ordem dentro de nossos muros.

Reafirmamos publicamente que a administração do Colégio Primórdio está em cooperação irrestrita e contínua com a Guarda Civil e com o Alto Comando Militar de Fragktus. Todas as dependências da instituição, bem como registros acadêmicos e laudos pertinentes, foram colocados à inteira disposição das autoridades para assegurar uma investigação célere, rigorosa e discreta.

Pedimos a todas as famílias e estudantes que mantenham a serenidade e a compostura condizentes com a tradição de nosso colégio. Solicitamos expressamente que se evite a propagação de boatos levianos ou especulações que possam interferir nos trabalhos oficiais ou manchar a honra dos envolvidos.

Permanecemos firmes na fé de que a ordem será restabelecida e que Sara retornará em segurança ao nosso convívio.

Com estima e rigor,

Constança Montenegro e Conselho Diretor de Fragktus.

#ColegioPrimordio #Fragktus #ComunicadoOficial #SaraAuguil`,
        timestamp: now - (5 * 60 * 1000),
        timeDisplay: '02/08/2061',
        likes: 142,
        likedBy: [],
        rewuits: 68,
        rewuitedBy: [],
        media: '',
        comments: [
          {
            id: 'c_seed_col_1',
            authorId: 'npc_gazeta_paladium',
            text: `A direção fala em cooperação 'discreta', mas testemunhas viram agentes do Alto Comando de Fragktus apreendendo armários no 3º andar antes mesmo do comunicado ser emitido. O que mais estão escondendo nos corredores do Primórdio?`,
            timestamp: now - (4 * 60 * 1000),
            timeDisplay: '02/08/2061',
            replyToCommentId: null,
            replyToHandle: null
          },
          {
            id: 'c_seed_col_2',
            authorId: 'npc_gov_fragktus',
            text: `O Alto Comando Militar de Fragktus reitera que qualquer informação confirmada sobre Sara Auguil deve ser remetida à guarnição central. Advertimos contra a infiltração de agentes não autorizados de potências vizinhas na apuração.`,
            timestamp: now - (3 * 60 * 1000),
            timeDisplay: '02/08/2061',
            replyToCommentId: null,
            replyToHandle: null
          },
          {
            id: 'c_seed_col_3',
            authorId: 'npc_gov_paladium',
            text: `O Departamento de Segurança de Paladium manifesta repúdio ao descontrole institucional em Fragktus. Reforçamos a vigilância na fronteira norte para impedir que o caos civil transborde para o nosso território.`,
            timestamp: now - (2 * 60 * 1000),
            timeDisplay: '03/08/2061',
            replyToCommentId: 'c_seed_col_2',
            replyToHandle: '@gov_fragktus'
          },
          {
            id: 'c_seed_col_4',
            authorId: 'npc_viktor_cronista',
            text: `Uma aluna exemplar desaparece e os dois governos transformam o caso em disputa geopolítica de fronteira. A vaidade dos gabinetes de Paladium e Fragktus é repugnante.`,
            timestamp: now - (1 * 60 * 1000),
            timeDisplay: '03/08/2061',
            replyToCommentId: 'c_seed_col_3',
            replyToHandle: '@gov_paladium'
          }
        ]
      },
      {
        id: 'wuit_seed_sara_encruzilhada_1',
        authorId: 'npc_sara',
        text: `Até a Encruzilhada.`,
        timestamp: now - (10 * 60 * 1000),
        timeDisplay: '31/06/2061',
        likes: 218,
        likedBy: [],
        rewuits: 84,
        rewuitedBy: [],
        media: 'assets/sara_encruzilhada.jpg',
        comments: [
          {
            id: 'c_seed_encruzilhada_1',
            authorId: 'npc_gazeta_paladium',
            text: `ATENÇÃO: Último registro fotográfico e público da aluna Sara Auguil antes do desaparecimento catalogado formalmente pelas autoridades em 01/08. Quem tiver pistas sobre a localização exata desta imagem contate a redação ou a Guarda.`,
            timestamp: now - (8 * 60 * 1000),
            timeDisplay: '01/08/2061',
            replyToCommentId: null,
            replyToHandle: null
          },
          {
            id: 'c_seed_encruzilhada_2',
            authorId: 'npc_viktor_cronista',
            text: `Sara? Onde você tirou essa foto? Essa vegetação de fundo e essa névoa âmbar não condizem com nenhum parque catalogado dentro dos limites seguros do distrito. Alguém sabe para onde ela foi?`,
            timestamp: now - (7 * 60 * 1000),
            timeDisplay: '01/08/2061',
            replyToCommentId: null,
            replyToHandle: null
          },
          {
            id: 'c_seed_encruzilhada_3',
            authorId: 'npc_fauna_verdes',
            text: `Sara, seu gato não para de arranhar a porta do Café Névoa desde ontem... onde você foi parar? Volta logo, por favor.`,
            timestamp: now - (6 * 60 * 1000),
            timeDisplay: '01/08/2061',
            replyToCommentId: null,
            replyToHandle: null
          },
          {
            id: 'c_seed_encruzilhada_4',
            authorId: 'npc_leo_mecanico',
            text: `Passei na porta do café ontem e a caldeira de infusão ainda estava acesa e o caderno do balcão aberto. Se alguém tiver notícias dela, avisa a gente no Setor 4.`,
            timestamp: now - (5 * 60 * 1000),
            timeDisplay: '02/08/2061',
            replyToCommentId: null,
            replyToHandle: null
          },
          {
            id: 'c_seed_encruzilhada_5',
            authorId: 'npc_paladium_art',
            text: `Essa iluminação âmbar com densidade na copa das árvores... parece a antiga rota além do marco de contenção da Linha de Ruptura.`,
            timestamp: now - (4 * 60 * 1000),
            timeDisplay: '02/08/2061',
            replyToCommentId: null,
            replyToHandle: null
          }
        ]
      },
      {
        id: 'wuit_seed_gov_alerta_1',
        authorId: 'npc_gov_paladium',
        text: `[ALERTA DE SEGURANÇA — CHANCELARIA DE PALADIUM]
MANDADO DE CAPTURA PÚBLICA

Informações comprovadas que levem à custódia de Kaelen, o Silencioso, foragido do Setor Penitenciário de Ferro-Velho, serão recompensadas com 500 moedas de prata pelo Tesouro Municipal.

O indivíduo responde por invasão de arquivos do Conclave e quebra de lacres etéreos. Denúncias podem ser feitas em qualquer posto da Guarda.

#AlertaPaladium #SegurancaMetropolitana #Recompensa`,
        timestamp: now - (15 * 60 * 1000),
        timeDisplay: '03/08/2061',
        likes: 62,
        likedBy: [],
        rewuits: 25,
        rewuitedBy: [],
        media: '',
        comments: [
          {
            id: 'c_seed_alerta_1',
            authorId: 'npc_gazeta_paladium',
            text: `A guarnição do 2º Batalhão já bloqueou as saídas pelos canais do Porto Velho? A última pista indicava rota de fuga pelas docas.`,
            timestamp: now - (12 * 60 * 1000),
            timeDisplay: '03/08/2061',
            replyToCommentId: null,
            replyToHandle: null
          },
          {
            id: 'c_seed_alerta_2',
            authorId: 'npc_leo_mecanico',
            text: `Se esse sujeito passar perto da minha oficina com ferramentas clandestinas, aciono a tranca magnética dos portões na hora.`,
            timestamp: now - (10 * 60 * 1000),
            timeDisplay: '03/08/2061',
            replyToCommentId: null,
            replyToHandle: null
          }
        ]
      },
      {
        id: 'wuit_seed_gazeta_1',
        authorId: 'npc_gazeta_paladium',
        text: `URGENTE: Três guardas metropolitanos foram afastados após o sumiço de relatórios confidenciais da Sala de Evidências do Conclave.

O Governo de Paladium ainda não emitiu nota oficial sobre o caso. Fontes anônimas apontam conexão com anomalias registradas no Subsolo 7.

#GazetaInforma #EscandaloPaladium #SegredosDoConclave`,
        timestamp: now - (25 * 60 * 1000),
        timeDisplay: '03/08/2061',
        likes: 86,
        likedBy: [],
        rewuits: 31,
        rewuitedBy: [],
        media: '',
        comments: [
          {
            id: 'c_seed_gazeta_1_1',
            authorId: 'npc_gov_paladium',
            text: `A Corregedoria Geral trata de assuntos internos com o devido sigilo processual. Especulações infundadas serão objeto de inquérito administrativo.`,
            timestamp: now - (20 * 60 * 1000),
            timeDisplay: '03/08/2061',
            replyToCommentId: null,
            replyToHandle: null
          },
          {
            id: 'c_seed_gazeta_1_2',
            authorId: 'npc_viktor_cronista',
            text: `Sumiço de relatórios no Conclave sempre coincide com picos de consumo de éter na rede subterrânea. Não tentem encobrir a verdade.`,
            timestamp: now - (16 * 60 * 1000),
            timeDisplay: '03/08/2061',
            replyToCommentId: 'c_seed_gazeta_1_1',
            replyToHandle: '@gov_paladium'
          }
        ]
      },
      {
        id: 'wuit_seed_gov_1',
        authorId: 'npc_gov_paladium',
        text: `[DEPARTAMENTO DE SEGURANÇA PÚBLICA — PALADIUM]
REGISTRO DE OPERAÇÃO #3088

Durante a madrugada, a Guarda Metropolitana efetuou a prisão em flagrante de 3 indivíduos no Distrito Portuário por contrabando de condutores de éter de grau militar originários de Fragktus com selos alfandegários adulterados.

Os detidos foram encaminhados à Penitenciária de Alta Contenção de Ferro-Velho. Qualquer movimentação suspeita nas docas deve ser reportada imediatamente à guarnição central.

#PaladiumSegura #OperacaoDocas #LeiEOrdem`,
        timestamp: now - (40 * 60 * 1000),
        timeDisplay: '02/08/2061',
        likes: 54,
        likedBy: [],
        rewuits: 14,
        rewuitedBy: [],
        media: '',
        comments: [
          {
            id: 'c_seed_gov_1_1',
            authorId: 'npc_gazeta_paladium',
            text: `A Guarda só esqueceu de mencionar que o 'contrabando' eram geradores antigos que abasteciam a clínica comunitária do Distrito Baixo após o racionamento decretado pelo próprio Senado.`,
            timestamp: now - (35 * 60 * 1000),
            timeDisplay: '02/08/2061',
            replyToCommentId: null,
            replyToHandle: null
          },
          {
            id: 'c_seed_gov_1_2',
            authorId: 'npc_gov_paladium',
            text: `A Gazeta de Paladium está advertida formalmente contra a disseminação de narrativas desinformativas acerca de apreensões de materiais com risco de instabilidade.`,
            timestamp: now - (30 * 60 * 1000),
            timeDisplay: '02/08/2061',
            replyToCommentId: 'c_seed_gov_1_1',
            replyToHandle: '@gazeta_paladium'
          },
          {
            id: 'c_seed_gov_1_3',
            authorId: 'npc_viktor_cronista',
            text: `Instabilidade? Desde quando condutores de éter grau 2 têm risco crítico? O relatório técnico de vocês está desatualizado há pelo menos quatro legislaturas.`,
            timestamp: now - (25 * 60 * 1000),
            timeDisplay: '02/08/2061',
            replyToCommentId: 'c_seed_gov_1_2',
            replyToHandle: '@gov_paladium'
          }
        ]
      },
      {
        id: 'wuit_seed_bichinhos_1',
        authorId: 'npc_bichinhos_wui',
        text: `Apresentamos: Barnabé, a corujinha-mecânica do mestre Tobias. Ela foi forjada com engrenagens de relógio e penas de latão polido. O trabalho dela é entregar bilhetes e pedir carinho com bicadinhas no dedo.

Protejam essa fofura a todo custo.

#FaunaDasTerrasVerdes #MascotesMagicos #PaladiumPets`,
        timestamp: now - (60 * 60 * 1000),
        timeDisplay: '02/08/2061',
        likes: 98,
        likedBy: [],
        rewuits: 34,
        rewuitedBy: [],
        media: '',
        comments: [
          {
            id: 'c_seed_bichinhos_1_1',
            authorId: 'npc_paladium_art',
            text: `A anatomia da asa mecânica nessa peça é de uma delicadeza impressionante. Tobias é um patrimônio vivo do Distrito Baixo.`,
            timestamp: now - (50 * 60 * 1000),
            timeDisplay: '02/08/2061',
            replyToCommentId: null,
            replyToHandle: null
          },
          {
            id: 'c_seed_bichinhos_1_3',
            authorId: 'npc_leo_mecanico',
            text: `Se ela souber carregar ferramentas pequenas sem derrubar no meio do caminho, encomendo duas para a oficina.`,
            timestamp: now - (45 * 60 * 1000),
            timeDisplay: '02/08/2061',
            replyToCommentId: null,
            replyToHandle: null
          }
        ]
      },
      {
        id: 'wuit_seed_art_1',
        authorId: 'npc_paladium_art',
        text: `Estudo em aquarela e nanquim: 'A Névoa Sobre as Cúpulas de Ferro de Paladium ao Entardecer'.

A dualidade entre a imponência do Distrito Alto e a fumaça incansável que sobe das fundições do submundo resume a alma da nossa metrópole.

Artista: M. Valerius (Setor 2).

#ArtePaladium #WuitalurArt #ConceitoVisual #Aquarela`,
        timestamp: now - (90 * 60 * 1000),
        timeDisplay: '01/08/2061',
        likes: 73,
        likedBy: [],
        rewuits: 22,
        rewuitedBy: [],
        media: '',
        comments: [
          {
            id: 'c_seed_art_1_2',
            authorId: 'npc_viktor_cronista',
            text: `Fiel inclusive na densidade da poluição atmosférica. Parabéns ao artista pelo rigor documental.`,
            timestamp: now - (80 * 60 * 1000),
            timeDisplay: '01/08/2061',
            replyToCommentId: null,
            replyToHandle: null
          }
        ]
      },
      {
        id: 'wuit_seed_viktor_1',
        authorId: 'npc_viktor_cronista',
        text: `Os sensores do Instituto registraram uma oscilação de 3.4 micro-wu na pressão barométrica perto da Torre do Relógio às 16h. Não se surpreendam se as bússolas começarem a girar no sentido anti-horário amanhã.

Dica: recalibrem seus cronômetros antes que a meia-noite chegue adiantada.

#CienciaDeWu #AnomaliasUrbanas #ViktorObserva`,
        timestamp: now - (120 * 60 * 1000),
        timeDisplay: '01/08/2061',
        likes: 47,
        likedBy: [],
        rewuits: 18,
        rewuitedBy: [],
        media: '',
        comments: [
          {
            id: 'c_seed_viktor_1_1',
            authorId: 'npc_leo_mecanico',
            text: `Minha bússola da bancada já está apontando pro leste há duas horas. Achei que fosse defeito mecânico no ponteiro.`,
            timestamp: now - (110 * 60 * 1000),
            timeDisplay: '01/08/2061',
            replyToCommentId: null,
            replyToHandle: null
          },
          {
            id: 'c_seed_viktor_1_2',
            authorId: 'npc_viktor_cronista',
            text: `Não é defeito, @leo_engrenagens. É a malha etérea da cidade reagindo à sobrecarga dos geradores centrais.`,
            timestamp: now - (105 * 60 * 1000),
            timeDisplay: '01/08/2061',
            replyToCommentId: 'c_seed_viktor_1_1',
            replyToHandle: '@leo_engrenagens'
          },
          {
            id: 'c_seed_viktor_1_3',
            authorId: 'npc_bichinhos_wui',
            text: `Isso explica por que os gatos passaram a tarde inteira miando fixados nas paredes vazias!`,
            timestamp: now - (100 * 60 * 1000),
            timeDisplay: '01/08/2061',
            replyToCommentId: null,
            replyToHandle: null
          }
        ]
      },
      {
        id: 'wuit_seed_gov_2',
        authorId: 'npc_gov_paladium',
        text: `[COMUNICADO OFICIAL DO SENADO DE PALADIUM]
DECRETO N. 884/26

Fica instituída a Tarifa Provisória sobre o Refino de Cristais de Éter Bruto, destinada ao Fundo Emergencial de Contenção Urbana.

O racionamento de energia nos Distritos 3 e 4 vigorará entre 01:00 e 05:00 de segunda a sexta-feira.

#SenadoPaladium #Decreto884 #AdministracaoPublica`,
        timestamp: now - (180 * 60 * 1000),
        timeDisplay: '30/07/2061',
        likes: 21,
        likedBy: [],
        rewuits: 46,
        rewuitedBy: [],
        media: '',
        comments: [
          {
            id: 'c_seed_gov_2_1',
            authorId: 'npc_leo_mecanico',
            text: `Racionamento no Distrito 4 de novo? Como vou manter as soldas das próteses ligadas de madrugada? Vocês aumentam imposto do cristal e desligam o disjuntor. Piada pronta.`,
            timestamp: now - (170 * 60 * 1000),
            timeDisplay: '30/07/2061',
            replyToCommentId: null,
            replyToHandle: null
          },
          {
            id: 'c_seed_gov_2_2',
            authorId: 'npc_gazeta_paladium',
            text: `Enquanto isso, a iluminação ornamental do Palácio do Governo permanece acesa 24 horas por dia com cristais de grau puro.`,
            timestamp: now - (160 * 60 * 1000),
            timeDisplay: '30/07/2061',
            replyToCommentId: 'c_seed_gov_2_1',
            replyToHandle: '@leo_engrenagens'
          }
        ]
      },
      {
        id: 'wuit_seed_sara_barista_1',
        authorId: 'npc_sara',
        text: `Primeiro turno das 06h: caldeira de vapor sibilando, grãos de café de Fragktus moídos na hora e cheiro de canela etérea no ar. Se a prova de Alquimia Aplicada do 3º ano no Primórdio for tão difícil quanto o professor Aldous prometeu, vou precisar de três xícaras duplas antes de abrir o colégio.

#CafeNevoa #BaristaLife #Fragktus #ColegioPrimordio #Alquimia`,
        timestamp: now - (240 * 60 * 1000),
        timeDisplay: '28/06/2061',
        likes: 68,
        likedBy: [],
        rewuits: 15,
        rewuitedBy: [],
        media: '',
        comments: [
          {
            id: 'c_seed_barista_1',
            authorId: 'npc_viktor_cronista',
            text: `Guarda uma garrafa térmica de café duplo bem amargo pra mim, @sara. A noite de análises no laboratório vai ser longa.`,
            timestamp: now - (230 * 60 * 1000),
            timeDisplay: '28/06/2061',
            replyToCommentId: null,
            replyToHandle: null
          },
          {
            id: 'c_seed_barista_2',
            authorId: 'npc_sara',
            text: `Separado e bem forte, doutor! Passa aqui pela porta lateral que não tem a fila dos fiscais da alfândega.`,
            timestamp: now - (220 * 60 * 1000),
            timeDisplay: '28/06/2061',
            replyToCommentId: 'c_seed_barista_1',
            replyToHandle: '@viktor_cronista'
          }
        ]
      },
      {
        id: 'wuit_seed_sara_nevoa_2',
        authorId: 'npc_sara',
        text: `Acabei de ver uma fumaça arroxeada saindo do bueiro em frente à Torre do Sino. Não sei se era vazamento de resíduo alquímico ou magia clandestina, mas meu gato se recusou terminantemente a passar perto da calçada.

Alguém mais sentiu cheiro de cobre queimado?

#DistritoComercial #PaladiumEstranho #AlquimiaUrbana`,
        timestamp: now - (300 * 60 * 1000),
        timeDisplay: '24/06/2061',
        likes: 45,
        likedBy: [],
        rewuits: 11,
        rewuitedBy: [],
        media: '',
        comments: [
          {
            id: 'c_seed_sara_nevoa_1',
            authorId: 'npc_viktor_cronista',
            text: `Não respire sem lenço ou máscara de feltro, @sara. Os filtros de purificação do Setor 3 estão entupidos desde o início da semana.`,
            timestamp: now - (290 * 60 * 1000),
            timeDisplay: '24/06/2061',
            replyToCommentId: null,
            replyToHandle: null
          },
          {
            id: 'c_seed_sara_nevoa_2',
            authorId: 'npc_leo_mecanico',
            text: `Fumaça arroxeada com cheiro de cobre é assinatura de sublimação de nitrato de éter. Alguém descartou reagente na tubulação sem neutralizar.`,
            timestamp: now - (280 * 60 * 1000),
            timeDisplay: '24/06/2061',
            replyToCommentId: null,
            replyToHandle: null
          }
        ]
      },
      {
        id: 'wuit_seed_sara_estudos_1',
        authorId: 'npc_sara',
        text: `Tentando conciliar os relatórios de Herbologia do Primórdio com o expediente no Café Névoa. Se eu errar a dosagem de folhas de lótus etéreas de novo, a diretoria vai me colocar de recuperação no semestre inteiro. Pelo menos o aroma de café ajuda a não desmaiar em cima dos pergaminhos.

#VidaDeEstudante #ColegioPrimordio #Herbologia #CafeNevoa`,
        timestamp: now - (360 * 60 * 1000),
        timeDisplay: '19/06/2061',
        likes: 54,
        likedBy: [],
        rewuits: 10,
        rewuitedBy: [],
        media: '',
        comments: []
      },
      {
        id: 'wuit_seed_sara_1',
        authorId: 'npc_sara',
        text: `Bom dia para quem acordou com cheiro de ozônio e vapor de caldeira vazando na rua. O Café Névoa já está aberto e o chá de camomila estelar tá saindo com 20% de desconto para quem tiver cara de quem não dormiu por causa do toque de recolher.

E por favor: parem de deixar seus mascotes mastigarem os fios de cobre da fachada!

#CafeNevoa #PaladiumDaily #ChadeBruxa`,
        timestamp: now - (420 * 60 * 1000),
        timeDisplay: '12/06/2061',
        likes: 39,
        likedBy: [],
        rewuits: 9,
        rewuitedBy: [],
        media: '',
        comments: [
          {
            id: 'c_seed_sara_1_1',
            authorId: 'npc_bichinhos_wui',
            text: `Se for o furãozinho albino com coleira de latão, o nome dele é Pipoca e ele é viciado em eletricidade estática. Peço perdão em nome da comunidade pet!`,
            timestamp: now - (410 * 60 * 1000),
            timeDisplay: '12/06/2061',
            replyToCommentId: null,
            replyToHandle: null
          },
          {
            id: 'c_seed_sara_1_2',
            authorId: 'npc_sara',
            text: `Ele quase virou uma torrada no condensador do balcão! Mas ele ganhou um pedaço de biscoito de aveia e perdoei.`,
            timestamp: now - (400 * 60 * 1000),
            timeDisplay: '12/06/2061',
            replyToCommentId: 'c_seed_sara_1_1',
            replyToHandle: '@fauna_verdes'
          }
        ]
      }
    ];
  }

  loadLocalCache() {
    const savedAcc = localStorage.getItem(WUITTER_STORAGE_ACCOUNTS);
    if (savedAcc) {
      try {
        this.accounts = JSON.parse(savedAcc);
        DEFAULT_ACCOUNTS.forEach(def => {
          const exists = this.accounts.find(a => a.id === def.id);
          if (!exists) {
            this.accounts.push(def);
          } else {
            exists.tokens = def.tokens;
            exists.hashes = def.hashes;
            exists.isMaster = def.isMaster;
            if (def.isMaster) {
              exists.name = 'Mestre';
              exists.handle = '@mestre';
              exists.badge = 'gold';
            }
            if (def.id === 'npc_bichinhos_wui') {
              exists.name = 'Fauna das Terras Verdes';
              exists.handle = '@fauna_verdes';
              exists.avatarLetter = 'F';
            }
            if (def.id === 'npc_sara') {
              exists.name = 'Sara Auguil';
              exists.handle = '@sara';
              exists.bio = def.bio;
            }
            if (def.id === 'npc_colegio_primordio') {
              exists.name = 'Colégio Integrado Primórdio de Fragktus';
              exists.handle = '@colegio_primordio';
              exists.badge = 'gold';
            }
            if (def.id === 'npc_gov_fragktus') {
              exists.name = 'Governo & Alto Comando de Fragktus';
              exists.handle = '@gov_fragktus';
              exists.badge = 'gold';
            }
            if (!exists.avatarLetter) exists.avatarLetter = (exists.name || 'P').charAt(0).toUpperCase();
          }
        });
      } catch (e) {
        this.accounts = [...DEFAULT_ACCOUNTS];
      }
    } else {
      this.accounts = [...DEFAULT_ACCOUNTS];
    }

    // Remove contas excluidas se ainda estiverem no storage local
    this.accounts = this.accounts.filter(a => a && a.name && a.name.toLowerCase() !== 'pindolla' && a.handle !== '@pindolla');
    this.saveAccountsLocal();

    const savedPosts = localStorage.getItem(WUITTER_STORAGE_POSTS);
    if (savedPosts) {
      try {
        this.posts = JSON.parse(savedPosts);
      } catch (e) {
        this.posts = [];
      }
    } else {
      this.posts = [];
    }

    // Mescla posts iniciais do universo para manter o feed vivo e datas atualizadas
    const seedPosts = this.getInitialSeedPosts();
    const seedMap = new Map();
    seedPosts.forEach(s => seedMap.set(s.id, s));

    // Atualiza posts salvos no cache local com as novas definicoes de seed
    this.posts = this.posts.map(p => {
      if (seedMap.has(p.id)) {
        const seed = seedMap.get(p.id);
        return {
          ...seed,
          likes: Math.max(seed.likes || 0, p.likes || 0),
          likedBy: Array.from(new Set([...(seed.likedBy || []), ...(p.likedBy || [])])),
          rewuits: Math.max(seed.rewuits || 0, p.rewuits || 0),
          rewuitedBy: Array.from(new Set([...(seed.rewuitedBy || []), ...(p.rewuitedBy || [])])),
          comments: [
            ...seed.comments,
            ...(p.comments || []).filter(c => !seed.comments.some(sc => sc.id === c.id))
          ]
        };
      }
      return p;
    });

    seedPosts.forEach(seed => {
      if (!this.posts.some(p => p.id === seed.id)) {
        this.posts.push(seed);
      }
    });
    this.savePostsLocal();
  }

  saveAccountsLocal() {
    localStorage.setItem(WUITTER_STORAGE_ACCOUNTS, JSON.stringify(this.accounts));
  }

  savePostsLocal() {
    localStorage.setItem(WUITTER_STORAGE_POSTS, JSON.stringify(this.posts));
  }

  async authenticateWithSavedToken() {
    const token = this.myToken || localStorage.getItem(WUITTER_STORAGE_TOKEN) || localStorage.getItem('wuitter_token');
    if (token) {
      await this.loginWithToken(token, false);
    }
  }

  async loginWithToken(rawToken, showAlert = true) {
    if (!rawToken) return false;
    const token = rawToken.trim().toUpperCase();
    const tokenHash = await this.sha256(token);

    const isDirectMaster = MASTER_PLAIN_TOKENS.includes(token) || MASTER_HASHES.includes(tokenHash) || MASTER_HASHES.includes(token.toLowerCase());

    let matched = null;

    if (isDirectMaster) {
      matched = this.accounts.find(a => a.id === 'mestre' || a.isMaster === true);
      if (!matched) {
        matched = DEFAULT_ACCOUNTS[0];
        this.accounts.unshift(matched);
      }
    } else {
      matched = this.accounts.find(acc => {
        if (acc.tokens && acc.tokens.some(t => t.toUpperCase() === token)) return true;
        if (acc.hashes && (acc.hashes.includes(tokenHash) || acc.hashes.includes(token.toLowerCase()))) return true;
        return false;
      });
    }

    if (matched) {
      this.myToken = token;
      localStorage.setItem(WUITTER_STORAGE_TOKEN, token);
      localStorage.setItem('wuitter_token', token);
      this.authenticatedAccount = matched;
      this.selectedPostingAccountId = matched.id;

      if (showAlert) {
        if (matched.isMaster) {
          alert('Autenticado com sucesso como MESTRE! Painel do Mestre e ferramentas liberados.');
        } else {
          alert(`Autenticado com sucesso como ${matched.name}!`);
        }
      }
      this.render();
      return true;
    } else {
      if (showAlert) {
        alert('Token inválido. Verifique o código fornecido.');
      }
      return false;
    }
  }

  logout() {
    this.myToken = null;
    localStorage.removeItem(WUITTER_STORAGE_TOKEN);
    localStorage.removeItem('wuitter_token');
    this.authenticatedAccount = null;
    this.selectedPostingAccountId = null;
    this.render();
  }

  isMaster() {
    return this.authenticatedAccount && this.authenticatedAccount.isMaster === true;
  }

  getPostingAccount() {
    if (this.isMaster() && this.selectedPostingAccountId) {
      return this.accounts.find(a => a.id === this.selectedPostingAccountId) || this.authenticatedAccount;
    }
    return this.authenticatedAccount || {
      id: 'visitante',
      name: 'Visitante Não Autenticado',
      handle: '@visitante',
      avatarLetter: '?',
      avatarImage: '',
      avatarColor: '#374151',
      badge: 'none'
    };
  }

  getAccountById(id) {
    if (!id) {
      return {
        id: 'anon',
        name: 'Cidadão de Paladium',
        handle: '@cidadao',
        avatarLetter: 'C',
        avatarImage: '',
        avatarColor: '#475569',
        badge: 'none'
      };
    }
    let acc = this.accounts.find(a => a.id === id);
    if (!acc) {
      acc = DEFAULT_ACCOUNTS.find(a => a.id === id);
    }
    return acc || {
      id: id,
      name: id.replace(/^(npc_|char_)/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      handle: `@${id.replace(/^(npc_|char_)/, '')}`,
      avatarLetter: id.charAt(0).toUpperCase(),
      avatarImage: '',
      avatarColor: '#475569',
      badge: 'none'
    };
  }

  async optimizeImage(fileOrBlobOrDataUrl, maxWidth = 1200, maxHeight = 1200, quality = 0.8) {
    if (!fileOrBlobOrDataUrl) return '';
    return new Promise((resolve) => {
      const processImg = (src) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // WebP ou JPEG comprimido
          let dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(dataUrl);
        };
        img.onerror = () => {
          // Em caso de erro na decodificação, retorna original
          resolve(typeof fileOrBlobOrDataUrl === 'string' ? fileOrBlobOrDataUrl : '');
        };
        img.src = src;
      };

      if (typeof fileOrBlobOrDataUrl === 'string') {
        if (fileOrBlobOrDataUrl.startsWith('data:image')) {
          processImg(fileOrBlobOrDataUrl);
        } else {
          resolve(fileOrBlobOrDataUrl);
        }
      } else {
        const reader = new FileReader();
        reader.onload = (e) => processImg(e.target.result);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(fileOrBlobOrDataUrl);
      }
    });
  }

  // ---- ENGAJAMENTO ORGÂNICO AUTOMÁTICO (CURTIDAS & RE-WUITS VIVOS) ----
  ensureOrganicBaselineEngagement() {
    if (!this.posts || this.posts.length === 0) return;
    let modified = false;

    this.posts.forEach(post => {
      // Se o post tiver 0 ou poucas curtidas, atribui um baseline orgânico determinístico
      if (typeof post.likes !== 'number' || post.likes < 3) {
        let hash = 0;
        const str = (post.id || '') + (post.text || '') + (post.authorId || '');
        for (let i = 0; i < str.length; i++) {
          hash = ((hash << 5) - hash) + str.charCodeAt(i);
          hash |= 0;
        }
        const absHash = Math.abs(hash);

        // Curtidas variadas entre 6 e 38 dependendo do conteúdo/autor
        const isOfficialOrNews = post.authorId === 'npc_gov_paladium' || post.authorId === 'npc_gazeta_paladium';
        const isPetOrArt = post.authorId === 'npc_bichinhos_wui' || post.authorId === 'npc_paladium_art';
        
        let baseLikes = (absHash % 28) + 6;
        if (isOfficialOrNews) baseLikes += 15;
        if (isPetOrArt) baseLikes += 25;

        let baseRewuits = (absHash % 7);
        if (isOfficialOrNews) baseRewuits += 5;

        post.likes = Math.max(post.likes || 0, baseLikes);
        post.rewuits = Math.max(post.rewuits || 0, baseRewuits);
        if (!post.likedBy) post.likedBy = [];
        if (!post.rewuitedBy) post.rewuitedBy = [];
        modified = true;
      }
    });

    if (modified) {
      this.savePostsLocal();
    }
  }

  startOrganicEngagementLoop() {
    const runTick = () => {
      if (this.posts && this.posts.length > 0) {
        // Seleciona um post aleatório dos 15 mais recentes para receber engajamento orgânico de cidadãos
        const recentPool = this.posts.slice(0, Math.min(15, this.posts.length));
        if (recentPool.length > 0) {
          const randomIndex = Math.floor(Math.random() * recentPool.length);
          const targetPost = recentPool[randomIndex];

          if (targetPost) {
            let updated = false;

            // 65% de chance de somar +1 curtida orgânica (com teto natural de 85)
            if (Math.random() < 0.65 && (targetPost.likes || 0) < 85) {
              targetPost.likes = (targetPost.likes || 0) + 1;
              updated = true;
            }

            // 20% de chance de somar +1 re-wuit orgânico (com teto natural de 30)
            if (Math.random() < 0.20 && (targetPost.rewuits || 0) < 30) {
              targetPost.rewuits = (targetPost.rewuits || 0) + 1;
              updated = true;
            }

            if (updated) {
              this.savePostsLocal();
              this.updatePostStatsInDOM(targetPost.id);
            }
          }
        }
      }

      // Próxima interação orgânica aleatória entre 18 e 45 segundos
      const nextDelay = 18000 + Math.floor(Math.random() * 27000);
      setTimeout(runTick, nextDelay);
    };

    // Inicia após 8 segundos da abertura da página
    setTimeout(runTick, 8000);
  }

  bindEvents() {
    document.querySelectorAll('.w-feed-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.w-feed-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeTab = tab.dataset.tab;
        this.renderFeed();
      });
    });

    const textarea = document.getElementById('w-compose-input');
    const charCounter = document.getElementById('w-char-counter');
    const postBtn = document.getElementById('w-btn-post');

    if (textarea) {
      textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        if (charCounter) charCounter.textContent = `${len}/280`;
        if (postBtn) {
          postBtn.disabled = (!this.authenticatedAccount) || (len === 0 && !this.pendingImageBase64);
        }
      });

      textarea.addEventListener('paste', async (e) => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let index in items) {
          const item = items[index];
          if (item.kind === 'file') {
            const blob = item.getAsFile();
            if (blob && blob.type.startsWith('image/')) {
              e.preventDefault();
              try {
                const optimized = await this.optimizeImage(blob, 1200, 1200, 0.8);
                if (optimized) {
                  this.pendingImageBase64 = optimized;
                  this.showImagePreview(this.pendingImageBase64);
                  if (postBtn && this.authenticatedAccount) postBtn.disabled = false;
                }
              } catch(err) {
                console.warn('Erro ao processar imagem colada:', err);
              }
            } else {
              alert('Apenas fotos e imagens podem ser anexadas (vídeos não são permitidos).');
            }
          }
        }
      });
    }

    if (postBtn) {
      postBtn.addEventListener('click', () => {
        this.submitWuit();
      });
    }

    const imgInput = document.getElementById('w-compose-image-input');
    if (imgInput) {
      imgInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          if (!file.type.startsWith('image/')) {
            alert('Apenas arquivos de imagem e fotos são permitidos (vídeos não são suportados).');
            imgInput.value = '';
            return;
          }
          try {
            const optimized = await this.optimizeImage(file, 1200, 1200, 0.8);
            if (optimized) {
              this.pendingImageBase64 = optimized;
              this.showImagePreview(this.pendingImageBase64);
              if (postBtn && this.authenticatedAccount) postBtn.disabled = false;
            }
          } catch(err) {
            console.warn('Erro ao processar arquivo de imagem:', err);
          }
        }
      });
    }

    const imgUrlBtn = document.getElementById('w-tool-img-url');
    if (imgUrlBtn) {
      imgUrlBtn.addEventListener('click', () => {
        const url = prompt('Insira o link direto da imagem/foto (URL):');
        if (url && url.trim()) {
          this.pendingImageBase64 = url.trim();
          this.showImagePreview(this.pendingImageBase64);
          if (postBtn && this.authenticatedAccount) postBtn.disabled = false;
        }
      });
    }

    const removePreviewBtn = document.getElementById('w-remove-preview-btn');
    if (removePreviewBtn) {
      removePreviewBtn.addEventListener('click', () => {
        this.pendingImageBase64 = '';
    this.activeReplyContext = null;
        if (imgInput) imgInput.value = '';
        const preview = document.getElementById('w-compose-preview');
        if (preview) preview.style.display = 'none';
        if (textarea && postBtn) {
          postBtn.disabled = textarea.value.trim().length === 0;
        }
      });
    }

    const searchInput = document.getElementById('w-search-input');
    const searchClearBtn = document.getElementById('w-search-clear-btn');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        if (searchClearBtn) {
          searchClearBtn.style.display = e.target.value.length > 0 ? 'flex' : 'none';
        }
        if (this.currentView === 'profile' && this.searchQuery) {
          this.currentView = 'feed';
        }
        this.renderHeader();
        this.renderProfileHero();
        this.renderFeed();
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.clearSearch();
        }
      });
    }

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        this.clearSearch();
      });
    }

    const btnNewAccount = document.getElementById('w-gm-new-account');
    if (btnNewAccount) {
      btnNewAccount.addEventListener('click', () => this.openNewAccountModal());
    }

    const btnExportJson = document.getElementById('w-gm-export-json');
    if (btnExportJson) {
      btnExportJson.addEventListener('click', () => this.exportFeedJson());
    }

    const btnImportJson = document.getElementById('w-gm-import-json');
    if (btnImportJson) {
      btnImportJson.addEventListener('click', () => this.importFeedJson());
    }

    const masterAccountSelector = document.getElementById('w-master-account-select');
    if (masterAccountSelector) {
      masterAccountSelector.addEventListener('change', (e) => {
        this.selectedPostingAccountId = e.target.value;
        this.renderComposeHeader();
      });
    }
  }

  showImagePreview(src) {
    const preview = document.getElementById('w-compose-preview');
    const previewImg = document.getElementById('w-compose-preview-img');
    if (preview && previewImg) {
      previewImg.src = src;
      preview.style.display = 'block';
    }
  }

  async submitWuit() {
    if (!this.authenticatedAccount) {
      this.openTokenModal();
      return;
    }

    const textarea = document.getElementById('w-compose-input');
    const text = textarea ? textarea.value.trim() : '';

    if (!text && !this.pendingImageBase64) return;

    const postingAcc = this.getPostingAccount();

    let finalMedia = this.pendingImageBase64 || '';
    if (finalMedia && finalMedia.startsWith('data:image') && finalMedia.length > 150000) {
      try {
        finalMedia = await this.optimizeImage(finalMedia, 1200, 1200, 0.78);
      } catch(e) {}
    }

    // Curtidas iniciais automáticas (entre 2 e 5 curtidas de cidadãos ativos)
    const initialOrganicLikes = Math.floor(Math.random() * 4) + 2;
    const initialOrganicRewuits = Math.random() < 0.35 ? 1 : 0;

    const newPost = {
      id: 'wuit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      authorId: postingAcc.id,
      text: text,
      timestamp: Date.now(),
      likes: initialOrganicLikes,
      likedBy: [],
      rewuits: initialOrganicRewuits,
      rewuitedBy: [],
      comments: [],
      media: finalMedia
    };

    // Programa curtidas orgânicas adicionais surgindo nos próximos segundos
    setTimeout(() => {
      const p = this.posts.find(x => x.id === newPost.id);
      if (p) {
        p.likes = (p.likes || 0) + Math.floor(Math.random() * 2) + 1;
        this.savePostsLocal();
        this.updatePostStatsInDOM(p.id);
      }
    }, 12000 + Math.floor(Math.random() * 15000));

    setTimeout(() => {
      const p = this.posts.find(x => x.id === newPost.id);
      if (p) {
        p.likes = (p.likes || 0) + Math.floor(Math.random() * 3) + 1;
        if (Math.random() < 0.4) p.rewuits = (p.rewuits || 0) + 1;
        this.savePostsLocal();
        this.updatePostStatsInDOM(p.id);
      }
    }, 35000 + Math.floor(Math.random() * 25000));

    this.posts.unshift(newPost);
    this.savePostsLocal();

    // Reset Compose Box
    if (textarea) textarea.value = '';
    this.pendingImageBase64 = '';
    this.activeReplyContext = null;
    const imgInput = document.getElementById('w-compose-image-input');
    if (imgInput) imgInput.value = '';
    const preview = document.getElementById('w-compose-preview');
    if (preview) preview.style.display = 'none';
    const charCounter = document.getElementById('w-char-counter');
    if (charCounter) charCounter.textContent = '0/280';
    const postBtn = document.getElementById('w-btn-post');
    if (postBtn) postBtn.disabled = true;

    this.renderFeed(newPost.id);

    // Transmite instantaneamente para os outros usuários e grava no Supabase Cloud
    this.broadcastSync('NEW_POST', { post: newPost });
    await this.syncToCloud();
  }

  goToFeed() {
    this.currentView = 'feed';
    this.profileAccountId = null;
    this.searchQuery = '';
    const searchInput = document.getElementById('w-search-input');
    if (searchInput) searchInput.value = '';
    const clearBtn = document.getElementById('w-search-clear-btn');
    if (clearBtn) clearBtn.style.display = 'none';
    this.updateNavActiveState('home');
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  viewProfile(accountId) {
    if (!accountId) return;
    const acc = this.getAccountById(accountId);
    if (!acc) return;

    this.currentView = 'profile';
    this.profileAccountId = accountId;
    this.profileTab = 'posts';
    this.searchQuery = '';
    const searchInput = document.getElementById('w-search-input');
    if (searchInput) searchInput.value = '';
    const clearBtn = document.getElementById('w-search-clear-btn');
    if (clearBtn) clearBtn.style.display = 'none';

    this.updateNavActiveState(null);
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToExplore() {
    this.currentView = 'explore';
    this.profileAccountId = null;
    this.updateNavActiveState('explore');
    this.render();
    const searchInput = document.getElementById('w-search-input');
    if (searchInput) {
      searchInput.focus();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setProfileTab(tab) {
    this.profileTab = tab;
    this.renderProfileHero();
    this.renderFeed();
  }

  clearSearch() {
    this.searchQuery = '';
    const searchInput = document.getElementById('w-search-input');
    if (searchInput) searchInput.value = '';
    const clearBtn = document.getElementById('w-search-clear-btn');
    if (clearBtn) clearBtn.style.display = 'none';
    this.render();
  }

  updateNavActiveState(activeItem) {
    const homeBtn = document.getElementById('w-nav-home-item');
    const exploreBtn = document.getElementById('w-nav-explore-item');
    if (homeBtn) homeBtn.classList.toggle('active', activeItem === 'home');
    if (exploreBtn) exploreBtn.classList.toggle('active', activeItem === 'explore');
  }

  render() {
    this.renderHeader();
    this.renderSidebarAuth();
    this.renderProfileHero();
    this.renderComposeHeader();
    this.renderFeed();
    this.renderMasterPanel();
    this.renderTrends();
  }

  renderHeader() {
    const header = document.getElementById('w-feed-header');
    if (!header) return;

    if (this.currentView === 'profile' && this.profileAccountId) {
      const acc = this.getAccountById(this.profileAccountId);
      const userPosts = this.posts.filter(p => p.authorId === acc.id);
      header.innerHTML = `
        <div class="w-header-title-bar">
          <div style="display: flex; align-items: center;">
            <button class="w-btn-back" onclick="window.wuitter.goToFeed()" title="Voltar ao Feed">
              ${SVG_ICONS.arrowLeft}
            </button>
            <div class="w-header-user-info">
              <h1 class="w-header-title" style="font-size: 1.15rem; display: flex; align-items: center; gap: 5px;">
                ${acc.name}
                ${this.renderBadgeSvg(acc.badge)}
              </h1>
              <span class="w-header-subtitle">${userPosts.length} Wuit${userPosts.length === 1 ? '' : 's'}</span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="w-btn-header-token" onclick="window.wuitter.openTokenModal()" id="w-header-token-btn" title="Autenticar ou Trocar Token">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1.5-1.5L8 9l-4 4a5.66 5.66 0 1 0 8 8l4-4 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5 2-2z"/></svg>
              <span id="w-header-token-text">${this.authenticatedAccount ? `${this.authenticatedAccount.name} (Trocar)` : 'Autenticar Token'}</span>
            </button>
          </div>
        </div>
      `;
      return;
    }

    if (this.searchQuery) {
      header.innerHTML = `
        <div class="w-header-title-bar">
          <div style="display: flex; align-items: center;">
            <button class="w-btn-back" onclick="window.wuitter.clearSearch()" title="Limpar Busca">
              ${SVG_ICONS.arrowLeft}
            </button>
            <div class="w-header-user-info">
              <h1 class="w-header-title" style="font-size: 1.15rem;">Busca: "${this.searchQuery}"</h1>
              <span class="w-header-subtitle">Resultados em tempo real</span>
            </div>
          </div>
          <button class="w-btn-header-token" onclick="window.wuitter.clearSearch()" style="font-size: 0.75rem;">
            Limpar busca
          </button>
        </div>
      `;
      return;
    }

    if (this.currentView === 'explore') {
      header.innerHTML = `
        <div class="w-header-title-bar">
          <h1 class="w-header-title">Explorar Wuitter</h1>
          <div class="w-realtime-status-pill online" id="w-realtime-badge">
            <span class="w-realtime-dot"></span>
            <span class="w-realtime-text">Tempo Real Ativo</span>
          </div>
        </div>
        <div class="w-feed-tabs">
          <button class="w-feed-tab active">Em alta / Recentes</button>
        </div>
      `;
      return;
    }

    // Feed Principal
    header.innerHTML = `
      <div class="w-header-title-bar">
        <h1 class="w-header-title">Página Inicial</h1>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="w-btn-header-token" onclick="window.wuitter.openTokenModal()" id="w-header-token-btn" title="Autenticar ou Trocar Token">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1.5-1.5L8 9l-4 4a5.66 5.66 0 1 0 8 8l4-4 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5 2-2z"/></svg>
            <span id="w-header-token-text">${this.authenticatedAccount ? `${this.authenticatedAccount.name} (Trocar)` : 'Autenticar Token'}</span>
          </button>
          <div class="w-realtime-status-pill online" id="w-realtime-badge" title="Sincronização em tempo real via Nuvem e WebSocket">
            <span class="w-realtime-dot"></span>
            <span class="w-realtime-text">Tempo Real Ativo</span>
          </div>
        </div>
      </div>
      <div class="w-feed-tabs">
        <button class="w-feed-tab active" data-tab="para-voce">Para você</button>
      </div>
    `;
  }

  renderProfileHero() {
    const container = document.getElementById('w-profile-hero-container');
    const composeSection = document.getElementById('w-compose-section');
    if (!container) return;

    if (this.currentView !== 'profile' || !this.profileAccountId) {
      container.style.display = 'none';
      if (composeSection) composeSection.style.display = (this.currentView === 'feed' && !this.searchQuery) ? 'block' : 'none';
      return;
    }

    if (composeSection) composeSection.style.display = 'none';
    container.style.display = 'block';

    const acc = this.getAccountById(this.profileAccountId);
    const isMe = this.authenticatedAccount && this.authenticatedAccount.id === acc.id;
    const canEdit = this.isMaster() || isMe;

    const bgGradient = acc.avatarColor ? `linear-gradient(135deg, ${acc.avatarColor}44 0%, #0c0f17 100%)` : `linear-gradient(135deg, #1e293b 0%, #0f172a 100%)`;
    const roleText = acc.isMaster ? 'Mestre da Mesa' : (acc.slot ? `Investigador &bull; Slot ${acc.slot}` : 'Personagem de Wuitalur');

    container.innerHTML = `
      <div class="w-profile-hero">
        <div class="w-profile-banner" style="background: ${bgGradient};"></div>
        <div class="w-profile-main">
          <div class="w-profile-top-row">
            <div class="w-avatar profile-avatar" style="background-color: ${acc.avatarColor || '#1e293b'};">
              ${acc.avatarImage ? `<img src="${acc.avatarImage}" class="w-avatar profile-avatar" alt="${acc.name}">` : (acc.avatarLetter || acc.name.charAt(0)).toUpperCase()}
            </div>
            <div class="w-profile-actions">
              ${canEdit ? `
                <button class="w-btn-edit-profile" onclick="window.wuitter.openEditProfileModal(window.wuitter.getAccountById('${acc.id}'))">
                  Editar Perfil
                </button>
              ` : (this.authenticatedAccount ? `
                <button class="w-btn-edit-profile" style="background: #fff; color: #000; border-color: #fff;" onclick="alert('Você está acompanhando as postagens de ${acc.name}.')">
                  Seguindo
                </button>
              ` : `
                <button class="w-btn-edit-profile" onclick="window.wuitter.openTokenModal()">
                  Conectar Token
                </button>
              `)}
            </div>
          </div>

          <div class="w-profile-names">
            <div class="w-profile-display-name">
              ${acc.name}
              ${this.renderBadgeSvg(acc.badge)}
            </div>
            <div class="w-profile-handle">${acc.handle}</div>
          </div>

          ${acc.bio ? `<div class="w-profile-bio">${this.formatText(acc.bio)}</div>` : ''}

          <div class="w-profile-meta-row">
            <div class="w-profile-meta-item">
              ${SVG_ICONS.crown}
              <span>${roleText}</span>
            </div>
            <div class="w-profile-meta-item">
              ${SVG_ICONS.calendar}
              <span>Rede In-Universe &bull; Wuitalur</span>
            </div>
          </div>

          <div class="w-profile-stats">
            <div style="cursor: pointer;" onclick="window.wuitter.openConnectionsModal('${acc.id}', 'following')" title="Ver quem ${acc.name} segue">
              <span class="w-profile-stat-count">${acc.followingCount !== undefined ? acc.followingCount : Math.max(1, this.accounts.length - 1)}</span> 
              <span class="w-profile-stat-label">Seguindo</span>
            </div>
            <div style="cursor: pointer;" onclick="window.wuitter.openConnectionsModal('${acc.id}', 'followers')" title="Ver seguidores de ${acc.name}">
              <span class="w-profile-stat-count">${acc.followersCount !== undefined ? acc.followersCount : Math.max(1, this.accounts.length)}</span> 
              <span class="w-profile-stat-label">Seguidores</span>
            </div>
          </div>

          <div class="w-profile-nav-tabs">
            <button class="w-profile-tab ${this.profileTab === 'posts' ? 'active' : ''}" onclick="window.wuitter.setProfileTab('posts')">Wuits</button>
            <button class="w-profile-tab ${this.profileTab === 'replies' ? 'active' : ''}" onclick="window.wuitter.setProfileTab('replies')">Respostas</button>
            <button class="w-profile-tab ${this.profileTab === 'media' ? 'active' : ''}" onclick="window.wuitter.setProfileTab('media')">Mídia</button>
          </div>
        </div>
      </div>
    `;
  }

  renderSidebarAuth() {
    const authContainer = document.getElementById('w-auth-section');
    const masterNavBtn = document.getElementById('w-nav-master-item');
    const navTokenLabel = document.getElementById('w-nav-token-label');
    const headerTokenText = document.getElementById('w-header-token-text');

    const isMaster = this.isMaster();

    if (masterNavBtn) {
      masterNavBtn.style.display = isMaster ? 'flex' : 'none';
    }

    if (!this.authenticatedAccount) {
      if (navTokenLabel) navTokenLabel.textContent = 'Autenticar Token';
      if (headerTokenText) headerTokenText.textContent = 'Autenticar Token';

      if (authContainer) {
        authContainer.innerHTML = `
          <div class="w-auth-box-unlogged">
            <p class="w-auth-unlogged-text">Conecte o token do seu personagem para wuitar.</p>
            <button class="w-btn-post-primary" style="padding: 9px 16px; width: 100%; font-size: 0.88rem;" onclick="window.wuitter.openTokenModal()">
              Autenticar Token
            </button>
          </div>
        `;
      }
      return;
    }

    const acc = this.authenticatedAccount;

    if (navTokenLabel) navTokenLabel.textContent = 'Trocar Token';
    if (headerTokenText) headerTokenText.textContent = `${acc.name} (Trocar)`;

    if (authContainer) {
      authContainer.innerHTML = `
        <div class="w-persona-card-auth w-clickable-profile" onclick="window.wuitter.viewProfile('${acc.id}')" title="Ver meu perfil">
          <div class="w-persona-info">
            ${this.renderAvatarHtml(acc, 'normal')}
            <div class="w-persona-names">
              <span class="w-persona-name">
                ${acc.name}
                ${this.renderBadgeSvg(acc.badge)}
              </span>
              <span class="w-persona-handle">${acc.handle}</span>
            </div>
          </div>
        </div>
        
        ${isMaster ? `
          <button class="w-gm-btn w-gm-btn-highlight" onclick="window.wuitter.openMasterPanelModal()" style="width: 100%; margin-top: 8px; justify-content: center;">
            ${SVG_ICONS.crown}
            <span>Painel do Mestre</span>
          </button>
        ` : ''}

        <div style="display: flex; gap: 6px; margin-top: 8px;">
          <button class="w-gm-btn" style="flex: 1; padding: 6px 10px; font-size: 0.78rem; justify-content: center;" onclick="window.wuitter.openEditProfileModal(window.wuitter.authenticatedAccount)">
            ${SVG_ICONS.settings}
            <span>Editar Perfil</span>
          </button>
          <button class="w-gm-btn" style="color: var(--w-accent-red); padding: 6px 10px; font-size: 0.78rem;" onclick="window.wuitter.logout()" title="Sair da Conta">
            Sair
          </button>
        </div>
      `;
    }
  }

  renderComposeHeader() {
    const avatarEl = document.getElementById('w-compose-avatar-wrap');
    const postingAcc = this.getPostingAccount();

    if (avatarEl) {
      avatarEl.innerHTML = `
        <div class="w-clickable-profile" onclick="window.wuitter.viewProfile('${postingAcc.id}')" title="Ver perfil">
          ${this.renderAvatarHtml(postingAcc, 'normal')}
        </div>
      `;
    }

    const masterSelectWrap = document.getElementById('w-master-selector-wrap');
    if (masterSelectWrap) {
      if (this.isMaster()) {
        masterSelectWrap.style.display = 'block';
        const selectEl = document.getElementById('w-master-account-select');
        if (selectEl) {
          selectEl.innerHTML = this.accounts.map(a => `
            <option value="${a.id}" ${a.id === this.selectedPostingAccountId ? 'selected' : ''}>
              ${a.name} (${a.handle}) ${a.isMaster ? '[MESTRE]' : ''}
            </option>
          `).join('');
        }
      } else {
        masterSelectWrap.style.display = 'none';
      }
    }

    const postBtn = document.getElementById('w-btn-post');
    const textarea = document.getElementById('w-compose-input');
    if (postBtn && textarea) {
      if (!this.authenticatedAccount) {
        textarea.placeholder = 'Autentique seu token de personagem para poder wuitar...';
        textarea.disabled = true;
        postBtn.disabled = true;
      } else {
        textarea.placeholder = `O que está acontecendo, ${postingAcc.name}?`;
        textarea.disabled = false;
        postBtn.disabled = textarea.value.trim().length === 0 && !this.pendingImageBase64;
      }
    }
  }

  renderAvatarHtml(account, size = 'normal') {
    const sizeClass = size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : '';
    if (account.avatarImage) {
      return `<img src="${account.avatarImage}" class="w-avatar ${sizeClass}" alt="${account.name}">`;
    }
    const letter = (account.avatarLetter || account.name.charAt(0) || 'P').toUpperCase();
    const bg = account.avatarColor || '#1f2937';
    return `<div class="w-avatar ${sizeClass}" style="background-color: ${bg};">${letter}</div>`;
  }

  renderBadgeSvg(badgeType) {
    if (badgeType === 'blue') return SVG_ICONS.verifiedBlue;
    if (badgeType === 'gold') return SVG_ICONS.verifiedGold;
    return '';
  }

  formatTime(timestamp, customDisplay = null) {
    if (customDisplay) return customDisplay;
    if (typeof timestamp === 'string' && (timestamp.includes('/') || timestamp.includes('-') || timestamp.includes(':'))) {
      return timestamp;
    }
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return `${Math.max(1, diff)}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }

  formatText(text) {
    const escaped = (text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped
      .replace(/#([a-zA-Z0-9_]+)/g, '<a href="javascript:void(0)" class="w-tag" onclick="window.wuitter.filterByTag(\'$1\')">#$1</a>')
      .replace(/@([a-zA-Z0-9_]+)/g, (match, p1) => {
        const target = this.accounts.find(a => a.handle.toLowerCase() === `@${p1.toLowerCase()}`);
        if (target) {
          return `<a href="javascript:void(0)" class="w-mention" onclick="window.wuitter.viewProfile('${target.id}')">@${p1}</a>`;
        }
        return `<a href="javascript:void(0)" class="w-mention" onclick="window.wuitter.filterByMention('${p1}')">@${p1}</a>`;
      });
  }

  filterByTag(tag) {
    const searchInput = document.getElementById('w-search-input');
    const clearBtn = document.getElementById('w-search-clear-btn');
    if (searchInput) searchInput.value = `#${tag}`;
    if (clearBtn) clearBtn.style.display = 'flex';
    this.searchQuery = `#${tag}`.toLowerCase();
    if (this.currentView === 'profile') this.currentView = 'feed';
    this.renderHeader();
    this.renderProfileHero();
    this.renderFeed();
  }

  filterByMention(mention) {
    const target = this.accounts.find(a => a.handle.toLowerCase() === `@${mention.toLowerCase()}`);
    if (target) {
      this.viewProfile(target.id);
      return;
    }
    const searchInput = document.getElementById('w-search-input');
    const clearBtn = document.getElementById('w-search-clear-btn');
    if (searchInput) searchInput.value = `@${mention}`;
    if (clearBtn) clearBtn.style.display = 'flex';
    this.searchQuery = `@${mention}`.toLowerCase();
    if (this.currentView === 'profile') this.currentView = 'feed';
    this.renderHeader();
    this.renderProfileHero();
    this.renderFeed();
  }

  renderFeed(highlightPostId = null) {
    const feedContainer = document.getElementById('w-feed-list');
    if (!feedContainer) return;

    let filtered = [...this.posts];

    // 1. Filtragem por perfil se estiver no perfil
    if (this.currentView === 'profile' && this.profileAccountId) {
      const accId = this.profileAccountId;
      if (this.profileTab === 'posts') {
        filtered = filtered.filter(p => p.authorId === accId);
      } else if (this.profileTab === 'replies') {
        filtered = filtered.filter(p => p.authorId === accId || (p.comments && p.comments.some(c => c.authorId === accId)));
      } else if (this.profileTab === 'media') {
        filtered = filtered.filter(p => p.authorId === accId && !!p.media);
      }
    }

    // 2. Filtragem por Busca
    if (this.searchQuery) {
      const q = this.searchQuery;
      filtered = filtered.filter(p => {
        const author = this.getAccountById(p.authorId);
        const textMatch = p.text && p.text.toLowerCase().includes(q);
        const authorNameMatch = author.name && author.name.toLowerCase().includes(q);
        const handleMatch = author.handle && author.handle.toLowerCase().includes(q);
        const commentMatch = p.comments && p.comments.some(c => c.text && c.text.toLowerCase().includes(q));
        return textMatch || authorNameMatch || handleMatch || commentMatch;
      });
    }

    let bannerHtml = '';
    if (this.searchQuery) {
      bannerHtml = `
        <div class="w-search-active-banner">
          <span>Buscando por: <strong>${this.searchQuery}</strong> (${filtered.length} wuit${filtered.length === 1 ? '' : 's'})</span>
          <a onclick="window.wuitter.clearSearch()">Limpar</a>
        </div>
      `;
    }

    if (filtered.length === 0) {
      let emptyMsg = 'Nenhum Wuit no momento';
      let emptySub = 'Autentique seu token de personagem e seja o primeiro a postar!';

      if (this.currentView === 'profile') {
        const acc = this.getAccountById(this.profileAccountId);
        if (this.profileTab === 'media') {
          emptyMsg = `@${acc.name} ainda não publicou nenhuma foto`;
          emptySub = 'Quando fotos forem anexadas aos Wuits, elas aparecerão aqui.';
        } else if (this.profileTab === 'replies') {
          emptyMsg = `@${acc.name} ainda não tem respostas registradas`;
          emptySub = 'Respostas a outros wuits aparecerão aqui.';
        } else {
          emptyMsg = `@${acc.name} ainda não wuitou`;
          emptySub = 'Quando este personagem postar, seus wuits aparecerão aqui.';
        }
      } else if (this.searchQuery) {
        emptyMsg = `Nenhum resultado para "${this.searchQuery}"`;
        emptySub = 'Tente buscar por outras palavras-chave, nomes de personagens ou #hashtags.';
      }

      feedContainer.innerHTML = `
        ${bannerHtml}
        <div style="padding: 50px 20px; text-align: center; color: var(--w-text-muted);">
          <p style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 6px;">${emptyMsg}</p>
          <p style="font-size: 0.9rem;">${emptySub}</p>
        </div>
      `;
      return;
    }

    feedContainer.innerHTML = bannerHtml + filtered.map(post => this.renderPostCard(post, post.id === highlightPostId)).join('');
  }

  renderPostCard(post, isNew = false) {
    const author = this.getAccountById(post.authorId);
    const badgeSvg = this.renderBadgeSvg(author.badge);

    const myId = this.authenticatedAccount ? this.authenticatedAccount.id : null;
    const isLiked = Boolean(myId && post.likedBy && post.likedBy.includes(myId));
    const isRewuited = Boolean(myId && post.rewuitedBy && post.rewuitedBy.includes(myId));

    const mediaHtml = post.media ? `
      <div class="w-wuit-media" onclick="window.wuitter.openLightbox('${post.media}')">
        <img src="${post.media}" alt="Foto do Wuit" loading="lazy">
      </div>
    ` : '';

    const commentsCount = post.comments ? post.comments.length : 0;
    const canDelete = this.isMaster() || (this.authenticatedAccount && this.authenticatedAccount.id === post.authorId);
    const inlineRepliesHtml = (post.comments && post.comments.length > 0) ? `
      <div class="w-inline-replies-wrap">
        ${post.comments.slice(-2).map(c => {
          const cAuthor = this.getAccountById(c.authorId);
          const cBadge = this.renderBadgeSvg(cAuthor.badge);
          return `
            <div class="w-inline-reply-item">
              <div class="w-clickable-profile" onclick="window.wuitter.viewProfile('${cAuthor.id}')">
                ${this.renderAvatarHtml(cAuthor, 'sm')}
              </div>
              <div class="w-inline-reply-body">
                <div class="w-inline-reply-header">
                  <span class="w-inline-reply-name" onclick="window.wuitter.viewProfile('${cAuthor.id}')">${cAuthor.name}</span>
                  ${cBadge}
                  <span class="w-inline-reply-handle">${cAuthor.handle}</span>
                  <span class="w-wuit-dot">&bull;</span>
                  <span class="w-wuit-time">${c.timeDisplay || c.customDate || this.formatTime(c.timestamp)}</span>
                </div>
                ${c.replyToHandle ? `<div class="w-reply-to-tag-sm">Respondendo a <span class="w-mention" onclick="window.wuitter.filterByMention('${c.replyToHandle.replace('@', '')}')">${c.replyToHandle}</span></div>` : ''}
                <div class="w-inline-reply-text">${this.formatText(c.text)}</div>
                <div style="margin-top: 4px; display: flex; align-items: center; gap: 8px;">
                  <button class="w-inline-reply-action-btn" onclick="window.wuitter.setReplyContext('${post.id}', '${c.id}')" title="Responder a ${cAuthor.name}">
                    ${SVG_ICONS.comment}
                    <span>Responder</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
        ${post.comments.length > 2 ? `
          <button class="w-btn-show-more-replies" onclick="window.wuitter.openCommentsModal('${post.id}')">
            Ver todas as ${post.comments.length} respostas
          </button>
        ` : ''}
      </div>
    ` : '';

    return `
      <article class="w-wuit-card ${isNew ? 'new-incoming' : ''}" id="post_${post.id}" onclick="window.wuitter.handlePostClick(event, '${post.id}')">
        <div class="w-clickable-profile" onclick="window.wuitter.viewProfile('${author.id}')" title="Ver perfil de ${author.name}">
          ${this.renderAvatarHtml(author, 'normal')}
        </div>
        <div class="w-wuit-content-area">
          <div class="w-wuit-meta">
            <div class="w-wuit-author-info">
              <span class="w-wuit-name" onclick="window.wuitter.viewProfile('${author.id}')">${author.name}</span>
              ${badgeSvg}
              <span class="w-wuit-handle" onclick="window.wuitter.viewProfile('${author.id}')">${author.handle}</span>
              <span class="w-wuit-dot">&bull;</span>
              <span class="w-wuit-time">${post.timeDisplay || post.customDate || this.formatTime(post.timestamp)}</span>
            </div>
            ${canDelete ? `
              <button class="w-delete-btn" onclick="window.wuitter.deletePost('${post.id}')" title="Excluir Wuit">
                ${SVG_ICONS.trash}
              </button>
            ` : ''}
          </div>

          <div class="w-wuit-text">${this.formatText(post.text)}</div>

          ${mediaHtml}

          <div class="w-wuit-actions">
            <button class="w-action-btn reply" onclick="window.wuitter.openCommentsModal('${post.id}')" title="Responder">
              ${SVG_ICONS.comment}
              <span>${commentsCount > 0 ? commentsCount : ''}</span>
            </button>

            <button class="w-action-btn rewuit ${isRewuited ? 'active' : ''}" onclick="window.wuitter.toggleRewuit('${post.id}')" title="Re-wuitar">
              ${SVG_ICONS.rewuit}
              <span>${post.rewuits > 0 ? post.rewuits : ''}</span>
            </button>

            <button class="w-action-btn like ${isLiked ? 'active' : ''}" onclick="window.wuitter.toggleLike('${post.id}')" title="Curtir">
              ${SVG_ICONS.like}
              <span>${post.likes > 0 ? post.likes : ''}</span>
            </button>

            <button class="w-action-btn share" onclick="window.wuitter.openPropModal('${post.id}')" title="Gerar Cartão de Pista (Prop RPG)">
              ${SVG_ICONS.share}
            </button>
          </div>
          ${inlineRepliesHtml}
        </div>
      </article>
    `;
  }

  async toggleLike(postId) {
    if (!this.authenticatedAccount) {
      this.openTokenModal();
      return;
    }
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    if (!post.likedBy) post.likedBy = [];
    const myId = this.authenticatedAccount.id;

    if (post.likedBy.includes(myId)) {
      post.likedBy = post.likedBy.filter(id => id !== myId);
      post.likes = Math.max(0, (post.likes || 1) - 1);
    } else {
      post.likedBy.push(myId);
      post.likes = (post.likes || 0) + 1;
    }

    this.savePostsLocal();
    this.updatePostStatsInDOM(postId);

    this.broadcastSync('TOGGLE_LIKE', { postId: postId, likedBy: post.likedBy, likes: post.likes });
    await this.syncToCloud();
  }

  async toggleRewuit(postId) {
    if (!this.authenticatedAccount) {
      this.openTokenModal();
      return;
    }
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    if (!post.rewuitedBy) post.rewuitedBy = [];
    const myId = this.authenticatedAccount.id;

    if (post.rewuitedBy.includes(myId)) {
      post.rewuitedBy = post.rewuitedBy.filter(id => id !== myId);
      post.rewuits = Math.max(0, (post.rewuits || 1) - 1);
    } else {
      post.rewuitedBy.push(myId);
      post.rewuits = (post.rewuits || 0) + 1;
    }

    this.savePostsLocal();
    this.updatePostStatsInDOM(postId);

    this.broadcastSync('TOGGLE_REWUIT', { postId: postId, rewuitedBy: post.rewuitedBy, rewuits: post.rewuits });
    await this.syncToCloud();
  }

  async deletePost(postId) {
    if (confirm('Tem certeza que deseja excluir este Wuit?')) {
      this.posts = this.posts.filter(p => p.id !== postId);
      this.savePostsLocal();
      this.renderFeed();

      this.broadcastSync('DELETE_POST', { postId: postId });
      await this.syncToCloud();
    }
  }

  renderTrends() {
    const container = document.getElementById('w-trends-list');
    if (!container) return;
    container.innerHTML = '';
  }

  renderMasterPanel() {
    const panel = document.getElementById('w-gm-panel-container');
    if (!panel) return;

    if (!this.isMaster()) {
      panel.style.display = 'none';
      return;
    }

    panel.style.display = 'block';

    const renderAccountItem = (acc) => {
      const isCustom = !acc.slot && !acc.isMaster;
      return `
      <div class="w-follow-item" style="padding: 8px 12px; border-bottom: 1px solid var(--w-border-subtle); display: flex; align-items: center; justify-content: space-between;">
        <div class="w-persona-info">
          ${this.renderAvatarHtml(acc, 'sm')}
          <div class="w-persona-names">
            <span class="w-persona-name">${acc.name} ${this.renderBadgeSvg(acc.badge)}</span>
            <span class="w-persona-handle">${acc.handle} ${acc.isMaster ? '[Mestre]' : ''}</span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <button class="w-btn-follow" style="padding: 4px 10px; font-size: 0.75rem;" onclick="window.wuitter.openEditProfileModal(window.wuitter.getAccountById('${acc.id}'))">
            Editar
          </button>
          ${isCustom ? `
            <button class="w-delete-btn" style="color: var(--w-accent-red); padding: 4px;" onclick="window.wuitter.deleteAccount('${acc.id}')" title="Excluir Conta">
              ${SVG_ICONS.trash}
            </button>
          ` : ''}
        </div>
      </div>
    `;
    };

    const accountListEl = document.getElementById('w-gm-accounts-list');
    if (accountListEl) {
      accountListEl.innerHTML = this.accounts.map(renderAccountItem).join('');
    }

    const modalMasterAccounts = document.getElementById('w-modal-master-accounts');
    if (modalMasterAccounts) {
      modalMasterAccounts.innerHTML = this.accounts.map(renderAccountItem).join('');
    }
  }

  // Modais
  openMasterPanelModal() {
    if (!this.isMaster()) {
      this.openTokenModal();
      return;
    }
    this.renderMasterPanel();
    const modal = document.getElementById('w-master-modal');
    if (modal) modal.classList.add('active');
  }

  openTokenModal() {
    const modal = document.getElementById('w-token-modal');
    const input = document.getElementById('w-token-input');
    if (input) input.value = '';
    if (modal) modal.classList.add('active');
    setTimeout(() => { if (input) input.focus(); }, 100);
  }

  async submitTokenFromModal() {
    const input = document.getElementById('w-token-input');
    const token = input ? input.value.trim() : '';
    if (!token) return;

    const success = await this.loginWithToken(token, true);
    if (success) {
      this.closeModals();
    }
  }

  openEditProfileModal(account) {
    if (!account) return;
    const modal = document.getElementById('w-edit-profile-modal');
    if (!modal) return;

    document.getElementById('w-edit-target-id').value = account.id;
    document.getElementById('w-edit-name').value = account.name || '';
    document.getElementById('w-edit-handle').value = account.handle || '';
    document.getElementById('w-edit-bio').value = account.bio || '';
    document.getElementById('w-edit-avatar-letter').value = account.avatarLetter || account.name.charAt(0) || '';
    document.getElementById('w-edit-avatar-color').value = account.avatarColor || '#ff1133';
    document.getElementById('w-edit-avatar-img').value = account.avatarImage || '';

    const badgeGroup = document.getElementById('w-edit-badge-group');
    if (badgeGroup) {
      badgeGroup.style.display = this.isMaster() ? 'block' : 'none';
      document.getElementById('w-edit-badge-select').value = account.badge || 'none';
    }

    modal.classList.add('active');
  }

  async saveProfileChanges() {
    const targetId = document.getElementById('w-edit-target-id').value;
    const acc = this.accounts.find(a => a.id === targetId);
    if (!acc) return;

    const name = document.getElementById('w-edit-name').value.trim();
    let handle = document.getElementById('w-edit-handle').value.trim();
    const bio = document.getElementById('w-edit-bio').value.trim();
    const avatarLetter = document.getElementById('w-edit-avatar-letter').value.trim().toUpperCase().slice(0, 2);
    const avatarColor = document.getElementById('w-edit-avatar-color').value;
    const avatarImg = document.getElementById('w-edit-avatar-img').value.trim();

    if (!name || !handle) {
      alert('Nome e @Handle são obrigatórios.');
      return;
    }

    if (!handle.startsWith('@')) handle = '@' + handle;

    acc.name = name;
    acc.handle = handle;
    acc.bio = bio;
    acc.avatarLetter = avatarLetter || name.charAt(0).toUpperCase();
    acc.avatarColor = avatarColor;
    acc.avatarImage = avatarImg;

    if (this.isMaster()) {
      const badgeSelect = document.getElementById('w-edit-badge-select');
      if (badgeSelect) acc.badge = badgeSelect.value;
    }

    this.saveAccountsLocal();
    this.broadcastSync('UPDATE_ACCOUNT', { account: acc });
    await this.syncToCloud();

    this.closeModals();
    this.render();
    alert('Perfil atualizado e sincronizado com sucesso!');
  }

  openNewAccountModal() {
    if (!this.isMaster()) return;
    const modal = document.getElementById('w-new-account-modal');
    if (modal) modal.classList.add('active');
  }

  async saveNewAccount() {
    if (!this.isMaster()) return;

    const name = document.getElementById('w-new-acc-name').value.trim();
    let handle = document.getElementById('w-new-acc-handle').value.trim();
    const token = document.getElementById('w-new-acc-token').value.trim().toUpperCase();
    const badge = document.getElementById('w-new-acc-badge').value;
    const color = document.getElementById('w-new-acc-color').value;

    if (!name || !handle) {
      alert('Nome e @Handle são obrigatórios.');
      return;
    }

    if (!handle.startsWith('@')) handle = '@' + handle;

    const id = 'acc_' + Date.now();
    const newAcc = {
      id: id,
      slot: null,
      tokens: token ? [token] : [],
      hashes: [],
      name: name,
      handle: handle,
      bio: '',
      avatarLetter: name.charAt(0).toUpperCase(),
      avatarImage: '',
      avatarColor: color,
      badge: badge,
      isMaster: false
    };

    this.accounts.push(newAcc);
    this.saveAccountsLocal();
    this.broadcastSync('UPDATE_ACCOUNT', { account: newAcc });
    await this.syncToCloud();

    this.closeModals();
    this.render();
    alert('Nova conta cadastrada e sincronizada com sucesso!');
  }

  async deleteAccount(accountId) {
    if (!this.isMaster()) return;
    const acc = this.accounts.find(a => a.id === accountId);
    if (!acc) return;
    if (acc.isMaster || acc.slot) {
      alert('Não é possível excluir contas principais de personagens do sistema.');
      return;
    }
    if (confirm(`Tem certeza que deseja excluir a conta "${acc.name}" (${acc.handle})?`)) {
      this.accounts = this.accounts.filter(a => a.id !== accountId);
      if (this.selectedPostingAccountId === accountId) {
        this.selectedPostingAccountId = this.authenticatedAccount ? this.authenticatedAccount.id : null;
      }
      this.saveAccountsLocal();
      this.broadcastSync('DELETE_ACCOUNT', { accountId: accountId });
      await this.syncToCloud();
      this.render();
      alert(`Conta "${acc.name}" excluída com sucesso.`);
    }
  }

  handlePostClick(event, postId) {
    if (event.target.closest('button, a, input, textarea, select, .w-clickable-profile, .w-wuit-media, .w-action-btn, .w-delete-btn, .w-inline-reply-item')) {
      return;
    }
    this.openCommentsModal(postId);
  }

  setReplyContext(postId, commentId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post || !post.comments) return;
    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;

    const cAuthor = this.getAccountById(comment.authorId);
    this.activeReplyContext = {
      postId: postId,
      commentId: commentId,
      authorHandle: cAuthor.handle,
      authorName: cAuthor.name
    };

    this.openCommentsModal(postId);
  }

  cancelReplyContext(postId) {
    this.activeReplyContext = null;
    this.openCommentsModal(postId);
  }

  openCommentsModal(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const modal = document.getElementById('w-comments-modal');
    const container = document.getElementById('w-comments-container');
    const targetPostPreview = document.getElementById('w-modal-post-target');
    const replyBoxWrap = document.getElementById('w-modal-reply-box-wrap');

    if (!modal || !container || !targetPostPreview) return;

    const author = this.getAccountById(post.authorId);
    const badgeSvg = this.renderBadgeSvg(author.badge);

    const myId = this.authenticatedAccount ? this.authenticatedAccount.id : null;
    const isLiked = Boolean(myId && post.likedBy && post.likedBy.includes(myId));
    const isRewuited = Boolean(myId && post.rewuitedBy && post.rewuitedBy.includes(myId));
    const commentsCount = post.comments ? post.comments.length : 0;
    const canDelete = this.isMaster() || (this.authenticatedAccount && this.authenticatedAccount.id === post.authorId);

    const mediaHtml = post.media ? `
      <div style="margin-top: 12px; border-radius: var(--w-radius-md); overflow: hidden; max-height: 280px; border: 1px solid var(--w-border); background: #000; cursor: pointer;" onclick="window.wuitter.openLightbox('${post.media}')">
        <img src="${post.media}" style="width: 100%; max-height: 280px; object-fit: contain; display: block;" alt="Mídia do Wuit">
      </div>
    ` : '';

    const formattedDate = post.timeDisplay || post.customDate || (new Date(post.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' · ' + new Date(post.timestamp).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }));

    targetPostPreview.innerHTML = `
      <div class="w-modal-tweet-detail">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="w-clickable-profile" onclick="window.wuitter.viewProfile('${author.id}'); window.wuitter.closeModals();">
              ${this.renderAvatarHtml(author, 'normal')}
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 4px;">
                <span class="w-wuit-name" style="font-size: 1rem;" onclick="window.wuitter.viewProfile('${author.id}'); window.wuitter.closeModals();">${author.name}</span>
                ${badgeSvg}
              </div>
              <div class="w-wuit-handle" style="font-size: 0.85rem;" onclick="window.wuitter.viewProfile('${author.id}'); window.wuitter.closeModals();">${author.handle}</div>
            </div>
          </div>
          ${canDelete ? `
            <button class="w-delete-btn" onclick="window.wuitter.deletePost('${post.id}'); window.wuitter.closeModals();" title="Excluir Wuit">
              ${SVG_ICONS.trash}
            </button>
          ` : ''}
        </div>

        <div style="font-size: 1.15rem; line-height: 1.5; color: #fff; white-space: pre-wrap; margin-bottom: 12px; word-break: break-word;">
          ${this.formatText(post.text)}
        </div>

        ${mediaHtml}

        <div style="padding: 12px 0; border-top: 1px solid var(--w-border-subtle); border-bottom: 1px solid var(--w-border-subtle); margin-top: 12px; font-size: 0.88rem; color: var(--w-text-muted); display: flex; gap: 16px; flex-wrap: wrap;">
          <span>${formattedDate}</span>
          <span>&bull;</span>
          <span><strong style="color: #fff;">${post.likes || 0}</strong> Curtida${(post.likes || 0) === 1 ? '' : 's'}</span>
          <span><strong style="color: #fff;">${post.rewuits || 0}</strong> Re-wuit${(post.rewuits || 0) === 1 ? '' : 's'}</span>
          <span><strong style="color: #fff;">${commentsCount}</strong> Resposta${commentsCount === 1 ? '' : 's'}</span>
        </div>

        <div class="w-wuit-actions" style="margin-top: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--w-border); max-width: 400px;">
          <button class="w-action-btn reply" title="Responder" onclick="document.getElementById('w-reply-textarea')?.focus()">
            ${SVG_ICONS.comment}
            <span>${commentsCount > 0 ? commentsCount : ''}</span>
          </button>
          <button class="w-action-btn rewuit ${isRewuited ? 'active' : ''}" onclick="window.wuitter.toggleRewuit('${post.id}').then(() => window.wuitter.openCommentsModal('${post.id}'))" title="Re-wuitar">
            ${SVG_ICONS.rewuit}
            <span>${post.rewuits > 0 ? post.rewuits : ''}</span>
          </button>
          <button class="w-action-btn like ${isLiked ? 'active' : ''}" onclick="window.wuitter.toggleLike('${post.id}').then(() => window.wuitter.openCommentsModal('${post.id}'))" title="Curtir">
            ${SVG_ICONS.like}
            <span>${post.likes > 0 ? post.likes : ''}</span>
          </button>
          <button class="w-action-btn share" onclick="window.wuitter.openPropModal('${post.id}')" title="Gerar Cartão de Pista (Prop RPG)">
            ${SVG_ICONS.share}
          </button>
        </div>
      </div>
    `;

    if (replyBoxWrap) {
      if (!this.authenticatedAccount) {
        replyBoxWrap.innerHTML = `
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px dashed var(--w-border); border-radius: var(--w-radius-md); padding: 14px; text-align: center; margin: 14px 0;">
            <p style="font-size: 0.88rem; color: var(--w-text-muted); margin-bottom: 8px;">Identifique-se com seu token para responder nesta conversa.</p>
            <button class="w-btn-post-primary" style="font-size: 0.82rem; padding: 6px 14px;" onclick="window.wuitter.openTokenModal()">Autenticar Token</button>
          </div>
        `;
      } else {
        const postingAcc = this.getPostingAccount();
        const hasSubReply = Boolean(this.activeReplyContext && this.activeReplyContext.postId === postId);
        const replyTargetHandle = hasSubReply ? this.activeReplyContext.authorHandle : author.handle;

        replyBoxWrap.innerHTML = `
          <div class="w-reply-box-card">
            <div class="w-clickable-profile" onclick="window.wuitter.viewProfile('${postingAcc.id}'); window.wuitter.closeModals();">
              ${this.renderAvatarHtml(postingAcc, 'normal')}
            </div>
            <div style="flex: 1; min-width: 0;">
              <div style="font-size: 0.82rem; color: var(--w-text-muted); margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 4px;">
                <div>
                  Em resposta a <span style="color: var(--w-primary); font-weight: 600;">${author.handle}</span>
                  ${hasSubReply && this.activeReplyContext.authorHandle !== author.handle ? ` e <span style="color: var(--w-primary); font-weight: 600;">${this.activeReplyContext.authorHandle}</span>` : ''}
                  ${this.isMaster() && postingAcc.id !== this.authenticatedAccount.id ? `<span style="color: var(--w-accent-gold); font-weight: 700; margin-left: 6px;">(Postando como ${postingAcc.name})</span>` : ''}
                </div>
                ${hasSubReply ? `
                  <button class="w-cancel-subreply-btn" onclick="window.wuitter.cancelReplyContext('${post.id}')" title="Cancelar resposta direta">
                    Cancelar resposta direta
                  </button>
                ` : ''}
              </div>
              <textarea id="w-reply-textarea" class="w-reply-textarea" placeholder="${hasSubReply ? 'Responder a ' + replyTargetHandle + '...' : 'Postar sua resposta...'}" rows="2"></textarea>
              <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 8px; gap: 8px;">
                <button class="w-btn-post-primary" style="padding: 6px 16px; font-size: 0.85rem;" onclick="window.wuitter.submitReply('${post.id}')">
                  Responder
                </button>
              </div>
            </div>
          </div>
        `;

        setTimeout(() => {
          const textarea = document.getElementById('w-reply-textarea');
          if (textarea) {
            textarea.focus();
            textarea.addEventListener('keydown', (e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                window.wuitter.submitReply(postId);
              }
            });
          }
        }, 50);
      }
    }

    if (post.comments && post.comments.length > 0) {
      container.innerHTML = post.comments.map(c => {
        const cAuthor = this.getAccountById(c.authorId);
        const cBadge = this.renderBadgeSvg(cAuthor.badge);
        const canDeleteComment = this.isMaster() || (this.authenticatedAccount && this.authenticatedAccount.id === c.authorId);
        return `
          <div class="w-comment-item" id="comment_${c.id}">
            <div class="w-clickable-profile" onclick="window.wuitter.viewProfile('${cAuthor.id}'); window.wuitter.closeModals();">
              ${this.renderAvatarHtml(cAuthor, 'normal')}
            </div>
            <div class="w-comment-main">
              <div class="w-comment-header">
                <div class="w-comment-author-info">
                  <span class="w-comment-name" onclick="window.wuitter.viewProfile('${cAuthor.id}'); window.wuitter.closeModals();">${cAuthor.name}</span>
                  ${cBadge}
                  <span class="w-comment-handle" onclick="window.wuitter.viewProfile('${cAuthor.id}'); window.wuitter.closeModals();">${cAuthor.handle}</span>
                  <span class="w-wuit-dot">&bull;</span>
                  <span class="w-comment-time">${c.timeDisplay || c.customDate || this.formatTime(c.timestamp)}</span>
                </div>
                <div class="w-comment-actions">
                  <button class="w-comment-action-btn" onclick="window.wuitter.setReplyContext('${post.id}', '${c.id}')" title="Responder a ${cAuthor.name}">
                    ${SVG_ICONS.comment}
                    <span style="font-size: 0.75rem; margin-left: 4px;">Responder</span>
                  </button>
                  ${canDeleteComment ? `
                    <button class="w-delete-btn" onclick="window.wuitter.deleteComment('${post.id}', '${c.id}')" title="Excluir Resposta">
                      ${SVG_ICONS.trash}
                    </button>
                  ` : ''}
                </div>
              </div>
              ${c.replyToHandle ? `<div class="w-reply-to-tag">Respondendo a <span class="w-mention" onclick="window.wuitter.filterByMention('${c.replyToHandle.replace('@', '')}')">${c.replyToHandle}</span></div>` : ''}
              <div class="w-comment-text">${this.formatText(c.text)}</div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      container.innerHTML = `<p style="color: var(--w-text-muted); font-size: 0.88rem; text-align: center; padding: 24px 0;">Nenhuma resposta nesta conversa ainda. Seja o primeiro a responder!</p>`;
    }

    modal.classList.add('active');
  }

  async submitReply(postId) {
    if (!this.authenticatedAccount) {
      this.openTokenModal();
      return;
    }
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const textarea = document.getElementById('w-reply-textarea');
    const text = textarea ? textarea.value.trim() : '';
    if (!text) return;

    const postingAcc = this.getPostingAccount();
    const hasSubReply = Boolean(this.activeReplyContext && this.activeReplyContext.postId === postId);

    const newComment = {
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      authorId: postingAcc.id,
      text: text,
      timestamp: Date.now(),
      replyToCommentId: hasSubReply ? this.activeReplyContext.commentId : null,
      replyToHandle: hasSubReply ? this.activeReplyContext.authorHandle : null
    };

    if (!post.comments) post.comments = [];
    post.comments.push(newComment);

    this.activeReplyContext = null;

    this.savePostsLocal();
    this.updatePostStatsInDOM(postId);
    this.broadcastSync('ADD_COMMENT', { postId: postId, comment: newComment });
    await this.syncToCloud();

    if (textarea) textarea.value = '';
    this.openCommentsModal(postId);
    this.renderFeed();
  }

  async deleteComment(postId, commentId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post || !post.comments) return;

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;

    const canDelete = this.isMaster() || (this.authenticatedAccount && this.authenticatedAccount.id === comment.authorId);
    if (!canDelete) return;

    if (confirm('Tem certeza que deseja excluir esta resposta?')) {
      post.comments = post.comments.filter(c => c.id !== commentId);
      if (this.activeReplyContext && this.activeReplyContext.commentId === commentId) {
        this.activeReplyContext = null;
      }
      this.savePostsLocal();
      this.updatePostStatsInDOM(postId);
      this.broadcastSync('DELETE_COMMENT', { postId: postId, commentId: commentId });
      await this.syncToCloud();
      this.openCommentsModal(postId);
      this.renderFeed();
    }
  }

  openPropModal(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const modal = document.getElementById('w-prop-modal');
    const container = document.getElementById('w-prop-render-area');
    if (!modal || !container) return;

    const author = this.getAccountById(post.authorId);
    const badgeSvg = this.renderBadgeSvg(author.badge);

    container.innerHTML = `
      <div class="w-prop-card" style="max-width: 520px; margin: 0 auto;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--w-border); padding-bottom: 10px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--w-primary)" stroke-width="2.8"><path d="M3 4l4.5 16L12 9l4.5 11L21 4"/></svg>
            <span style="font-weight: 900; font-size: 0.95rem; letter-spacing: 0.05em; color: #fff;">WUITTER &bull; REGISTRO DE REDE</span>
          </div>
          <span style="font-size: 0.75rem; color: var(--w-text-muted); font-family: var(--w-font-mono);">EVIDÊNCIA #${post.id.slice(-6)}</span>
        </div>

        <div style="display: flex; gap: 12px; margin-bottom: 12px;">
          ${this.renderAvatarHtml(author, 'normal')}
          <div>
            <div style="font-weight: 700; color: #fff; font-size: 0.95rem; display: flex; align-items: center; gap: 4px;">
              ${author.name} ${badgeSvg}
            </div>
            <div style="color: var(--w-text-muted); font-size: 0.8rem;">${author.handle}</div>
          </div>
        </div>

        <div style="font-size: 1.05rem; line-height: 1.5; color: #fff; margin-bottom: 14px; white-space: pre-wrap; text-align: left;">
          ${this.formatText(post.text)}
        </div>

        ${post.media ? `<div style="border-radius: 8px; overflow: hidden; margin-bottom: 12px; border: 1px solid var(--w-border);"><img src="${post.media}" style="width: 100%; display: block;"></div>` : ''}

        <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--w-border); padding-top: 10px; font-size: 0.8rem; color: var(--w-text-muted); font-family: var(--w-font-mono);">
          <span>${post.timeDisplay || post.customDate || new Date(post.timestamp).toLocaleString('pt-BR')}</span>
          <span>${post.likes || 0} Curtidas &bull; ${post.rewuits || 0} Re-wuits</span>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  openLightbox(src) {
    const modal = document.getElementById('w-lightbox-modal');
    const img = document.getElementById('w-lightbox-img');
    if (modal && img) {
      img.src = src;
      modal.classList.add('active');
    }
  }

  exportFeedJson() {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      accounts: this.accounts,
      posts: this.posts
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wuitter_feed_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importFeedJson() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (re) => {
          try {
            const data = JSON.parse(re.target.result);
            if (data.posts && Array.isArray(data.posts)) {
              this.posts = data.posts;
              this.savePostsLocal();
            }
            if (data.accounts && Array.isArray(data.accounts)) {
              this.accounts = data.accounts;
              this.saveAccountsLocal();
            }
            this.render();
            await this.syncToCloud();
            alert('Feed e Contas importados e sincronizados com sucesso na Nuvem!');
          } catch (err) {
            alert('Arquivo JSON inválido.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  closeModals() {
    document.querySelectorAll('.w-modal-overlay').forEach(m => m.classList.remove('active'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.wuitter = new WuitterSystem();
});
