import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
    Lock,
    Mail,
    Eye,
    EyeOff,
    User,
    Shield,
    LogIn,
    UserPlus,
    Loader
} from 'lucide-react'

interface AuthProps {
    onAuthSuccess: (user: any, profile: any) => void
}

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

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        confirmPassword: ''
    })

    // Vérifier si l'utilisateur est déjà connecté
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                await handleAuthSuccess(session.user)
            }
        }
        checkUser()
    }, [])

    // Gérer le succès de l'authentification
    const handleAuthSuccess = async (user: any) => {
        try {
            // Récupérer le profil utilisateur
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error) {
                console.error('Erreur récupération profil:', error)
                return
            }

            onAuthSuccess(user, profile)
        } catch (error) {
            console.error('Erreur handleAuthSuccess:', error)
        }
    }

    // Connexion
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            })

            if (error) {
                setMessage({ type: 'error', text: error.message })
                return
            }

            if (data.user) {
                setMessage({ type: 'success', text: 'Connexion réussie !' })
                await handleAuthSuccess(data.user)
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur de connexion' })
        } finally {
            setLoading(false)
        }
    }

    // Inscription
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' })
            return
        }

        setLoading(true)
        setMessage(null)

        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName
                    }
                }
            })

            if (error) {
                setMessage({ type: 'error', text: error.message })
                return
            }

            if (data.user) {
                setMessage({
                    type: 'success',
                    text: 'Compte créé ! Vérifiez votre email pour confirmer votre inscription.'
                })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur lors de l\'inscription' })
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Shield className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Caissier Familial Pro
                    </h1>
                    <p className="text-gray-600">
                        {isLogin ? 'Connectez-vous à votre espace familial' : 'Créez votre compte sécurisé'}
                    </p>
                </div>

                {/* Formulaire */}
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">

                    {/* Toggle Login/Signup */}
                    <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center ${isLogin
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            <LogIn className="h-4 w-4 mr-2" />
                            Connexion
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center ${!isLogin
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Inscription
                        </button>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'error'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : message.type === 'success'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">

                        {/* Nom complet (inscription seulement) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom complet
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Votre nom complet"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="votre@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirmer mot de passe (inscription seulement) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmer le mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="••••••••"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Bouton Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader className="animate-spin h-5 w-5 mr-2" />
                                    {isLogin ? 'Connexion...' : 'Création...'}
                                </>
                            ) : (
                                <>
                                    {isLogin ? <LogIn className="h-5 w-5 mr-2" /> : <UserPlus className="h-5 w-5 mr-2" />}
                                    {isLogin ? 'Se connecter' : 'Créer le compte'}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Info sécurité */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start">
                            <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                            <div className="text-sm text-blue-700">
                                <p className="font-medium mb-1">Sécurité avancée</p>
                                <p>Vos données sont protégées par un chiffrement de niveau bancaire et des politiques de sécurité strictes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth