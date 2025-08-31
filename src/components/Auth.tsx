





// // Code qui marche mais avec recup de profile
// // src/components/Auth.tsx - Version Supabase corrigée complète
// import React, { useState, useEffect } from 'react'
// import { authService } from '../lib/supabaseService'
// import {
//     Lock,
//     Mail,
//     Eye,
//     EyeOff,
//     User,
//     Shield,
//     LogIn,
//     UserPlus,
//     Loader,
//     AlertCircle,
//     CheckCircle,
//     Cloud,
//     Wifi,
//     WifiOff
// } from 'lucide-react'

// interface AuthProps {
//     onAuthSuccess: (user: any, profile: any) => void
// }

// const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
//     const [isLogin, setIsLogin] = useState(true)
//     const [showPassword, setShowPassword] = useState(false)
//     const [loading, setLoading] = useState(false)
//     const [isOnline, setIsOnline] = useState(navigator.onLine)
//     const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)

//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//         fullName: '',
//         confirmPassword: ''
//     })

//     // Écouter les changements de connexion
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

//     // Vérifier si l'utilisateur est déjà connecté
//     useEffect(() => {
//         const checkSession = async () => {
//             if (!isOnline) {
//                 setMessage({
//                     type: 'error',
//                     text: 'Connexion internet requise pour utiliser l\'application'
//                 })
//                 return
//             }

//             try {
//                 const session = authService.getSession()
//                 if (session.user && session.profile) {
//                     onAuthSuccess(session.user, session.profile)
//                     return
//                 }
//             } catch (error) {
//                 console.error('Erreur vérification session:', error)
//             }
//         }

//         checkSession()
//     }, [onAuthSuccess, isOnline])

//     // Connexion
//     const handleLogin = async (e: React.FormEvent) => {
//         e.preventDefault()

//         if (!isOnline) {
//             setMessage({
//                 type: 'error',
//                 text: 'Connexion internet requise'
//             })
//             return
//         }

//         setLoading(true)
//         setMessage(null)

//         try {
//             const result = await authService.signIn(formData.email, formData.password)

//             if (result.error) {
//                 throw new Error(result.error)
//             }

//             if (result.user) {
//                 const profile = await authService.getProfile(result.user.id)
//                 if (profile) {
//                     setMessage({ type: 'success', text: 'Connexion réussie!' })
//                     setTimeout(() => onAuthSuccess(result.user, profile), 500)
//                 } else {
//                     throw new Error('Profil utilisateur non trouvé')
//                 }
//             }

//         } catch (error: any) {
//             let errorMessage = 'Erreur de connexion'

//             if (error.message?.includes('Invalid login credentials')) {
//                 errorMessage = 'Email ou mot de passe incorrect'
//             } else if (error.message?.includes('Email not confirmed')) {
//                 errorMessage = 'Veuillez confirmer votre email avant de vous connecter'
//             } else if (error.message?.includes('Too many requests')) {
//                 errorMessage = 'Trop de tentatives, veuillez patienter'
//             } else if (error.message) {
//                 errorMessage = error.message
//             }

//             setMessage({ type: 'error', text: errorMessage })
//         } finally {
//             setLoading(false)
//         }
//     }

//     // Inscription
//     const handleSignUp = async (e: React.FormEvent) => {
//         e.preventDefault()

//         if (!isOnline) {
//             setMessage({
//                 type: 'error',
//                 text: 'Connexion internet requise'
//             })
//             return
//         }

//         if (formData.password !== formData.confirmPassword) {
//             setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' })
//             return
//         }

//         if (formData.password.length < 6) {
//             setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' })
//             return
//         }

//         setLoading(true)
//         setMessage(null)

//         try {
//             const userData = { full_name: formData.fullName }
//             const result = await authService.signUp(formData.email, formData.password, userData)

//             if (result.error) {
//                 throw new Error(result.error)
//             }

