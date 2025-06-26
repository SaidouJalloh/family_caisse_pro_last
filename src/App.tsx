// code qui marche bien

// import React, { useState, useEffect } from 'react';
// import { Plus, TrendingUp, Users, Wallet, Calendar, Settings, CheckCircle, AlertCircle, Clock, DollarSign, User, CreditCard, PartyPopper } from 'lucide-react';
// import { DatabaseService } from './services/database';
// import { DbMember, DbCotisation, DbPayment, DbActivity } from './lib/supabase';

// // ================================
// // 📁 TYPES & INTERFACES (Adaptés pour Supabase)
// // ================================
// interface Member {
//   id: string;
//   name: string;
//   avatar?: string;
//   balance: number;
//   joinDate: string;
//   phone?: string;
//   email?: string;
// }

// interface Cotisation {
//   id: string;
//   name: string;
//   amount: number;
//   date: string;
//   month: string;
//   description?: string;
// }

// interface Payment {
//   id?: string;
//   memberId: string;
//   cotisationId: string;
//   amount: number;
//   status: 'paid' | 'partial' | 'unpaid';
//   date?: string;
// }

// interface Activity {
//   id: string;
//   name: string;
//   amount: number;
//   date: string;
//   description?: string;
// }

// // Fonctions de conversion Supabase <-> App
// const convertDbMemberToMember = (dbMember: DbMember): Member => ({
//   id: dbMember.id,
//   name: dbMember.name,
//   balance: dbMember.balance,
//   joinDate: dbMember.join_date,
//   phone: dbMember.phone || undefined,
//   email: dbMember.email || undefined,
// });

// const convertDbCotisationToCotisation = (dbCotisation: DbCotisation): Cotisation => ({
//   id: dbCotisation.id,
//   name: dbCotisation.name,
//   amount: dbCotisation.amount,
//   date: dbCotisation.created_at,
//   month: dbCotisation.month,
//   description: dbCotisation.description || undefined,
// });

// const convertDbPaymentToPayment = (dbPayment: DbPayment): Payment => ({
//   id: dbPayment.id,
//   memberId: dbPayment.member_id,
//   cotisationId: dbPayment.cotisation_id,
//   amount: dbPayment.amount,
//   status: dbPayment.status,
//   date: dbPayment.payment_date,
// });

// const convertDbActivityToActivity = (dbActivity: DbActivity): Activity => ({
//   id: dbActivity.id,
//   name: dbActivity.name,
//   amount: dbActivity.amount,
//   date: dbActivity.activity_date,
//   description: dbActivity.description || undefined,
// });

// // ================================
// // 🎨 UI COMPONENTS LIBRARY
// // ================================
// const UIComponents = {
//   // Glass Card Component
//   GlassCard: ({ children, className = '', ...props }: any) => (
//     <div
//       className={`backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-2xl shadow-2xl ${className}`}
//       {...props}
//     >
//       {children}
//     </div>
//   ),

//   // Modal Component
//   Modal: ({ isOpen, onClose, title, children }: any) => {
//     if (!isOpen) return null;

//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center">
//         <div
//           className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
//           onClick={onClose}
//         />
//         <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-all">
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
//               <button
//                 onClick={onClose}
//                 className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//               >
//                 ✕
//               </button>
//             </div>
//             {children}
//           </div>
//         </div>
//       </div>
//     );
//   },

//   // Input Field Component
//   InputField: ({ label, type = 'text', value, onChange, placeholder, icon, error }: any) => (
//     <div className="mb-4">
//       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//         {label}
//       </label>
//       <div className="relative">
//         {icon && (
//           <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//             {icon}
//           </div>
//         )}
//         <input
//           type={type}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all`}
//         />
//         {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//       </div>
//     </div>
//   ),

//   // Button Component
//   Button: ({ children, onClick, variant = 'primary', className = '', disabled = false, loading = false }: any) => {
//     const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed";
//     const variants = {
//       primary: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg transform hover:scale-105",
//       secondary: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600",
//       success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transform hover:scale-105",
//       danger: "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg transform hover:scale-105",
//       warning: "bg-gradient-to-r from-orange-500 to-yellow-600 text-white hover:shadow-lg transform hover:scale-105"
//     };

//     return (
//       <button
//         onClick={onClick}
//         disabled={disabled || loading}
//         className={`${baseClasses} ${variants[variant as keyof typeof variants]} ${className}`}
//       >
//         {loading ? (
//           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//         ) : (
//           children
//         )}
//       </button>
//     );
//   },

//   // Animated Counter
//   AnimatedCounter: ({ value, suffix = '', prefix = '' }: any) => {
//     const [displayValue, setDisplayValue] = useState(0);

//     useEffect(() => {
//       const duration = 1000;
//       const steps = 60;
//       const increment = value / steps;
//       let current = 0;

//       const timer = setInterval(() => {
//         current += increment;
//         if (current >= value) {
//           setDisplayValue(value);
//           clearInterval(timer);
//         } else {
//           setDisplayValue(Math.floor(current));
//         }
//       }, duration / steps);

//       return () => clearInterval(timer);
//     }, [value]);

//     return (
//       <span className="font-bold text-2xl">
//         {prefix}{displayValue.toLocaleString()}{suffix}
//       </span>
//     );
//   },

//   // Progress Ring
//   ProgressRing: ({ percentage, size = 120, strokeWidth = 8 }: any) => {
//     const radius = (size - strokeWidth) / 2;
//     const circumference = 2 * Math.PI * radius;
//     const strokeDasharray = circumference;
//     const strokeDashoffset = circumference - (percentage / 100) * circumference;

//     return (
//       <div className="relative">
//         <svg width={size} height={size} className="transform -rotate-90">
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             stroke="currentColor"
//             strokeWidth={strokeWidth}
//             fill="none"
//             className="text-gray-300 dark:text-gray-600"
//           />
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             stroke="url(#gradient)"
//             strokeWidth={strokeWidth}
//             fill="none"
//             strokeDasharray={strokeDasharray}
//             strokeDashoffset={strokeDashoffset}
//             strokeLinecap="round"
//             className="transition-all duration-1000 ease-out"
//           />
//           <defs>
//             <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//               <stop offset="0%" stopColor="#667eea" />
//               <stop offset="100%" stopColor="#764ba2" />
//             </linearGradient>
//           </defs>
//         </svg>
//         <div className="absolute inset-0 flex items-center justify-center">
//           <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//             {Math.round(percentage)}%
//           </span>
//         </div>
//       </div>
//     );
//   }
// };

// // ================================
// // 🧮 BUSINESS LOGIC FUNCTIONS
// // ================================
// const BusinessLogic = {
//   // Calculs automatiques
//   calculateTotalCaisse: (payments: Payment[], activities: Activity[]) => {
//     const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
//     const totalActivities = activities.reduce((sum, a) => sum + a.amount, 0);
//     return totalPayments - totalActivities;
//   },

//   calculatePaymentRate: (payments: Payment[], cotisationId: string, totalMembers: number) => {
//     if (!cotisationId || totalMembers === 0) return 0;
//     const paidMembers = payments.filter(p => p.cotisationId === cotisationId && p.status !== 'unpaid').length;
//     return (paidMembers / totalMembers) * 100;
//   },

//   getCurrentCotisation: (cotisations: Cotisation[]) => {
//     const currentMonth = new Date().toISOString().slice(0, 7);
//     return cotisations.find(c => c.month === currentMonth);
//   },

//   // Génération d'ID unique
//   generateId: () => Date.now().toString() + Math.random().toString(36).substr(2, 9),

//   // Formatage des dates
//   formatDate: (date: string) => new Date(date).toLocaleDateString('fr-FR'),

//   // Validation des formulaires
//   validateMember: (member: { name: string; phone?: string; email?: string }) => {
//     const errors: any = {};
//     if (!member.name.trim()) errors.name = 'Le nom est requis';
//     if (member.email && !/\S+@\S+\.\S+/.test(member.email)) errors.email = 'Email invalide';
//     return { isValid: Object.keys(errors).length === 0, errors };
//   },

//   validateCotisation: (cotisation: { name: string; amount: string }) => {
//     const errors: any = {};
//     if (!cotisation.name.trim()) errors.name = 'Le nom est requis';
//     if (!cotisation.amount || parseFloat(cotisation.amount) <= 0) errors.amount = 'Montant invalide';
//     return { isValid: Object.keys(errors).length === 0, errors };
//   },

//   validateActivity: (activity: { name: string; amount: string }) => {
//     const errors: any = {};
//     if (!activity.name.trim()) errors.name = 'Le nom est requis';
//     if (!activity.amount || parseFloat(activity.amount) <= 0) errors.amount = 'Montant invalide';
//     return { isValid: Object.keys(errors).length === 0, errors };
//   }
// };

// // ================================
// // 📊 DASHBOARD COMPONENTS
// // ================================
// const DashboardComponents = {
//   // Stats Cards Section
//   StatsCards: ({ totalCaisse, totalMembers, paymentRate }: any) => (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//       <UIComponents.GlassCard className="p-6 text-center">
//         <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
//           <DollarSign className="w-6 h-6 text-white" />
//         </div>
//         <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Caisse Totale</h3>
//         <UIComponents.AnimatedCounter value={totalCaisse} suffix="€" />
//         <p className="text-xs text-green-600 mt-1">+12% ce mois</p>
//       </UIComponents.GlassCard>

//       <UIComponents.GlassCard className="p-6 text-center">
//         <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//           <Users className="w-6 h-6 text-white" />
//         </div>
//         <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Membres Actifs</h3>
//         <UIComponents.AnimatedCounter value={totalMembers} />
//         <p className="text-xs text-blue-600 mt-1">Tous connectés</p>
//       </UIComponents.GlassCard>

//       <UIComponents.GlassCard className="p-6 text-center">
//         <div className="flex justify-center mb-4">
//           <UIComponents.ProgressRing percentage={paymentRate} size={80} strokeWidth={6} />
//         </div>
//         <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Taux de Paiement</h3>
//         <p className="text-xs text-purple-600">Ce mois-ci</p>
//       </UIComponents.GlassCard>

//       <UIComponents.GlassCard className="p-6 text-center">
//         <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
//           <Calendar className="w-6 h-6 text-white" />
//         </div>
//         <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Prochaine Activité</h3>
//         <p className="text-lg font-bold text-gray-800 dark:text-white">Dans 5 jours</p>
//         <p className="text-xs text-orange-600 mt-1">Sortie prévue</p>
//       </UIComponents.GlassCard>
//     </div>
//   ),

//   // Member Card Component
//   MemberCard: ({ member, payments, onPayment }: any) => {
//     const memberPayments = payments.filter((p: Payment) => p.memberId === member.id);
//     const latestPayment = memberPayments[memberPayments.length - 1];
//     const status: 'paid' | 'partial' | 'unpaid' = latestPayment?.status || 'unpaid';

//     const statusConfig = {
//       paid: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/20' },
//       partial: { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/20' },
//       unpaid: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/20' }
//     } as const;

//     const StatusIcon = statusConfig[status].icon;

//     return (
//       <UIComponents.GlassCard className="p-6 hover:scale-105 transition-all duration-300 cursor-pointer group">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center space-x-3">
//             <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
//               {member.name.split(' ').map((n: string) => n[0]).join('')}
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-800 dark:text-white">{member.name}</h3>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 Depuis {BusinessLogic.formatDate(member.joinDate)}
//               </p>
//             </div>
//           </div>
//           <div className={`p-2 rounded-full ${statusConfig[status].bg}`}>
//             <StatusIcon className={`w-5 h-5 ${statusConfig[status].color}`} />
//           </div>
//         </div>

//         <div className="flex justify-between items-center">
//           <div>
//             <p className="text-sm text-gray-500 dark:text-gray-400">Solde</p>
//             <p className={`text-xl font-bold ${member.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//               {member.balance >= 0 ? '+' : ''}{member.balance}€
//             </p>
//           </div>
//           <UIComponents.Button
//             onClick={() => onPayment(member)}
//             className="opacity-0 group-hover:opacity-100 transition-opacity"
//             variant="primary"
//           >
//             Paiement
//           </UIComponents.Button>
//         </div>
//       </UIComponents.GlassCard>
//     );
//   },

//   // Quick Actions Panel
//   QuickActions: ({ onNewCotisation, onNewActivity, onSendReminders }: any) => (
//     <UIComponents.GlassCard className="p-6">
//       <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
//         <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
//         Actions Rapides
//       </h3>
//       <div className="space-y-3">
//         <UIComponents.Button
//           onClick={onNewCotisation}
//           variant="success"
//           className="w-full"
//         >
//           <CreditCard className="w-5 h-5" />
//           <span>Nouvelle Cotisation</span>
//         </UIComponents.Button>
//         <UIComponents.Button
//           onClick={onNewActivity}
//           variant="primary"
//           className="w-full"
//         >
//           <PartyPopper className="w-5 h-5" />
//           <span>Ajouter Activité</span>
//         </UIComponents.Button>
//         <UIComponents.Button
//           onClick={onSendReminders}
//           variant="warning"
//           className="w-full"
//         >
//           <Settings className="w-5 h-5" />
//           <span>Envoyer Rappels</span>
//         </UIComponents.Button>
//       </div>
//     </UIComponents.GlassCard>
//   ),

//   // Recent Activities Panel
//   RecentActivities: ({ activities }: any) => (
//     <UIComponents.GlassCard className="p-6">
//       <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Activités Récentes</h3>
//       <div className="space-y-3">
//         {activities.slice(0, 3).map((activity: Activity) => (
//           <div key={activity.id} className="flex justify-between items-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
//             <div>
//               <p className="font-medium text-gray-800 dark:text-white text-sm">{activity.name}</p>
//               <p className="text-xs text-gray-500">{BusinessLogic.formatDate(activity.date)}</p>
//             </div>
//             <span className="text-red-600 font-semibold">-{activity.amount}€</span>
//           </div>
//         ))}
//       </div>
//     </UIComponents.GlassCard>
//   ),

//   // Statistics Panel
//   StatisticsPanel: ({ payments, activities, totalCaisse }: any) => (
//     <UIComponents.GlassCard className="p-6">
//       <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Statistiques</h3>
//       <div className="space-y-4">
//         <div className="flex justify-between">
//           <span className="text-gray-600 dark:text-gray-400">Total collecté</span>
//           <span className="font-semibold text-green-600">+{payments.reduce((sum: number, p: Payment) => sum + p.amount, 0)}€</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600 dark:text-gray-400">Total dépensé</span>
//           <span className="font-semibold text-red-600">-{activities.reduce((sum: number, a: Activity) => sum + a.amount, 0)}€</span>
//         </div>
//         <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
//           <div className="flex justify-between">
//             <span className="font-semibold text-gray-800 dark:text-white">Solde final</span>
//             <span className={`font-bold ${totalCaisse >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//               {totalCaisse >= 0 ? '+' : ''}{totalCaisse}€
//             </span>
//           </div>
//         </div>
//       </div>
//     </UIComponents.GlassCard>
//   )
// };

// // ================================
// // 📝 FORM COMPONENTS
// // ================================
// const FormComponents = {
//   // Add Member Form
//   AddMemberForm: ({ newMember, setNewMember, onSubmit, errors = {} }: any) => (
//     <div>
//       <UIComponents.InputField
//         label="Nom complet"
//         value={newMember.name}
//         onChange={(e: any) => setNewMember({ ...newMember, name: e.target.value })}
//         placeholder="Ex: Jean Dupont"
//         icon={<User className="w-5 h-5" />}
//         error={errors.name}
//       />
//       <UIComponents.InputField
//         label="Téléphone (optionnel)"
//         value={newMember.phone || ''}
//         onChange={(e: any) => setNewMember({ ...newMember, phone: e.target.value })}
//         placeholder="Ex: +221 77 123 45 67"
//         error={errors.phone}
//       />
//       <UIComponents.InputField
//         label="Email (optionnel)"
//         type="email"
//         value={newMember.email || ''}
//         onChange={(e: any) => setNewMember({ ...newMember, email: e.target.value })}
//         placeholder="Ex: jean@email.com"
//         error={errors.email}
//       />
//       <div className="flex space-x-3 mt-6">
//         <UIComponents.Button onClick={onSubmit} variant="success" className="flex-1">
//           <Plus className="w-5 h-5" />
//           <span>Ajouter Membre</span>
//         </UIComponents.Button>
//       </div>
//     </div>
//   ),

//   // Add Cotisation Form
//   AddCotisationForm: ({ newCotisation, setNewCotisation, onSubmit, errors = {} }: any) => (
//     <div>
//       <UIComponents.InputField
//         label="Nom de la cotisation"
//         value={newCotisation.name}
//         onChange={(e: any) => setNewCotisation({ ...newCotisation, name: e.target.value })}
//         placeholder="Ex: Cotisation Juillet 2025"
//         icon={<CreditCard className="w-5 h-5" />}
//         error={errors.name}
//       />
//       <UIComponents.InputField
//         label="Montant (€)"
//         type="number"
//         value={newCotisation.amount}
//         onChange={(e: any) => setNewCotisation({ ...newCotisation, amount: e.target.value })}
//         placeholder="Ex: 50"
//         icon={<DollarSign className="w-5 h-5" />}
//         error={errors.amount}
//       />
//       <UIComponents.InputField
//         label="Description (optionnel)"
//         value={newCotisation.description || ''}
//         onChange={(e: any) => setNewCotisation({ ...newCotisation, description: e.target.value })}
//         placeholder="Ex: Pour les frais du mois"
//       />
//       <div className="flex space-x-3 mt-6">
//         <UIComponents.Button onClick={onSubmit} variant="success" className="flex-1">
//           <Plus className="w-5 h-5" />
//           <span>Créer Cotisation</span>
//         </UIComponents.Button>
//       </div>
//     </div>
//   ),

//   // Add Activity Form
//   AddActivityForm: ({ newActivity, setNewActivity, onSubmit, errors = {} }: any) => (
//     <div>
//       <UIComponents.InputField
//         label="Nom de l'activité"
//         value={newActivity.name}
//         onChange={(e: any) => setNewActivity({ ...newActivity, name: e.target.value })}
//         placeholder="Ex: Sortie plage familiale"
//         icon={<PartyPopper className="w-5 h-5" />}
//         error={errors.name}
//       />
//       <UIComponents.InputField
//         label="Coût (€)"
//         type="number"
//         value={newActivity.amount}
//         onChange={(e: any) => setNewActivity({ ...newActivity, amount: e.target.value })}
//         placeholder="Ex: 75"
//         icon={<DollarSign className="w-5 h-5" />}
//         error={errors.amount}
//       />
//       <UIComponents.InputField
//         label="Description (optionnel)"
//         value={newActivity.description || ''}
//         onChange={(e: any) => setNewActivity({ ...newActivity, description: e.target.value })}
//         placeholder="Ex: Transport + repas pour 4 personnes"
//       />
//       <div className="flex space-x-3 mt-6">
//         <UIComponents.Button onClick={onSubmit} variant="warning" className="flex-1">
//           <Plus className="w-5 h-5" />
//           <span>Ajouter Activité</span>
//         </UIComponents.Button>
//       </div>
//     </div>
//   )
// };

// // ================================
// // 🎯 MAIN APPLICATION AVEC SUPABASE
// // ================================
// const FamilyCashierApp = () => {
//   // États principaux
//   const [members, setMembers] = useState<Member[]>([]);
//   const [cotisations, setCotisations] = useState<Cotisation[]>([]);
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [activities, setActivities] = useState<Activity[]>([]);

//   // États UI
//   const [darkMode, setDarkMode] = useState(false);
//   const [showMemberModal, setShowMemberModal] = useState(false);
//   const [showCotisationModal, setShowCotisationModal] = useState(false);
//   const [showActivityModal, setShowActivityModal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // États des formulaires
//   const [newMember, setNewMember] = useState({ name: '', phone: '', email: '' });
//   const [newCotisation, setNewCotisation] = useState({ name: '', amount: '', description: '' });
//   const [newActivity, setNewActivity] = useState({ name: '', amount: '', description: '' });
//   const [formErrors, setFormErrors] = useState({});

//   // ================================
//   // 🔄 CHARGEMENT INITIAL DES DONNÉES
//   // ================================
//   const loadAllData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       console.log('🔄 Chargement des données depuis Supabase...');

//       const data = await DatabaseService.loadAllData();

//       // Convertir les données Supabase vers le format de l'app
//       const convertedMembers = data.members.map(convertDbMemberToMember);
//       const convertedCotisations = data.cotisations.map(convertDbCotisationToCotisation);
//       const convertedPayments = data.payments.map(convertDbPaymentToPayment);
//       const convertedActivities = data.activities.map(convertDbActivityToActivity);

//       setMembers(convertedMembers);
//       setCotisations(convertedCotisations);
//       setPayments(convertedPayments);
//       setActivities(convertedActivities);

//       console.log('✅ Données chargées:', {
//         membres: convertedMembers.length,
//         cotisations: convertedCotisations.length,
//         paiements: convertedPayments.length,
//         activités: convertedActivities.length
//       });

//     } catch (error) {
//       console.error('❌ Erreur lors du chargement:', error);
//       setError('Erreur de connexion à la base de données');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Charger les données au démarrage
//   useEffect(() => {
//     loadAllData();
//   }, []);

//   // ================================
//   // 🚀 GESTIONNAIRES AVEC SUPABASE
//   // ================================

//   const handleAddMember = async () => {
//     const validation = BusinessLogic.validateMember(newMember);
//     if (!validation.isValid) {
//       setFormErrors(validation.errors);
//       return;
//     }

//     try {
//       setLoading(true);

//       const dbMember = await DatabaseService.addMember({
//         name: newMember.name.trim(),
//         phone: newMember.phone || undefined,
//         email: newMember.email || undefined,
//       });

//       if (dbMember) {
//         const newMemberConverted = convertDbMemberToMember(dbMember);
//         setMembers(prev => [newMemberConverted, ...prev]);

//         setNewMember({ name: '', phone: '', email: '' });
//         setFormErrors({});
//         setShowMemberModal(false);
//         showNotification('✅ Membre ajouté avec succès !');
//       } else {
//         showNotification('❌ Erreur lors de l\'ajout du membre', 'error');
//       }
//     } catch (error) {
//       console.error('Erreur handleAddMember:', error);
//       showNotification('❌ Erreur de connexion', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddCotisation = async () => {
//     const validation = BusinessLogic.validateCotisation(newCotisation);
//     if (!validation.isValid) {
//       setFormErrors(validation.errors);
//       return;
//     }

//     try {
//       setLoading(true);

//       const dbCotisation = await DatabaseService.addCotisation({
//         name: newCotisation.name.trim(),
//         amount: parseFloat(newCotisation.amount),
//         description: newCotisation.description || undefined,
//       });

//       if (dbCotisation) {
//         const newCotisationConverted = convertDbCotisationToCotisation(dbCotisation);
//         setCotisations(prev => [newCotisationConverted, ...prev]);

//         setNewCotisation({ name: '', amount: '', description: '' });
//         setFormErrors({});
//         setShowCotisationModal(false);
//         showNotification('💰 Cotisation créée avec succès !');
//       } else {
//         showNotification('❌ Erreur lors de la création de la cotisation', 'error');
//       }
//     } catch (error) {
//       console.error('Erreur handleAddCotisation:', error);
//       showNotification('❌ Erreur de connexion', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddActivity = async () => {
//     const validation = BusinessLogic.validateActivity(newActivity);
//     if (!validation.isValid) {
//       setFormErrors(validation.errors);
//       return;
//     }

//     try {
//       setLoading(true);

//       const dbActivity = await DatabaseService.addActivity({
//         name: newActivity.name.trim(),
//         amount: parseFloat(newActivity.amount),
//         description: newActivity.description || undefined,
//       });

//       if (dbActivity) {
//         const newActivityConverted = convertDbActivityToActivity(dbActivity);
//         setActivities(prev => [newActivityConverted, ...prev]);

//         setNewActivity({ name: '', amount: '', description: '' });
//         setFormErrors({});
//         setShowActivityModal(false);
//         showNotification('🎉 Activité ajoutée - Fonds prélevés !');
//       } else {
//         showNotification('❌ Erreur lors de l\'ajout de l\'activité', 'error');
//       }
//     } catch (error) {
//       console.error('Erreur handleAddActivity:', error);
//       showNotification('❌ Erreur de connexion', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMemberPayment = async (member: Member) => {
//     if (!currentCotisation) {
//       showNotification('Aucune cotisation active ce mois-ci', 'warning');
//       return;
//     }

//     try {
//       setLoading(true);

//       const amount = currentCotisation.amount;

//       // Vérifier si un paiement existe déjà
//       const existingPayment = payments.find(
//         p => p.memberId === member.id && p.cotisationId === currentCotisation.id
//       );

//       if (existingPayment) {
//         // Mettre à jour le paiement existant
//         const success = await DatabaseService.updatePayment(existingPayment.id!, {
//           amount: amount,
//           status: 'paid'
//         });

//         if (success) {
//           // Mettre à jour localement
//           setPayments(prev => prev.map(p =>
//             p.id === existingPayment.id
//               ? { ...p, amount, status: 'paid' as const }
//               : p
//           ));
//         }
//       } else {
//         // Créer un nouveau paiement
//         const dbPayment = await DatabaseService.addPayment({
//           memberId: member.id,
//           cotisationId: currentCotisation.id,
//           amount: amount,
//           status: 'paid'
//         });

//         if (dbPayment) {
//           const newPaymentConverted = convertDbPaymentToPayment(dbPayment);
//           setPayments(prev => [...prev, newPaymentConverted]);
//         }
//       }

//       // Mettre à jour le solde du membre
//       const newBalance = member.balance + amount;
//       const balanceUpdated = await DatabaseService.updateMemberBalance(member.id, newBalance);

//       if (balanceUpdated) {
//         setMembers(prev => prev.map(m =>
//           m.id === member.id
//             ? { ...m, balance: newBalance }
//             : m
//         ));
//       }

//       showNotification(`💳 Paiement de ${amount}€ enregistré pour ${member.name}`);

//     } catch (error) {
//       console.error('Erreur handleMemberPayment:', error);
//       showNotification('❌ Erreur lors du paiement', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showNotification = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
//     // Notification simple - on peut améliorer plus tard
//     const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️';
//     alert(`${emoji} ${message}`);
//   };

//   // Calculs automatiques
//   const totalCaisse = BusinessLogic.calculateTotalCaisse(payments, activities);
//   const totalMembers = members.length;
//   const currentCotisation = BusinessLogic.getCurrentCotisation(cotisations);
//   const paymentRate = currentCotisation ?
//     BusinessLogic.calculatePaymentRate(payments, currentCotisation.id, totalMembers) : 0;

//   const handleSendReminders = () => {
//     if (!currentCotisation) {
//       showNotification('Aucune cotisation active', 'warning');
//       return;
//     }

//     const unpaidMembers = members.filter(member => {
//       const payment = payments.find(p => p.memberId === member.id && p.cotisationId === currentCotisation.id);
//       return !payment || payment.status === 'unpaid';
//     });

//     if (unpaidMembers.length === 0) {
//       showNotification('🎉 Tous les membres ont payé !');
//     } else {
//       showNotification(`📩 Rappels envoyés à ${unpaidMembers.length} membre(s): ${unpaidMembers.map(m => m.name).join(', ')}`);
//     }
//   };

//   // Affichage d'erreur si problème de connexion
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md mx-4">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
//               <AlertCircle className="w-8 h-8 text-white" />
//             </div>
//             <h2 className="text-xl font-bold text-gray-800 mb-2">Erreur de Connexion</h2>
//             <p className="text-gray-600 mb-6">{error}</p>
//             <UIComponents.Button onClick={loadAllData} variant="danger">
//               Réessayer
//             </UIComponents.Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Écran de chargement
//   if (loading && members.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
//           <h2 className="text-xl font-bold text-gray-800 mb-2">Chargement en cours...</h2>
//           <p className="text-gray-600">Connexion à Supabase</p>
//         </div>
//       </div>
//     );
//   }

//   // Interface principale
//   return (
//     <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100'}`}>
//       {/* Header Premium avec indicateur de connexion */}
//       <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-4">
//               <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
//                 <Wallet className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//                   Caissier Familial Pro
//                 </h1>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
//                   <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
//                   Connecté à Supabase
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               {loading && (
//                 <div className="w-4 h-4 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
//               )}
//               <button
//                 onClick={() => setDarkMode(!darkMode)}
//                 className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//               >
//                 {darkMode ? '☀️' : '🌙'}
//               </button>
//               <button
//                 onClick={loadAllData}
//                 className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//                 title="Actualiser les données"
//               >
//                 🔄
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Dashboard Principal */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Stats Cards */}
//         <DashboardComponents.StatsCards
//           totalCaisse={totalCaisse}
//           totalMembers={totalMembers}
//           paymentRate={paymentRate}
//         />

//         {/* Section Membres */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Membres de la Famille</h2>
//             <UIComponents.Button
//               onClick={() => setShowMemberModal(true)}
//               variant="primary"
//             >
//               <Plus className="w-5 h-5" />
//               <span>Nouveau Membre</span>
//             </UIComponents.Button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {members.map(member => (
//               <DashboardComponents.MemberCard
//                 key={member.id}
//                 member={member}
//                 payments={payments}
//                 onPayment={handleMemberPayment}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Panels d'Information */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <DashboardComponents.QuickActions
//             onNewCotisation={() => setShowCotisationModal(true)}
//             onNewActivity={() => setShowActivityModal(true)}
//             onSendReminders={handleSendReminders}
//           />

//           <DashboardComponents.RecentActivities activities={activities} />

//           <DashboardComponents.StatisticsPanel
//             payments={payments}
//             activities={activities}
//             totalCaisse={totalCaisse}
//           />
//         </div>
//       </main>

//       {/* FAB pour actions rapides */}
//       <button className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-50">
//         <Plus className="w-8 h-8" />
//       </button>

//       {/* Modals */}
//       <UIComponents.Modal
//         isOpen={showMemberModal}
//         onClose={() => {
//           setShowMemberModal(false);
//           setFormErrors({});
//           setNewMember({ name: '', phone: '', email: '' });
//         }}
//         title="👥 Ajouter un Nouveau Membre"
//       >
//         <FormComponents.AddMemberForm
//           newMember={newMember}
//           setNewMember={setNewMember}
//           onSubmit={handleAddMember}
//           errors={formErrors}
//         />
//       </UIComponents.Modal>

//       <UIComponents.Modal
//         isOpen={showCotisationModal}
//         onClose={() => {
//           setShowCotisationModal(false);
//           setFormErrors({});
//           setNewCotisation({ name: '', amount: '', description: '' });
//         }}
//         title="💳 Créer une Nouvelle Cotisation"
//       >
//         <FormComponents.AddCotisationForm
//           newCotisation={newCotisation}
//           setNewCotisation={setNewCotisation}
//           onSubmit={handleAddCotisation}
//           errors={formErrors}
//         />
//       </UIComponents.Modal>

//       <UIComponents.Modal
//         isOpen={showActivityModal}
//         onClose={() => {
//           setShowActivityModal(false);
//           setFormErrors({});
//           setNewActivity({ name: '', amount: '', description: '' });
//         }}
//         title="🎉 Ajouter une Activité Familiale"
//       >
//         <FormComponents.AddActivityForm
//           newActivity={newActivity}
//           setNewActivity={setNewActivity}
//           onSubmit={handleAddActivity}
//           errors={formErrors}
//         />
//       </UIComponents.Modal>
//     </div>
//   );
// };

// export default FamilyCashierApp;













// import React, { useState, useEffect } from 'react'
// import {
//   Home,
//   Users,
//   CreditCard,
//   Euro,
//   Activity,
//   Menu,
//   X,
//   Sun,
//   Moon,
//   Settings
// } from 'lucide-react'

// // Import des composants
// import Dashboard from './components/Dashboard'
// import Members from './components/Members'
// import Payments from './components/Payments'
// import Cotisations from './components/Cotisations'
// import Activities from './components/Activities'

// // Types pour la navigation
// type NavigationSection = 'dashboard' | 'members' | 'cotisations' | 'payments' | 'activities'

// const App: React.FC = () => {
//   // État principal de navigation
//   const [currentSection, setCurrentSection] = useState<NavigationSection>('dashboard')
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
//   const [isDarkMode, setIsDarkMode] = useState(false)

//   // Gestion du thème
//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme')
//     if (savedTheme === 'dark') {
//       setIsDarkMode(true)
//       document.documentElement.classList.add('dark')
//     }
//   }, [])

//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode)
//     if (!isDarkMode) {
//       document.documentElement.classList.add('dark')
//       localStorage.setItem('theme', 'dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//       localStorage.setItem('theme', 'light')
//     }
//   }

//   // Navigation items
//   const navigationItems = [
//     {
//       id: 'dashboard' as NavigationSection,
//       name: 'Tableau de Bord',
//       icon: Home,
//       color: 'text-indigo-600',
//       bgColor: 'bg-indigo-100',
//       description: 'Vue d\'ensemble'
//     },
//     {
//       id: 'members' as NavigationSection,
//       name: 'Membres',
//       icon: Users,
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-100',
//       description: 'Gestion des membres'
//     },
//     {
//       id: 'cotisations' as NavigationSection,
//       name: 'Cotisations',
//       icon: CreditCard,
//       color: 'text-purple-600',
//       bgColor: 'bg-purple-100',
//       description: 'Cotisations mensuelles'
//     },
//     {
//       id: 'payments' as NavigationSection,
//       name: 'Paiements',
//       icon: Euro,
//       color: 'text-green-600',
//       bgColor: 'bg-green-100',
//       description: 'Paiements flexibles'
//     },
//     {
//       id: 'activities' as NavigationSection,
//       name: 'Activités',
//       icon: Activity,
//       color: 'text-orange-600',
//       bgColor: 'bg-orange-100',
//       description: 'Activités familiales'
//     }
//   ]

//   // Gérer la navigation
//   const handleNavigation = (section: NavigationSection) => {
//     setCurrentSection(section)
//     setIsMobileMenuOpen(false) // Fermer le menu mobile après navigation
//   }

//   // Rendu du composant actuel
//   const renderCurrentSection = () => {
//     switch (currentSection) {
//       case 'dashboard':
//         return <Dashboard onNavigate={handleNavigation} />
//       case 'members':
//         return <Members onBack={() => handleNavigation('dashboard')} />
//       case 'cotisations':
//         return <Cotisations onBack={() => handleNavigation('dashboard')} />
//       case 'payments':
//         return <Payments onBack={() => handleNavigation('dashboard')} />
//       case 'activities':
//         return <Activities onBack={() => handleNavigation('dashboard')} />
//       default:
//         return <Dashboard onNavigate={handleNavigation} />
//     }
//   }

//   return (
//     <div className={`min-h-screen transition-colors duration-300 ${isDarkMode
//         ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900'
//         : 'bg-gradient-to-br from-indigo-100 via-white to-purple-100'
//       }`}>

//       {/* Navigation Desktop - Sidebar */}
//       <div className={`hidden lg:block fixed inset-y-0 left-0 w-64 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'
//         } backdrop-blur-lg border-r ${isDarkMode ? 'border-gray-700' : 'border-white/20'
//         } shadow-xl z-40`}>

//         {/* Logo */}
//         <div className="p-6 border-b border-gray-200/20">
//           <div className="flex items-center">
//             <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl">
//               <Euro className="h-8 w-8 text-white" />
//             </div>
//             <div className="ml-3">
//               <h1 className={`text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ${isDarkMode ? 'text-white' : ''
//                 }`}>
//                 Caissier Pro
//               </h1>
//               <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                 Gestion Familiale
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="p-4 space-y-2">
//           {navigationItems.map((item) => {
//             const IconComponent = item.icon
//             const isActive = currentSection === item.id

//             return (
//               <button
//                 key={item.id}
//                 onClick={() => handleNavigation(item.id)}
//                 className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
//                     ? `${item.bgColor} ${item.color} shadow-lg scale-105`
//                     : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} hover:scale-105`
//                   }`}
//               >
//                 <div className={`p-2 rounded-lg mr-3 transition-colors ${isActive ? 'bg-white/20' : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} group-hover:${item.bgColor}`
//                   }`}>
//                   <IconComponent className={`h-5 w-5 ${isActive ? 'text-current' : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:${item.color}`
//                     }`} />
//                 </div>
//                 <div className="text-left">
//                   <div className={`font-medium ${isActive ? 'text-current' : ''}`}>
//                     {item.name}
//                   </div>
//                   <div className={`text-xs ${isActive
//                       ? 'text-current opacity-80'
//                       : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
//                     }`}>
//                     {item.description}
//                   </div>
//                 </div>
//               </button>
//             )
//           })}
//         </nav>

//         {/* Paramètres en bas */}
//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/20">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={toggleTheme}
//               className={`p-3 rounded-xl transition-all duration-300 ${isDarkMode
//                   ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
//                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                 }`}
//             >
//               {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//             </button>

//             <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//               Version 2.0
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Mobile - Top Bar */}
//       <div className={`lg:hidden sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
//         } backdrop-blur-lg border-b ${isDarkMode ? 'border-gray-700' : 'border-white/20'
//         } shadow-lg`}>
//         <div className="flex items-center justify-between p-4">

//           {/* Logo Mobile */}
//           <div className="flex items-center">
//             <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
//               <Euro className="h-6 w-6 text-white" />
//             </div>
//             <div className="ml-2">
//               <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'
//                 }`}>
//                 Caissier Pro
//               </h1>
//             </div>
//           </div>

//           {/* Actions Mobile */}
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={toggleTheme}
//               className={`p-2 rounded-lg transition-colors ${isDarkMode
//                   ? 'bg-gray-700 text-yellow-400'
//                   : 'bg-gray-100 text-gray-600'
//                 }`}
//             >
//               {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//             </button>

//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className={`p-2 rounded-lg transition-colors ${isDarkMode
//                   ? 'bg-gray-700 text-white'
//                   : 'bg-gray-100 text-gray-600'
//                 }`}
//             >
//               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Menu Mobile Dropdown */}
//         {isMobileMenuOpen && (
//           <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'
//             } border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
//             } shadow-lg`}>
//             <div className="p-4 space-y-2">
//               {navigationItems.map((item) => {
//                 const IconComponent = item.icon
//                 const isActive = currentSection === item.id

//                 return (
//                   <button
//                     key={item.id}
//                     onClick={() => handleNavigation(item.id)}
//                     className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${isActive
//                         ? `${item.bgColor} ${item.color}`
//                         : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
//                       }`}
//                   >
//                     <div className={`p-2 rounded-lg mr-3 ${isActive ? 'bg-white/20' : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`
//                       }`}>
//                       <IconComponent className={`h-5 w-5 ${isActive ? 'text-current' : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
//                         }`} />
//                     </div>
//                     <div className="text-left">
//                       <div className="font-medium">{item.name}</div>
//                       <div className={`text-xs ${isActive
//                           ? 'text-current opacity-80'
//                           : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
//                         }`}>
//                         {item.description}
//                       </div>
//                     </div>
//                   </button>
//                 )
//               })}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Contenu Principal */}
//       <div className="lg:ml-64">
//         <main className="min-h-screen">
//           {renderCurrentSection()}
//         </main>
//       </div>

//       {/* Navigation Mobile Bottom (Optionnelle) */}
//       <div className={`lg:hidden fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
//         } backdrop-blur-lg border-t ${isDarkMode ? 'border-gray-700' : 'border-white/20'
//         } shadow-lg z-40`}>
//         <div className="flex items-center justify-around py-2">
//           {navigationItems.slice(0, 5).map((item) => {
//             const IconComponent = item.icon
//             const isActive = currentSection === item.id

//             return (
//               <button
//                 key={item.id}
//                 onClick={() => handleNavigation(item.id)}
//                 className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300 ${isActive
//                     ? `${item.color} scale-105`
//                     : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
//                   }`}
//               >
//                 <div className={`p-1.5 rounded-lg ${isActive ? `${item.bgColor}` : 'transparent'
//                   }`}>
//                   <IconComponent className="h-5 w-5" />
//                 </div>
//                 <span className="text-xs mt-1 font-medium">
//                   {item.name}
//                 </span>
//               </button>
//             )
//           })}
//         </div>
//       </div>

//       {/* Overlay pour mobile menu */}
//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//     </div>
//   )
// }

// export default App

















// import React, { useState, useEffect } from 'react';
// import {
//   Home,
//   Users,
//   CreditCard,
//   Euro,
//   Activity,
//   Menu,
//   X,
//   Sun,
//   Moon,
//   Settings
// } from 'lucide-react';

// // Import des composants
// import Dashboard from './components/Dashboard';
// import Members from './components/Members';
// import Payments from './components/Payments';
// import Cotisations from './components/Cotisations';
// import Activities from './components/Activities';

// // Types pour la navigation
// type NavigationSection = 'dashboard' | 'members' | 'cotisations' | 'payments' | 'activities';

// const App: React.FC = () => {
//   // État principal de navigation
//   const [currentSection, setCurrentSection] = useState<NavigationSection>('dashboard');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   // Gestion du thème
//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setIsDarkMode(true);
//       document.documentElement.classList.add('dark');
//     }
//   }, []);

//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode);
//     if (!isDarkMode) {
//       document.documentElement.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//     }
//   };

//   // Navigation items
//   const navigationItems = [
//     {
//       id: 'dashboard' as NavigationSection,
//       name: 'Tableau de Bord',
//       icon: Home,
//       color: 'text-indigo-600',
//       bgColor: 'bg-indigo-100',
//       description: 'Vue d\'ensemble'
//     },
//     {
//       id: 'members' as NavigationSection,
//       name: 'Membres',
//       icon: Users,
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-100',
//       description: 'Gestion des membres'
//     },
//     {
//       id: 'cotisations' as NavigationSection,
//       name: 'Cotisations',
//       icon: CreditCard,
//       color: 'text-purple-600',
//       bgColor: 'bg-purple-100',
//       description: 'Cotisations mensuelles'
//     },
//     {
//       id: 'payments' as NavigationSection,
//       name: 'Paiements',
//       icon: Euro,
//       color: 'text-green-600',
//       bgColor: 'bg-green-100',
//       description: 'Paiements flexibles'
//     },
//     {
//       id: 'activities' as NavigationSection,
//       name: 'Activités',
//       icon: Activity,
//       color: 'text-orange-600',
//       bgColor: 'bg-orange-100',
//       description: 'Activités familiales'
//     }
//   ];

//   // Gérer la navigation
//   const handleNavigation = (section: string) => {
//     if (['dashboard', 'members', 'cotisations', 'payments', 'activities'].includes(section)) {
//       setCurrentSection(section as NavigationSection);
//       setIsMobileMenuOpen(false); // Fermer le menu mobile après navigation
//     }
//   };

//   // Rendu du composant actuel
//   const renderCurrentSection = () => {
//     switch (currentSection) {
//       case 'dashboard':
//         return <Dashboard onNavigate={handleNavigation} />;
//       case 'members':
//         return <Members onBack={() => handleNavigation('dashboard')} />;
//       case 'cotisations':
//         return <Cotisations onBack={() => handleNavigation('dashboard')} />;
//       case 'payments':
//         return <Payments onBack={() => handleNavigation('dashboard')} />;
//       case 'activities':
//         return <Activities onBack={() => handleNavigation('dashboard')} />;
//       default:
//         return <Dashboard onNavigate={handleNavigation} />;
//     }
//   };

//   return (
//     <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' : 'bg-gradient-to-br from-indigo-100 via-white to-purple-100'}`}>
//       {/* Navigation Desktop - Sidebar */}
//       <div className={`hidden lg:block fixed inset-y-0 left-0 w-64 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-lg border-r ${isDarkMode ? 'border-gray-700' : 'border-white/20'} shadow-xl z-40`}>
//         {/* Logo */}
//         <div className="p-6 border-b border-gray-200/20">
//           <div className="flex items-center">
//             <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl">
//               <Euro className="h-8 w-8 text-white" />
//             </div>
//             <div className="ml-3">
//               <h1 className={`text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ${isDarkMode ? 'text-white' : ''}`}>
//                 Caissier Pro
//               </h1>
//               <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                 Gestion Familiale
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="p-4 space-y-2">
//           {navigationItems.map((item) => {
//             const IconComponent = item.icon;
//             const isActive = currentSection === item.id;

//             return (
//               <button
//                 key={item.id}
//                 onClick={() => handleNavigation(item.id)}
//                 className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? `${item.bgColor} ${item.color} shadow-lg scale-105` : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} hover:scale-105`}`}
//               >
//                 <div className={`p-2 rounded-lg mr-3 transition-colors ${isActive ? 'bg-white/20' : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} group-hover:${item.bgColor}`}`}>
//                   <IconComponent className={`h-5 w-5 ${isActive ? 'text-current' : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:${item.color}`}`} />
//                 </div>
//                 <div className="text-left">
//                   <div className={`font-medium ${isActive ? 'text-current' : ''}`}>
//                     {item.name}
//                   </div>
//                   <div className={`text-xs ${isActive ? 'text-current opacity-80' : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}`}>
//                     {item.description}
//                   </div>
//                 </div>
//               </button>
//             );
//           })}
//         </nav>

//         {/* Paramètres en bas */}
//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/20">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={toggleTheme}
//               className={`p-3 rounded-xl transition-all duration-300 ${isDarkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
//             >
//               {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//             </button>

//             <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//               Version 2.0
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Mobile - Top Bar */}
//       <div className={`lg:hidden sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-lg border-b ${isDarkMode ? 'border-gray-700' : 'border-white/20'} shadow-lg`}>
//         <div className="flex items-center justify-between p-4">
//           {/* Logo Mobile */}
//           <div className="flex items-center">
//             <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
//               <Euro className="h-6 w-6 text-white" />
//             </div>
//             <div className="ml-2">
//               <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
//                 Caissier Pro
//               </h1>
//             </div>
//           </div>

//           {/* Actions Mobile */}
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={toggleTheme}
//               className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
//             >
//               {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//             </button>

//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'}`}
//             >
//               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Menu Mobile Dropdown */}
//         {isMobileMenuOpen && (
//           <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
//             <div className="p-4 space-y-2">
//               {navigationItems.map((item) => {
//                 const IconComponent = item.icon;
//                 const isActive = currentSection === item.id;

//                 return (
//                   <button
//                     key={item.id}
//                     onClick={() => handleNavigation(item.id)}
//                     className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? `${item.bgColor} ${item.color}` : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}`}
//                   >
//                     <div className={`p-2 rounded-lg mr-3 ${isActive ? 'bg-white/20' : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}`}>
//                       <IconComponent className={`h-5 w-5 ${isActive ? 'text-current' : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}`} />
//                     </div>
//                     <div className="text-left">
//                       <div className="font-medium">{item.name}</div>
//                       <div className={`text-xs ${isActive ? 'text-current opacity-80' : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}`}>
//                         {item.description}
//                       </div>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Contenu Principal */}
//       <div className="lg:ml-64">
//         <main className="min-h-screen">
//           {renderCurrentSection()}
//         </main>
//       </div>

//       {/* Navigation Mobile Bottom (Optionnelle) */}
//       <div className={`lg:hidden fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-lg border-t ${isDarkMode ? 'border-gray-700' : 'border-white/20'} shadow-lg z-40`}>
//         <div className="flex items-center justify-around py-2">
//           {navigationItems.slice(0, 5).map((item) => {
//             const IconComponent = item.icon;
//             const isActive = currentSection === item.id;

//             return (
//               <button
//                 key={item.id}
//                 onClick={() => handleNavigation(item.id)}
//                 className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300 ${isActive ? `${item.color} scale-105` : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}`}
//               >
//                 <div className={`p-1.5 rounded-lg ${isActive ? `${item.bgColor}` : 'transparent'}`}>
//                   <IconComponent className="h-5 w-5" />
//                 </div>
//                 <span className="text-xs mt-1 font-medium">
//                   {item.name}
//                 </span>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Overlay pour mobile menu */}
//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default App;























// le code precedent marchait bien mais sans authimport React, { useState, useEffect, useCallback, useRef } from 'react'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Home,
  Users,
  CreditCard,
  Euro,
  Activity,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Shield,
  Crown,
  User
} from 'lucide-react'
import { supabase } from './lib/supabase'

// Import des composants
import Dashboard from './components/Dashboard'
import Members from './components/Members'
import Payments from './components/Payments'
import Cotisations from './components/Cotisations'
import Activities from './components/Activities'
import Auth from './components/Auth'

// 🔧 Logger optimisé
const isDev = process.env.NODE_ENV === 'development'
const logger = {
  auth: (type: string, ...args: any[]) => {
    if (isDev) {
      const emoji: Record<string, string> = {
        check: '🔍',
        change: '🔄',
        profile: '📋',
        error: '❌',
        success: '✅',
        temp: '🔧'
      }
      console.log(`${emoji[type] || '🔔'} [AUTH]`, ...args)
    }
  },
  error: (...args: any[]) => console.error('❌ [ERROR]', ...args),
  render: (...args: any[]) => isDev && console.log('🎨 [RENDER]', ...args)
}

// Types pour la navigation
type NavigationSection = 'dashboard' | 'members' | 'cotisations' | 'payments' | 'activities'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'member' | 'guest'
  family_id: string
  avatar_url: string | null
  phone: string | null
  is_active: boolean
  created_at: string
}

interface AuthState {
  user: any
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

// 🚀 Hook d'authentification optimisé
const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null
  })

  // Refs pour éviter les appels multiples
  const isCheckingRef = useRef(false)
  const profileCacheRef = useRef(new Map<string, UserProfile>())
  const mountedRef = useRef(true)

  // 🔧 Fonction de création de profil temporaire
  const createTempProfile = useCallback((user: any): UserProfile => {
    const tempProfile: UserProfile = {
      id: user.id,
      email: user.email || 'unknown@email.com',
      full_name: user.user_metadata?.full_name || user.email || 'Utilisateur',
      role: 'admin',
      family_id: 'temp-family-id',
      avatar_url: null,
      phone: null,
      is_active: true,
      created_at: new Date().toISOString()
    }
    logger.auth('temp', 'Profil temporaire créé:', tempProfile.email)
    return tempProfile
  }, [])

  // 🔧 Récupération optimisée du profil
  const fetchUserProfile = useCallback(async (user: any) => {
    if (!user?.id || !mountedRef.current) return

    // Vérifier le cache
    const cachedProfile = profileCacheRef.current.get(user.id)
    if (cachedProfile) {
      logger.auth('profile', 'Profil récupéré du cache:', cachedProfile.email)
      setAuthState(prev => ({ ...prev, profile: cachedProfile }))
      return
    }

    try {
      logger.auth('profile', 'Récupération profil pour:', user.id)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!mountedRef.current) return

      if (error) {
        logger.auth('error', 'Erreur profil:', error.message)

        // Si profil non trouvé, créer un temporaire
        if (error.code === 'PGRST116' || error.message.includes('No rows found')) {
          const tempProfile = createTempProfile(user)
          setAuthState(prev => ({ ...prev, profile: tempProfile }))
          return
        }

        // Pour autres erreurs, créer quand même un profil temporaire
        const tempProfile = createTempProfile(user)
        setAuthState(prev => ({ ...prev, profile: tempProfile }))
        return
      }

      logger.auth('success', 'Profil récupéré:', data.email)
      // Mettre en cache
      profileCacheRef.current.set(user.id, data)
      setAuthState(prev => ({ ...prev, profile: data }))

    } catch (error) {
      logger.auth('error', 'Erreur fetchUserProfile:', error)
      if (mountedRef.current) {
        const tempProfile = createTempProfile(user)
        setAuthState(prev => ({ ...prev, profile: tempProfile }))
      }
    }
  }, [createTempProfile])

  // 🔧 Vérification auth optimisée avec debounce
  const checkAuthStatus = useCallback(async () => {
    if (isCheckingRef.current || !mountedRef.current) {
      return
    }

    isCheckingRef.current = true

    try {
      logger.auth('check', 'Vérification authentification...')
      const { data: { session }, error } = await supabase.auth.getSession()

      if (!mountedRef.current) return

      if (error) {
        logger.auth('error', 'Erreur session:', error.message)
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
          user: null,
          profile: null
        }))
        return
      }

      if (session?.user) {
        logger.auth('success', 'Session trouvée:', session.user.email)
        setAuthState(prev => ({ ...prev, user: session.user, loading: false }))
        await fetchUserProfile(session.user)
      } else {
        logger.auth('check', 'Aucune session trouvée')
        setAuthState(prev => ({
          ...prev,
          loading: false,
          user: null,
          profile: null
        }))
      }
    } catch (error) {
      logger.auth('error', 'Erreur vérification auth:', error)
      if (mountedRef.current) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Erreur de connexion',
          user: null,
          profile: null
        }))
      }
    } finally {
      isCheckingRef.current = false
    }
  }, [fetchUserProfile])

  // 🔧 Effect d'initialisation optimisé
  useEffect(() => {
    mountedRef.current = true
    let authSubscription: any

    // Check initial avec délai pour éviter les appels multiples
    const initAuth = async () => {
      await checkAuthStatus()

      // Setup auth listener avec debounce
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mountedRef.current) return

        logger.auth('change', `Auth event: ${event}`, session?.user?.email || 'no user')

        // Debounce les changements rapides
        setTimeout(() => {
          if (!mountedRef.current) return

          if (session?.user) {
            setAuthState(prev => ({ ...prev, user: session.user }))
            fetchUserProfile(session.user)
          } else {
            setAuthState({
              user: null,
              profile: null,
              loading: false,
              error: null
            })
            profileCacheRef.current.clear()
          }
        }, 100)
      })

      authSubscription = data.subscription
    }

    initAuth()

    // Cleanup
    return () => {
      mountedRef.current = false
      isCheckingRef.current = false
      authSubscription?.unsubscribe()
    }
  }, [checkAuthStatus, fetchUserProfile])

  // Méthodes d'authentification
  const handleAuthSuccess = useCallback((authUser: any, userProfile: UserProfile) => {
    logger.auth('success', 'Authentification réussie:', authUser.email)
    profileCacheRef.current.set(authUser.id, userProfile)
    setAuthState({
      user: authUser,
      profile: userProfile,
      loading: false,
      error: null
    })
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      logger.auth('check', 'Déconnexion...')
      await supabase.auth.signOut()
      profileCacheRef.current.clear()
      setAuthState({
        user: null,
        profile: null,
        loading: false,
        error: null
      })
      logger.auth('success', 'Déconnexion réussie')
    } catch (error) {
      logger.auth('error', 'Erreur déconnexion:', error)
    }
  }, [])

  return {
    ...authState,
    handleAuthSuccess,
    handleLogout,
    isAuthenticated: !!(authState.user && authState.profile)
  }
}

// 🚀 Hook de thème optimisé
const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return saved === 'dark' || (!saved && prefersDark)
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev)
  }, [])

  return { isDarkMode, toggleTheme }
}

// Interface pour les éléments de navigation
interface NavigationItem {
  id: NavigationSection
  name: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  color: string
  bgColor: string
  description: string
  roles: string[]
}

// 🎯 Composant principal optimisé
const App: React.FC = () => {
  // Hooks optimisés
  const { user, profile, loading, error, isAuthenticated, handleAuthSuccess, handleLogout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()

  // État de navigation
  const [currentSection, setCurrentSection] = useState<NavigationSection>('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // 🔧 Navigation items avec memoization
  const navigationItems = React.useMemo((): NavigationItem[] => [
    {
      id: 'dashboard',
      name: 'Tableau de Bord',
      icon: Home,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      description: 'Vue d\'ensemble',
      roles: ['admin', 'member', 'guest']
    },
    {
      id: 'members',
      name: 'Membres',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Gestion des membres',
      roles: ['admin', 'member']
    },
    {
      id: 'cotisations',
      name: 'Cotisations',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Cotisations mensuelles',
      roles: ['admin', 'member', 'guest']
    },
    {
      id: 'payments',
      name: 'Paiements',
      icon: Euro,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Paiements flexibles',
      roles: ['admin', 'member']
    },
    {
      id: 'activities',
      name: 'Activités',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Activités familiales',
      roles: ['admin', 'member']
    }
  ], [])

  // Filtrer les items selon le rôle avec memoization
  const filteredNavigationItems = React.useMemo(() =>
    navigationItems.filter(item =>
      profile ? item.roles.includes(profile.role) : false
    ), [navigationItems, profile]
  )

  // 🔧 Gestionnaire de navigation optimisé
  const handleNavigation = useCallback((section: string) => {
    if (['dashboard', 'members', 'cotisations', 'payments', 'activities'].includes(section)) {
      setCurrentSection(section as NavigationSection)
      setIsMobileMenuOpen(false)
    }
  }, [])

  // 🔧 Fonctions utilitaires avec memoization
  const getRoleIcon = useCallback((role: string) => {
    switch (role) {
      case 'admin': return Crown
      case 'member': return User
      case 'guest': return Shield
      default: return User
    }
  }, [])

  const getRoleColor = useCallback((role: string) => {
    switch (role) {
      case 'admin': return 'text-yellow-600'
      case 'member': return 'text-blue-600'
      case 'guest': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }, [])

  // 🔧 Rendu conditionnel optimisé
  const renderCurrentSection = useCallback(() => {
    if (!profile) return null

    const hasAccess = (requiredRoles: string[]) => requiredRoles.includes(profile.role)
    const AccessDenied = () => (
      <div className="p-8 text-center text-gray-500">
        <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>Accès non autorisé pour votre rôle</p>
      </div>
    )

    switch (currentSection) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigation} />
      case 'members':
        return hasAccess(['admin', 'member']) ?
          <Members onBack={() => handleNavigation('dashboard')} /> :
          <AccessDenied />
      case 'cotisations':
        return <Cotisations onBack={() => handleNavigation('dashboard')} />
      case 'payments':
        return hasAccess(['admin', 'member']) ?
          <Payments onBack={() => handleNavigation('dashboard')} /> :
          <AccessDenied />
      case 'activities':
        return hasAccess(['admin', 'member']) ?
          <Activities onBack={() => handleNavigation('dashboard')} /> :
          <AccessDenied />
      default:
        return <Dashboard onNavigate={handleNavigation} />
    }
  }, [currentSection, profile, handleNavigation])

  // 🔧 Loading state optimisé
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement de l'application...</p>
          <p className="text-gray-400 text-sm mt-2">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  // 🔧 Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-red-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200">
          <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-red-800 font-bold text-lg mb-2">Erreur d'authentification</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  // Si pas authentifié
  if (!isAuthenticated) {
    logger.render('Affichage page authentification')
    return <Auth onAuthSuccess={handleAuthSuccess} />
  }

  logger.render('Interface principale pour:', profile!.email, profile!.role)

  // 🎯 Composants memoized pour la performance
  const UserProfileCard = React.memo(() => (
    <div className="p-4 border-b border-gray-200/20">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg mr-3 ${profile!.role === 'admin' ? 'bg-yellow-100' :
          profile!.role === 'member' ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
          {(() => {
            const RoleIcon = getRoleIcon(profile!.role)
            return <RoleIcon className={`h-5 w-5 ${getRoleColor(profile!.role)}`} />
          })()}
        </div>
        <div className="flex-1">
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {profile!.full_name || profile!.email}
          </div>
          <div className={`text-xs capitalize ${getRoleColor(profile!.role)}`}>
            {profile!.role === 'admin' ? 'Administrateur' :
              profile!.role === 'member' ? 'Membre' : 'Invité'}
          </div>
        </div>
      </div>
    </div>
  ))

  const NavigationButton = React.memo(({ item, isActive }: { item: NavigationItem, isActive: boolean }) => {
    const IconComponent = item.icon

    return (
      <button
        onClick={() => handleNavigation(item.id)}
        className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
          ? `${item.bgColor} ${item.color} shadow-lg scale-105`
          : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} hover:scale-105`
          }`}
      >
        <div className={`p-2 rounded-lg mr-3 transition-colors ${isActive ? 'bg-white/20' : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} group-hover:${item.bgColor}`
          }`}>
          <IconComponent className={`h-5 w-5 ${isActive ? 'text-current' : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:${item.color}`
            }`} />
        </div>
        <div className="text-left">
          <div className={`font-medium ${isActive ? 'text-current' : ''}`}>
            {item.name}
          </div>
          <div className={`text-xs ${isActive
            ? 'text-current opacity-80'
            : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
            }`}>
            {item.description}
          </div>
        </div>
      </button>
    )
  })

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900'
      : 'bg-gradient-to-br from-indigo-100 via-white to-purple-100'
      }`}>

      {/* Navigation Desktop - Sidebar */}
      <div className={`hidden lg:block fixed inset-y-0 left-0 w-64 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'
        } backdrop-blur-lg border-r ${isDarkMode ? 'border-gray-700' : 'border-white/20'
        } shadow-xl z-40`}>

        {/* Logo */}
        <div className="p-6 border-b border-gray-200/20">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl">
              <Euro className="h-8 w-8 text-white" />
            </div>
            <div className="ml-3">
              <h1 className={`text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ${isDarkMode ? 'text-white' : ''
                }`}>
                Caissier Pro
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Gestion Familiale
              </p>
            </div>
          </div>
        </div>

        {/* Profil utilisateur */}
        <UserProfileCard />

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">
          {filteredNavigationItems.map((item) => (
            <NavigationButton
              key={item.id}
              item={item}
              isActive={currentSection === item.id}
            />
          ))}
        </nav>

        {/* Actions en bas */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/20">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 ${isDarkMode
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={handleLogout}
              className={`p-3 rounded-xl transition-all duration-300 ${isDarkMode
                ? 'bg-red-900/50 text-red-400 hover:bg-red-900'
                : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
              title="Se déconnecter"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          <div className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Version 2.1 • Optimisé
          </div>
        </div>
      </div>

      {/* Navigation Mobile - Top Bar */}
      <div className={`lg:hidden sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
        } backdrop-blur-lg border-b ${isDarkMode ? 'border-gray-700' : 'border-white/20'
        } shadow-lg`}>
        <div className="flex items-center justify-between p-4">
          {/* Logo Mobile */}
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
              <Euro className="h-6 w-6 text-white" />
            </div>
            <div className="ml-2">
              <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Caissier Pro
              </h1>
            </div>
          </div>

          {/* Actions Mobile */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDarkMode
                ? 'bg-gray-700 text-yellow-400'
                : 'bg-gray-100 text-gray-600'
                }`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={handleLogout}
              className={`p-2 rounded-lg transition-colors ${isDarkMode
                ? 'bg-red-900/50 text-red-400'
                : 'bg-red-100 text-red-600'
                }`}
            >
              <LogOut className="h-5 w-5" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode
                ? 'bg-gray-700 text-white'
                : 'bg-gray-100 text-gray-600'
                }`}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'
            } border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
            } shadow-lg`}>
            <div className="p-4 space-y-2">
              {filteredNavigationItems.map((item) => (
                <NavigationButton
                  key={item.id}
                  item={item}
                  isActive={currentSection === item.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contenu Principal */}
      <div className="lg:ml-64">
        <main className="min-h-screen">
          {renderCurrentSection()}
        </main>
      </div>

      {/* Navigation Mobile Bottom */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
        } backdrop-blur-lg border-t ${isDarkMode ? 'border-gray-700' : 'border-white/20'
        } shadow-lg z-40`}>
        <div className="flex items-center justify-around py-2">
          {filteredNavigationItems.slice(0, 5).map((item) => {
            const IconComponent = item.icon
            const isActive = currentSection === item.id

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300 ${isActive
                  ? `${item.color} scale-105`
                  : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
                  }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? `${item.bgColor}` : 'transparent'
                  }`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1 font-medium">
                  {item.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Overlay pour mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

    </div>
  )
}

export default App