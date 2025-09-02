

// // code qui marche bien avec soucis de suppression
// import React, { useState, useEffect } from 'react'
// import {
//     Users,
//     CreditCard,
//     Activity,
//     TrendingUp,
//     Calendar,
//     Euro,
//     PieChart,
//     BarChart3,
//     Plus,
//     DollarSign,
//     Gift,
//     RefreshCw,
//     ShoppingBag,
//     Award,
//     HelpCircle,
//     Trash2,
//     Cloud,
//     Wifi,
//     WifiOff
// } from 'lucide-react'
// import AddCaisseDepositModal from './AddCaisseDepositModal'
// // import { AddCaisseDepositModal } from './AddCaisseDepositModal'

// import { DatabaseService } from '../lib/supabaseService'
// import type { DbMember, DbCotisation, DbPayment, DbActivity, DbCaisseDeposit } from '../lib/supabaseService'

// interface DashboardProps {
//     onNavigate: (section: 'dashboard' | 'members' | 'cotisations' | 'payments' | 'activities') => void
// }

// const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
//     // État principal
//     const [members, setMembers] = useState<DbMember[]>([])
//     const [cotisations, setCotisations] = useState<DbCotisation[]>([])
//     const [payments, setPayments] = useState<DbPayment[]>([])
//     const [activities, setActivities] = useState<DbActivity[]>([])
//     const [deposits, setDeposits] = useState<DbCaisseDeposit[]>([])
//     const [loading, setLoading] = useState(true)
//     const [isOnline, setIsOnline] = useState(navigator.onLine)

//     // État pour le modal de dépôt
//     const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)

//     // Surveillance de la connexion réseau
//     useEffect(() => {
//         const handleOnline = () => setIsOnline(true)
//         const handleOffline = () => setIsOnline(false)

//         window.addEventListener('online', handleOnline)
//         window.addEventListener('offline', handleOffline)

//         return () => {
//             window.removeEventListener('online', handleOnline)
//             window.removeEventListener('offline', handleOffline)
//         }
//     }, [])

//     // Charger toutes les données depuis Supabase
//     const loadData = async () => {
//         if (!isOnline) {
//             console.warn('🔄 Pas de connexion - impossible de charger les données')
//             setLoading(false)
//             return
//         }

//         setLoading(true)
//         try {
//             console.log('🔄 Chargement des données depuis Supabase...')

//             const [allData, depositsData] = await Promise.all([
//                 DatabaseService.loadAllData(),
//                 DatabaseService.getCaisseDeposits()
//             ])

//             setMembers(allData.members)
//             setCotisations(allData.cotisations)
//             setPayments(allData.payments)
//             setActivities(allData.activities)
//             setDeposits(depositsData)

//             console.log('✅ Données chargées depuis Supabase:', {
//                 membres: allData.members.length,
//                 cotisations: allData.cotisations.length,
//                 paiements: allData.payments.length,
//                 activités: allData.activities.length,
//                 dépôts: depositsData.length
//             })
//         } catch (error) {
//             console.error('❌ Erreur chargement dashboard:', error)
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         loadData()
//     }, [isOnline])

//     // Callback après ajout de dépôt
//     const handleDepositSuccess = () => {
//         console.log('✅ Dépôt ajouté avec succès, rechargement des données...')
//         loadData()
//     }

//     // Supprimer un dépôt
//     const handleDeleteDeposit = async (id: string) => {
//         if (!isOnline) {
//             alert('Connexion internet requise pour supprimer un dépôt')
//             return
//         }

//         if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce dépôt ?')) return

//         try {
//             console.log('🗑️ Suppression du dépôt:', id)
//             const success = await DatabaseService.deleteCaisseDeposit(id)
//             if (success) {
//                 alert('Dépôt supprimé avec succès !')
//                 loadData()
//             } else {
//                 alert('Erreur lors de la suppression')
//             }
//         } catch (error) {
//             console.error('❌ Erreur suppression dépôt:', error)
//             alert('Erreur lors de la suppression')
//         }
//     }

//     // Actualiser les données
//     const handleRefresh = async () => {
//         if (!isOnline) {
//             alert('Connexion internet requise pour actualiser')
//             return
//         }

//         try {
//             console.log('🔄 Actualisation des données...')
//             await loadData()
//         } catch (error) {
//             console.error('❌ Erreur actualisation:', error)
//             alert('Erreur lors de l\'actualisation')
//         }
//     }

//     // Fonctions utilitaires pour les dépôts
//     const getCategoryIcon = (category: string) => {
//         switch (category) {
//             case 'don': return <Gift className="w-4 h-4 text-green-500" />
//             case 'remboursement': return <RefreshCw className="w-4 h-4 text-blue-500" />
//             case 'vente': return <ShoppingBag className="w-4 h-4 text-purple-500" />
//             case 'bonus': return <Award className="w-4 h-4 text-yellow-500" />
//             default: return <HelpCircle className="w-4 h-4 text-gray-500" />
//         }
//     }

//     const getCategoryLabel = (category: string) => {
//         switch (category) {
//             case 'don': return 'Don familial'
//             case 'remboursement': return 'Remboursement'
//             case 'vente': return 'Vente d\'objets'
//             case 'bonus': return 'Bonus/Prime'
//             default: return 'Autre'
//         }
//     }

//     // Calculs
//     const totalCaisse = payments.reduce((sum, payment) => sum + payment.amount, 0) +
//         deposits.reduce((sum, deposit) => sum + deposit.amount, 0) -
//         activities.reduce((sum, activity) => sum + activity.amount, 0)

//     const totalMembers = members.length
//     const totalCotisations = cotisations.length
//     const totalActivities = activities.length

//     // Taux de paiement du mois actuel
//     const currentMonth = new Date().toISOString().slice(0, 7)
//     const currentMonthCotisations = cotisations.filter(c => c.month === currentMonth)
//     const currentMonthPayments = payments.filter(p =>
//         currentMonthCotisations.some(c => c.id === p.cotisation_id)
//     )
//     const paymentRate = currentMonthCotisations.length > 0
//         ? Math.round((currentMonthPayments.length / (currentMonthCotisations.length * totalMembers)) * 100)
//         : 0

//     // Membres les plus actifs
//     const memberPayments = members.map(member => {
//         const memberPaymentTotal = payments
//             .filter(p => p.member_id === member.id)
//             .reduce((sum, p) => sum + p.amount, 0)
//         return { ...member, totalPaid: memberPaymentTotal }
//     }).sort((a, b) => b.totalPaid - a.totalPaid)

//     // Indicateur de statut réseau
//     const NetworkStatusBanner = () => (
//         <div className={`mb-6 p-4 rounded-xl border ${isOnline
//             ? 'bg-blue-50 border-blue-200 text-blue-800'
//             : 'bg-red-50 border-red-200 text-red-800'
//             }`}>
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                     <div className="flex items-center gap-2">
//                         <Cloud className="w-5 h-5 text-blue-600" />
//                         <span className="font-medium">Mode Cloud Supabase</span>
//                     </div>

//                     <div className="flex items-center gap-2">
//                         {isOnline ? (
//                             <>
//                                 <Wifi className="w-4 h-4 text-green-500" />
//                                 <span className="text-sm text-green-600">En ligne</span>
//                             </>
//                         ) : (
//                             <>
//                                 <WifiOff className="w-4 h-4 text-red-500" />
//                                 <span className="text-sm text-red-600">Hors ligne</span>
//                             </>
//                         )}
//                     </div>
//                 </div>

//                 {/* Bouton actualiser */}
//                 {isOnline && (
//                     <button
//                         onClick={handleRefresh}
//                         disabled={loading}
//                         className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
//                     >
//                         <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//                         Actualiser
//                     </button>
//                 )}
//             </div>
//         </div>
//     )

//     // État de chargement
//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mb-4"></div>
//                     <p className="text-gray-600 font-medium">Chargement du dashboard...</p>
//                     <p className="text-gray-400 text-sm mt-2">
//                         Mode Cloud • {isOnline ? 'En ligne' : 'Hors ligne'}
//                     </p>
//                 </div>
//             </div>
//         )
//     }

//     // État hors ligne
//     if (!isOnline) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-red-50 flex items-center justify-center">
//                 <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200">
//                     <WifiOff className="h-16 w-16 text-red-500 mx-auto mb-4" />
//                     <h3 className="text-red-800 font-bold text-lg mb-2">Connexion requise</h3>
//                     <p className="text-red-600 text-sm mb-4">
//                         Une connexion internet est nécessaire pour utiliser le dashboard.
//                     </p>
//                     <button
//                         onClick={() => window.location.reload()}
//                         className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                     >
//                         Réessayer
//                     </button>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-4">
//             <div className="max-w-7xl mx-auto">

//                 {/* Bannière de statut réseau */}
//                 <NetworkStatusBanner />

//                 {/* Header avec bouton dépôt */}
//                 <div className="flex flex-col md:flex-row justify-between items-center mb-8">
//                     <div className="text-center md:text-left mb-4 md:mb-0">
//                         <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
//                             💰 Caissier Familial Pro
//                         </h1>
//                         <p className="text-gray-600 text-lg">
//                             Tableau de bord - Vue d'ensemble de la caisse familiale
//                         </p>
//                         <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
//                             <span className="text-xs text-gray-500">Version 4.0 Cloud</span>
//                             <div className="w-2 h-2 rounded-full bg-blue-500"></div>
//                         </div>
//                     </div>

//                     {/* Bouton dépôt direct */}
//                     <button
//                         onClick={() => setIsDepositModalOpen(true)}
//                         disabled={!isOnline}
//                         className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 
//                                  hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl 
//                                  transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105
//                                  font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         <Plus className="w-6 h-6" />
//                         <DollarSign className="w-6 h-6" />
//                         <span>Ajouter argent</span>
//                     </button>
//                 </div>

//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     {/* Total Caisse */}
//                     <div
//                         className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
//                         onClick={() => onNavigate('payments')}
//                     >
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Total Caisse</p>
//                                 <p className="text-3xl font-bold text-green-600">
//                                     {totalCaisse.toFixed(2)}€
//                                 </p>
//                                 <p className="text-xs text-green-500 mt-1">
//                                     +{deposits.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}€ en dépôts
//                                 </p>
//                                 <div className="flex items-center gap-1 mt-2">
//                                     <Cloud className="w-3 h-3 text-blue-400" />
//                                     <span className="text-xs text-blue-500">Sync cloud</span>
//                                 </div>
//                             </div>
//                             <div className="bg-green-100 p-3 rounded-full">
//                                 <Euro className="h-8 w-8 text-green-600" />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Membres */}
//                     <div
//                         className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
//                         onClick={() => onNavigate('members')}
//                     >
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Membres</p>
//                                 <p className="text-3xl font-bold text-blue-600">{totalMembers}</p>
//                             </div>
//                             <div className="bg-blue-100 p-3 rounded-full">
//                                 <Users className="h-8 w-8 text-blue-600" />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Cotisations */}
//                     <div
//                         className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
//                         onClick={() => onNavigate('cotisations')}
//                     >
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Cotisations</p>
//                                 <p className="text-3xl font-bold text-purple-600">{totalCotisations}</p>
//                             </div>
//                             <div className="bg-purple-100 p-3 rounded-full">
//                                 <CreditCard className="h-8 w-8 text-purple-600" />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Activités */}
//                     <div
//                         className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
//                         onClick={() => onNavigate('activities')}
//                     >
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Activités</p>
//                                 <p className="text-3xl font-bold text-orange-600">{totalActivities}</p>
//                             </div>
//                             <div className="bg-orange-100 p-3 rounded-full">
//                                 <Activity className="h-8 w-8 text-orange-600" />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Historique des dépôts récents */}
//                 {deposits.length > 0 && (
//                     <div className="mb-8 bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                                 <DollarSign className="w-6 h-6 text-green-600" />
//                                 Derniers dépôts dans la caisse
//                             </h3>
//                             <span className="text-sm text-gray-500">
//                                 {deposits.length} dépôt{deposits.length > 1 ? 's' : ''} total
//                             </span>
//                         </div>
//                         <div className="space-y-3">
//                             {deposits.slice(0, 5).map((deposit) => (
//                                 <div
//                                     key={deposit.id}
//                                     className="flex items-center justify-between p-4 bg-green-50/50 rounded-lg border border-green-200"
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         {getCategoryIcon(deposit.category)}
//                                         <div>
//                                             <p className="font-medium text-gray-900">
//                                                 +{deposit.amount.toFixed(2)} €
//                                             </p>
//                                             <p className="text-sm text-gray-600">
//                                                 {getCategoryLabel(deposit.category)} • {deposit.description}
//                                             </p>
//                                             <p className="text-xs text-gray-500">
//                                                 {new Date(deposit.deposit_date).toLocaleDateString('fr-FR', {
//                                                     day: 'numeric',
//                                                     month: 'long',
//                                                     hour: '2-digit',
//                                                     minute: '2-digit'
//                                                 })}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <button
//                                         onClick={() => handleDeleteDeposit(deposit.id)}
//                                         disabled={!isOnline}
//                                         className="text-red-500 hover:text-red-700 p-2 rounded-lg 
//                                                  hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                         title="Supprimer ce dépôt"
//                                     >
//                                         <Trash2 className="w-4 h-4" />
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {/* Métriques Avancées */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

//                     {/* Taux de Paiement */}
//                     <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-lg font-semibold text-gray-800">Taux de Paiement Ce Mois</h3>
//                             <TrendingUp className="h-6 w-6 text-green-600" />
//                         </div>
//                         <div className="relative">
//                             <div className="flex items-center justify-center">
//                                 <div className="relative w-32 h-32">
//                                     <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
//                                         <circle
//                                             cx="64"
//                                             cy="64"
//                                             r="56"
//                                             stroke="currentColor"
//                                             strokeWidth="8"
//                                             fill="none"
//                                             className="text-gray-200"
//                                         />
//                                         <circle
//                                             cx="64"
//                                             cy="64"
//                                             r="56"
//                                             stroke="currentColor"
//                                             strokeWidth="8"
//                                             fill="none"
//                                             strokeLinecap="round"
//                                             className="text-green-600"
//                                             strokeDasharray={`${(paymentRate / 100) * 351.86} 351.86`}
//                                         />
//                                     </svg>
//                                     <div className="absolute inset-0 flex items-center justify-center">
//                                         <span className="text-2xl font-bold text-green-600">{paymentRate}%</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Top Contributeurs */}
//                     <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-lg font-semibold text-gray-800">Top Contributeurs</h3>
//                             <BarChart3 className="h-6 w-6 text-purple-600" />
//                         </div>
//                         <div className="space-y-3">
//                             {memberPayments.slice(0, 5).map((member, index) => (
//                                 <div key={member.id} className="flex items-center justify-between">
//                                     <div className="flex items-center">
//                                         <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${index === 0 ? 'bg-yellow-500' :
//                                             index === 1 ? 'bg-gray-400' :
//                                                 index === 2 ? 'bg-orange-400' : 'bg-blue-500'
//                                             }`}>
//                                             {index + 1}
//                                         </div>
//                                         <span className="font-medium text-gray-700">{member.name}</span>
//                                     </div>
//                                     <span className="font-bold text-green-600">{member.totalPaid.toFixed(2)}€</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Actions Rapides */}
//                 <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                         <PieChart className="h-6 w-6 text-indigo-600 mr-2" />
//                         Actions Rapides
//                     </h3>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                         <button
//                             onClick={() => onNavigate('members')}
//                             className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
//                         >
//                             <Users className="h-6 w-6 mx-auto mb-2" />
//                             <span className="text-sm font-medium">Gérer Membres</span>
//                         </button>

//                         <button
//                             onClick={() => onNavigate('cotisations')}
//                             className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
//                         >
//                             <CreditCard className="h-6 w-6 mx-auto mb-2" />
//                             <span className="text-sm font-medium">Cotisations</span>
//                         </button>

//                         <button
//                             onClick={() => onNavigate('payments')}
//                             className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg"
//                         >
//                             <Euro className="h-6 w-6 mx-auto mb-2" />
//                             <span className="text-sm font-medium">Paiements</span>
//                         </button>

//                         <button
//                             onClick={() => onNavigate('activities')}
//                             className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-lg"
//                         >
//                             <Activity className="h-6 w-6 mx-auto mb-2" />
//                             <span className="text-sm font-medium">Activités</span>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Activités Récentes */}
//                 {activities.length > 0 && (
//                     <div className="mt-8 bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                             <Calendar className="h-6 w-6 text-orange-600 mr-2" />
//                             Activités Récentes
//                         </h3>
//                         <div className="space-y-3">
//                             {activities.slice(0, 5).map(activity => (
//                                 <div key={activity.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
//                                     <div>
//                                         <p className="font-medium text-gray-700">{activity.name}</p>
//                                         <p className="text-sm text-gray-500">
//                                             {new Date(activity.activity_date).toLocaleDateString('fr-FR')}
//                                         </p>
//                                     </div>
//                                     <span className="font-bold text-orange-600">-{activity.amount.toFixed(2)}€</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {/* Modal de dépôt */}
//                 <AddCaisseDepositModal
//                     isOpen={isDepositModalOpen}
//                     onClose={() => setIsDepositModalOpen(false)}
//                     onSuccess={handleDepositSuccess}
//                 />

//             </div>
//         </div>
//     )
// }

// export default Dashboard
















import React, { useState, useEffect } from 'react'
import {
    Users,
    CreditCard,
    Activity,
    TrendingUp,
    Calendar,
    Euro,
    PieChart,
    BarChart3,
    Plus,
    DollarSign,
    Gift,
    RefreshCw,
    ShoppingBag,
    Award,
    HelpCircle,
    Trash2,
    Cloud,
    Wifi,
    WifiOff,
    AlertTriangle,
    X
} from 'lucide-react'
import AddCaisseDepositModal from './AddCaisseDepositModal'

import { DatabaseService } from '../lib/supabaseService'
import type { DbMember, DbCotisation, DbPayment, DbActivity, DbCaisseDeposit } from '../lib/supabaseService'

interface DashboardProps {
    onNavigate: (section: 'dashboard' | 'members' | 'cotisations' | 'payments' | 'activities') => void
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    // État principal
    const [members, setMembers] = useState<DbMember[]>([])
    const [cotisations, setCotisations] = useState<DbCotisation[]>([])
    const [payments, setPayments] = useState<DbPayment[]>([])
    const [activities, setActivities] = useState<DbActivity[]>([])
    const [deposits, setDeposits] = useState<DbCaisseDeposit[]>([])
    const [loading, setLoading] = useState(true)
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [error, setError] = useState<string | null>(null)

    // États pour les modals
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedDeposit, setSelectedDeposit] = useState<DbCaisseDeposit | null>(null)
    const [deleting, setDeleting] = useState(false)

    // Surveillance de la connexion réseau
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true)
            setError(null)
        }
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Charger toutes les données depuis Supabase avec gestion d'erreurs améliorée
    const loadData = async () => {
        if (!isOnline) {
            console.warn('Pas de connexion - impossible de charger les données')
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        try {
            console.log('Chargement des données depuis Supabase...')

            // Chargement des données avec gestion d'erreurs
            const allData = await DatabaseService.loadAllData()

            if (!allData) {
                throw new Error('Aucune donnée reçue de la base')
            }

            // Validation et affectation sécurisée des données
            setMembers(Array.isArray(allData.members) ? allData.members : [])
            setCotisations(Array.isArray(allData.cotisations) ? allData.cotisations : [])
            setPayments(Array.isArray(allData.payments) ? allData.payments : [])
            setActivities(Array.isArray(allData.activities) ? allData.activities : [])

            // Chargement séparé des dépôts avec gestion d'erreur
            try {
                const depositsData = await DatabaseService.getCaisseDeposits()
                setDeposits(Array.isArray(depositsData) ? depositsData : [])
            } catch (depositsError) {
                console.warn('Erreur chargement dépôts:', depositsError)
                setDeposits([])
            }

            console.log('Données chargées avec succès:', {
                membres: allData.members?.length || 0,
                cotisations: allData.cotisations?.length || 0,
                paiements: allData.payments?.length || 0,
                activités: allData.activities?.length || 0,
                dépôts: deposits.length
            })

        } catch (error) {
            console.error('Erreur chargement dashboard:', error)
            setError('Erreur lors du chargement des données. Vérifiez votre connexion.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [isOnline])

    // Callback après ajout de dépôt avec gestion d'erreurs
    const handleDepositSuccess = async () => {
        console.log('Dépôt ajouté avec succès, rechargement des dépôts...')

        try {
            const depositsData = await DatabaseService.getCaisseDeposits()
            setDeposits(Array.isArray(depositsData) ? depositsData : [])
        } catch (error) {
            console.error('Erreur rechargement dépôts:', error)
            // Ne pas bloquer l'interface, juste recharger toutes les données
            loadData()
        }
    }

    // Ouvrir modal de suppression
    const openDeleteModal = (deposit: DbCaisseDeposit) => {
        setSelectedDeposit(deposit)
        setShowDeleteModal(true)
    }

    // Supprimer un dépôt avec confirmation
    const handleDeleteDeposit = async () => {
        if (!selectedDeposit || !isOnline) return

        setDeleting(true)
        try {
            console.log('Suppression du dépôt:', selectedDeposit.id)

            const success = await DatabaseService.deleteCaisseDeposit(selectedDeposit.id)

            if (success) {
                // Mise à jour locale immédiate
                setDeposits(prev => prev.filter(d => d.id !== selectedDeposit.id))
                setShowDeleteModal(false)
                setSelectedDeposit(null)
                console.log('Dépôt supprimé avec succès')
            } else {
                console.error('La suppression a échoué')
                alert('Erreur lors de la suppression du dépôt')
            }
        } catch (error) {
            console.error('Erreur suppression dépôt:', error)
            alert('Erreur lors de la suppression du dépôt')
        } finally {
            setDeleting(false)
        }
    }

    // Actualiser les données
    const handleRefresh = async () => {
        if (!isOnline) {
            alert('Connexion internet requise pour actualiser')
            return
        }

        try {
            console.log('Actualisation manuelle des données...')
            await loadData()
        } catch (error) {
            console.error('Erreur actualisation:', error)
            setError('Erreur lors de l\'actualisation')
        }
    }

    // Fonctions utilitaires pour les dépôts
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'don': return <Gift className="w-4 h-4 text-green-500" />
            case 'remboursement': return <RefreshCw className="w-4 h-4 text-blue-500" />
            case 'vente': return <ShoppingBag className="w-4 h-4 text-purple-500" />
            case 'bonus': return <Award className="w-4 h-4 text-yellow-500" />
            default: return <HelpCircle className="w-4 h-4 text-gray-500" />
        }
    }

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'don': return 'Don familial'
            case 'remboursement': return 'Remboursement'
            case 'vente': return 'Vente d\'objets'
            case 'bonus': return 'Bonus/Prime'
            default: return 'Autre'
        }
    }

    // Calculs sécurisés avec vérification des données
    const totalCaisse = (payments?.reduce((sum, payment) => sum + (payment?.amount || 0), 0) || 0) +
        (deposits?.reduce((sum, deposit) => sum + (deposit?.amount || 0), 0) || 0) -
        (activities?.reduce((sum, activity) => sum + (activity?.amount || 0), 0) || 0)

    const totalMembers = members?.length || 0
    const totalCotisations = cotisations?.length || 0
    const totalActivities = activities?.length || 0

    // Taux de paiement du mois actuel avec gestion des erreurs
    const currentMonth = new Date().toISOString().slice(0, 7)
    const currentMonthCotisations = cotisations?.filter(c => c?.month === currentMonth) || []
    const currentMonthPayments = payments?.filter(p =>
        currentMonthCotisations.some(c => c?.id === p?.cotisation_id)
    ) || []
    const paymentRate = currentMonthCotisations.length > 0 && totalMembers > 0
        ? Math.round((currentMonthPayments.length / (currentMonthCotisations.length * totalMembers)) * 100)
        : 0

    // Membres les plus actifs avec vérification des données
    const memberPayments = (members || []).map(member => {
        const memberPaymentTotal = (payments || [])
            .filter(p => p?.member_id === member?.id)
            .reduce((sum, p) => sum + (p?.amount || 0), 0)
        return { ...member, totalPaid: memberPaymentTotal }
    }).sort((a, b) => (b?.totalPaid || 0) - (a?.totalPaid || 0))

    // Indicateur de statut réseau
    const NetworkStatusBanner = () => (
        <div className={`mb-6 p-4 rounded-xl border ${error
            ? 'bg-red-50 border-red-200'
            : isOnline
                ? 'bg-blue-50 border-blue-200'
                : 'bg-red-50 border-red-200'
            }`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Cloud className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-800">Mode Cloud Supabase</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {isOnline ? (
                            <>
                                <Wifi className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600">En ligne</span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-red-600">Hors ligne</span>
                            </>
                        )}
                    </div>

                    {error && (
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-600">{error}</span>
                        </div>
                    )}
                </div>

                {/* Bouton actualiser */}
                {isOnline && (
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Actualiser
                    </button>
                )}
            </div>
        </div>
    )

    // État de chargement
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Chargement du dashboard...</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Mode Cloud • {isOnline ? 'En ligne' : 'Hors ligne'}
                    </p>
                </div>
            </div>
        )
    }

    // État hors ligne
    if (!isOnline) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-red-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200">
                    <WifiOff className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-red-800 font-bold text-lg mb-2">Connexion requise</h3>
                    <p className="text-red-600 text-sm mb-4">
                        Une connexion internet est nécessaire pour utiliser le dashboard.
                    </p>
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-4">
            <div className="max-w-7xl mx-auto">

                {/* Bannière de statut réseau */}
                <NetworkStatusBanner />

                {/* Header avec bouton dépôt */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            💰 Caissier Familial Pro
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Tableau de bord - Vue d'ensemble de la caisse familiale
                        </p>
                        <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                            <span className="text-xs text-gray-500">Version 4.0 Cloud</span>
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        </div>
                    </div>

                    {/* Bouton dépôt direct */}
                    <button
                        onClick={() => setIsDepositModalOpen(true)}
                        disabled={!isOnline}
                        className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 
                                 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl 
                                 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105
                                 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-6 h-6" />
                        <DollarSign className="w-6 h-6" />
                        <span>Ajouter argent</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Caisse */}
                    <div
                        className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
                        onClick={() => onNavigate('payments')}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Caisse</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {totalCaisse.toFixed(2)}€
                                </p>
                                <p className="text-xs text-green-500 mt-1">
                                    +{(deposits || []).reduce((sum, d) => sum + (d?.amount || 0), 0).toFixed(2)}€ en dépôts
                                </p>
                                <div className="flex items-center gap-1 mt-2">
                                    <Cloud className="w-3 h-3 text-blue-400" />
                                    <span className="text-xs text-blue-500">Sync cloud</span>
                                </div>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <Euro className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Membres */}
                    <div
                        className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
                        onClick={() => onNavigate('members')}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Membres</p>
                                <p className="text-3xl font-bold text-blue-600">{totalMembers}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Cotisations */}
                    <div
                        className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
                        onClick={() => onNavigate('cotisations')}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Cotisations</p>
                                <p className="text-3xl font-bold text-purple-600">{totalCotisations}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <CreditCard className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    {/* Activités */}
                    <div
                        className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
                        onClick={() => onNavigate('activities')}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Activités</p>
                                <p className="text-3xl font-bold text-orange-600">{totalActivities}</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-full">
                                <Activity className="h-8 w-8 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Historique des dépôts récents */}
                {deposits.length > 0 && (
                    <div className="mb-8 bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <DollarSign className="w-6 h-6 text-green-600" />
                                Derniers dépôts dans la caisse
                            </h3>
                            <span className="text-sm text-gray-500">
                                {deposits.length} dépôt{deposits.length > 1 ? 's' : ''} total
                            </span>
                        </div>
                        <div className="space-y-3">
                            {deposits.slice(0, 5).map((deposit) => (
                                <div
                                    key={deposit.id}
                                    className="flex items-center justify-between p-4 bg-green-50/50 rounded-lg border border-green-200 group hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        {getCategoryIcon(deposit.category)}
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                +{deposit.amount.toFixed(2)} €
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {getCategoryLabel(deposit.category)} • {deposit.description}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(deposit.deposit_date).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => openDeleteModal(deposit)}
                                        disabled={!isOnline}
                                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-2 rounded-lg 
                                                 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Supprimer ce dépôt"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Métriques Avancées */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                    {/* Taux de Paiement */}
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Taux de Paiement Ce Mois</h3>
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="relative">
                            <div className="flex items-center justify-center">
                                <div className="relative w-32 h-32">
                                    <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="none"
                                            className="text-gray-200"
                                        />
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeLinecap="round"
                                            className="text-green-600"
                                            strokeDasharray={`${(paymentRate / 100) * 351.86} 351.86`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-green-600">{paymentRate}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Contributeurs */}
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Top Contributeurs</h3>
                            <BarChart3 className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="space-y-3">
                            {memberPayments.slice(0, 5).map((member, index) => (
                                <div key={member.id} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${index === 0 ? 'bg-yellow-500' :
                                            index === 1 ? 'bg-gray-400' :
                                                index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <span className="font-medium text-gray-700">{member.name}</span>
                                    </div>
                                    <span className="font-bold text-green-600">{member.totalPaid.toFixed(2)}€</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions Rapides */}
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <PieChart className="h-6 w-6 text-indigo-600 mr-2" />
                        Actions Rapides
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            onClick={() => onNavigate('members')}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            <Users className="h-6 w-6 mx-auto mb-2" />
                            <span className="text-sm font-medium">Gérer Membres</span>
                        </button>

                        <button
                            onClick={() => onNavigate('cotisations')}
                            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            <CreditCard className="h-6 w-6 mx-auto mb-2" />
                            <span className="text-sm font-medium">Cotisations</span>
                        </button>

                        <button
                            onClick={() => onNavigate('payments')}
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            <Euro className="h-6 w-6 mx-auto mb-2" />
                            <span className="text-sm font-medium">Paiements</span>
                        </button>

                        <button
                            onClick={() => onNavigate('activities')}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            <Activity className="h-6 w-6 mx-auto mb-2" />
                            <span className="text-sm font-medium">Activités</span>
                        </button>
                    </div>
                </div>

                {/* Activités Récentes */}
                {activities.length > 0 && (
                    <div className="mt-8 bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Calendar className="h-6 w-6 text-orange-600 mr-2" />
                            Activités Récentes
                        </h3>
                        <div className="space-y-3">
                            {activities.slice(0, 5).map(activity => (
                                <div key={activity.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-700">{activity.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(activity.activity_date).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                    <span className="font-bold text-orange-600">-{activity.amount.toFixed(2)}€</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Modal de dépôt */}
                <AddCaisseDepositModal
                    isOpen={isDepositModalOpen}
                    onClose={() => setIsDepositModalOpen(false)}
                    onSuccess={handleDepositSuccess}
                />

                {/* Modal de suppression de dépôt */}
                {showDeleteModal && selectedDeposit && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                                        <AlertTriangle className="w-6 h-6" />
                                        Supprimer le Dépôt
                                    </h3>
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <p className="text-gray-600 mb-4">
                                        Êtes-vous sûr de vouloir supprimer ce dépôt de <strong>{selectedDeposit.amount.toFixed(2)}€</strong> ?
                                    </p>

                                    {/* Détails du dépôt */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                {getCategoryIcon(selectedDeposit.category)}
                                                <strong>Catégorie:</strong> {getCategoryLabel(selectedDeposit.category)}
                                            </div>
                                            <div><strong>Montant:</strong> {selectedDeposit.amount.toFixed(2)}€</div>
                                            <div><strong>Description:</strong> {selectedDeposit.description}</div>
                                            <div><strong>Date:</strong> {new Date(selectedDeposit.deposit_date).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</div>
                                        </div>
                                    </div>

                                    {/* Impact sur la caisse */}
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-orange-700 font-medium">Impact sur la caisse:</span>
                                            <span className="text-lg font-bold text-orange-600">
                                                -{selectedDeposit.amount.toFixed(2)}€
                                            </span>
                                        </div>
                                        <p className="text-orange-600 text-sm mt-2">
                                            Ce montant sera retiré du solde total de la caisse
                                        </p>
                                    </div>

                                    {/* Avertissement */}
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-red-600 text-sm">
                                            ⚠️ Cette action est irréversible et affectera les calculs de la caisse familiale.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg 
                                                 hover:bg-gray-50 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleDeleteDeposit}
                                        disabled={deleting}
                                        className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg 
                                                 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed
                                                 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {deleting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Suppression...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="w-4 h-4" />
                                                Supprimer
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Dashboard