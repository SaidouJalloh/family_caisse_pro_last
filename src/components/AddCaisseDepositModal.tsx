// import React, { useState } from 'react'
// import { Plus, DollarSign, Gift, RefreshCw, ShoppingBag, Award, HelpCircle } from 'lucide-react'
// import { DatabaseService } from '../lib/supabaseService'

// interface AddCaisseDepositModalProps {
//     isOpen: boolean
//     onClose: () => void
//     onSuccess: () => void
// }

// export const AddCaisseDepositModal: React.FC<AddCaisseDepositModalProps> = ({
//     isOpen,
//     onClose,
//     onSuccess
// }) => {
//     const [formData, setFormData] = useState({
//         amount: '',
//         category: 'don' as 'don' | 'remboursement' | 'vente' | 'bonus' | 'autre',
//         description: ''
//     })
//     const [isLoading, setIsLoading] = useState(false)

//     const categories = [
//         { value: 'don', label: 'Don familial', icon: Gift, color: 'text-green-500' },
//         { value: 'remboursement', label: 'Remboursement', icon: RefreshCw, color: 'text-blue-500' },
//         { value: 'vente', label: 'Vente d\'objets', icon: ShoppingBag, color: 'text-purple-500' },
//         { value: 'bonus', label: 'Bonus/Prime', icon: Award, color: 'text-yellow-500' },
//         { value: 'autre', label: 'Autre', icon: HelpCircle, color: 'text-gray-500' }
//     ]

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()

//         if (!formData.amount || !formData.description.trim()) {
//             alert('Veuillez remplir tous les champs !')
//             return
//         }

//         if (parseFloat(formData.amount) <= 0) {
//             alert('Le montant doit être supérieur à 0 !')
//             return
//         }

//         setIsLoading(true)

//         try {
//             const result = await DatabaseService.addCaisseDeposit({
//                 amount: parseFloat(formData.amount),
//                 category: formData.category,
//                 description: formData.description.trim()
//             })

//             if (result) {
//                 alert('💰 Argent ajouté à la caisse avec succès !')
//                 setFormData({ amount: '', category: 'don', description: '' })
//                 onSuccess()
//                 onClose()
//             } else {
//                 alert('Erreur lors de l\'ajout à la caisse')
//             }
//         } catch (error) {
//             console.error('Erreur ajout caisse:', error)
//             alert('Erreur lors de l\'ajout à la caisse')
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     const handleClose = () => {
//         setFormData({ amount: '', category: 'don', description: '' })
//         onClose()
//     }

//     if (!isOpen) return null

//     return (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
//                 {/* Header */}
//                 <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//                     <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
//                         <DollarSign className="w-6 h-6 text-green-500" />
//                         Ajouter de l'argent à la caisse
//                     </h2>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="p-6 space-y-4">
//                     {/* Montant */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                             Montant (€)
//                         </label>
//                         <input
//                             type="number"
//                             step="0.01"
//                             min="0"
//                             value={formData.amount}
//                             onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
//                             className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
//                                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white
//                                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
//                                      text-lg font-semibold"
//                             placeholder="0.00"
//                             required
//                             autoFocus
//                         />
//                     </div>

//                     {/* Catégorie */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                             Catégorie
//                         </label>
//                         <div className="grid grid-cols-1 gap-2">
//                             {categories.map((cat) => {
//                                 const IconComponent = cat.icon
//                                 return (
//                                     <label
//                                         key={cat.value}
//                                         className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all
//                                                   ${formData.category === cat.value
//                                                 ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
//                                                 : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
//                                             }`}
//                                     >
//                                         <input
//                                             type="radio"
//                                             name="category"
//                                             value={cat.value}
//                                             checked={formData.category === cat.value}
//                                             onChange={(e) => setFormData(prev => ({
//                                                 ...prev,
//                                                 category: e.target.value as 'don' | 'remboursement' | 'vente' | 'bonus' | 'autre'
//                                             }))}
//                                             className="sr-only"
//                                         />
//                                         <IconComponent className={`w-5 h-5 ${cat.color}`} />
//                                         <span className="text-gray-900 dark:text-white font-medium">
//                                             {cat.label}
//                                         </span>
//                                     </label>
//                                 )
//                             })}
//                         </div>
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                             Description
//                         </label>
//                         <textarea
//                             value={formData.description}
//                             onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//                             className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
//                                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white
//                                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
//                                      resize-none"
//                             rows={3}
//                             placeholder="Décrivez la raison de cet ajout..."
//                             required
//                         />
//                     </div>

//                     {/* Boutons */}
//                     <div className="flex gap-3 pt-4">
//                         <button
//                             type="button"
//                             onClick={handleClose}
//                             className="flex-1 px-4 py-3 text-gray-600 dark:text-gray-400 
//                                      border border-gray-300 dark:border-gray-600 rounded-lg 
//                                      hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
//                                      font-medium"
//                         >
//                             Annuler
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={isLoading}
//                             className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg 
//                                      hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed
//                                      transition-colors flex items-center justify-center gap-2
//                                      font-medium"
//                         >
//                             {isLoading ? (
//                                 <>
//                                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                                     Ajout...
//                                 </>
//                             ) : (
//                                 <>
//                                     <Plus className="w-4 h-4" />
//                                     Ajouter
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     )
// }












// code avec suppresssion optimise
import React, { useState, useEffect } from 'react'
import {
    Plus, DollarSign, Gift, RefreshCw, ShoppingBag, Award, HelpCircle,
    Trash2, Edit3, Calendar, AlertTriangle, X
} from 'lucide-react'
import { DatabaseService, DbCaisseDeposit } from '../lib/supabaseService'

interface CaisseDepositsManagerProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export const CaisseDepositsManager: React.FC<CaisseDepositsManagerProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    // États
    const [deposits, setDeposits] = useState<DbCaisseDeposit[]>([])
    const [loading, setLoading] = useState(false)
    const [showAddForm, setShowAddForm] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedDeposit, setSelectedDeposit] = useState<DbCaisseDeposit | null>(null)
    const [saving, setSaving] = useState(false)

    // Formulaire d'ajout
    const [formData, setFormData] = useState({
        amount: '',
        category: 'don' as 'don' | 'remboursement' | 'vente' | 'bonus' | 'autre',
        description: ''
    })

    const categories = [
        { value: 'don', label: 'Don familial', icon: Gift, color: 'text-green-500' },
        { value: 'remboursement', label: 'Remboursement', icon: RefreshCw, color: 'text-blue-500' },
        { value: 'vente', label: 'Vente d\'objets', icon: ShoppingBag, color: 'text-purple-500' },
        { value: 'bonus', label: 'Bonus/Prime', icon: Award, color: 'text-yellow-500' },
        { value: 'autre', label: 'Autre', icon: HelpCircle, color: 'text-gray-500' }
    ]

    // Charger les dépôts
    const loadDeposits = async () => {
        setLoading(true)
        try {
            const data = await DatabaseService.getCaisseDeposits()
            setDeposits(data)
        } catch (error) {
            console.error('Erreur chargement dépôts:', error)
            alert('Erreur lors du chargement des dépôts')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            loadDeposits()
        }
    }, [isOpen])

    // Ajouter un dépôt
    const handleAddDeposit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.amount || !formData.description.trim()) {
            alert('Veuillez remplir tous les champs !')
            return
        }

        if (parseFloat(formData.amount) <= 0) {
            alert('Le montant doit être supérieur à 0 !')
            return
        }

        setSaving(true)
        try {
            const result = await DatabaseService.addCaisseDeposit({
                amount: parseFloat(formData.amount),
                category: formData.category,
                description: formData.description.trim()
            })

            if (result) {
                setDeposits(prev => [result, ...prev])
                setFormData({ amount: '', category: 'don', description: '' })
                setShowAddForm(false)
                onSuccess() // Notifier le parent
            } else {
                alert('Erreur lors de l\'ajout du dépôt')
            }
        } catch (error) {
            console.error('Erreur ajout dépôt:', error)
            alert('Erreur lors de l\'ajout du dépôt')
        } finally {
            setSaving(false)
        }
    }

    // Supprimer un dépôt
    const handleDeleteDeposit = async () => {
        if (!selectedDeposit) return

        setSaving(true)
        try {
            const success = await DatabaseService.deleteCaisseDeposit(selectedDeposit.id)

            if (success) {
                setDeposits(prev => prev.filter(d => d.id !== selectedDeposit.id))
                setShowDeleteModal(false)
                setSelectedDeposit(null)
                onSuccess() // Notifier le parent
            } else {
                alert('Erreur lors de la suppression du dépôt')
            }
        } catch (error) {
            console.error('Erreur suppression dépôt:', error)
            alert('Erreur lors de la suppression du dépôt')
        } finally {
            setSaving(false)
        }
    }

    // Obtenir l'icône d'une catégorie
    const getCategoryIcon = (category: string) => {
        const cat = categories.find(c => c.value === category)
        return cat ? cat.icon : HelpCircle
    }

    // Obtenir la couleur d'une catégorie
    const getCategoryColor = (category: string) => {
        const cat = categories.find(c => c.value === category)
        return cat ? cat.color : 'text-gray-500'
    }

    // Obtenir le label d'une catégorie
    const getCategoryLabel = (category: string) => {
        const cat = categories.find(c => c.value === category)
        return cat ? cat.label : 'Autre'
    }

    const handleClose = () => {
        setFormData({ amount: '', category: 'don', description: '' })
        setShowAddForm(false)
        setShowDeleteModal(false)
        setSelectedDeposit(null)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-green-500" />
                        Gestion des Dépôts de Caisse
                        <span className="text-sm font-normal text-gray-500">
                            ({deposits.length} entrée{deposits.length !== 1 ? 's' : ''})
                        </span>
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                                     transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Ajouter
                        </button>
                        <button
                            onClick={handleClose}
                            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Contenu */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">

                    {/* Formulaire d'ajout */}
                    {showAddForm && (
                        <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50/50">
                            <h3 className="font-semibold text-gray-800 mb-4">Ajouter un nouveau dépôt</h3>

                            <form onSubmit={handleAddDeposit} className="space-y-4">
                                {/* Montant */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Montant (€)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.amount}
                                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                                 focus:ring-2 focus:ring-green-500 focus:border-transparent
                                                 text-lg font-semibold"
                                        placeholder="0.00"
                                        required
                                        autoFocus
                                    />
                                </div>

                                {/* Catégorie */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Catégorie
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                        {categories.map((cat) => {
                                            const IconComponent = cat.icon
                                            return (
                                                <label
                                                    key={cat.value}
                                                    className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all
                                                              ${formData.category === cat.value
                                                            ? 'border-green-500 bg-green-100'
                                                            : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="category"
                                                        value={cat.value}
                                                        checked={formData.category === cat.value}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            category: e.target.value as any
                                                        }))}
                                                        className="sr-only"
                                                    />
                                                    <IconComponent className={`w-4 h-4 ${cat.color}`} />
                                                    <span className="text-sm font-medium">{cat.label}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                                 focus:ring-2 focus:ring-green-500 focus:border-transparent
                                                 resize-none"
                                        rows={2}
                                        placeholder="Décrivez la raison de cet ajout..."
                                        required
                                    />
                                </div>

                                {/* Boutons */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddForm(false)
                                            setFormData({ amount: '', category: 'don', description: '' })
                                        }}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg 
                                                 hover:bg-gray-50 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-2 bg-green-500 text-white rounded-lg 
                                                 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed
                                                 transition-colors flex items-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Ajout...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4" />
                                                Ajouter
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Liste des dépôts */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                        </div>
                    ) : deposits.length > 0 ? (
                        <div className="space-y-3">
                            {deposits.map((deposit) => {
                                const IconComponent = getCategoryIcon(deposit.category)
                                return (
                                    <div
                                        key={deposit.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 
                                                 rounded-lg hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <IconComponent className={`w-5 h-5 ${getCategoryColor(deposit.category)}`} />
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-green-600 text-lg">
                                                        +{deposit.amount.toFixed(2)}€
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        • {getCategoryLabel(deposit.category)}
                                                    </span>
                                                </div>

                                                <p className="text-gray-700 mt-1">{deposit.description}</p>

                                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {new Date(deposit.deposit_date).toLocaleDateString('fr-FR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setSelectedDeposit(deposit)
                                                    setShowDeleteModal(true)
                                                }}
                                                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                                title="Supprimer ce dépôt"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-500 mb-2">Aucun dépôt</h3>
                            <p className="text-gray-400 mb-6">
                                Commencez par ajouter un premier dépôt à la caisse
                            </p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 
                                         transition-colors flex items-center gap-2 mx-auto"
                            >
                                <Plus className="w-4 h-4" />
                                Premier Dépôt
                            </button>
                        </div>
                    )}

                    {/* Total */}
                    {deposits.length > 0 && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700">Total des dépôts:</span>
                                <span className="text-xl font-bold text-green-600">
                                    +{deposits.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}€
                                </span>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Modal de suppression */}
            {showDeleteModal && selectedDeposit && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                                    <AlertTriangle className="w-6 h-6" />
                                    Supprimer le Dépôt
                                </h3>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-600 mb-4">
                                    Êtes-vous sûr de vouloir supprimer ce dépôt de <strong>{selectedDeposit.amount.toFixed(2)}€</strong> ?
                                </p>

                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                    <p className="text-red-600 text-sm">
                                        ⚠️ Cette action retirera {selectedDeposit.amount.toFixed(2)}€ de la caisse et ne peut pas être annulée.
                                    </p>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                    <p className="text-sm text-gray-600">
                                        <strong>Description:</strong> {selectedDeposit.description}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <strong>Catégorie:</strong> {getCategoryLabel(selectedDeposit.category)}
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
                                    disabled={saving}
                                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg 
                                             hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed
                                             transition-colors flex items-center justify-center gap-2"
                                >
                                    {saving ? (
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
    )
}

export default CaisseDepositsManager