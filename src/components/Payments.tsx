
// code qui marche mais peut flexible

// import React, { useState, useEffect } from 'react'
// import {
//     CreditCard,
//     Plus,
//     ArrowLeft,
//     Euro,
//     Users,
//     Calendar,
//     TrendingUp,
//     CheckCircle,
//     AlertCircle,
//     XCircle,
//     Edit3,
//     Trash2,
//     Save,
//     X,
//     Calculator,
//     Target,
//     DollarSign
// } from 'lucide-react'
// import { DatabaseService } from '../services/database'
// import { DbMember, DbCotisation, DbPayment } from '../lib/supabase'

// interface PaymentsProps {
//     onBack: () => void
// }

// const Payments: React.FC<PaymentsProps> = ({ onBack }) => {
//     // État principal
//     const [members, setMembers] = useState<DbMember[]>([])
//     const [cotisations, setCotisations] = useState<DbCotisation[]>([])
//     const [payments, setPayments] = useState<DbPayment[]>([])
//     const [loading, setLoading] = useState(true)

//     // États des modals
//     const [showPaymentModal, setShowPaymentModal] = useState(false)
//     const [showEditModal, setShowEditModal] = useState(false)
//     const [selectedPayment, setSelectedPayment] = useState<DbPayment | null>(null)

//     // États du formulaire de paiement
//     const [newPayment, setNewPayment] = useState({
//         memberId: '',
//         cotisationId: '',
//         amount: '',
//         customAmount: '',
//         note: ''
//     })

//     // États de l'édition
//     const [editPayment, setEditPayment] = useState({
//         amount: '',
//         status: 'paid' as 'paid' | 'partial' | 'unpaid'
//     })

//     // État de sauvegarde
//     const [saving, setSaving] = useState(false)

//     // Charger les données
//     useEffect(() => {
//         const loadData = async () => {
//             setLoading(true)
//             try {
//                 const data = await DatabaseService.loadAllData()
//                 setMembers(data.members)
//                 setCotisations(data.cotisations)
//                 setPayments(data.payments)
//             } catch (error) {
//                 console.error('Erreur chargement paiements:', error)
//             } finally {
//                 setLoading(false)
//             }
//         }

//         loadData()
//     }, [])

//     // Suggestions de montants
//     const getSuggestions = (cotisationId: string) => {
//         const cotisation = cotisations.find(c => c.id === cotisationId)
//         if (!cotisation) return []

//         const amount = cotisation.amount
//         return [
//             { label: 'Montant complet', value: amount, percentage: 100 },
//             { label: 'Moitié', value: amount / 2, percentage: 50 },
//             { label: 'Un quart', value: amount / 4, percentage: 25 },
//             { label: 'Deux tiers', value: (amount * 2) / 3, percentage: 67 }
//         ]
//     }

//     // Calculer le nouveau solde après paiement
//     const calculateNewBalance = (memberId: string, paymentAmount: number) => {
//         const member = members.find(m => m.id === memberId)
//         return member ? member.balance + paymentAmount : paymentAmount
//     }

//     // Déterminer le statut du paiement
//     const getPaymentStatus = (paidAmount: number, totalAmount: number): 'paid' | 'partial' | 'unpaid' => {
//         if (paidAmount >= totalAmount) return 'paid'
//         if (paidAmount > 0) return 'partial'
//         return 'unpaid'
//     }

//     // Ajouter un paiement
//     const handleAddPayment = async () => {
//         const memberId = newPayment.memberId
//         const cotisationId = newPayment.cotisationId
//         const amount = parseFloat(newPayment.customAmount || newPayment.amount)

//         if (!memberId || !cotisationId || !amount || amount <= 0) return

//         setSaving(true)
//         try {
//             const cotisation = cotisations.find(c => c.id === cotisationId)
//             if (!cotisation) return

//             const status = getPaymentStatus(amount, cotisation.amount)

//             const addedPayment = await DatabaseService.addPayment({
//                 memberId,
//                 cotisationId,
//                 amount,
//                 status
//             })

//             if (addedPayment) {
//                 setPayments(prev => [addedPayment, ...prev])

//                 // Mettre à jour le solde du membre
//                 const newBalance = calculateNewBalance(memberId, amount)
//                 await DatabaseService.updateMemberBalance(memberId, newBalance)
//                 setMembers(prev => prev.map(m =>
//                     m.id === memberId ? { ...m, balance: newBalance } : m
//                 ))

//                 // Reset du formulaire
//                 setNewPayment({
//                     memberId: '',
//                     cotisationId: '',
//                     amount: '',
//                     customAmount: '',
//                     note: ''
//                 })
//                 setShowPaymentModal(false)
//             }
//         } catch (error) {
//             console.error('Erreur ajout paiement:', error)
//         } finally {
//             setSaving(false)
//         }
//     }

//     // Modifier un paiement
//     const handleEditPayment = async () => {
//         if (!selectedPayment) return

//         const newAmount = parseFloat(editPayment.amount)
//         if (!newAmount || newAmount <= 0) return

//         setSaving(true)
//         try {
//             const cotisation = cotisations.find(c => c.id === selectedPayment.cotisation_id)
//             if (!cotisation) return

//             const newStatus = getPaymentStatus(newAmount, cotisation.amount)

//             const success = await DatabaseService.updatePayment(selectedPayment.id, {
//                 amount: newAmount,
//                 status: newStatus
//             })

//             if (success) {
//                 // Calculer la différence de montant
//                 const difference = newAmount - selectedPayment.amount

//                 // Mettre à jour le paiement
//                 setPayments(prev => prev.map(p =>
//                     p.id === selectedPayment.id
//                         ? { ...p, amount: newAmount, status: newStatus }
//                         : p
//                 ))

//                 // Mettre à jour le solde du membre
//                 const member = members.find(m => m.id === selectedPayment.member_id)
//                 if (member) {
//                     const newBalance = member.balance + difference
//                     await DatabaseService.updateMemberBalance(member.id, newBalance)
//                     setMembers(prev => prev.map(m =>
//                         m.id === member.id ? { ...m, balance: newBalance } : m
//                     ))
//                 }

//                 setShowEditModal(false)
//                 setSelectedPayment(null)
//             }
//         } catch (error) {
//             console.error('Erreur modification paiement:', error)
//         } finally {
//             setSaving(false)
//         }
//     }

//     // Ouvrir modal d'édition
//     const openEditModal = (payment: DbPayment) => {
//         setSelectedPayment(payment)
//         setEditPayment({
//             amount: payment.amount.toString(),
//             status: payment.status
//         })
//         setShowEditModal(true)
//     }

//     // Obtenir les infos d'un paiement
//     const getPaymentInfo = (payment: DbPayment) => {
//         const member = members.find(m => m.id === payment.member_id)
//         const cotisation = cotisations.find(c => c.id === payment.cotisation_id)
//         return { member, cotisation }
//     }

//     // Statistiques
//     const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)
//     const averagePayment = payments.length > 0 ? totalPaid / payments.length : 0
//     const paidPayments = payments.filter(p => p.status === 'paid').length
//     const partialPayments = payments.filter(p => p.status === 'partial').length
//     const unpaidPayments = payments.filter(p => p.status === 'unpaid').length

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-4">
//             <div className="max-w-7xl mx-auto">

//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-8">
//                     <div className="flex items-center">
//                         <button
//                             onClick={onBack}
//                             className="mr-4 p-2 bg-white/70 backdrop-blur-lg rounded-full border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                         >
//                             <ArrowLeft className="h-6 w-6 text-gray-600" />
//                         </button>
//                         <div>
//                             <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
//                                 💳 Gestion des Paiements
//                             </h1>
//                             <p className="text-gray-600">
//                                 {payments.length} paiement{payments.length !== 1 ? 's' : ''} enregistré{payments.length !== 1 ? 's' : ''}
//                             </p>
//                         </div>
//                     </div>

//                     <button
//                         onClick={() => setShowPaymentModal(true)}
//                         className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
//                     >
//                         <Plus className="h-5 w-5 mr-2" />
//                         Nouveau Paiement
//                     </button>
//                 </div>

//                 {/* Stats Dashboard */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     {/* Total Payé */}
//                     <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                         <div className="flex items-center">
//                             <div className="bg-green-100 p-3 rounded-full mr-4">
//                                 <Euro className="h-8 w-8 text-green-600" />
//                             </div>
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Total Payé</p>
//                                 <p className="text-3xl font-bold text-green-600">{totalPaid.toFixed(2)}€</p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Paiement Moyen */}
//                     <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                         <div className="flex items-center">
//                             <div className="bg-blue-100 p-3 rounded-full mr-4">
//                                 <TrendingUp className="h-8 w-8 text-blue-600" />
//                             </div>
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Paiement Moyen</p>
//                                 <p className="text-2xl font-bold text-blue-600">{averagePayment.toFixed(2)}€</p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Paiements Complets */}
//                     <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                         <div className="flex items-center">
//                             <div className="bg-emerald-100 p-3 rounded-full mr-4">
//                                 <CheckCircle className="h-8 w-8 text-emerald-600" />
//                             </div>
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Paiements Complets</p>
//                                 <p className="text-3xl font-bold text-emerald-600">{paidPayments}</p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Paiements Partiels */}
//                     <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                         <div className="flex items-center">
//                             <div className="bg-orange-100 p-3 rounded-full mr-4">
//                                 <AlertCircle className="h-8 w-8 text-orange-600" />
//                             </div>
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Paiements Partiels</p>
//                                 <p className="text-3xl font-bold text-orange-600">{partialPayments}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Liste des Paiements */}
//                 <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
//                     <div className="p-6 border-b border-gray-200">
//                         <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//                             <CreditCard className="h-6 w-6 text-green-600 mr-2" />
//                             Historique des Paiements
//                         </h3>
//                     </div>

//                     {payments.length > 0 ? (
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead className="bg-gray-50">
//                                     <tr>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Membre
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Cotisation
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Montant
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Statut
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Date
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                             Actions
//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="bg-white divide-y divide-gray-200">
//                                     {payments.map(payment => {
//                                         const { member, cotisation } = getPaymentInfo(payment)
//                                         return (
//                                             <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center">
//                                                         <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full mr-3">
//                                                             <Users className="h-4 w-4 text-white" />
//                                                         </div>
//                                                         <span className="font-medium text-gray-900">
//                                                             {member?.name || 'Membre inconnu'}
//                                                         </span>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <span className="text-gray-900">
//                                                         {cotisation?.name || 'Cotisation inconnue'}
//                                                     </span>
//                                                     <div className="text-sm text-gray-500">
//                                                         {cotisation?.amount?.toFixed(2)}€ attendu
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <span className="text-lg font-bold text-green-600">
//                                                         {payment.amount.toFixed(2)}€
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${payment.status === 'paid'
//                                                         ? 'bg-green-100 text-green-800'
//                                                         : payment.status === 'partial'
//                                                             ? 'bg-orange-100 text-orange-800'
//                                                             : 'bg-red-100 text-red-800'
//                                                         }`}>
//                                                         {payment.status === 'paid' && <CheckCircle className="h-3 w-3 mr-1" />}
//                                                         {payment.status === 'partial' && <AlertCircle className="h-3 w-3 mr-1" />}
//                                                         {payment.status === 'unpaid' && <XCircle className="h-3 w-3 mr-1" />}
//                                                         {payment.status === 'paid' ? 'Complet' :
//                                                             payment.status === 'partial' ? 'Partiel' : 'Non payé'}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                     <div className="flex items-center">
//                                                         <Calendar className="h-4 w-4 mr-1" />
//                                                         {new Date(payment.payment_date).toLocaleDateString('fr-FR')}
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                                     <div className="flex space-x-2">
//                                                         <button
//                                                             onClick={() => openEditModal(payment)}
//                                                             className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
//                                                         >
//                                                             <Edit3 className="h-4 w-4 text-blue-600" />
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         )
//                                     })}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         <div className="text-center py-12">
//                             <CreditCard className="h-24 w-24 text-gray-300 mx-auto mb-4" />
//                             <h3 className="text-xl font-medium text-gray-500 mb-2">Aucun paiement</h3>
//                             <p className="text-gray-400 mb-6">Commencez par enregistrer votre premier paiement</p>
//                             <button
//                                 onClick={() => setShowPaymentModal(true)}
//                                 className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg"
//                             >
//                                 Premier Paiement
//                             </button>
//                         </div>
//                     )}
//                 </div>

//             </div>

//             {/* Modal Nouveau Paiement */}
//             {showPaymentModal && (
//                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
//                         <div className="flex items-center justify-between mb-6">
//                             <h3 className="text-xl font-bold text-gray-800">Nouveau Paiement</h3>
//                             <button
//                                 onClick={() => setShowPaymentModal(false)}
//                                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <X className="h-6 w-6 text-gray-500" />
//                             </button>
//                         </div>

//                         <div className="space-y-6">
//                             {/* Sélection Membre */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Membre *
//                                 </label>
//                                 <select
//                                     value={newPayment.memberId}
//                                     onChange={(e) => setNewPayment(prev => ({ ...prev, memberId: e.target.value }))}
//                                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                                 >
//                                     <option value="">Sélectionner un membre</option>
//                                     {members.map(member => (
//                                         <option key={member.id} value={member.id}>
//                                             {member.name} (Solde: {member.balance.toFixed(2)}€)
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* Sélection Cotisation */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Cotisation *
//                                 </label>
//                                 <select
//                                     value={newPayment.cotisationId}
//                                     onChange={(e) => setNewPayment(prev => ({
//                                         ...prev,
//                                         cotisationId: e.target.value,
//                                         amount: '', // Reset amount when cotisation changes
//                                         customAmount: ''
//                                     }))}
//                                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                                 >
//                                     <option value="">Sélectionner une cotisation</option>
//                                     {cotisations.map(cotisation => (
//                                         <option key={cotisation.id} value={cotisation.id}>
//                                             {cotisation.name} - {cotisation.amount.toFixed(2)}€ ({cotisation.month})
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* Suggestions de Montants */}
//                             {newPayment.cotisationId && (
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                                         <Calculator className="h-4 w-4 inline mr-1" />
//                                         Montant suggéré
//                                     </label>
//                                     <div className="grid grid-cols-2 gap-3">
//                                         {getSuggestions(newPayment.cotisationId).map((suggestion, index) => (
//                                             <button
//                                                 key={index}
//                                                 onClick={() => setNewPayment(prev => ({
//                                                     ...prev,
//                                                     amount: suggestion.value.toString(),
//                                                     customAmount: ''
//                                                 }))}
//                                                 className={`p-3 border-2 rounded-lg transition-all duration-300 hover:scale-105 ${newPayment.amount === suggestion.value.toString()
//                                                     ? 'border-green-500 bg-green-50'
//                                                     : 'border-gray-200 hover:border-green-300'
//                                                     }`}
//                                             >
//                                                 <div className="text-center">
//                                                     <div className="font-medium text-gray-800">{suggestion.label}</div>
//                                                     <div className="text-lg font-bold text-green-600">
//                                                         {suggestion.value.toFixed(2)}€
//                                                     </div>
//                                                     <div className="text-xs text-gray-500">
//                                                         {suggestion.percentage}%
//                                                     </div>
//                                                 </div>
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Montant Personnalisé */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <Target className="h-4 w-4 inline mr-1" />
//                                     Ou montant personnalisé
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type="number"
//                                         step="0.01"
//                                         min="0"
//                                         value={newPayment.customAmount}
//                                         onChange={(e) => setNewPayment(prev => ({
//                                             ...prev,
//                                             customAmount: e.target.value,
//                                             amount: '' // Reset suggested amount
//                                         }))}
//                                         className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                                         placeholder="Entrer un montant personnalisé"
//                                     />
//                                     <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                                         <Euro className="h-5 w-5 text-gray-400" />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Aperçu du Nouveau Solde */}
//                             {(newPayment.amount || newPayment.customAmount) && newPayment.memberId && (
//                                 <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                                     <div className="flex items-center justify-between">
//                                         <span className="text-green-700 font-medium">Nouveau solde du membre:</span>
//                                         <span className="text-xl font-bold text-green-600">
//                                             {calculateNewBalance(
//                                                 newPayment.memberId,
//                                                 parseFloat(newPayment.customAmount || newPayment.amount || '0')
//                                             ).toFixed(2)}€
//                                         </span>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Note Optionnelle */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Note (optionnelle)
//                                 </label>
//                                 <textarea
//                                     value={newPayment.note}
//                                     onChange={(e) => setNewPayment(prev => ({ ...prev, note: e.target.value }))}
//                                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                                     placeholder="Ajouter une note..."
//                                     rows={3}
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex justify-end mt-6 space-x-3">
//                             <button
//                                 onClick={() => setShowPaymentModal(false)}
//                                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 Annuler
//                             </button>
//                             <button
//                                 onClick={handleAddPayment}
//                                 disabled={
//                                     !newPayment.memberId ||
//                                     !newPayment.cotisationId ||
//                                     (!newPayment.amount && !newPayment.customAmount) ||
//                                     saving
//                                 }
//                                 className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                             >
//                                 {saving ? (
//                                     <>
//                                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                                         Enregistrement...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Save className="h-4 w-4 mr-2" />
//                                         Enregistrer le Paiement
//                                     </>
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Modal Modifier Paiement */}
//             {showEditModal && selectedPayment && (
//                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
//                         <div className="flex items-center justify-between mb-6">
//                             <h3 className="text-xl font-bold text-gray-800">Modifier le Paiement</h3>
//                             <button
//                                 onClick={() => setShowEditModal(false)}
//                                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <X className="h-6 w-6 text-gray-500" />
//                             </button>
//                         </div>

//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Nouveau montant *
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type="number"
//                                         step="0.01"
//                                         min="0"
//                                         value={editPayment.amount}
//                                         onChange={(e) => setEditPayment(prev => ({ ...prev, amount: e.target.value }))}
//                                         className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                                     />
//                                     <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                                         <Euro className="h-5 w-5 text-gray-400" />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                                 <p className="text-blue-700 text-sm">
//                                     💡 Le statut sera automatiquement mis à jour selon le montant payé par rapport au montant total de la cotisation.
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="flex justify-end mt-6 space-x-3">
//                             <button
//                                 onClick={() => setShowEditModal(false)}
//                                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 Annuler
//                             </button>
//                             <button
//                                 onClick={handleEditPayment}
//                                 disabled={!editPayment.amount || parseFloat(editPayment.amount) <= 0 || saving}
//                                 className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                             >
//                                 {saving ? (
//                                     <>
//                                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                                         Sauvegarde...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Save className="h-4 w-4 mr-2" />
//                                         Sauvegarder
//                                     </>
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//         </div>
//     )
// }

// export default Payments

















