import React, { useState, useEffect } from 'react'
import {
    Settings as SettingsIcon,
    User,
    Palette,
    Database,
    Download,
    Upload,
    Save,
    RotateCcw,
    Moon,
    Sun,
    Monitor,
    CheckCircle,
    AlertCircle
} from 'lucide-react'
import { DatabaseService, authService } from '../lib/supabaseService'
import type {
    UserProfileSettings,
    AppearanceSettings,
    ApplicationSettings,
    DataSettings
} from '../lib/supabaseService'

interface SettingsProps {
    onNavigate?: (section: string) => void
}

const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'application' | 'data'>('profile')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    // États pour chaque section
    const [profileSettings, setProfileSettings] = useState<UserProfileSettings>({
        full_name: '',
        email: '',
        phone: '',
        avatar_url: null,
        bio: '',
        role: 'member'
    })

    const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
        theme: 'light',
        primary_color: '#3B82F6',
        language: 'fr',
        font_size: 'medium',
        animations: true
    })

    const [applicationSettings, setApplicationSettings] = useState<ApplicationSettings>({
        currency: 'EUR',
        currency_symbol: '€',
        date_format: 'DD/MM/YYYY',
        decimal_places: 2,
        auto_backup: true,
        reminder_days: 7
    })

    const [dataSettings, setDataSettings] = useState<DataSettings>({
        auto_export: false,
        export_format: 'JSON',
        backup_frequency: 'weekly',
        keep_backups: 5,
        last_backup: null,
        last_export: null
    })

    // Charger les paramètres au montage
    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        try {
            setLoading(true)
            const user = authService.getSession().user
            if (!user) return

            const settings = await DatabaseService.getUserSettings(user.id)

            setProfileSettings(settings.profile)
            setAppearanceSettings(settings.appearance)
            setApplicationSettings(settings.application)
            setDataSettings(settings.data)
        } catch (error) {
            console.error('Erreur chargement paramètres:', error)
            showNotification('error', 'Erreur lors du chargement des paramètres')
        } finally {
            setLoading(false)
        }
    }

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 3000)
    }

    const saveSettings = async (category: 'profile' | 'appearance' | 'application' | 'data', settings: any) => {
        try {
            setSaving(true)
            const user = authService.getSession().user
            if (!user) return

            const success = await DatabaseService.updateMultipleSettings(user.id, category, settings)

            if (success) {
                showNotification('success', 'Paramètres sauvegardés avec succès !')
            } else {
                showNotification('error', 'Erreur lors de la sauvegarde')
            }
        } catch (error) {
            console.error('Erreur sauvegarde:', error)
            showNotification('error', 'Erreur lors de la sauvegarde')
        } finally {
            setSaving(false)
        }
    }

    const handleExportData = async () => {
        try {
            const user = authService.getSession().user
            if (!user) return

            const data = await DatabaseService.exportUserData(user.id, dataSettings.export_format)
            if (data) {
                // ✅ CORRECTION - Gestion des différents formats
                const mimeTypes = {
                    'JSON': 'application/json',
                    'CSV': 'text/csv',
                    'EXCEL': 'application/json' // Pour l'instant, EXCEL retourne du JSON
                }

                const extensions = {
                    'JSON': 'json',
                    'CSV': 'csv',
                    'EXCEL': 'json' // Pour l'instant
                }

                const blob = new Blob([data], { type: mimeTypes[dataSettings.export_format] })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `caissier-familial-export-${new Date().toISOString().split('T')[0]}.${extensions[dataSettings.export_format]}`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)

                showNotification('success', 'Données exportées avec succès !')

                // Mettre à jour la date du dernier export
                const newDataSettings = { ...dataSettings, last_export: new Date().toISOString() }
                setDataSettings(newDataSettings)
                await saveSettings('data', newDataSettings)
            } else {
                showNotification('error', 'Erreur lors de l\'export')
            }
        } catch (error) {
            console.error('Erreur export:', error)
            showNotification('error', 'Erreur lors de l\'export')
        }
    }

    const handleResetSettings = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) return

        try {
            const user = authService.getSession().user
            if (!user) return

            const success = await DatabaseService.resetUserSettings(user.id)
            if (success) {
                showNotification('success', 'Paramètres réinitialisés avec succès !')
                await loadSettings()
            } else {
                showNotification('error', 'Erreur lors de la réinitialisation')
            }
        } catch (error) {
            console.error('Erreur reset:', error)
            showNotification('error', 'Erreur lors de la réinitialisation')
        }
    }

    const tabs = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'appearance', label: 'Apparence', icon: Palette },
        { id: 'application', label: 'Application', icon: SettingsIcon },
        { id: 'data', label: 'Données', icon: Database }
    ] as const

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
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        ⚙️ Paramètres
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Personnalisez votre expérience Caissier Familial
                    </p>
                </div>

                {/* Notification */}
                {notification && (
                    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${notification.type === 'success'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                        }`}>
                        {notification.type === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                        <span>{notification.message}</span>
                    </div>
                )}

                <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">

                    {/* Navigation tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            {tabs.map((tab) => {
                                const IconComponent = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <IconComponent className="w-5 h-5" />
                                        {tab.label}
                                    </button>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="p-6">

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <User className="w-6 h-6 text-indigo-600" />
                                    Profil utilisateur
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nom complet
                                        </label>
                                        <input
                                            type="text"
                                            value={profileSettings.full_name}
                                            onChange={(e) => setProfileSettings((prev: UserProfileSettings) => ({ ...prev, full_name: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="Votre nom complet"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={profileSettings.email}
                                            onChange={(e) => setProfileSettings((prev: UserProfileSettings) => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="votre@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Téléphone
                                        </label>
                                        <input
                                            type="tel"
                                            value={profileSettings.phone}
                                            onChange={(e) => setProfileSettings((prev: UserProfileSettings) => ({ ...prev, phone: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="+33 6 12 34 56 78"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rôle
                                        </label>
                                        <select
                                            value={profileSettings.role}
                                            onChange={(e) => setProfileSettings((prev: UserProfileSettings) => ({ ...prev, role: e.target.value as 'admin' | 'member' | 'guest' }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="admin">Administrateur</option>
                                            <option value="member">Membre</option>
                                            <option value="guest">Invité</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Biographie
                                    </label>
                                    <textarea
                                        value={profileSettings.bio}
                                        onChange={(e) => setProfileSettings((prev: UserProfileSettings) => ({ ...prev, bio: e.target.value }))}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                        placeholder="Parlez-nous de vous..."
                                    />
                                </div>

                                <button
                                    onClick={() => saveSettings('profile', profileSettings)}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                >
                                    <Save className="w-5 h-5" />
                                    {saving ? 'Sauvegarde...' : 'Sauvegarder le profil'}
                                </button>
                            </div>
                        )}

                        {/* Appearance Tab */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Palette className="w-6 h-6 text-indigo-600" />
                                    Apparence
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Thème */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Thème
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { value: 'light', label: 'Clair', icon: Sun },
                                                { value: 'dark', label: 'Sombre', icon: Moon },
                                                { value: 'auto', label: 'Auto', icon: Monitor }
                                            ].map((theme) => {
                                                const IconComponent = theme.icon
                                                return (
                                                    <label
                                                        key={theme.value}
                                                        className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${appearanceSettings.theme === theme.value
                                                            ? 'border-indigo-500 bg-indigo-50'
                                                            : 'border-gray-300 hover:border-gray-400'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="theme"
                                                            value={theme.value}
                                                            checked={appearanceSettings.theme === theme.value}
                                                            onChange={(e) => setAppearanceSettings((prev: AppearanceSettings) => ({ ...prev, theme: e.target.value as 'light' | 'dark' | 'auto' }))}
                                                            className="sr-only"
                                                        />
                                                        <IconComponent className="w-6 h-6 mb-2" />
                                                        <span className="text-sm font-medium">{theme.label}</span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Langue */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Langue
                                        </label>
                                        <select
                                            value={appearanceSettings.language}
                                            onChange={(e) => setAppearanceSettings((prev: AppearanceSettings) => ({ ...prev, language: e.target.value as 'fr' | 'en' }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="fr">🇫🇷 Français</option>
                                            <option value="en">🇺🇸 English</option>
                                        </select>
                                    </div>

                                    {/* Couleur principale */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Couleur principale
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={appearanceSettings.primary_color}
                                                onChange={(e) => setAppearanceSettings((prev: AppearanceSettings) => ({ ...prev, primary_color: e.target.value }))}
                                                className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={appearanceSettings.primary_color}
                                                onChange={(e) => setAppearanceSettings((prev: AppearanceSettings) => ({ ...prev, primary_color: e.target.value }))}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="#3B82F6"
                                            />
                                        </div>
                                    </div>

                                    {/* Taille de police */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Taille de police
                                        </label>
                                        <select
                                            value={appearanceSettings.font_size}
                                            onChange={(e) => setAppearanceSettings((prev: AppearanceSettings) => ({ ...prev, font_size: e.target.value as 'small' | 'medium' | 'large' }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="small">Petite</option>
                                            <option value="medium">Moyenne</option>
                                            <option value="large">Grande</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Animations */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Animations</h3>
                                        <p className="text-sm text-gray-600">Activer les animations et transitions</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={appearanceSettings.animations}
                                            onChange={(e) => setAppearanceSettings((prev: AppearanceSettings) => ({ ...prev, animations: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                <button
                                    onClick={() => saveSettings('appearance', appearanceSettings)}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                >
                                    <Save className="w-5 h-5" />
                                    {saving ? 'Sauvegarde...' : 'Sauvegarder l\'apparence'}
                                </button>
                            </div>
                        )}

                        {/* Application Tab */}
                        {activeTab === 'application' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <SettingsIcon className="w-6 h-6 text-indigo-600" />
                                    Configuration de l'application
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Devise */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Devise
                                        </label>
                                        <select
                                            value={applicationSettings.currency}
                                            onChange={(e) => {
                                                const currency = e.target.value as 'EUR' | 'USD' | 'XOF'
                                                const symbols = { EUR: '€', USD: '$', XOF: 'FCFA' } as const
                                                setApplicationSettings((prev: ApplicationSettings) => ({
                                                    ...prev,
                                                    currency,
                                                    currency_symbol: symbols[currency]
                                                }))
                                            }}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="EUR">🇪🇺 Euro (€)</option>
                                            <option value="USD">🇺🇸 Dollar ($)</option>
                                            <option value="XOF">🇸🇳 Franc CFA (FCFA)</option>
                                        </select>
                                    </div>

                                    {/* Format de date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Format de date
                                        </label>
                                        <select
                                            value={applicationSettings.date_format}
                                            onChange={(e) => setApplicationSettings((prev: ApplicationSettings) => ({ ...prev, date_format: e.target.value as 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="DD/MM/YYYY">DD/MM/YYYY (ex: 25/12/2024)</option>
                                            <option value="MM/DD/YYYY">MM/DD/YYYY (ex: 12/25/2024)</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD (ex: 2024-12-25)</option>
                                        </select>
                                    </div>

                                    {/* Décimales */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre de décimales
                                        </label>
                                        <select
                                            value={applicationSettings.decimal_places}
                                            onChange={(e) => setApplicationSettings((prev: ApplicationSettings) => ({ ...prev, decimal_places: parseInt(e.target.value) as 0 | 1 | 2 }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="0">0 (ex: 50)</option>
                                            <option value="1">1 (ex: 50.0)</option>
                                            <option value="2">2 (ex: 50.00)</option>
                                        </select>
                                    </div>

                                    {/* Jours de rappel */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rappel avant échéance (jours)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="30"
                                            value={applicationSettings.reminder_days}
                                            onChange={(e) => setApplicationSettings((prev: ApplicationSettings) => ({ ...prev, reminder_days: parseInt(e.target.value) }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Sauvegarde automatique */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Sauvegarde automatique</h3>
                                        <p className="text-sm text-gray-600">Sauvegarder automatiquement les données</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={applicationSettings.auto_backup}
                                            onChange={(e) => setApplicationSettings((prev: ApplicationSettings) => ({ ...prev, auto_backup: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                <button
                                    onClick={() => saveSettings('application', applicationSettings)}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                >
                                    <Save className="w-5 h-5" />
                                    {saving ? 'Sauvegarde...' : 'Sauvegarder la configuration'}
                                </button>
                            </div>
                        )}

                        {/* Data Tab */}
                        {activeTab === 'data' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Database className="w-6 h-6 text-indigo-600" />
                                    Gestion des données
                                </h2>

                                {/* Export/Import */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Export & Import</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Format d'export
                                            </label>
                                            <select
                                                value={dataSettings.export_format}
                                                onChange={(e) => setDataSettings((prev: DataSettings) => ({ ...prev, export_format: e.target.value as 'JSON' | 'CSV' | 'EXCEL' }))}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            >
                                                <option value="JSON">JSON (recommandé)</option>
                                                <option value="CSV">CSV (tableur)</option>
                                                <option value="EXCEL">Excel (à venir)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Dernier export
                                            </label>
                                            <p className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-600">
                                                {dataSettings.last_export
                                                    ? new Date(dataSettings.last_export).toLocaleDateString('fr-FR')
                                                    : 'Jamais'
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={handleExportData}
                                            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <Download className="w-5 h-5" />
                                            Exporter les données
                                        </button>

                                        <button
                                            onClick={() => showNotification('error', 'Import non encore disponible')}
                                            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Upload className="w-5 h-5" />
                                            Importer des données
                                        </button>
                                    </div>
                                </div>

                                {/* Sauvegarde */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sauvegarde automatique</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Fréquence de sauvegarde
                                            </label>
                                            <select
                                                value={dataSettings.backup_frequency}
                                                onChange={(e) => setDataSettings((prev: DataSettings) => ({ ...prev, backup_frequency: e.target.value as 'daily' | 'weekly' | 'monthly' }))}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            >
                                                <option value="daily">Quotidienne</option>
                                                <option value="weekly">Hebdomadaire</option>
                                                <option value="monthly">Mensuelle</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nombre de sauvegardes à conserver
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="20"
                                                value={dataSettings.keep_backups}
                                                onChange={(e) => setDataSettings((prev: DataSettings) => ({ ...prev, keep_backups: parseInt(e.target.value) }))}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Export automatique</h4>
                                            <p className="text-sm text-gray-600">Exporter automatiquement selon la fréquence</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={dataSettings.auto_export}
                                                onChange={(e) => setDataSettings((prev: DataSettings) => ({ ...prev, auto_export: e.target.checked }))}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                </div>

                                {/* Zone de danger */}
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5" />
                                        Zone de danger
                                    </h3>

                                    <div className="space-y-4">
                                        <button
                                            onClick={handleResetSettings}
                                            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            <RotateCcw className="w-5 h-5" />
                                            Réinitialiser tous les paramètres
                                        </button>

                                        <p className="text-sm text-red-700">
                                            ⚠️ Cette action réinitialisera tous vos paramètres aux valeurs par défaut. Cette action est irréversible.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => saveSettings('data', dataSettings)}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                >
                                    <Save className="w-5 h-5" />
                                    {saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings