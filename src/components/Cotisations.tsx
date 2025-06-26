import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    Plus,
    ArrowLeft,
    Euro,
    Calendar,
    TrendingUp,
    Edit3,
    Trash2,
    Save,
    X,
    CheckCircle,
    AlertTriangle,
    Users,
    Target,
    FileText,
    BarChart3,
    PieChart
} from 'lucide-react';
import { DatabaseService } from '../services/database';
import { DbMember, DbCotisation, DbPayment } from '../lib/supabase';

interface CotisationsProps {
    onBack: () => void;
}

const Cotisations: React.FC<CotisationsProps> = ({ onBack }) => {
    const [members, setMembers] = useState<DbMember[]>([]);
    const [cotisations, setCotisations] = useState<DbCotisation[]>([]);
    const [payments, setPayments] = useState<DbPayment[]>([]);
    const [loading, setLoading] = useState(true);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCotisation, setSelectedCotisation] = useState<DbCotisation | null>(null);

    const [newCotisation, setNewCotisation] = useState({
        name: '',
        amount: '',
        description: '',
        month: new Date().toISOString().slice(0, 7)
    });

    const [editCotisation, setEditCotisation] = useState({
        name: '',
        amount: '',
        description: '',
        month: ''
    });

    const [saving, setSaving] = useState(false);

    const cotisationSuggestions = [
        { name: 'Cotisation Mensuelle Standard', amount: 50, description: 'Cotisation mensuelle de base pour tous les membres' },
        { name: 'Frais de Gestion', amount: 25, description: 'Frais administratifs et de gestion mensuelle' },
        { name: 'Cotisation Familiale', amount: 100, description: 'Cotisation pour activités familiales' },
        { name: 'Contribution Spéciale', amount: 75, description: 'Contribution pour projets spéciaux' },
        { name: 'Frais de Maintenance', amount: 30, description: 'Maintenance et entretien des équipements' },
        { name: 'Fonds d\'Urgence', amount: 40, description: 'Constitution d\'un fonds d\'urgence familial' }
    ];

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await DatabaseService.loadAllData();
                setMembers(data.members);
                setCotisations(data.cotisations);
                setPayments(data.payments);
            } catch (error) {
                console.error('Erreur chargement cotisations:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const getCotisationStats = (cotisationId: string) => {
        const cotisationPayments = payments.filter(p => p.cotisation_id === cotisationId);
        const totalCollected = cotisationPayments.reduce((sum, p) => sum + p.amount, 0);
        const totalMembers = members.length;
        const membersWhoPaid = new Set(cotisationPayments.map(p => p.member_id)).size;
        const paymentRate = totalMembers > 0 ? Math.round((membersWhoPaid / totalMembers) * 100) : 0;

        const cotisation = cotisations.find(c => c.id === cotisationId);
        const expectedTotal = cotisation ? cotisation.amount * totalMembers : 0;
        const collectionRate = expectedTotal > 0 ? Math.round((totalCollected / expectedTotal) * 100) : 0;

        return {
            totalCollected,
            membersWhoPaid,
            totalMembers,
            paymentRate,
            expectedTotal,
            collectionRate,
            paymentsCount: cotisationPayments.length
        };
    };

    const handleAddCotisation = async () => {
        if (!newCotisation.name.trim() || !newCotisation.amount) return;

        setSaving(true);
        try {
            const addedCotisation = await DatabaseService.addCotisation({
                name: newCotisation.name.trim(),
                amount: parseFloat(newCotisation.amount),
                description: newCotisation.description.trim() || undefined,
                month: newCotisation.month
            });

            if (addedCotisation) {
                setCotisations(prev => [addedCotisation, ...prev]);
                setNewCotisation({
                    name: '',
                    amount: '',
                    description: '',
                    month: new Date().toISOString().slice(0, 7)
                });
                setShowAddModal(false);
            }
        } catch (error) {
            console.error('Erreur ajout cotisation:', error);
        } finally {
            setSaving(false);
        }
    };
    // Modifier une cotisation
    const handleEditCotisation = async () => {
        if (!selectedCotisation || !editCotisation.name.trim() || !editCotisation.amount) return

        setSaving(true)
        try {
            // Appeler directement avec les données transformées
            const updated = await DatabaseService.updateCotisation(selectedCotisation.id, {
                name: editCotisation.name.trim(),
                amount: parseFloat(editCotisation.amount),
                description: editCotisation.description.trim() || null,
                month: editCotisation.month
            })

            if (updated) {
                // Mettre à jour l'état local avec les mêmes valeurs
                setCotisations(prev => prev.map(c =>
                    c.id === selectedCotisation.id
                        ? {
                            ...c,
                            name: editCotisation.name.trim(),
                            amount: parseFloat(editCotisation.amount),
                            description: editCotisation.description.trim() || null,
                            month: editCotisation.month
                        }
                        : c
                ))

                setShowEditModal(false)
                setSelectedCotisation(null)
            }
        } catch (error) {
            console.error('Erreur modification cotisation:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteCotisation = async () => {
        if (!selectedCotisation) return;

        setSaving(true);
        try {
            await DatabaseService.deleteCotisation(selectedCotisation.id);
            setCotisations(prev => prev.filter(c => c.id !== selectedCotisation.id));
            setShowDeleteModal(false);
            setSelectedCotisation(null);
        } catch (error) {
            console.error('Erreur suppression cotisation:', error);
        } finally {
            setSaving(false);
        }
    };

    const openEditModal = (cotisation: DbCotisation) => {
        setSelectedCotisation(cotisation);
        setEditCotisation({
            name: cotisation.name,
            amount: cotisation.amount.toString(),
            description: cotisation.description || '',
            month: cotisation.month
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (cotisation: DbCotisation) => {
        setSelectedCotisation(cotisation);
        setShowDeleteModal(true);
    };

    const applySuggestion = (suggestion: typeof cotisationSuggestions[0]) => {
        setNewCotisation(prev => ({
            ...prev,
            name: suggestion.name,
            amount: suggestion.amount.toString(),
            description: suggestion.description
        }));
    };

    const totalExpected = cotisations.reduce((sum, c) => sum + (c.amount * members.length), 0);
    const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
    const globalCollectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <button
                            onClick={onBack}
                            className="mr-4 p-2 bg-white/70 backdrop-blur-lg rounded-full border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <ArrowLeft className="h-6 w-6 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                💰 Gestion des Cotisations
                            </h1>
                            <p className="text-gray-600">
                                {cotisations.length} cotisation{cotisations.length !== 1 ? 's' : ''} créée{cotisations.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Nouvelle Cotisation
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center">
                            <div className="bg-purple-100 p-3 rounded-full mr-4">
                                <CreditCard className="h-8 w-8 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Cotisations</p>
                                <p className="text-3xl font-bold text-purple-600">{cotisations.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                <Target className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Montant Attendu</p>
                                <p className="text-2xl font-bold text-blue-600">{totalExpected.toFixed(2)}€</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-full mr-4">
                                <Euro className="h-8 w-8 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Montant Collecté</p>
                                <p className="text-2xl font-bold text-green-600">{totalCollected.toFixed(2)}€</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center">
                            <div className="bg-emerald-100 p-3 rounded-full mr-4">
                                <TrendingUp className="h-8 w-8 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Taux de Collection</p>
                                <p className="text-2xl font-bold text-emerald-600">{globalCollectionRate}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {cotisations.map(cotisation => {
                        const stats = getCotisationStats(cotisation.id);
                        return (
                            <div
                                key={cotisation.id}
                                className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                                        <CreditCard className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={() => openEditModal(cotisation)}
                                            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg mr-2 transition-colors"
                                        >
                                            <Edit3 className="h-4 w-4 text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(cotisation)}
                                            className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{cotisation.name}</h3>
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <Euro className="h-4 w-4 mr-2" />
                                        <span className="text-lg font-bold text-purple-600">{cotisation.amount.toFixed(2)}€</span>
                                        <span className="text-sm text-gray-500 ml-2">par membre</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span className="text-sm">
                                            {new Date(cotisation.month + '-01').toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long'
                                            })}
                                        </span>
                                    </div>
                                    {cotisation.description && (
                                        <div className="flex items-start text-gray-600">
                                            <FileText className="h-4 w-4 mr-2 mt-0.5" />
                                            <span className="text-sm">{cotisation.description}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Collecté</p>
                                            <p className="text-lg font-bold text-green-600">
                                                {stats.totalCollected.toFixed(2)}€
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Attendu</p>
                                            <p className="text-lg font-bold text-blue-600">
                                                {stats.expectedTotal.toFixed(2)}€
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>Progression</span>
                                            <span>{stats.collectionRate}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${Math.min(stats.collectionRate, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <Users className="h-4 w-4 mr-1" />
                                            <span>{stats.membersWhoPaid}/{stats.totalMembers} membres</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <BarChart3 className="h-4 w-4 mr-1" />
                                            <span>{stats.paymentsCount} paiement{stats.paymentsCount !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        {stats.collectionRate >= 100 ? (
                                            <div className="flex items-center text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                <span className="text-sm font-medium">Collecte complète</span>
                                            </div>
                                        ) : stats.collectionRate >= 75 ? (
                                            <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                                                <TrendingUp className="h-4 w-4 mr-2" />
                                                <span className="text-sm font-medium">Bonne progression</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                                                <AlertTriangle className="h-4 w-4 mr-2" />
                                                <span className="text-sm font-medium">En cours de collecte</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {cotisations.length === 0 && (
                    <div className="text-center py-12">
                        <CreditCard className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-500 mb-2">Aucune cotisation</h3>
                        <p className="text-gray-400 mb-6">Commencez par créer votre première cotisation</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            Créer la Première Cotisation
                        </button>
                    </div>
                )}

                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Nouvelle Cotisation</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-6 w-6 text-gray-500" />
                                </button>
                            </div>
                            <div className="mb-6">
                                <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                                    <PieChart className="h-5 w-5 mr-2" />
                                    Suggestions Rapides
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {cotisationSuggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() => applySuggestion(suggestion)}
                                            className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 text-left group"
                                        >
                                            <div className="font-medium text-gray-800 group-hover:text-purple-600">
                                                {suggestion.name}
                                            </div>
                                            <div className="text-lg font-bold text-purple-600 mt-1">
                                                {suggestion.amount}€
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {suggestion.description}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nom de la cotisation *
                                    </label>
                                    <input
                                        type="text"
                                        value={newCotisation.name}
                                        onChange={(e) => setNewCotisation(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Ex: Cotisation Mensuelle Janvier 2025"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Montant par membre *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={newCotisation.amount}
                                            onChange={(e) => setNewCotisation(prev => ({ ...prev, amount: e.target.value }))}
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="50.00"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <Euro className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mois de la cotisation
                                    </label>
                                    <input
                                        type="month"
                                        value={newCotisation.month}
                                        onChange={(e) => setNewCotisation(prev => ({ ...prev, month: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description (optionnelle)
                                    </label>
                                    <textarea
                                        value={newCotisation.description}
                                        onChange={(e) => setNewCotisation(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Description de la cotisation et son objectif..."
                                        rows={3}
                                    />
                                </div>
                                {newCotisation.amount && (
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-purple-700 font-medium">Total attendu ({members.length} membres):</span>
                                            <span className="text-xl font-bold text-purple-600">
                                                {(parseFloat(newCotisation.amount || '0') * members.length).toFixed(2)}€
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end mt-6 space-x-3">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleAddCotisation}
                                    disabled={!newCotisation.name.trim() || !newCotisation.amount || saving}
                                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {saving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Création...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Créer la Cotisation
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showEditModal && selectedCotisation && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Modifier la Cotisation</h3>
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
                                        Nom de la cotisation *
                                    </label>
                                    <input
                                        type="text"
                                        value={editCotisation.name}
                                        onChange={(e) => setEditCotisation(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Montant par membre *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={editCotisation.amount}
                                            onChange={(e) => setEditCotisation(prev => ({ ...prev, amount: e.target.value }))}
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <Euro className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mois de la cotisation
                                    </label>
                                    <input
                                        type="month"
                                        value={editCotisation.month}
                                        onChange={(e) => setEditCotisation(prev => ({ ...prev, month: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={editCotisation.description}
                                        onChange={(e) => setEditCotisation(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex justify-end mt-6 space-x-3">
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleEditCotisation}
                                        disabled={!editCotisation.name.trim() || !editCotisation.amount || saving}
                                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
                    </div>
                )}

                {showDeleteModal && selectedCotisation && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-red-600 flex items-center">
                                    <AlertTriangle className="h-6 w-6 mr-2" />
                                    Supprimer la Cotisation
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
                                    Êtes-vous sûr de vouloir supprimer la cotisation <strong>{selectedCotisation.name}</strong> ?
                                </p>
                                {(() => {
                                    const stats = getCotisationStats(selectedCotisation.id);
                                    return (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                            <p className="text-red-600 text-sm mb-2">
                                                ⚠️ Cette action supprimera définitivement :
                                            </p>
                                            <ul className="text-red-600 text-sm space-y-1">
                                                <li>• La cotisation de {selectedCotisation.amount.toFixed(2)}€</li>
                                                <li>• {stats.paymentsCount} paiement{stats.paymentsCount !== 1 ? 's' : ''} associé{stats.paymentsCount !== 1 ? 's' : ''}</li>
                                                <li>• {stats.totalCollected.toFixed(2)}€ déjà collectés</li>
                                            </ul>
                                        </div>
                                    );
                                })()}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <p className="text-gray-600 text-sm">
                                        💡 <strong>Alternative :</strong> Vous pouvez modifier cette cotisation au lieu de la supprimer pour conserver l'historique des paiements.
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
                                        setShowDeleteModal(false);
                                        openEditModal(selectedCotisation);
                                    }}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center"
                                >
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Modifier Plutôt
                                </button>
                                <button
                                    onClick={handleDeleteCotisation}
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
        </div>
    );
};

export default Cotisations;