//             if (result.user) {
//                 // Pour Supabase, l'utilisateur doit souvent confirmer son email
//                 if (!result.user.email_confirmed_at) {
//                     setMessage({
//                         type: 'info',
//                         text: 'Compte créé! Vérifiez votre email pour confirmer votre compte.'
//                     })
//                     // Basculer vers le mode connexion
//                     setIsLogin(true)
//                 } else {
//                     // Si l'email est déjà confirmé, connecter directement
//                     const profile = await authService.getProfile(result.user.id)
//                     if (profile) {
//                         setMessage({ type: 'success', text: 'Compte créé avec succès!' })
//                         setTimeout(() => onAuthSuccess(result.user, profile), 1000)
//                     }
//                 }
//             }

//         } catch (error: any) {
//             let errorMessage = 'Erreur lors de l\'inscription'

//             if (error.message?.includes('User already registered')) {
//                 errorMessage = 'Un compte existe déjà avec cet email'
//             } else if (error.message?.includes('Password should be at least')) {
//                 errorMessage = 'Le mot de passe doit contenir au moins 6 caractères'
//             } else if (error.message?.includes('Invalid email')) {
//                 errorMessage = 'Format d\'email invalide'
//             } else if (error.message) {
//                 errorMessage = error.message
//             }

//             setMessage({ type: 'error', text: errorMessage })
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData(prev => ({
//             ...prev,
//             [e.target.name]: e.target.value
//         }))
//     }

//     // Si hors ligne, afficher message d'erreur
//     if (!isOnline) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4">
//                 <div className="w-full max-w-md text-center">
//                     <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
//                         <WifiOff className="h-16 w-16 text-red-500 mx-auto mb-4" />
//                         <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion requise</h2>
//                         <p className="text-gray-600 mb-4">
//                             Cette application nécessite une connexion internet pour fonctionner.
//                         </p>
//                         <div className="text-sm text-gray-500">
//                             Vérifiez votre connexion et actualisez la page.
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4">
//             <div className="w-full max-w-md">

//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
//                         <Shield className="h-10 w-10 text-white" />
//                     </div>
//                     <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
//                         Caissier Familial Pro
//                     </h1>
//                     <p className="text-gray-600">
//                         {isLogin ? 'Connectez-vous à votre espace familial' : 'Créez votre compte sécurisé'}
//                     </p>

//                     {/* Indicateur Cloud */}
//                     <div className="mt-3 flex items-center justify-center gap-4">
//                         <div className="flex items-center text-sm text-green-600">
//                             <Cloud className="h-4 w-4 mr-1" />
//                             Mode Cloud
//                         </div>
//                         <div className="flex items-center text-xs text-green-500">
//                             <Wifi className="h-3 w-3 mr-1" />
//                             En ligne
//                         </div>
//                     </div>
//                 </div>

//                 {/* Formulaire */}
//                 <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">

//                     {/* Toggle Login/Signup */}
//                     <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
//                         <button
//                             onClick={() => setIsLogin(true)}
//                             className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center ${isLogin
//                                 ? 'bg-white text-indigo-600 shadow-sm'
//                                 : 'text-gray-600 hover:text-gray-800'
//                                 }`}
//                         >
//                             <LogIn className="h-4 w-4 mr-2" />
//                             Connexion
//                         </button>
//                         <button
//                             onClick={() => setIsLogin(false)}
//                             className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center ${!isLogin
//                                 ? 'bg-white text-indigo-600 shadow-sm'
//                                 : 'text-gray-600 hover:text-gray-800'
//                                 }`}
//                         >
//                             <UserPlus className="h-4 w-4 mr-2" />
//                             Inscription
//                         </button>
//                     </div>

//                     {/* Message */}
//                     {message && (
//                         <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'error'
//                             ? 'bg-red-50 text-red-700 border border-red-200'
//                             : message.type === 'success'
//                                 ? 'bg-green-50 text-green-700 border border-green-200'
//                                 : 'bg-blue-50 text-blue-700 border border-blue-200'
//                             }`}>
//                             <div className="flex items-center">
//                                 {message.type === 'error' && <AlertCircle className="h-4 w-4 mr-2" />}
//                                 {message.type === 'success' && <CheckCircle className="h-4 w-4 mr-2" />}
//                                 {message.type === 'info' && <AlertCircle className="h-4 w-4 mr-2" />}
//                                 {message.text}
//                             </div>
//                         </div>
//                     )}

//                     <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">

//                         {/* Nom complet (inscription seulement) */}
//                         {!isLogin && (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Nom complet
//                                 </label>
//                                 <div className="relative">
//                                     <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                                     <input
//                                         type="text"
//                                         name="fullName"
//                                         value={formData.fullName}
//                                         onChange={handleInputChange}
//                                         className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                         placeholder="Votre nom complet"
//                                         required
//                                     />
//                                 </div>
//                             </div>
//                         )}

//                         {/* Email */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Email
//                             </label>
//                             <div className="relative">
//                                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     value={formData.email}
//                                     onChange={handleInputChange}
//                                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                     placeholder="votre@email.com"
//                                     required
//                                 />
//                             </div>
//                         </div>

//                         {/* Mot de passe */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Mot de passe
//                             </label>
//                             <div className="relative">
//                                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                                 <input
//                                     type={showPassword ? 'text' : 'password'}
//                                     name="password"
//                                     value={formData.password}
//                                     onChange={handleInputChange}
//                                     className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                     placeholder="••••••••"
//                                     required
//                                     minLength={6}
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                 >
//                                     {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Confirmer mot de passe (inscription seulement) */}
//                         {!isLogin && (
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Confirmer le mot de passe
//                                 </label>
//                                 <div className="relative">
//                                     <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                                     <input
//                                         type="password"
//                                         name="confirmPassword"
//                                         value={formData.confirmPassword}
//                                         onChange={handleInputChange}
//                                         className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                         placeholder="••••••••"
//                                         required
//                                     />
//                                 </div>
//                             </div>
//                         )}

//                         {/* Bouton Submit */}
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
//                         >
//                             {loading ? (
//                                 <>
//                                     <Loader className="animate-spin h-5 w-5 mr-2" />
//                                     {isLogin ? 'Connexion...' : 'Création...'}
//                                 </>
//                             ) : (
//                                 <>
//                                     {isLogin ? <LogIn className="h-5 w-5 mr-2" /> : <UserPlus className="h-5 w-5 mr-2" />}
//                                     {isLogin ? 'Se connecter' : 'Créer le compte'}
//                                 </>
//                             )}
//                         </button>
//                     </form>

//                     {/* Info Supabase */}
//                     <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
//                         <div className="flex items-start">
//                             <Cloud className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
//                             <div className="text-sm">
//                                 <p className="font-medium mb-1 text-blue-700">Données sécurisées dans le cloud</p>
//                                 <p className="text-blue-600">
//                                     Vos données sont sauvegardées de manière sécurisée et accessibles depuis n'importe quel appareil.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Auth













// code avec auth simple
// src/components/Auth.tsx - Version sans récupération de profil
import React, { useState, useEffect } from 'react'
import { authService } from '../lib/supabaseService'
import {
    Lock,
    Mail,
    Eye,
    EyeOff,
    User,
    Shield,
    LogIn,
    UserPlus,
    Loader,
    AlertCircle,
    CheckCircle,
    Cloud,
    Wifi,
    WifiOff
} from 'lucide-react'

interface AuthProps {
    onAuthSuccess: (user: any) => void // Plus besoin du profil ici
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        confirmPassword: ''
    })

    // Écouter les changements de connexion
    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Vérifier si l'utilisateur est déjà connecté (SANS profil)
    useEffect(() => {
        const checkSession = async () => {
            if (!isOnline) {
                setMessage({
                    type: 'error',
                    text: 'Connexion internet requise pour utiliser l\'application'
                })
                return
            }

            try {
                const session = authService.getSession()
                if (session.user) {
                    // Seulement vérifier l'utilisateur, pas le profil
                    onAuthSuccess(session.user)
                    return
                }
            } catch (error) {
                console.error('Erreur vérification session:', error)
            }
        }

        checkSession()
    }, [onAuthSuccess, isOnline])

    // Connexion (SANS récupération de profil)
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isOnline) {
            setMessage({
                type: 'error',
                text: 'Connexion internet requise'
            })
            return
        }

        setLoading(true)
        setMessage(null)

        try {
            const result = await authService.signIn(formData.email, formData.password)

            if (result.error) {
                throw new Error(result.error)
            }

            if (result.user) {
                setMessage({ type: 'success', text: 'Connexion réussie!' })
                // Passer seulement l'utilisateur, sans récupérer le profil
                setTimeout(() => onAuthSuccess(result.user), 500)
            }

        } catch (error: any) {
            let errorMessage = 'Erreur de connexion'

            if (error.message?.includes('Invalid login credentials')) {
                errorMessage = 'Email ou mot de passe incorrect'
            } else if (error.message?.includes('Email not confirmed')) {
                errorMessage = 'Veuillez confirmer votre email avant de vous connecter'
            } else if (error.message?.includes('Too many requests')) {
                errorMessage = 'Trop de tentatives, veuillez patienter'
            } else if (error.message) {
                errorMessage = error.message
            }

            setMessage({ type: 'error', text: errorMessage })
        } finally {
            setLoading(false)
        }
    }

    // Inscription (SANS récupération de profil)
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isOnline) {
            setMessage({
                type: 'error',
                text: 'Connexion internet requise'
            })
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' })
            return
        }

        if (formData.password.length < 6) {
            setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' })
            return
        }

        setLoading(true)
        setMessage(null)

        try {
            const userData = { full_name: formData.fullName }
            const result = await authService.signUp(formData.email, formData.password, userData)

            if (result.error) {
                throw new Error(result.error)
            }

            if (result.user) {
                // Pour Supabase, l'utilisateur doit souvent confirmer son email
                if (!result.user.email_confirmed_at) {
                    setMessage({
                        type: 'info',
                        text: 'Compte créé! Vérifiez votre email pour confirmer votre compte.'
                    })
                    // Basculer vers le mode connexion
                    setIsLogin(true)
                } else {
                    // Si l'email est déjà confirmé, connecter directement SANS profil
                    setMessage({ type: 'success', text: 'Compte créé avec succès!' })
                    setTimeout(() => onAuthSuccess(result.user), 1000)
                }
            }

        } catch (error: any) {
            let errorMessage = 'Erreur lors de l\'inscription'

            if (error.message?.includes('User already registered')) {
                errorMessage = 'Un compte existe déjà avec cet email'
            } else if (error.message?.includes('Password should be at least')) {
                errorMessage = 'Le mot de passe doit contenir au moins 6 caractères'
            } else if (error.message?.includes('Invalid email')) {
                errorMessage = 'Format d\'email invalide'
            } else if (error.message) {
                errorMessage = error.message
            }

            setMessage({ type: 'error', text: errorMessage })
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

    // Si hors ligne, afficher message d'erreur
    if (!isOnline) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
                        <WifiOff className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion requise</h2>
                        <p className="text-gray-600 mb-4">
                            Cette application nécessite une connexion internet pour fonctionner.
                        </p>
                        <div className="text-sm text-gray-500">
                            Vérifiez votre connexion et actualisez la page.
                        </div>
                    </div>
                </div>
            </div>
        )
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

                    {/* Indicateur Cloud */}
                    <div className="mt-3 flex items-center justify-center gap-4">
                        <div className="flex items-center text-sm text-green-600">
                            <Cloud className="h-4 w-4 mr-1" />
                            Mode Cloud
                        </div>
                        <div className="flex items-center text-xs text-green-500">
                            <Wifi className="h-3 w-3 mr-1" />
                            En ligne
                        </div>
                    </div>
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
                            <div className="flex items-center">
                                {message.type === 'error' && <AlertCircle className="h-4 w-4 mr-2" />}
                                {message.type === 'success' && <CheckCircle className="h-4 w-4 mr-2" />}
                                {message.type === 'info' && <AlertCircle className="h-4 w-4 mr-2" />}
                                {message.text}
                            </div>
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
                                        required
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
                                        required
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

                    {/* Info Supabase */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="flex items-start">
                            <Cloud className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-medium mb-1 text-blue-700">Données sécurisées dans le cloud</p>
                                <p className="text-blue-600">
                                    Vos données sont sauvegardées de manière sécurisée et accessibles depuis n'importe quel appareil.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth