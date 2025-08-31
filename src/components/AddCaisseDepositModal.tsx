import React, { useState } from 'react'
import { Plus, DollarSign, Gift, RefreshCw, ShoppingBag, Award, HelpCircle } from 'lucide-react'
import { DatabaseService } from '../lib/supabaseService'

interface AddCaisseDepositModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export const AddCaisseDepositModal: React.FC<AddCaisseDepositModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [formData, setFormData] = useState({
        amount: '',
        category: 'don' as 'don' | 'remboursement' | 'vente' | 'bonus' | 'autre',
        description: ''
    })
    const [isLoading, setIsLoading] = useState(false)

    const categories = [
        { value: 'don', label: 'Don familial', icon: Gift, color: 'text-green-500' },
        { value: 'remboursement', label: 'Remboursement', icon: RefreshCw, color: 'text-blue-500' },
        { value: 'vente', label: 'Vente d\'objets', icon: ShoppingBag, color: 'text-purple-500' },
        { value: 'bonus', label: 'Bonus/Prime', icon: Award, color: 'text-yellow-500' },
        { value: 'autre', label: 'Autre', icon: HelpCircle, color: 'text-gray-500' }
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.amount || !formData.description.trim()) {
            alert('Veuillez remplir tous les champs !')
            return
        }

        if (parseFloat(formData.amount) <= 0) {
            alert('Le montant doit être supérieur à 0 !')
            return
        }

        setIsLoading(true)

        try {
            const result = await DatabaseService.addCaisseDeposit({
                amount: parseFloat(formData.amount),
                category: formData.category,
                description: formData.description.trim()
            })

            if (result) {
                alert('💰 Argent ajouté à la caisse avec succès !')
                setFormData({ amount: '', category: 'don', description: '' })
                onSuccess()
                onClose()
            } else {
                alert('Erreur lors de l\'ajout à la caisse')
            }
        } catch (error) {
            console.error('Erreur ajout caisse:', error)
            alert('Erreur lors de l\'ajout à la caisse')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setFormData({ amount: '', category: 'don', description: '' })
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-green-500" />
                        Ajouter de l'argent à la caisse
                    </h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Montant */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Montant (€)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.amount}
                            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                     text-lg font-semibold"
                            placeholder="0.00"
                            required
                            autoFocus
                        />
                    </div>

                    {/* Catégorie */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Catégorie
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {categories.map((cat) => {
                                const IconComponent = cat.icon
                                return (
                                    <label
                                        key={cat.value}
                                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all
                                                  ${formData.category === cat.value
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="category"
                                            value={cat.value}
                                            checked={formData.category === cat.value}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                category: e.target.value as 'don' | 'remboursement' | 'vente' | 'bonus' | 'autre'
                                            }))}
                                            className="sr-only"
                                        />
                                        <IconComponent className={`w-5 h-5 ${cat.color}`} />
                                        <span className="text-gray-900 dark:text-white font-medium">
                                            {cat.label}
                                        </span>
                                    </label>
                                )
                            })}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                     resize-none"
                            rows={3}
                            placeholder="Décrivez la raison de cet ajout..."
                            required
                        />
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 text-gray-600 dark:text-gray-400 
                                     border border-gray-300 dark:border-gray-600 rounded-lg 
                                     hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                                     font-medium"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg 
                                     hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed
                                     transition-colors flex items-center justify-center gap-2
                                     font-medium"
                        >
                            {isLoading ? (
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
        </div>
    )
}