// code optimisé
import React, { useState, useEffect } from 'react'
import {
    CreditCard,
    Plus,
    ArrowLeft,
    Euro,
    Users,
    Calendar,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    XCircle,
    Edit3,
    Trash2,
    Save,
    X,
    Calculator,
    Target,
    DollarSign
} from 'lucide-react'
// import { DatabaseService } from '../lib/database'
// import { DbMember, DbCotisation, DbPayment } from '../lib/database'
import { DatabaseService, authService, DbMember, DbPayment, DbCotisation } from '../lib/supabaseService'
interface PaymentsProps {
    onBack: () => void
}

interface PaymentSuggestion {
    label: string
    value: number
    percentage: number
    disabled?: boolean
}

const Payments: React.FC<PaymentsProps> = ({ onBack }) => {
    // État principal
    const [members, setMembers] = useState<DbMember[]>([])
    const [cotisations, setCotisations] = useState<DbCotisation[]>([])
    const [payments, setPayments] = useState<DbPayment[]>([])
    const [loading, setLoading] = useState(true)

    // États des modals
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState<DbPayment | null>(null)

    // États du formulaire de paiement
    const [newPayment, setNewPayment] = useState({
        memberId: '',
        cotisationId: '',
        amount: '',
        customAmount: '',
        note: ''
    })

    // États de l'édition
    const [editPayment, setEditPayment] = useState({
        amount: '',
        status: 'paid' as 'paid' | 'partial' | 'unpaid'
    })

    // État de sauvegarde
    const [saving, setSaving] = useState(false)

    // Charger les données
    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                const data = await DatabaseService.loadAllData()
                setMembers(data.members)
                setCotisations(data.cotisations)
                setPayments(data.payments)
            } catch (error) {
                console.error('Erreur chargement paiements:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    // Calculer les paiements déjà effectués pour une combinaison membre/cotisation
    const getExistingPayments = (memberId: string, cotisationId: string) => {
        const existingPayments = payments.filter(p =>
            p.member_id === memberId && p.cotisation_id === cotisationId
        )
        const totalPaid = existingPayments.reduce((sum, p) => sum + p.amount, 0)
        const paymentCount = existingPayments.length

        return { totalPaid, paymentCount, payments: existingPayments }
    }

    // Calculer le montant restant à payer
    const getRemainingAmount = (memberId: string, cotisationId: string) => {
        const cotisation = cotisations.find(c => c.id === cotisationId)
        if (!cotisation) return 0

        const { totalPaid } = getExistingPayments(memberId, cotisationId)
        return Math.max(0, cotisation.amount - totalPaid)
    }

    // Suggestions de montants adaptées au montant restant
    const getAdaptedSuggestions = (cotisationId: string, memberId: string): PaymentSuggestion[] => {
        const cotisation = cotisations.find(c => c.id === cotisationId)
        if (!cotisation) return []

        const remainingAmount = getRemainingAmount(memberId, cotisationId)
        const { totalPaid } = getExistingPayments(memberId, cotisationId)

        if (remainingAmount <= 0) {
            return [{ label: 'Déjà payé intégralement', value: 0, percentage: 100, disabled: true }]
        }

        const suggestions: PaymentSuggestion[] = [
            { label: 'Montant restant complet', value: remainingAmount, percentage: 100, disabled: false },
            { label: 'Moitié du restant', value: remainingAmount / 2, percentage: 50, disabled: false },
            { label: 'Un quart du restant', value: remainingAmount / 4, percentage: 25, disabled: false }
        ]

        // Ajouter suggestion pour compléter à des paliers
        if (remainingAmount > 10) {
            suggestions.push({ label: '10€', value: 10, percentage: Math.round((10 / remainingAmount) * 100), disabled: false })
        }
        if (remainingAmount > 20) {
            suggestions.push({ label: '20€', value: 20, percentage: Math.round((20 / remainingAmount) * 100), disabled: false })
        }

        return suggestions.filter(s => s.value > 0)
    }

    // Calculer le nouveau solde après paiement
    const calculateNewBalance = (memberId: string, paymentAmount: number) => {
        const member = members.find(m => m.id === memberId)
        return member ? member.balance + paymentAmount : paymentAmount
    }

    // Déterminer le statut du paiement
    const getPaymentStatus = (paidAmount: number, totalAmount: number): 'paid' | 'partial' | 'unpaid' => {
        if (paidAmount >= totalAmount) return 'paid'
        if (paidAmount > 0) return 'partial'
        return 'unpaid'
    }

    // Ajouter un paiement
    const handleAddPayment = async () => {
        const memberId = newPayment.memberId
        const cotisationId = newPayment.cotisationId
        const amount = parseFloat(newPayment.customAmount || newPayment.amount)

        if (!memberId || !cotisationId || !amount || amount <= 0) return

        setSaving(true)
        try {
            const cotisation = cotisations.find(c => c.id === cotisationId)
            if (!cotisation) return

            const status = getPaymentStatus(amount, cotisation.amount)

            const addedPayment = await DatabaseService.addPayment({
                memberId,
                cotisationId,
                amount,
                status
            })

            if (addedPayment) {
                setPayments(prev => [addedPayment, ...prev])

                // Mettre à jour le solde du membre
                const newBalance = calculateNewBalance(memberId, amount)
                await DatabaseService.updateMemberBalance(memberId, newBalance)
                setMembers(prev => prev.map(m =>
                    m.id === memberId ? { ...m, balance: newBalance } : m
                ))

                // Reset du formulaire
                setNewPayment({
                    memberId: '',
                    cotisationId: '',
                    amount: '',
                    customAmount: '',
                    note: ''
                })
                setShowPaymentModal(false)
            }
        } catch (error) {
            console.error('Erreur ajout paiement:', error)
        } finally {
            setSaving(false)
        }
    }

    // Modifier un paiement
    const handleEditPayment = async () => {
        if (!selectedPayment) return

        const newAmount = parseFloat(editPayment.amount)
        if (!newAmount || newAmount <= 0) return

        setSaving(true)
        try {
            const cotisation = cotisations.find(c => c.id === selectedPayment.cotisation_id)
            if (!cotisation) return

            const newStatus = getPaymentStatus(newAmount, cotisation.amount)

            const success = await DatabaseService.updatePayment(selectedPayment.id, {
                amount: newAmount,
                status: newStatus
            })

            if (success) {
                // Calculer la différence de montant
                const difference = newAmount - selectedPayment.amount

                // Mettre à jour le paiement
                setPayments(prev => prev.map(p =>
                    p.id === selectedPayment.id
                        ? { ...p, amount: newAmount, status: newStatus }
                        : p
                ))

                // Mettre à jour le solde du membre
                const member = members.find(m => m.id === selectedPayment.member_id)
                if (member) {
                    const newBalance = member.balance + difference
                    await DatabaseService.updateMemberBalance(member.id, newBalance)
                    setMembers(prev => prev.map(m =>
                        m.id === member.id ? { ...m, balance: newBalance } : m
                    ))
                }

                setShowEditModal(false)
                setSelectedPayment(null)
            }
        } catch (error) {
            console.error('Erreur modification paiement:', error)
        } finally {
            setSaving(false)
        }
    }

    // Ouvrir modal d'édition
    const openEditModal = (payment: DbPayment) => {
        setSelectedPayment(payment)
        setEditPayment({
            amount: payment.amount.toString(),
            status: payment.status
        })
        setShowEditModal(true)
    }

    // Obtenir les infos d'un paiement
    const getPaymentInfo = (payment: DbPayment) => {
        const member = members.find(m => m.id === payment.member_id)
        const cotisation = cotisations.find(c => c.id === payment.cotisation_id)
        return { member, cotisation }
    }

    // Statistiques
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)
    const averagePayment = payments.length > 0 ? totalPaid / payments.length : 0
    const paidPayments = payments.filter(p => p.status === 'paid').length
    const partialPayments = payments.filter(p => p.status === 'partial').length
    const unpaidPayments = payments.filter(p => p.status === 'unpaid').length

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-4">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <button
                            onClick={onBack}
                            className="mr-4 p-2 bg-white/70 backdrop-blur-lg rounded-full border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <ArrowLeft className="h-6 w-6 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                💳 Gestion des Paiements
                            </h1>
                            <p className="text-gray-600">
                                {payments.length} paiement{payments.length !== 1 ? 's' : ''} enregistré{payments.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowPaymentModal(true)}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Nouveau Paiement
                    </button>
                </div>

                {/* Stats Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Payé */}
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-full mr-4">
                                <Euro className="h-8 w-8 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Payé</p>
                                <p className="text-3xl font-bold text-green-600">{totalPaid.toFixed(2)}€</p>
                            </div>
                        </div>
                    </div>

                    {/* Paiement Moyen */}
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                <TrendingUp className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Paiement Moyen</p>
                                <p className="text-2xl font-bold text-blue-600">{averagePayment.toFixed(2)}€</p>
                            </div>
                        </div>
                    </div>

                    {/* Paiements Complets */}
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center">
                            <div className="bg-emerald-100 p-3 rounded-full mr-4">
                                <CheckCircle className="h-8 w-8 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Paiements Complets</p>
                                <p className="text-3xl font-bold text-emerald-600">{paidPayments}</p>
                            </div>
                        </div>
                    </div>

                    {/* Paiements Partiels */}
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center">
                            <div className="bg-orange-100 p-3 rounded-full mr-4">
                                <AlertCircle className="h-8 w-8 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Paiements Partiels</p>
                                <p className="text-3xl font-bold text-orange-600">{partialPayments}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Liste des Paiements */}
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <CreditCard className="h-6 w-6 text-green-600 mr-2" />
                            Historique des Paiements
                        </h3>
                    </div>

                    {payments.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Membre
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cotisation
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Montant
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Statut
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {payments.map(payment => {
                                        const { member, cotisation } = getPaymentInfo(payment)
                                        return (
                                            <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full mr-3">
                                                            <Users className="h-4 w-4 text-white" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-900">
                                                                {member?.name || 'Membre inconnu'}
                                                            </span>
                                                            {(() => {
                                                                const { totalPaid, paymentCount } = getExistingPayments(payment.member_id, payment.cotisation_id)
                                                                const remainingAmount = getRemainingAmount(payment.member_id, payment.cotisation_id)
                                                                return (
                                                                    <div className="text-xs text-gray-500">
                                                                        {paymentCount} paiement{paymentCount !== 1 ? 's' : ''} •
                                                                        Reste: {remainingAmount.toFixed(2)}€
                                                                    </div>
                                                                )
                                                            })()}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <span className="text-gray-900">
                                                            {cotisation?.name || 'Cotisation inconnue'}
                                                        </span>
                                                        <div className="text-sm text-gray-500">
                                                            {cotisation?.amount?.toFixed(2)}€ attendu
                                                        </div>
                                                        {(() => {
                                                            const { totalPaid } = getExistingPayments(payment.member_id, payment.cotisation_id)
                                                            const progressPercentage = cotisation ? Math.round((totalPaid / cotisation.amount) * 100) : 0
                                                            return (
                                                                <div className="mt-1">
                                                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                                        <div
                                                                            className="bg-gradient-to-r from-green-500 to-blue-500 h-1.5 rounded-full"
                                                                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <div className="text-xs text-gray-400 mt-1">
                                                                        {totalPaid.toFixed(2)}€ collectés ({progressPercentage}%)
                                                                    </div>
                                                                </div>
                                                            )
                                                        })()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-lg font-bold text-green-600">
                                                        {payment.amount.toFixed(2)}€
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${payment.status === 'paid'
                                                        ? 'bg-green-100 text-green-800'
                                                        : payment.status === 'partial'
                                                            ? 'bg-orange-100 text-orange-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {payment.status === 'paid' && <CheckCircle className="h-3 w-3 mr-1" />}
                                                        {payment.status === 'partial' && <AlertCircle className="h-3 w-3 mr-1" />}
                                                        {payment.status === 'unpaid' && <XCircle className="h-3 w-3 mr-1" />}
                                                        {payment.status === 'paid' ? 'Complet' :
                                                            payment.status === 'partial' ? 'Partiel' : 'Non payé'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                        {new Date(payment.payment_date).toLocaleDateString('fr-FR')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => openEditModal(payment)}
                                                            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                                                        >
                                                            <Edit3 className="h-4 w-4 text-blue-600" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <CreditCard className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-500 mb-2">Aucun paiement</h3>
                            <p className="text-gray-400 mb-6">Commencez par enregistrer votre premier paiement</p>
                            <button
                                onClick={() => setShowPaymentModal(true)}
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg"
                            >
                                Premier Paiement
                            </button>
                        </div>
                    )}
                </div>

            </div>

            {/* Modal Nouveau Paiement */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Nouveau Paiement</h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Sélection Membre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Membre *
                                </label>
                                <select
                                    value={newPayment.memberId}
                                    onChange={(e) => setNewPayment(prev => ({ ...prev, memberId: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Sélectionner un membre</option>
                                    {members.map(member => (
                                        <option key={member.id} value={member.id}>
                                            {member.name} (Solde: {member.balance.toFixed(2)}€)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sélection Cotisation */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cotisation *
                                </label>
                                <select
                                    value={newPayment.cotisationId}
                                    onChange={(e) => setNewPayment(prev => ({
                                        ...prev,
                                        cotisationId: e.target.value,
                                        amount: '', // Reset amount when cotisation changes
                                        customAmount: ''
                                    }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Sélectionner une cotisation</option>
                                    {cotisations.map(cotisation => (
                                        <option key={cotisation.id} value={cotisation.id}>
                                            {cotisation.name} - {cotisation.amount.toFixed(2)}€ ({cotisation.month})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Affichage du statut de paiement existant */}
                            {newPayment.memberId && newPayment.cotisationId && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    {(() => {
                                        const { totalPaid, paymentCount } = getExistingPayments(newPayment.memberId, newPayment.cotisationId)
                                        const remainingAmount = getRemainingAmount(newPayment.memberId, newPayment.cotisationId)
                                        const cotisation = cotisations.find(c => c.id === newPayment.cotisationId)
                                        const member = members.find(m => m.id === newPayment.memberId)

                                        if (!cotisation || !member) return null

                                        const progressPercentage = Math.round((totalPaid / cotisation.amount) * 100)

                                        return (
                                            <div>
                                                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                                                    📊 État du paiement - {member.name}
                                                </h4>

                                                {/* Barre de progression */}
                                                <div className="mb-3">
                                                    <div className="flex justify-between text-sm text-blue-700 mb-1">
                                                        <span>Progression du paiement</span>
                                                        <span>{progressPercentage}%</span>
                                                    </div>
                                                    <div className="w-full bg-blue-200 rounded-full h-3">
                                                        <div
                                                            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                                                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Détails financiers */}
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-blue-600">💰 Montant total:</span>
                                                        <div className="font-bold text-blue-800">{cotisation.amount.toFixed(2)}€</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-green-600">✅ Déjà payé:</span>
                                                        <div className="font-bold text-green-700">{totalPaid.toFixed(2)}€</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-orange-600">⏳ Restant:</span>
                                                        <div className="font-bold text-orange-700">{remainingAmount.toFixed(2)}€</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-purple-600">📝 Paiements:</span>
                                                        <div className="font-bold text-purple-700">{paymentCount} tranche{paymentCount !== 1 ? 's' : ''}</div>
                                                    </div>
                                                </div>

                                                {remainingAmount <= 0 && (
                                                    <div className="mt-3 bg-green-100 border border-green-300 rounded-lg p-2 text-center">
                                                        <span className="text-green-700 font-semibold">🎉 Cotisation entièrement payée !</span>
                                                    </div>
                                                )}

                                                {remainingAmount > 0 && (
                                                    <div className="mt-3 bg-orange-100 border border-orange-300 rounded-lg p-2 text-center">
                                                        <span className="text-orange-700 font-semibold">
                                                            💡 Encore {remainingAmount.toFixed(2)}€ à collecter
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })()}
                                </div>
                            )}

                            {/* Suggestions de Montants Adaptées */}
                            {newPayment.cotisationId && newPayment.memberId && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        <Calculator className="h-4 w-4 inline mr-1" />
                                        Suggestions de paiement
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {getAdaptedSuggestions(newPayment.cotisationId, newPayment.memberId).map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={() => !suggestion.disabled && setNewPayment(prev => ({
                                                    ...prev,
                                                    amount: suggestion.value.toString(),
                                                    customAmount: ''
                                                }))}
                                                disabled={suggestion.disabled}
                                                className={`p-3 border-2 rounded-lg transition-all duration-300 hover:scale-105 ${suggestion.disabled
                                                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
                                                    : newPayment.amount === suggestion.value.toString()
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200 hover:border-green-300'
                                                    }`}
                                            >
                                                <div className="text-center">
                                                    <div className="font-medium text-gray-800">{suggestion.label}</div>
                                                    <div className={`text-lg font-bold ${suggestion.disabled ? 'text-gray-500' : 'text-green-600'
                                                        }`}>
                                                        {suggestion.value.toFixed(2)}€
                                                    </div>
                                                    {!suggestion.disabled && (
                                                        <div className="text-xs text-gray-500">
                                                            {suggestion.percentage}% du restant
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Montant Personnalisé */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Target className="h-4 w-4 inline mr-1" />
                                    Ou montant personnalisé
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={newPayment.customAmount}
                                        onChange={(e) => setNewPayment(prev => ({
                                            ...prev,
                                            customAmount: e.target.value,
                                            amount: '' // Reset suggested amount
                                        }))}
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Entrer un montant personnalisé"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <Euro className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Aperçu du Nouveau Solde */}
                            {(newPayment.amount || newPayment.customAmount) && newPayment.memberId && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-green-700 font-medium">Nouveau solde du membre:</span>
                                        <span className="text-xl font-bold text-green-600">
                                            {calculateNewBalance(
                                                newPayment.memberId,
                                                parseFloat(newPayment.customAmount || newPayment.amount || '0')
                                            ).toFixed(2)}€
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Note Optionnelle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Note (optionnelle)
                                </label>
                                <textarea
                                    value={newPayment.note}
                                    onChange={(e) => setNewPayment(prev => ({ ...prev, note: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Ajouter une note..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleAddPayment}
                                disabled={
                                    !newPayment.memberId ||
                                    !newPayment.cotisationId ||
                                    (!newPayment.amount && !newPayment.customAmount) ||
                                    saving
                                }
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Enregistrer le Paiement
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Modifier Paiement */}
            {showEditModal && selectedPayment && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Modifier le Paiement</h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nouveau montant *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editPayment.amount}
                                        onChange={(e) => setEditPayment(prev => ({ ...prev, amount: e.target.value }))}
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <Euro className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-blue-700 text-sm">
                                    💡 Le statut sera automatiquement mis à jour selon le montant payé par rapport au montant total de la cotisation.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleEditPayment}
                                disabled={!editPayment.amount || parseFloat(editPayment.amount) <= 0 || saving}
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Sauvegarde...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Sauvegarder
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Payments