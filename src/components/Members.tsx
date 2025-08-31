// import React, { useState, useEffect } from 'react'
// import {
//     Users,
//     Plus,
//     Edit3,
//     Trash2,
//     Phone,
//     Mail,
//     Calendar,
//     Euro,
//     ArrowLeft,
//     Save,
//     X,
//     UserPlus,
//     AlertTriangle,
//     User
// } from 'lucide-react'
// import { DatabaseService } from '../lib/database'
// import { DbMember, DbPayment } from '../lib/database'
// import ImageUpload from './ImageUpload'

// interface MembersProps {
//     onBack: () => void
// }

// const Members: React.FC<MembersProps> = ({ onBack }) => {
//     // État principal
//     const [members, setMembers] = useState<DbMember[]>([])
//     const [payments, setPayments] = useState<DbPayment[]>([])
//     const [loading, setLoading] = useState(true)

//     // États des modals
//     const [showAddModal, setShowAddModal] = useState(false)
//     const [showEditModal, setShowEditModal] = useState(false)
//     const [showDeleteModal, setShowDeleteModal] = useState(false)
//     const [selectedMember, setSelectedMember] = useState<DbMember | null>(null)

//     // États des formulaires avec photos
//     const [newMember, setNewMember] = useState({
//         name: '',
//         phone: '',
//         email: '',
//         bio: '',
//         avatar_url: null as string | null
//     })
//     const [editMember, setEditMember] = useState({
//         name: '',
//         phone: '',
//         email: '',
//         bio: '',
//         avatar_url: null as string | null
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
//                 setPayments(data.payments)
//             } catch (error) {
//                 console.error('Erreur chargement membres:', error)
//             } finally {
//                 setLoading(false)
//             }
//         }

//         loadData()
//     }, [])

//     // Calculer les statistiques par membre
//     const getMemberStats = (memberId: string) => {
//         const memberPayments = payments.filter(p => p.member_id === memberId)
//         const totalPaid = memberPayments.reduce((sum, p) => sum + p.amount, 0)
//         const paymentCount = memberPayments.length
//         const lastPayment = memberPayments.length > 0
//             ? new Date(Math.max(...memberPayments.map(p => new Date(p.payment_date).getTime())))
//             : null

//         return { totalPaid, paymentCount, lastPayment }
//     }

//     // Ajouter un membre
//     const handleAddMember = async () => {
//         if (!newMember.name.trim()) return

//         setSaving(true)
//         try {
//             const addedMember = await DatabaseService.addMember({
//                 name: newMember.name.trim(),
//                 phone: newMember.phone.trim() || undefined,
//                 email: newMember.email.trim() || undefined,
//                 bio: newMember.bio.trim() || undefined,
//                 avatar_url: newMember.avatar_url || undefined
//             })

//             if (addedMember) {
//                 setMembers(prev => [addedMember, ...prev])
//                 resetNewMemberForm()
//                 setShowAddModal(false)
//             }
//         } catch (error) {
//             console.error('Erreur ajout membre:', error)
//         } finally {
//             setSaving(false)
//         }
//     }

//     // Modifier un membre
//     const handleEditMember = async () => {
//         if (!selectedMember || !editMember.name.trim()) return

//         setSaving(true)
//         try {
//             const success = await DatabaseService.updateMember(selectedMember.id, {
//                 name: editMember.name.trim(),
//                 phone: editMember.phone.trim() || null,
//                 email: editMember.email.trim() || null,
//                 bio: editMember.bio.trim() || null,
//                 avatar_url: editMember.avatar_url
//             })

//             if (success) {
//                 setMembers(prev => prev.map(m =>
//                     m.id === selectedMember.id
//                         ? {
//                             ...m,
//                             name: editMember.name.trim(),
//                             phone: editMember.phone.trim() || null,
//                             email: editMember.email.trim() || null,
//                             bio: editMember.bio.trim() || null,
//                             avatar_url: editMember.avatar_url
//                         }
//                         : m
//                 ))
//             }

//             setShowEditModal(false)
//             setSelectedMember(null)
//         } catch (error) {
//             console.error('Erreur modification membre:', error)
//         } finally {
//             setSaving(false)
//         }
//     }

//     // Supprimer un membre
//     const handleDeleteMember = async () => {
//         if (!selectedMember) return

//         setSaving(true)
//         try {
//             const success = await DatabaseService.deleteMember(selectedMember.id)

//             if (success) {
//                 setMembers(prev => prev.filter(m => m.id !== selectedMember.id))
//                 setPayments(prev => prev.filter(p => p.member_id !== selectedMember.id))
//             }

//             setShowDeleteModal(false)
//             setSelectedMember(null)
//         } catch (error) {
//             console.error('Erreur suppression membre:', error)
//         } finally {
//             setSaving(false)
//         }
//     }

//     // Ouvrir modal d'édition
//     const openEditModal = (member: DbMember) => {
//         setSelectedMember(member)
//         setEditMember({
//             name: member.name,
//             phone: member.phone || '',
//             email: member.email || '',
//             bio: member.bio || '',
//             avatar_url: member.avatar_url
//         })
//         setShowEditModal(true)
//     }

//     // Ouvrir modal de suppression
//     const openDeleteModal = (member: DbMember) => {
//         setSelectedMember(member)
//         setShowDeleteModal(true)
//     }

//     // Reset formulaire
//     const resetNewMemberForm = () => {
//         setNewMember({
//             name: '',
//             phone: '',
//             email: '',
//             bio: '',
//             avatar_url: null
//         })
//     }

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-4">
//             <div className="max-w-6xl mx-auto">

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
//                             <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                                 👥 Gestion des Membres
//                             </h1>
//                             <p className="text-gray-600">
//                                 {members.length} membre{members.length !== 1 ? 's' : ''} dans la famille
//                             </p>
//                         </div>
//                     </div>

//                     <button
//                         onClick={() => setShowAddModal(true)}
//                         className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
//                     >
//                         <Plus className="h-5 w-5 mr-2" />
//                         Ajouter un Membre
//                     </button>
//                 </div>

//                 {/* Stats Rapides */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                     <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                         <div className="flex items-center">
//                             <div className="bg-blue-100 p-3 rounded-full mr-4">
//                                 <Users className="h-8 w-8 text-blue-600" />
//                             </div>
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Total Membres</p>
//                                 <p className="text-3xl font-bold text-blue-600">{members.length}</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                         <div className="flex items-center">
//                             <div className="bg-green-100 p-3 rounded-full mr-4">
//                                 <Euro className="h-8 w-8 text-green-600" />
//                             </div>
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Total Contributions</p>
//                                 <p className="text-3xl font-bold text-green-600">
//                                     {payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}€
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                         <div className="flex items-center">
//                             <div className="bg-purple-100 p-3 rounded-full mr-4">
//                                 <UserPlus className="h-8 w-8 text-purple-600" />
//                             </div>
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Membre Récent</p>
//                                 <p className="text-lg font-bold text-purple-600">
//                                     {members.length > 0 ? members[0].name : 'Aucun'}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Liste des Membres */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {members.map(member => {
//                         const stats = getMemberStats(member.id)
//                         return (
//                             <div
//                                 key={member.id}
//                                 className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
//                             >
//                                 {/* Header avec photo */}
//                                 <div className="flex items-center justify-between mb-4">
//                                     <div className="flex items-center">
//                                         <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg mr-4">
//                                             {member.avatar_url ? (
//                                                 <img
//                                                     src={member.avatar_url}
//                                                     alt={member.name}
//                                                     className="w-full h-full object-cover"
//                                                 />
//                                             ) : (
//                                                 <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
//                                                     <User className="w-8 h-8 text-white" />
//                                                 </div>
//                                             )}
//                                         </div>

//                                         <div className={`px-2 py-1 rounded-full text-xs font-medium ${member.status === 'active'
//                                                 ? 'bg-green-100 text-green-800'
//                                                 : 'bg-gray-100 text-gray-600'
//                                             }`}>
//                                             {member.status === 'active' ? 'Actif' : 'Inactif'}
//                                         </div>
//                                     </div>

//                                     <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                                         <button
//                                             onClick={() => openEditModal(member)}
//                                             className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg mr-2 transition-colors"
//                                         >
//                                             <Edit3 className="h-4 w-4 text-blue-600" />
//                                         </button>
//                                         <button
//                                             onClick={() => openDeleteModal(member)}
//                                             className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
//                                         >
//                                             <Trash2 className="h-4 w-4 text-red-600" />
//                                         </button>
//                                     </div>
//                                 </div>

//                                 {/* Informations */}
//                                 <div className="mb-4">
//                                     <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>

//                                     {member.bio && (
//                                         <p className="text-sm text-gray-600 mb-3 italic">"{member.bio}"</p>
//                                     )}

//                                     {member.phone && (
//                                         <div className="flex items-center text-gray-600 mb-1">
//                                             <Phone className="h-4 w-4 mr-2" />
//                                             <span className="text-sm">{member.phone}</span>
//                                         </div>
//                                     )}

//                                     {member.email && (
//                                         <div className="flex items-center text-gray-600 mb-1">
//                                             <Mail className="h-4 w-4 mr-2" />
//                                             <span className="text-sm">{member.email}</span>
//                                         </div>
//                                     )}

//                                     <div className="flex items-center text-gray-600">
//                                         <Calendar className="h-4 w-4 mr-2" />
//                                         <span className="text-sm">
//                                             Rejoint le {new Date(member.join_date).toLocaleDateString('fr-FR')}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 {/* Stats */}
//                                 <div className="border-t border-gray-200 pt-4">
//                                     <div className="flex justify-between items-center mb-2">
//                                         <span className="text-sm text-gray-600">Total payé:</span>
//                                         <span className="font-bold text-green-600">{stats.totalPaid.toFixed(2)}€</span>
//                                     </div>

//                                     <div className="flex justify-between items-center mb-2">
//                                         <span className="text-sm text-gray-600">Paiements:</span>
//                                         <span className="font-medium text-blue-600">{stats.paymentCount}</span>
//                                     </div>

//                                     <div className="flex justify-between items-center">
//                                         <span className="text-sm text-gray-600">Solde:</span>
//                                         <span className={`font-bold ${member.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                                             {member.balance.toFixed(2)}€
//                                         </span>
//                                     </div>

//                                     {stats.lastPayment && (
//                                         <div className="mt-2 text-xs text-gray-500">
//                                             Dernier: {stats.lastPayment.toLocaleDateString('fr-FR')}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         )
//                     })}
//                 </div>

//                 {/* Message si aucun membre */}
//                 {members.length === 0 && (
//                     <div className="text-center py-12">
//                         <Users className="h-24 w-24 text-gray-300 mx-auto mb-4" />
//                         <h3 className="text-xl font-medium text-gray-500 mb-2">Aucun membre</h3>
//                         <p className="text-gray-400 mb-6">Commencez par ajouter votre premier membre</p>
//                         <button
//                             onClick={() => setShowAddModal(true)}
//                             className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
//                         >
//                             Ajouter le Premier Membre
//                         </button>
//                     </div>
//                 )}

//             </div>

//             {/* Modal Ajouter */}
//             {showAddModal && (
//                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
//                         <div className="flex items-center justify-between mb-6">
//                             <h3 className="text-xl font-bold text-gray-800">Ajouter un Membre</h3>
//                             <button
//                                 onClick={() => {
//                                     setShowAddModal(false)
//                                     resetNewMemberForm()
//                                 }}
//                                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <X className="h-6 w-6 text-gray-500" />
//                             </button>
//                         </div>

