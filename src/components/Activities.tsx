// import React, { useState, useEffect } from 'react'
// import {
//     Activity,
//     Plus,
//     ArrowLeft,
//     Euro,
//     Calendar,
//     TrendingDown,
//     Edit3,
//     Trash2,
//     Save,
//     X,
//     MapPin,
//     Home,
//     Car,
//     ShoppingCart,
//     Stethoscope,
//     Zap,
//     Utensils,
//     Gamepad2,
//     Gift,
//     AlertTriangle,
//     Clock,
//     Target,
//     BarChart3
// } from 'lucide-react'
// // import { DatabaseService } from '../lib/database'
// // import { DbActivity, DbMember, DbPayment } from '../lib/database'
// import { DatabaseService, DbActivity, DbMember, DbPayment } from '../lib/supabaseService'
// interface ActivitiesProps {
//     onBack: () => void
// }

// const Activities: React.FC<ActivitiesProps> = ({ onBack }) => {
//     // État principal
//     const [activities, setActivities] = useState<DbActivity[]>([])
//     const [members, setMembers] = useState<DbMember[]>([])
//     const [payments, setPayments] = useState<DbPayment[]>([])
//     const [loading, setLoading] = useState(true)

//     // États des modals
//     const [showAddModal, setShowAddModal] = useState(false)
//     const [showEditModal, setShowEditModal] = useState(false)
//     const [showDeleteModal, setShowDeleteModal] = useState(false)
//     const [selectedActivity, setSelectedActivity] = useState<DbActivity | null>(null)

//     // États des formulaires
//     const [newActivity, setNewActivity] = useState({
//         name: '',
//         amount: '',
//         description: '',
//         category: ''
//     })

//     const [editActivity, setEditActivity] = useState({
//         name: '',
//         amount: '',
//         description: ''
//     })

//     // État de sauvegarde
//     const [saving, setSaving] = useState(false)

//     // Suggestions d'activités prédéfinies par catégorie
//     const activitySuggestions = {
//         famille: [
//             {
//                 name: 'Sortie plage familiale',
//                 amount: 75,
//                 description: 'Transport, snacks et activités pour une journée à la plage',
//                 icon: MapPin
//             },
//             {
//                 name: 'Cinéma famille',
//                 amount: 45,
//                 description: 'Billets de cinéma et popcorn pour toute la famille',
//                 icon: Gamepad2
//             },
//             {
//                 name: 'Restaurant familial',
//                 amount: 85,
//                 description: 'Repas au restaurant pour célébrer un événement',
//                 icon: Utensils
//             },
//             {
//                 name: 'Parc d\'attractions',
//                 amount: 120,
//                 description: 'Entrées et repas pour une journée au parc',
//                 icon: Gift
//             }
//         ],
//         maison: [
//             {
//                 name: 'Réparation maison',
//                 amount: 150,
//                 description: 'Matériaux et outils pour réparations domestiques',
//                 icon: Home
//             },
//             {
//                 name: 'Électricité/Eau',
//                 amount: 120,
//                 description: 'Factures mensuelles des services publics',
//                 icon: Zap
//             },
//             {
//                 name: 'Équipements ménagers',
//                 amount: 200,
//                 description: 'Achat ou réparation d\'électroménager',
//                 icon: Home
//             }
//         ],
//         quotidien: [
//             {
//                 name: 'Courses alimentaires',
//                 amount: 80,
//                 description: 'Achats hebdomadaires de nourriture et produits de base',
//                 icon: ShoppingCart
//             },
//             {
//                 name: 'Transport commun',
//                 amount: 35,
//                 description: 'Frais de transport en commun pour la famille',
//                 icon: Car
//             },
//             {
//                 name: 'Essence véhicule',
//                 amount: 60,
//                 description: 'Carburant pour les déplacements familiaux',
//                 icon: Car
//             }
//         ],
//         sante: [
//             {
//                 name: 'Médicaments famille',
//                 amount: 45,
//                 description: 'Pharmacie et médicaments pour la famille',
//                 icon: Stethoscope
//             },
//             {
//                 name: 'Consultations médicales',
//                 amount: 90,
//                 description: 'Visites chez le médecin et spécialistes',
//                 icon: Stethoscope
//             }
//         ]
//     }

//     // Charger les données
//     useEffect(() => {
//         const loadData = async () => {
//             setLoading(true)
//             try {
//                 const data = await DatabaseService.loadAllData()
//                 setActivities(data.activities)
//                 setMembers(data.members)
//                 setPayments(data.payments)
//             } catch (error) {
//                 console.error('Erreur chargement activités:', error)
//             } finally {
//                 setLoading(false)
//             }
//         }

//         loadData()
//     }, [])

//     // Calculer le solde de la caisse
//     const totalCaisse = payments.reduce((sum, payment) => sum + payment.amount, 0) -
//         activities.reduce((sum, activity) => sum + activity.amount, 0)

//     // Ajouter une activité
//     const handleAddActivity = async () => {
//         if (!newActivity.name.trim() || !newActivity.amount) return

//         setSaving(true)
//         try {
//             const addedActivity = await DatabaseService.addActivity({
//                 name: newActivity.name.trim(),
//                 amount: parseFloat(newActivity.amount),
//                 description: newActivity.description.trim() || undefined
//             })

//             if (addedActivity) {
//                 setActivities(prev => [addedActivity, ...prev])
//                 setNewActivity({
//                     name: '',
//                     amount: '',
//                     description: '',
//                     category: ''
//                 })
//                 setShowAddModal(false)
//             }
//         } catch (error) {
//             console.error('Erreur ajout activité:', error)
//         } finally {
//             setSaving(false)
//         }
//     }

//     // Modifier une activité
//     const handleEditActivity = async () => {
//         if (!selectedActivity || !editActivity.name.trim() || !editActivity.amount) return

//         setSaving(true)
//         try {
//             // Note: Vous devrez ajouter cette méthode dans DatabaseService
//             // const updated = await DatabaseService.updateActivity(selectedActivity.id, editActivity)

//             // Pour l'instant, simulation de mise à jour locale
//             setActivities(prev => prev.map(a =>
//                 a.id === selectedActivity.id
//                     ? {
//                         ...a,
//                         name: editActivity.name.trim(),
//                         amount: parseFloat(editActivity.amount),
//                         description: editActivity.description.trim() || null
//                     }
//                     : a
//             ))

//             setShowEditModal(false)
//             setSelectedActivity(null)
//         } catch (error) {
//             console.error('Erreur modification activité:', error)
//         } finally {
//             setSaving(false)
//         }
//     }

//     // Supprimer une activité
//     const handleDeleteActivity = async () => {
//         if (!selectedActivity) return

//         setSaving(true)
//         try {
//             // Note: Vous devrez ajouter cette méthode dans DatabaseService
//             // await DatabaseService.deleteActivity(selectedActivity.id)

//             // Pour l'instant, simulation de suppression locale
//             setActivities(prev => prev.filter(a => a.id !== selectedActivity.id))
//             setShowDeleteModal(false)
//             setSelectedActivity(null)
//         } catch (error) {
//             console.error('Erreur suppression activité:', error)
//         } finally {
//             setSaving(false)
//         }
//     }

//     // Ouvrir modal d'édition
//     const openEditModal = (activity: DbActivity) => {
//         setSelectedActivity(activity)
//         setEditActivity({
//             name: activity.name,
//             amount: activity.amount.toString(),
//             description: activity.description || ''
//         })
//         setShowEditModal(true)
//     }

//     // Ouvrir modal de suppression
//     const openDeleteModal = (activity: DbActivity) => {
//         setSelectedActivity(activity)
//         setShowDeleteModal(true)
//     }

//     // Appliquer une suggestion
//     const applySuggestion = (suggestion: any) => {
//         setNewActivity(prev => ({
//             ...prev,
//             name: suggestion.name,
//             amount: suggestion.amount.toString(),
//             description: suggestion.description
//         }))
//     }

//     // Calculer les statistiques
//     const totalSpent = activities.reduce((sum, a) => sum + a.amount, 0)
//     const averageActivity = activities.length > 0 ? totalSpent / activities.length : 0
//     const thisMonthActivities = activities.filter(a => {
//         const activityDate = new Date(a.activity_date)
//         const now = new Date()
//         return activityDate.getMonth() === now.getMonth() &&
//             activityDate.getFullYear() === now.getFullYear()
//     })
//     const thisMonthSpent = thisMonthActivities.reduce((sum, a) => sum + a.amount, 0)

//     // Grouper les activités par mois
//     const activitiesByMonth = activities.reduce((acc, activity) => {
//         const month = new Date(activity.activity_date).toISOString().slice(0, 7)
//         if (!acc[month]) acc[month] = []
//         acc[month].push(activity)
//         return acc
//     }, {} as Record<string, DbActivity[]>)

//     // Obtenir l'icône selon le nom de l'activité
//     const getActivityIcon = (name: string) => {
//         const nameLower = name.toLowerCase()
//         if (nameLower.includes('plage') || nameLower.includes('sortie')) return MapPin
//         if (nameLower.includes('maison') || nameLower.includes('réparation')) return Home
//         if (nameLower.includes('courses') || nameLower.includes('achat')) return ShoppingCart
//         if (nameLower.includes('transport') || nameLower.includes('essence')) return Car
//         if (nameLower.includes('médical') || nameLower.includes('médicament')) return Stethoscope
//         if (nameLower.includes('électricité') || nameLower.includes('eau')) return Zap
//         if (nameLower.includes('restaurant') || nameLower.includes('repas')) return Utensils
//         return Activity
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
//                             <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
//                                 🎉 Activités Familiales
//                             </h1>
//                             <p className="text-gray-600">
//                                 {activities.length} activité{activities.length !== 1 ? 's' : ''} enregistrée{activities.length !== 1 ? 's' : ''}
//                             </p>
//                         </div>
//                     </div>

//                     <button
//                         onClick={() => setShowAddModal(true)}
//                         className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
//                     >
//                         <Plus className="h-5 w-5 mr-2" />
//                         Nouvelle Activité
//                     </button>
//                 </div>

//                 {/* Stats Dashboard */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     {/* Solde Caisse */}
//                     <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                         <div className="flex items-center">
//                             <div className={`p-3 rounded-full mr-4 ${totalCaisse >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
//                                 <Euro className={`h-8 w-8 ${totalCaisse >= 0 ? 'text-green-600' : 'text-red-600'}`} />
//                             </div>
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Solde Caisse</p>
//                                 <p className={`text-2xl font-bold ${totalCaisse >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                                     {totalCaisse.toFixed(2)}€
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Total Dépensé */}
//                     <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                         <div className="flex items-center">
//                             <div className="bg-red-100 p-3 rounded-full mr-4">
//                                 <TrendingDown className="h-8 w-8 text-red-600" />
//                             </div>
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Total Dépensé</p>
//                                 <p className="text-2xl font-bold text-red-600">{totalSpent.toFixed(2)}€</p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Dépense Moyenne */}
//                     <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                         <div className="flex items-center">
//                             <div className="bg-blue-100 p-3 rounded-full mr-4">
//                                 <Target className="h-8 w-8 text-blue-600" />
//                             </div>
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Dépense Moyenne</p>
//                                 <p className="text-2xl font-bold text-blue-600">{averageActivity.toFixed(2)}€</p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Ce Mois */}
//                     <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                         <div className="flex items-center">
//                             <div className="bg-orange-100 p-3 rounded-full mr-4">
//                                 <Calendar className="h-8 w-8 text-orange-600" />
//                             </div>
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Ce Mois</p>
//                                 <p className="text-2xl font-bold text-orange-600">{thisMonthSpent.toFixed(2)}€</p>
//                                 <p className="text-xs text-gray-500">{thisMonthActivities.length} activité{thisMonthActivities.length !== 1 ? 's' : ''}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Alerte si solde faible */}
//                 {totalCaisse < 100 && totalCaisse > 0 && (
//                     <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-8 flex items-center">
//                         <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
//                         <div>
//                             <p className="text-yellow-800 font-medium">Attention : Solde de caisse faible</p>
//                             <p className="text-yellow-700 text-sm">
//                                 Il reste seulement {totalCaisse.toFixed(2)}€ dans la caisse. Pensez à demander des cotisations.
//                             </p>
//                         </div>
//                     </div>
//                 )}

//                 {totalCaisse < 0 && (
//                     <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 flex items-center">
//                         <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
//                         <div>
//                             <p className="text-red-800 font-medium">Alerte : Solde de caisse négatif</p>
//                             <p className="text-red-700 text-sm">
//                                 La caisse est en déficit de {Math.abs(totalCaisse).toFixed(2)}€. Il faut collecter des cotisations rapidement.
//                             </p>
//                         </div>
//                     </div>
//                 )}

//                 {/* Liste des Activités */}
//                 <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
//                     <div className="p-6 border-b border-gray-200">
//                         <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//                             <BarChart3 className="h-6 w-6 text-orange-600 mr-2" />
//                             Historique des Activités
//                         </h3>
//                     </div>

//                     {activities.length > 0 ? (
//                         <div className="divide-y divide-gray-200">
//                             {Object.entries(activitiesByMonth)
//                                 .sort(([a], [b]) => b.localeCompare(a))
//                                 .map(([month, monthActivities]) => (
//                                     <div key={month} className="p-6">
//                                         <div className="flex items-center justify-between mb-4">
//                                             <h4 className="text-lg font-semibold text-gray-800">
//                                                 {new Date(month + '-01').toLocaleDateString('fr-FR', {
//                                                     year: 'numeric',
//                                                     month: 'long'
//                                                 })}
//                                             </h4>
//                                             <div className="text-sm text-gray-500">
//                                                 {monthActivities.length} activité{monthActivities.length !== 1 ? 's' : ''} •
//                                                 <span className="font-bold text-red-600 ml-1">
//                                                     {monthActivities.reduce((sum, a) => sum + a.amount, 0).toFixed(2)}€
//                                                 </span>
//                                             </div>
//                                         </div>

//                                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                             {monthActivities.map(activity => {
//                                                 const IconComponent = getActivityIcon(activity.name)
//                                                 return (
//                                                     <div
//                                                         key={activity.id}
//                                                         className="bg-white/50 rounded-xl p-4 border border-white/20 hover:shadow-lg transition-all duration-300 hover:scale-105 group"
//                                                     >
//                                                         <div className="flex items-center justify-between mb-3">
//                                                             <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
//                                                                 <IconComponent className="h-5 w-5 text-white" />
//                                                             </div>
//                                                             <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                                                                 <button
//                                                                     onClick={() => openEditModal(activity)}
//                                                                     className="p-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg mr-2 transition-colors"
//                                                                 >
//                                                                     <Edit3 className="h-3 w-3 text-blue-600" />
//                                                                 </button>
//                                                                 <button
//                                                                     onClick={() => openDeleteModal(activity)}
//                                                                     className="p-1.5 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
//                                                                 >
//                                                                     <Trash2 className="h-3 w-3 text-red-600" />
//                                                                 </button>
//                                                             </div>
//                                                         </div>

//                                                         <h5 className="font-medium text-gray-800 mb-2">{activity.name}</h5>

//                                                         <div className="flex items-center justify-between mb-2">
//                                                             <span className="text-lg font-bold text-red-600">
//                                                                 -{activity.amount.toFixed(2)}€
//                                                             </span>
//                                                             <div className="flex items-center text-xs text-gray-500">
//                                                                 <Clock className="h-3 w-3 mr-1" />
//                                                                 {new Date(activity.activity_date).toLocaleDateString('fr-FR')}
//                                                             </div>
//                                                         </div>

//                                                         {activity.description && (
//                                                             <p className="text-sm text-gray-600 line-clamp-2">
//                                                                 {activity.description}
//                                                             </p>
//                                                         )}
//                                                     </div>
//                                                 )
//                                             })}
//                                         </div>
//                                     </div>
//                                 ))}
//                         </div>
//                     ) : (
//                         <div className="text-center py-12">
//                             <Activity className="h-24 w-24 text-gray-300 mx-auto mb-4" />
//                             <h3 className="text-xl font-medium text-gray-500 mb-2">Aucune activité</h3>
//                             <p className="text-gray-400 mb-6">Commencez par enregistrer votre première activité familiale</p>
//                             <button
//                                 onClick={() => setShowAddModal(true)}
//                                 className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-lg"
//                             >
//                                 Première Activité
//                             </button>
//                         </div>
//                     )}
//                 </div>

//             </div>

//             {/* Modal Nouvelle Activité */}
//             {showAddModal && (
//                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-2xl p-6 w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
//                         <div className="flex items-center justify-between mb-6">
//                             <h3 className="text-xl font-bold text-gray-800">Nouvelle Activité Familiale</h3>
//                             <button
//                                 onClick={() => setShowAddModal(false)}
//                                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <X className="h-6 w-6 text-gray-500" />
//                             </button>
//                         </div>

//                         {/* Suggestions par Catégorie */}
//                         <div className="mb-6">
//                             <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center">
//                                 <Gift className="h-5 w-5 mr-2" />
//                                 Suggestions d'Activités
//                             </h4>

//                             {Object.entries(activitySuggestions).map(([category, suggestions]) => (
//                                 <div key={category} className="mb-6">
//                                     <h5 className="text-sm font-medium text-gray-600 mb-3 capitalize">
//                                         {category === 'famille' ? '👨‍👩‍👧‍👦 Activités Familiales' :
//                                             category === 'maison' ? '🏠 Maison & Équipements' :
//                                                 category === 'quotidien' ? '🛒 Quotidien & Transport' :
//                                                     category === 'sante' ? '🏥 Santé & Bien-être' : category}
//                                     </h5>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
//                                         {suggestions.map((suggestion, index) => {
//                                             const IconComponent = suggestion.icon
//                                             return (
//                                                 <button
//                                                     key={index}
//                                                     onClick={() => applySuggestion(suggestion)}
//                                                     className="p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 text-left group"
//                                                 >
//                                                     <div className="flex items-center mb-2">
//                                                         <div className="bg-orange-100 p-2 rounded-lg mr-3 group-hover:bg-orange-200">
//                                                             <IconComponent className="h-4 w-4 text-orange-600" />
//                                                         </div>
//                                                         <div className="font-medium text-gray-800 text-sm group-hover:text-orange-600">
//                                                             {suggestion.name}
//                                                         </div>
//                                                     </div>
//                                                     <div className="text-lg font-bold text-orange-600 mb-1">
//                                                         {suggestion.amount}€
//                                                     </div>
//                                                     <div className="text-xs text-gray-500">
//                                                         {suggestion.description}
//                                                     </div>
//                                                 </button>
//                                             )
//                                         })}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="border-t border-gray-200 pt-6">
//                             <h4 className="text-md font-semibold text-gray-700 mb-4">Ou créer une activité personnalisée</h4>

//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Nom de l'activité *
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={newActivity.name}
//                                         onChange={(e) => setNewActivity(prev => ({ ...prev, name: e.target.value }))}
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                                         placeholder="Ex: Sortie au zoo familial"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Montant dépensé *
//                                     </label>
//                                     <div className="relative">
//                                         <input
//                                             type="number"
//                                             step="0.01"
//                                             min="0"
//                                             value={newActivity.amount}
//                                             onChange={(e) => setNewActivity(prev => ({ ...prev, amount: e.target.value }))}
//                                             className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                                             placeholder="0.00"
//                                         />
//                                         <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                                             <Euro className="h-5 w-5 text-gray-400" />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Description (optionnelle)
//                                     </label>
//                                     <textarea
//                                         value={newActivity.description}
//                                         onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                                         placeholder="Détails de l'activité, participants, etc..."
//                                         rows={3}
//                                     />
//                                 </div>

//                                 {/* Aperçu impact sur la caisse */}
//                                 {newActivity.amount && (
//                                     <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
//                                         <div className="flex items-center justify-between">
//                                             <span className="text-orange-700 font-medium">Nouveau solde de caisse:</span>
//                                             <span className={`text-xl font-bold ${(totalCaisse - parseFloat(newActivity.amount || '0')) >= 0
//                                                 ? 'text-green-600'
//                                                 : 'text-red-600'
//                                                 }`}>
//                                                 {(totalCaisse - parseFloat(newActivity.amount || '0')).toFixed(2)}€
//                                             </span>
//                                         </div>
//                                         {(totalCaisse - parseFloat(newActivity.amount || '0')) < 0 && (
//                                             <p className="text-red-600 text-sm mt-2">
//                                                 ⚠️ Cette dépense mettra la caisse en déficit
//                                             </p>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="flex justify-end mt-6 space-x-3">
//                             <button
//                                 onClick={() => setShowAddModal(false)}
//                                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 Annuler
//                             </button>
//                             <button
//                                 onClick={handleAddActivity}
//                                 disabled={!newActivity.name.trim() || !newActivity.amount || saving}
//                                 className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                             >
//                                 {saving ? (
//                                     <>
//                                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                                         Enregistrement...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Save className="h-4 w-4 mr-2" />
//                                         Enregistrer l'Activité
//                                     </>
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Modal Modifier Activité */}
//             {showEditModal && selectedActivity && (
//                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
//                         <div className="flex items-center justify-between mb-6">
//                             <h3 className="text-xl font-bold text-gray-800">Modifier l'Activité</h3>
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
//                                     Nom de l'activité *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={editActivity.name}
//                                     onChange={(e) => setEditActivity(prev => ({ ...prev, name: e.target.value }))}
//                                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Montant dépensé *
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type="number"
//                                         step="0.01"
//                                         min="0"
//                                         value={editActivity.amount}
//                                         onChange={(e) => setEditActivity(prev => ({ ...prev, amount: e.target.value }))}
//                                         className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                                     />
//                                     <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                                         <Euro className="h-5 w-5 text-gray-400" />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Description
//                                 </label>
//                                 <textarea
//                                     value={editActivity.description}
//                                     onChange={(e) => setEditActivity(prev => ({ ...prev, description: e.target.value }))}
//                                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                                     rows={3}
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
//                                 onClick={handleEditActivity}
//                                 disabled={!editActivity.name.trim() || !editActivity.amount || saving}
//                                 className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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