//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Photo de profil
//                                 </label>
//                                 <ImageUpload
//                                     onImageChange={(base64) => setNewMember(prev => ({ ...prev, avatar_url: base64 }))}
//                                     defaultName={newMember.name}
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Nom complet *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={newMember.name}
//                                     onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
//                                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     placeholder="Ex: Jean Dupont"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Bio / Description
//                                 </label>
//                                 <textarea
//                                     value={newMember.bio}
//                                     onChange={(e) => setNewMember(prev => ({ ...prev, bio: e.target.value }))}
//                                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     placeholder="Ex: Papa de famille, responsable des finances..."
//                                     rows={2}
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Téléphone
//                                 </label>
//                                 <input
//                                     type="tel"
//                                     value={newMember.phone}
//                                     onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
//                                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     placeholder="Ex: +33 6 12 34 56 78"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Email
//                                 </label>
//                                 <input
//                                     type="email"
//                                     value={newMember.email}
//                                     onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
//                                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     placeholder="Ex: jean.dupont@email.com"
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex justify-end mt-6 space-x-3">
//                             <button
//                                 onClick={() => {
//                                     setShowAddModal(false)
//                                     resetNewMemberForm()
//                                 }}
//                                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 Annuler
//                             </button>
//                             <button
//                                 onClick={handleAddMember}
//                                 disabled={!newMember.name.trim() || saving}
//                                 className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                             >
//                                 {saving ? (
//                                     <>
//                                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                                         Ajout...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Save className="h-4 w-4 mr-2" />
//                                         Ajouter
//                                     </>
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Modal Modifier */}
//             {showEditModal && selectedMember && (
//                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
//                         <div className="flex items-center justify-between mb-6">
//                             <h3 className="text-xl font-bold text-gray-800">Modifier le Membre</h3>
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
//                                     Photo de profil
//                                 </label>
//                                 <ImageUpload
//                                     onImageChange={(base64) => setEditMember(prev => ({ ...prev, avatar_url: base64 }))}
//                                     defaultName={editMember.name}
//                                     currentImage={editMember.avatar_url}
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Nom complet *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={editMember.name}
//                                     onChange={(e) => setEditMember(prev => ({ ...prev, name: e.target.value }))}
//                                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Bio / Description
//                                 </label>
//                                 <textarea
//                                     value={editMember.bio}
//                                     onChange={(e) => setEditMember(prev => ({ ...prev, bio: e.target.value }))}
//                                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                     rows={2}
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Téléphone
//                                 </label>
//                                 <input
//                                     type="tel"
//                                     value={editMember.phone}
//                                     onChange={(e) => setEditMember(prev => ({ ...prev, phone: e.target.value }))}
//                                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Email
//                                 </label>
//                                 <input
//                                     type="email"
//                                     value={editMember.email}
//                                     onChange={(e) => setEditMember(prev => ({ ...prev, email: e.target.value }))}
//                                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
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
//                                 onClick={handleEditMember}
//                                 disabled={!editMember.name.trim() || saving}
//                                 className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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

//             {/* Modal Supprimer */}
//             {showDeleteModal && selectedMember && (
//                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
//                         <div className="flex items-center justify-between mb-6">
//                             <h3 className="text-xl font-bold text-red-600 flex items-center">
//                                 <AlertTriangle className="h-6 w-6 mr-2" />
//                                 Supprimer le Membre
//                             </h3>
//                             <button
//                                 onClick={() => setShowDeleteModal(false)}
//                                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <X className="h-6 w-6 text-gray-500" />
//                             </button>
//                         </div>

//                         <div className="mb-6">
//                             <div className="flex items-center mb-4">
//                                 <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-gray-200 mr-4">
//                                     {selectedMember.avatar_url ? (
//                                         <img
//                                             src={selectedMember.avatar_url}
//                                             alt={selectedMember.name}
//                                             className="w-full h-full object-cover"
//                                         />
//                                     ) : (
//                                         <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
//                                             <User className="w-8 h-8 text-white" />
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <h4 className="font-bold text-gray-800">{selectedMember.name}</h4>
//                                     <p className="text-sm text-gray-600">{selectedMember.email || 'Pas d\'email'}</p>
//                                 </div>
//                             </div>

//                             <p className="text-gray-600 mb-4">
//                                 Êtes-vous sûr de vouloir supprimer ce membre ?
//                             </p>
//                             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                                 <p className="text-red-600 text-sm">
//                                     ⚠️ Cette action est irréversible. Tous les paiements associés seront également supprimés.
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="flex justify-end space-x-3">
//                             <button
//                                 onClick={() => setShowDeleteModal(false)}
//                                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 Annuler
//                             </button>
//                             <button
//                                 onClick={handleDeleteMember}
//                                 disabled={saving}
//                                 className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                             >
//                                 {saving ? (
//                                     <>
//                                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                                         Suppression...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Trash2 className="h-4 w-4 mr-2" />
//                                         Supprimer
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

// export default Members

























// code avec option ajout de photo
import React, { useState, useEffect } from 'react'
import {
    Users,
    Plus,
    Edit3,
    Trash2,
    Phone,
    Mail,
    Calendar,
    Euro,
    ArrowLeft,
    Save,
    X,
    UserPlus,
    AlertTriangle,
    User
} from 'lucide-react'
// import { DatabaseService } from '../lib/database'
// import { DbMember, DbPayment } from '../lib/database'
import { DatabaseService, authService, DbMember, DbPayment } from '../lib/supabaseService'
import ImageUpload from './ImageUpload'

interface MembersProps {
    onBack: () => void
}

const Members: React.FC<MembersProps> = ({ onBack }) => {
    // État principal
    const [members, setMembers] = useState<DbMember[]>([])
    const [payments, setPayments] = useState<DbPayment[]>([])
    const [loading, setLoading] = useState(true)

    // États des modals
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedMember, setSelectedMember] = useState<DbMember | null>(null)

    // États des formulaires AVEC photos maintenant
    const [newMember, setNewMember] = useState({
        name: '',
        phone: '',
        email: '',
        bio: '',
        avatar_url: null as string | null
    })
    const [editMember, setEditMember] = useState({
        name: '',
        phone: '',
        email: '',
        bio: '',
        avatar_url: null as string | null
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
                setPayments(data.payments)
            } catch (error) {
                console.error('Erreur chargement membres:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    // Calculer les statistiques par membre
    const getMemberStats = (memberId: string) => {
        const memberPayments = payments.filter(p => p.member_id === memberId)
        const totalPaid = memberPayments.reduce((sum, p) => sum + p.amount, 0)
        const paymentCount = memberPayments.length
        const lastPayment = memberPayments.length > 0
            ? new Date(Math.max(...memberPayments.map(p => new Date(p.payment_date).getTime())))
            : null

        return { totalPaid, paymentCount, lastPayment }
    }

    // Ajouter un membre
    const handleAddMember = async () => {
        // Validation obligatoire : nom ET téléphone
        if (!newMember.name.trim() || !newMember.phone.trim()) {
            alert('Le nom et le téléphone sont obligatoires !')
            return
        }

        setSaving(true)
        try {
            const addedMember = await DatabaseService.addMember({
                name: newMember.name.trim(),
                phone: newMember.phone.trim(),
                email: newMember.email.trim() || undefined,
                bio: newMember.bio.trim() || undefined,
                avatar_url: newMember.avatar_url || undefined
            })

            if (addedMember) {
                setMembers(prev => [addedMember, ...prev])
                resetNewMemberForm()
                setShowAddModal(false)
            }
        } catch (error) {
            console.error('Erreur ajout membre:', error)
        } finally {
            setSaving(false)
        }
    }

    // Reset formulaire
    const resetNewMemberForm = () => {
        setNewMember({
            name: '',
            phone: '',
            email: '',
            bio: '',
            avatar_url: null
        })
    }

    // Modifier un membre
    const handleEditMember = async () => {
        // Validation obligatoire : nom ET téléphone
        if (!selectedMember || !editMember.name.trim() || !editMember.phone.trim()) {
            alert('Le nom et le téléphone sont obligatoires !')
            return
        }

        setSaving(true)
        try {
            const success = await DatabaseService.updateMember(selectedMember.id, {
                name: editMember.name.trim(),
                phone: editMember.phone.trim(),
                email: editMember.email.trim() || null,
                bio: editMember.bio.trim() || null,
                avatar_url: editMember.avatar_url
            })

            if (success) {
                setMembers(prev => prev.map(m =>
                    m.id === selectedMember.id
                        ? {
                            ...m,
                            name: editMember.name.trim(),
                            phone: editMember.phone.trim(),
                            email: editMember.email.trim() || null,
                            bio: editMember.bio.trim() || null,
                            avatar_url: editMember.avatar_url
                        }
                        : m
                ))
            }

            setShowEditModal(false)
            setSelectedMember(null)
        } catch (error) {
            console.error('Erreur modification membre:', error)
        } finally {
            setSaving(false)
        }
    }

    // Supprimer un membre
    const handleDeleteMember = async () => {
        if (!selectedMember) return

        setSaving(true)
        try {
            const success = await DatabaseService.deleteMember(selectedMember.id)

            if (success) {
                setMembers(prev => prev.filter(m => m.id !== selectedMember.id))
                setPayments(prev => prev.filter(p => p.member_id !== selectedMember.id))
            }

            setShowDeleteModal(false)
            setSelectedMember(null)
        } catch (error) {
            console.error('Erreur suppression membre:', error)
        } finally {
            setSaving(false)
        }
    }

    // Ouvrir modal d'édition
    const openEditModal = (member: DbMember) => {
        setSelectedMember(member)
        setEditMember({
            name: member.name,
            phone: member.phone || '',
            email: member.email || '',
            bio: (member as any).bio || '',
            avatar_url: (member as any).avatar_url || null
        })
        setShowEditModal(true)
    }

    // Ouvrir modal de suppression
    const openDeleteModal = (member: DbMember) => {
        setSelectedMember(member)
        setShowDeleteModal(true)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-4">
            <div className="max-w-6xl mx-auto">

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
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                👥 Gestion des Membres
                            </h1>
                            <p className="text-gray-600">
                                {members.length} membre{members.length !== 1 ? 's' : ''} dans la famille
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Ajouter un Membre
                    </button>
                </div>

                {/* Stats Rapides */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Membres</p>
                                <p className="text-3xl font-bold text-blue-600">{members.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-full mr-4">
                                <Euro className="h-8 w-8 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Contributions</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}€
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center">
                            <div className="bg-purple-100 p-3 rounded-full mr-4">
                                <UserPlus className="h-8 w-8 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Membre Récent</p>
                                <p className="text-lg font-bold text-purple-600">
                                    {members.length > 0 ? members[0].name : 'Aucun'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Liste des Membres */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map(member => {
                        const stats = getMemberStats(member.id)
                        return (
                            <div
                                key={member.id}
                                className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                            >
                                {/* Header avec photo de profil */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg mr-4">
                                            {(member as any).avatar_url ? (
                                                <img
                                                    src={(member as any).avatar_url}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                                    <User className="w-8 h-8 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${(member as any).status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {(member as any).status === 'active' ? 'Actif' : 'Inactif'}
                                        </div>
                                    </div>

                                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={() => openEditModal(member)}
                                            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg mr-2 transition-colors"
                                        >
                                            <Edit3 className="h-4 w-4 text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(member)}
                                            className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>

                                {/* Informations */}
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>

                                    {(member as any).bio && (
                                        <p className="text-sm text-gray-600 mb-3 italic">"{(member as any).bio}"</p>
                                    )}

                                    {member.phone && (
                                        <div className="flex items-center text-gray-600 mb-1">
                                            <Phone className="h-4 w-4 mr-2" />
                                            <span className="text-sm">{member.phone}</span>
                                        </div>
                                    )}

                                    {member.email && (
                                        <div className="flex items-center text-gray-600 mb-1">
                                            <Mail className="h-4 w-4 mr-2" />
                                            <span className="text-sm">{member.email}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span className="text-sm">
                                            Rejoint le {new Date(member.join_date).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-600">Total payé:</span>
                                        <span className="font-bold text-green-600">{stats.totalPaid.toFixed(2)}€</span>
                                    </div>

                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-600">Paiements:</span>
                                        <span className="font-medium text-blue-600">{stats.paymentCount}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Solde:</span>
                                        <span className={`font-bold ${member.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {member.balance.toFixed(2)}€
                                        </span>
                                    </div>

                                    {stats.lastPayment && (
                                        <div className="mt-2 text-xs text-gray-500">
                                            Dernier: {stats.lastPayment.toLocaleDateString('fr-FR')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Message si aucun membre */}
                {members.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-500 mb-2">Aucun membre</h3>
                        <p className="text-gray-400 mb-6">Commencez par ajouter votre premier membre</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            Ajouter le Premier Membre
                        </button>
                    </div>
                )}

            </div>

            {/* Modal Ajouter */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Ajouter un Membre</h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false)
                                    resetNewMemberForm()
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Contenu scrollable */}
                        <div className="flex-1 overflow-y-auto pr-2">
                            <div className="space-y-4">
                                {/* Upload de photo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Photo de profil
                                    </label>
                                    <ImageUpload
                                        onImageChange={(base64: string | null) => setNewMember(prev => ({ ...prev, avatar_url: base64 }))}
                                        defaultName={newMember.name}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nom complet <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={newMember.name}
                                        onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!newMember.name.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                        placeholder="Ex: Jean Dupont"
                                        required
                                    />
                                    {!newMember.name.trim() && (
                                        <p className="text-red-500 text-xs mt-1">Le nom est obligatoire</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Téléphone <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={newMember.phone}
                                        onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!newMember.phone.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                        placeholder="Ex: +33 6 12 34 56 78"
                                        required
                                    />
                                    {!newMember.phone.trim() && (
                                        <p className="text-red-500 text-xs mt-1">Le téléphone est obligatoire</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bio / Description
                                    </label>
                                    <textarea
                                        value={newMember.bio}
                                        onChange={(e) => setNewMember(prev => ({ ...prev, bio: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ex: Papa de famille, responsable des finances..."
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email (optionnel)
                                    </label>
                                    <input
                                        type="email"
                                        value={newMember.email}
                                        onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ex: jean.dupont@email.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Boutons fixes en bas */}
                        <div className="border-t border-gray-200 pt-4 mt-6">
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowAddModal(false)
                                        resetNewMemberForm()
                                    }}
                                    className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleAddMember}
                                    disabled={!newMember.name.trim() || !newMember.phone.trim() || saving}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium shadow-lg"
                                >
                                    {saving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Ajout en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-5 w-5 mr-2" />
                                            Ajouter le Membre
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Modifier */}
            {showEditModal && selectedMember && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Modifier le Membre</h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Contenu scrollable */}
                        <div className="flex-1 overflow-y-auto pr-2">
                            <div className="space-y-4">
                                {/* Upload de photo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Photo de profil
                                    </label>
                                    <ImageUpload
                                        onImageChange={(base64: string | null) => setEditMember(prev => ({ ...prev, avatar_url: base64 }))}
                                        defaultName={editMember.name}
                                        currentImage={editMember.avatar_url}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nom complet <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editMember.name}
                                        onChange={(e) => setEditMember(prev => ({ ...prev, name: e.target.value }))}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!editMember.name.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                        required
                                    />
                                    {!editMember.name.trim() && (
                                        <p className="text-red-500 text-xs mt-1">Le nom est obligatoire</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Téléphone <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={editMember.phone}
                                        onChange={(e) => setEditMember(prev => ({ ...prev, phone: e.target.value }))}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!editMember.phone.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                        required
                                    />
                                    {!editMember.phone.trim() && (
                                        <p className="text-red-500 text-xs mt-1">Le téléphone est obligatoire</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bio / Description
                                    </label>
                                    <textarea
                                        value={editMember.bio}
                                        onChange={(e) => setEditMember(prev => ({ ...prev, bio: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email (optionnel)
                                    </label>
                                    <input
                                        type="email"
                                        value={editMember.email}
                                        onChange={(e) => setEditMember(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Boutons fixes en bas */}
                        <div className="border-t border-gray-200 pt-4 mt-6">
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleEditMember}
                                    disabled={!editMember.name.trim() || !editMember.phone.trim() || saving}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium shadow-lg"
                                >
                                    {saving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Sauvegarde...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-5 w-5 mr-2" />
                                            Sauvegarder les Modifications
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Supprimer */}
            {showDeleteModal && selectedMember && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-red-600 flex items-center">
                                <AlertTriangle className="h-6 w-6 mr-2" />
                                Supprimer le Membre
                            </h3>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-600 mb-4">
                                Êtes-vous sûr de vouloir supprimer <strong>{selectedMember.name}</strong> ?
                            </p>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-600 text-sm">
                                    ⚠️ Cette action est irréversible. Tous les paiements associés seront également supprimés.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDeleteMember}
                                disabled={saving}
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Suppression...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Supprimer
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

export default Members