//             {/* Modal Supprimer Activité */}
//             {showDeleteModal && selectedActivity && (
//                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
//                         <div className="flex items-center justify-between mb-6">
//                             <h3 className="text-xl font-bold text-red-600 flex items-center">
//                                 <AlertTriangle className="h-6 w-6 mr-2" />
//                                 Supprimer l'Activité
//                             </h3>
//                             <button
//                                 onClick={() => setShowDeleteModal(false)}
//                                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <X className="h-6 w-6 text-gray-500" />
//                             </button>
//                         </div>

//                         <div className="mb-6">
//                             <p className="text-gray-600 mb-4">
//                                 Êtes-vous sûr de vouloir supprimer l'activité <strong>{selectedActivity.name}</strong> ?
//                             </p>

//                             <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-orange-700 font-medium">Montant à rembourser:</span>
//                                     <span className="text-xl font-bold text-orange-600">
//                                         +{selectedActivity.amount.toFixed(2)}€
//                                     </span>
//                                 </div>
//                                 <p className="text-orange-600 text-sm mt-2">
//                                     💡 Cette suppression remettra {selectedActivity.amount.toFixed(2)}€ dans la caisse
//                                 </p>
//                             </div>

//                             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                                 <p className="text-red-600 text-sm">
//                                     ⚠️ Cette action est irréversible. L'historique de cette activité sera définitivement supprimé.
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
//                                 onClick={() => {
//                                     setShowDeleteModal(false)
//                                     openEditModal(selectedActivity)
//                                 }}
//                                 className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center"
//                             >
//                                 <Edit3 className="h-4 w-4 mr-2" />
//                                 Modifier Plutôt
//                             </button>
//                             <button
//                                 onClick={handleDeleteActivity}
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
//                                         Supprimer Définitivement
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

// export default Activities











// code update
import React, { useState, useEffect } from 'react'
import {
    Activity,
    Plus,
    ArrowLeft,
    Euro,
    Calendar,
    TrendingDown,
    Edit3,
    Trash2,
    Save,
    X,
    MapPin,
    Home,
    Car,
    ShoppingCart,
    Stethoscope,
    Zap,
    Utensils,
    Gamepad2,
    Gift,
    AlertTriangle,
    Clock,
    Target,
    BarChart3,
    RefreshCw
} from 'lucide-react'
import { DatabaseService, DbActivity, DbMember, DbPayment } from '../lib/supabaseService'

interface ActivitiesProps {
    onBack: () => void
}

const Activities: React.FC<ActivitiesProps> = ({ onBack }) => {
    // État principal
    const [activities, setActivities] = useState<DbActivity[]>([])
    const [members, setMembers] = useState<DbMember[]>([])
    const [payments, setPayments] = useState<DbPayment[]>([])
    const [loading, setLoading] = useState(true)

    // États des modals
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedActivity, setSelectedActivity] = useState<DbActivity | null>(null)

    // États des formulaires
    const [newActivity, setNewActivity] = useState({
        name: '',
        amount: '',
        description: '',
        category: ''
    })

    const [editActivity, setEditActivity] = useState({
        name: '',
        amount: '',
        description: ''
    })

    // État de sauvegarde
    const [saving, setSaving] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    // Suggestions d'activités prédéfinies par catégorie
    const activitySuggestions = {
        famille: [
            {
                name: 'Sortie plage familiale',
                amount: 75,
                description: 'Transport, snacks et activités pour une journée à la plage',
                icon: MapPin
            },
            {
                name: 'Cinéma famille',
                amount: 45,
                description: 'Billets de cinéma et popcorn pour toute la famille',
                icon: Gamepad2
            },
            {
                name: 'Restaurant familial',
                amount: 85,
                description: 'Repas au restaurant pour célébrer un événement',
                icon: Utensils
            },
            {
                name: 'Parc d\'attractions',
                amount: 120,
                description: 'Entrées et repas pour une journée au parc',
                icon: Gift
            }
        ],
        maison: [
            {
                name: 'Réparation maison',
                amount: 150,
                description: 'Matériaux et outils pour réparations domestiques',
                icon: Home
            },
            {
                name: 'Électricité/Eau',
                amount: 120,
                description: 'Factures mensuelles des services publics',
                icon: Zap
            },
            {
                name: 'Équipements ménagers',
                amount: 200,
                description: 'Achat ou réparation d\'électroménager',
                icon: Home
            }
        ],
        quotidien: [
            {
                name: 'Courses alimentaires',
                amount: 80,
                description: 'Achats hebdomadaires de nourriture et produits de base',
                icon: ShoppingCart
            },
            {
                name: 'Transport commun',
                amount: 35,
                description: 'Frais de transport en commun pour la famille',
                icon: Car
            },
            {
                name: 'Essence véhicule',
                amount: 60,
                description: 'Carburant pour les déplacements familiaux',
                icon: Car
            }
        ],
        sante: [
            {
                name: 'Médicaments famille',
                amount: 45,
                description: 'Pharmacie et médicaments pour la famille',
                icon: Stethoscope
            },
            {
                name: 'Consultations médicales',
                amount: 90,
                description: 'Visites chez le médecin et spécialistes',
                icon: Stethoscope
            }
        ]
    }

    // Charger les données
    const loadData = async () => {
        setLoading(true)
        try {
            const data = await DatabaseService.loadAllData()
            setActivities(data.activities)
            setMembers(data.members)
            setPayments(data.payments)
        } catch (error) {
            console.error('Erreur chargement activités:', error)
            alert('Erreur lors du chargement des données')
        } finally {
            setLoading(false)
        }
    }

    // Recharger les données (bouton refresh)
    const reloadData = async () => {
        setRefreshing(true)
        try {
            const data = await DatabaseService.loadAllData()
            setActivities(data.activities)
            setMembers(data.members)
            setPayments(data.payments)
        } catch (error) {
            console.error('Erreur rechargement activités:', error)
            alert('Erreur lors du rechargement des données')
        } finally {
            setRefreshing(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    // Calculer le solde de la caisse
    const totalCaisse = payments.reduce((sum, payment) => sum + payment.amount, 0) -
        activities.reduce((sum, activity) => sum + activity.amount, 0)

    // Ajouter une activité
    const handleAddActivity = async () => {
        if (!newActivity.name.trim() || !newActivity.amount) return

        setSaving(true)
        try {
            const addedActivity = await DatabaseService.addActivity({
                name: newActivity.name.trim(),
                amount: parseFloat(newActivity.amount),
                description: newActivity.description.trim() || undefined
            })

            if (addedActivity) {
                setActivities(prev => [addedActivity, ...prev])
                setNewActivity({
                    name: '',
                    amount: '',
                    description: '',
                    category: ''
                })
                setShowAddModal(false)
            } else {
                alert('Erreur lors de l\'ajout de l\'activité')
            }
        } catch (error) {
            console.error('Erreur ajout activité:', error)
            alert('Erreur lors de l\'ajout de l\'activité')
        } finally {
            setSaving(false)
        }
    }

    // Modifier une activité - CORRIGÉ
    const handleEditActivity = async () => {
        if (!selectedActivity || !editActivity.name.trim() || !editActivity.amount) return

        setSaving(true)
        try {
            // Appel RÉEL à la base de données
            const success = await DatabaseService.updateActivity(selectedActivity.id, {
                name: editActivity.name.trim(),
                amount: parseFloat(editActivity.amount),
                description: editActivity.description.trim() || null
            })

            if (success) {
                // Mise à jour du state local SEULEMENT si la BDD a réussi
                setActivities(prev => prev.map(a =>
                    a.id === selectedActivity.id
                        ? {
                            ...a,
                            name: editActivity.name.trim(),
                            amount: parseFloat(editActivity.amount),
                            description: editActivity.description.trim() || null
                        }
                        : a
                ))

                setShowEditModal(false)
                setSelectedActivity(null)
            } else {
                alert('Erreur lors de la modification de l\'activité')
            }
        } catch (error) {
            console.error('Erreur modification activité:', error)
            alert('Erreur lors de la modification de l\'activité')
        } finally {
            setSaving(false)
        }
    }

    // Supprimer une activité - CORRIGÉ
    const handleDeleteActivity = async () => {
        if (!selectedActivity) return

        setSaving(true)
        try {
            // Appel RÉEL à la base de données
            const success = await DatabaseService.deleteActivity(selectedActivity.id)

            if (success) {
                // Mise à jour du state local SEULEMENT si la BDD a réussi
                setActivities(prev => prev.filter(a => a.id !== selectedActivity.id))

                setShowDeleteModal(false)
                setSelectedActivity(null)

                console.log('Activité supprimée avec succès')
            } else {
                alert('Erreur lors de la suppression de l\'activité')
            }
        } catch (error) {
            console.error('Erreur suppression activité:', error)
            alert('Erreur lors de la suppression de l\'activité')
        } finally {
            setSaving(false)
        }
    }

    // Ouvrir modal d'édition
    const openEditModal = (activity: DbActivity) => {
        setSelectedActivity(activity)
        setEditActivity({
            name: activity.name,
            amount: activity.amount.toString(),
            description: activity.description || ''
        })
        setShowEditModal(true)
    }

    // Ouvrir modal de suppression
    const openDeleteModal = (activity: DbActivity) => {
        setSelectedActivity(activity)
        setShowDeleteModal(true)
    }

    // Appliquer une suggestion
    const applySuggestion = (suggestion: any) => {
        setNewActivity(prev => ({
            ...prev,
            name: suggestion.name,
            amount: suggestion.amount.toString(),
            description: suggestion.description
        }))
    }

    // Calculer les statistiques
    const totalSpent = activities.reduce((sum, a) => sum + a.amount, 0)
    const averageActivity = activities.length > 0 ? totalSpent / activities.length : 0
    const thisMonthActivities = activities.filter(a => {
        const activityDate = new Date(a.activity_date)
        const now = new Date()
        return activityDate.getMonth() === now.getMonth() &&
            activityDate.getFullYear() === now.getFullYear()
    })
    const thisMonthSpent = thisMonthActivities.reduce((sum, a) => sum + a.amount, 0)

    // Grouper les activités par mois
    const activitiesByMonth = activities.reduce((acc, activity) => {
        const month = new Date(activity.activity_date).toISOString().slice(0, 7)
        if (!acc[month]) acc[month] = []
        acc[month].push(activity)
        return acc
    }, {} as Record<string, DbActivity[]>)

    // Obtenir l'icône selon le nom de l'activité
    const getActivityIcon = (name: string) => {
        const nameLower = name.toLowerCase()
        if (nameLower.includes('plage') || nameLower.includes('sortie')) return MapPin
        if (nameLower.includes('maison') || nameLower.includes('réparation')) return Home
        if (nameLower.includes('courses') || nameLower.includes('achat')) return ShoppingCart
        if (nameLower.includes('transport') || nameLower.includes('essence')) return Car
        if (nameLower.includes('médical') || nameLower.includes('médicament')) return Stethoscope
        if (nameLower.includes('électricité') || nameLower.includes('eau')) return Zap
        if (nameLower.includes('restaurant') || nameLower.includes('repas')) return Utensils
        return Activity
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
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                🎉 Activités Familiales
                            </h1>
                            <p className="text-gray-600">
                                {activities.length} activité{activities.length !== 1 ? 's' : ''} enregistrée{activities.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Bouton de rechargement */}
                        <button
                            onClick={reloadData}
                            disabled={refreshing}
                            className="bg-white/70 backdrop-blur-lg p-3 rounded-full border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Recharger les données"
                        >
                            <RefreshCw className={`h-5 w-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>

                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Nouvelle Activité
                        </button>
                    </div>
                </div>

                {/* Stats Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Solde Caisse */}
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center">
                            <div className={`p-3 rounded-full mr-4 ${totalCaisse >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                <Euro className={`h-8 w-8 ${totalCaisse >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Solde Caisse</p>
                                <p className={`text-2xl font-bold ${totalCaisse >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {totalCaisse.toFixed(2)}€
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total Dépensé */}
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center">
                            <div className="bg-red-100 p-3 rounded-full mr-4">
                                <TrendingDown className="h-8 w-8 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Dépensé</p>
                                <p className="text-2xl font-bold text-red-600">{totalSpent.toFixed(2)}€</p>
                            </div>
                        </div>
                    </div>

                    {/* Dépense Moyenne */}
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                <Target className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Dépense Moyenne</p>
                                <p className="text-2xl font-bold text-blue-600">{averageActivity.toFixed(2)}€</p>
                            </div>
                        </div>
                    </div>

                    {/* Ce Mois */}
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center">
                            <div className="bg-orange-100 p-3 rounded-full mr-4">
                                <Calendar className="h-8 w-8 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Ce Mois</p>
                                <p className="text-2xl font-bold text-orange-600">{thisMonthSpent.toFixed(2)}€</p>
                                <p className="text-xs text-gray-500">{thisMonthActivities.length} activité{thisMonthActivities.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alerte si solde faible */}
                {totalCaisse < 100 && totalCaisse > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-8 flex items-center">
                        <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
                        <div>
                            <p className="text-yellow-800 font-medium">Attention : Solde de caisse faible</p>
                            <p className="text-yellow-700 text-sm">
                                Il reste seulement {totalCaisse.toFixed(2)}€ dans la caisse. Pensez à demander des cotisations.
                            </p>
                        </div>
                    </div>
                )}

                {totalCaisse < 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 flex items-center">
                        <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                        <div>
                            <p className="text-red-800 font-medium">Alerte : Solde de caisse négatif</p>
                            <p className="text-red-700 text-sm">
                                La caisse est en déficit de {Math.abs(totalCaisse).toFixed(2)}€. Il faut collecter des cotisations rapidement.
                            </p>
                        </div>
                    </div>
                )}

                {/* Liste des Activités */}
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <BarChart3 className="h-6 w-6 text-orange-600 mr-2" />
                            Historique des Activités
                        </h3>
                    </div>

                    {activities.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {Object.entries(activitiesByMonth)
                                .sort(([a], [b]) => b.localeCompare(a))
                                .map(([month, monthActivities]) => (
                                    <div key={month} className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-lg font-semibold text-gray-800">
                                                {new Date(month + '-01').toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'long'
                                                })}
                                            </h4>
                                            <div className="text-sm text-gray-500">
                                                {monthActivities.length} activité{monthActivities.length !== 1 ? 's' : ''} •
                                                <span className="font-bold text-red-600 ml-1">
                                                    {monthActivities.reduce((sum, a) => sum + a.amount, 0).toFixed(2)}€
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {monthActivities.map(activity => {
                                                const IconComponent = getActivityIcon(activity.name)
                                                return (
                                                    <div
                                                        key={activity.id}
                                                        className="bg-white/50 rounded-xl p-4 border border-white/20 hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                                                    >
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                                                                <IconComponent className="h-5 w-5 text-white" />
                                                            </div>
                                                            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                <button
                                                                    onClick={() => openEditModal(activity)}
                                                                    className="p-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg mr-2 transition-colors"
                                                                    title="Modifier l'activité"
                                                                >
                                                                    <Edit3 className="h-3 w-3 text-blue-600" />
                                                                </button>
                                                                <button
                                                                    onClick={() => openDeleteModal(activity)}
                                                                    className="p-1.5 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                                                                    title="Supprimer l'activité"
                                                                >
                                                                    <Trash2 className="h-3 w-3 text-red-600" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <h5 className="font-medium text-gray-800 mb-2">{activity.name}</h5>

                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-lg font-bold text-red-600">
                                                                -{activity.amount.toFixed(2)}€
                                                            </span>
                                                            <div className="flex items-center text-xs text-gray-500">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                {new Date(activity.activity_date).toLocaleDateString('fr-FR')}
                                                            </div>
                                                        </div>

                                                        {activity.description && (
                                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                                {activity.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Activity className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-500 mb-2">Aucune activité</h3>
                            <p className="text-gray-400 mb-6">Commencez par enregistrer votre première activité familiale</p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-lg"
                            >
                                Première Activité
                            </button>
                        </div>
                    )}
                </div>

            </div>

            {/* Modal Nouvelle Activité */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Nouvelle Activité Familiale</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Suggestions par Catégorie */}
                        <div className="mb-6">
                            <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center">
                                <Gift className="h-5 w-5 mr-2" />
                                Suggestions d'Activités
                            </h4>

                            {Object.entries(activitySuggestions).map(([category, suggestions]) => (
                                <div key={category} className="mb-6">
                                    <h5 className="text-sm font-medium text-gray-600 mb-3 capitalize">
                                        {category === 'famille' ? '👨‍👩‍👧‍👦 Activités Familiales' :
                                            category === 'maison' ? '🏠 Maison & Équipements' :
                                                category === 'quotidien' ? '🛒 Quotidien & Transport' :
                                                    category === 'sante' ? '🏥 Santé & Bien-être' : category}
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                        {suggestions.map((suggestion, index) => {
                                            const IconComponent = suggestion.icon
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => applySuggestion(suggestion)}
                                                    className="p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 text-left group"
                                                >
                                                    <div className="flex items-center mb-2">
                                                        <div className="bg-orange-100 p-2 rounded-lg mr-3 group-hover:bg-orange-200">
                                                            <IconComponent className="h-4 w-4 text-orange-600" />
                                                        </div>
                                                        <div className="font-medium text-gray-800 text-sm group-hover:text-orange-600">
                                                            {suggestion.name}
                                                        </div>
                                                    </div>
                                                    <div className="text-lg font-bold text-orange-600 mb-1">
                                                        {suggestion.amount}€
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {suggestion.description}
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <h4 className="text-md font-semibold text-gray-700 mb-4">Ou créer une activité personnalisée</h4>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nom de l'activité *
                                    </label>
                                    <input
                                        type="text"
                                        value={newActivity.name}
                                        onChange={(e) => setNewActivity(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Ex: Sortie au zoo familial"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Montant dépensé *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={newActivity.amount}
                                            onChange={(e) => setNewActivity(prev => ({ ...prev, amount: e.target.value }))}
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <Euro className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description (optionnelle)
                                    </label>
                                    <textarea
                                        value={newActivity.description}
                                        onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Détails de l'activité, participants, etc..."
                                        rows={3}
                                    />
                                </div>

                                {/* Aperçu impact sur la caisse */}
                                {newActivity.amount && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-orange-700 font-medium">Nouveau solde de caisse:</span>
                                            <span className={`text-xl font-bold ${(totalCaisse - parseFloat(newActivity.amount || '0')) >= 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                                }`}>
                                                {(totalCaisse - parseFloat(newActivity.amount || '0')).toFixed(2)}€
                                            </span>
                                        </div>
                                        {(totalCaisse - parseFloat(newActivity.amount || '0')) < 0 && (
                                            <p className="text-red-600 text-sm mt-2">
                                                ⚠️ Cette dépense mettra la caisse en déficit
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleAddActivity}
                                disabled={!newActivity.name.trim() || !newActivity.amount || saving}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Enregistrer l'Activité
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Modifier Activité */}
            {showEditModal && selectedActivity && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Modifier l'Activité</h3>
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
                                    Nom de l'activité *
                                </label>
                                <input
                                    type="text"
                                    value={editActivity.name}
                                    onChange={(e) => setEditActivity(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Montant dépensé *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editActivity.amount}
                                        onChange={(e) => setEditActivity(prev => ({ ...prev, amount: e.target.value }))}
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <Euro className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={editActivity.description}
                                    onChange={(e) => setEditActivity(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    rows={3}
                                />
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
                                onClick={handleEditActivity}
                                disabled={!editActivity.name.trim() || !editActivity.amount || saving}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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

            {/* Modal Supprimer Activité */}
            {showDeleteModal && selectedActivity && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-red-600 flex items-center">
                                <AlertTriangle className="h-6 w-6 mr-2" />
                                Supprimer l'Activité
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
                                Êtes-vous sûr de vouloir supprimer l'activité <strong>{selectedActivity.name}</strong> ?
                            </p>

                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-orange-700 font-medium">Montant à rembourser:</span>
                                    <span className="text-xl font-bold text-orange-600">
                                        +{selectedActivity.amount.toFixed(2)}€
                                    </span>
                                </div>
                                <p className="text-orange-600 text-sm mt-2">
                                    💡 Cette suppression remettra {selectedActivity.amount.toFixed(2)}€ dans la caisse
                                </p>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-600 text-sm">
                                    ⚠️ Cette action est irréversible. L'historique de cette activité sera définitivement supprimé.
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
                                onClick={() => {
                                    setShowDeleteModal(false)
                                    openEditModal(selectedActivity)
                                }}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center"
                            >
                                <Edit3 className="h-4 w-4 mr-2" />
                                Modifier Plutôt
                            </button>
                            <button
                                onClick={handleDeleteActivity}
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
                                        Supprimer Définitivement
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

export default Activities