















// // src/App.tsx - Version Supabase uniquement
// // src/App.tsx - Version Supabase uniquement
// import React, { useState, useEffect, useCallback, useRef } from 'react'
// import {
//   Home,
//   Users,
//   CreditCard,
//   Euro,
//   Activity,
//   Menu,
//   X,
//   Sun,
//   Moon,
//   LogOut,
//   Shield,
//   Crown,
//   User,
//   Settings as SettingsIcon,
//   Cloud,
//   Wifi,
//   WifiOff
// } from 'lucide-react'

// // Import des services Supabase
// import { DatabaseService, authService } from './lib/supabaseService'
// import type { DbMember, DbPayment } from './lib/supabaseService'

// // Import des composants
// import Dashboard from './components/Dashboard'
// import Members from './components/Members'
// import Payments from './components/Payments'
// import Cotisations from './components/Cotisations'
// import Activities from './components/Activities'
// import Settings from './components/Settings'
// import Auth from './components/Auth'

// // Logger optimisé
// const isDev = process.env.NODE_ENV === 'development'
// const logger = {
//   auth: (type: string, ...args: any[]) => {
//     if (isDev) {
//       const emoji: Record<string, string> = {
//         check: '🔍',
//         change: '🔄',
//         profile: '📋',
//         error: '❌',
//         success: '✅',
//         temp: '🔧'
//       }
//       console.log(`${emoji[type] || '🔔'} [AUTH]`, ...args)
//     }
//   },
//   error: (...args: any[]) => console.error('❌ [ERROR]', ...args),
//   render: (...args: any[]) => isDev && console.log('🎨 [RENDER]', ...args)
// }

// // Types
// type NavigationSection = 'dashboard' | 'members' | 'cotisations' | 'payments' | 'activities' | 'settings'

// interface UserProfile {
//   id: string
//   email: string
//   full_name: string | null
//   role: 'admin' | 'member' | 'guest'
//   family_id: string
//   avatar_url: string | null
//   phone: string | null
//   is_active: boolean
//   created_at: string
// }

// interface AuthState {
//   user: any
//   profile: UserProfile | null
//   loading: boolean
//   error: string | null
// }

// interface NetworkState {
//   isOnline: boolean
//   wasOffline: boolean
// }

// // Hook de monitoring réseau
// const useNetworkStatus = () => {
//   const [networkState, setNetworkState] = useState<NetworkState>({
//     isOnline: navigator.onLine,
//     wasOffline: false
//   })

//   useEffect(() => {
//     const handleOnline = () => {
//       logger.auth('change', 'Connexion rétablie')
//       setNetworkState(prev => ({
//         isOnline: true,
//         wasOffline: prev.wasOffline || !prev.isOnline
//       }))
//     }

//     const handleOffline = () => {
//       logger.auth('change', 'Connexion perdue')
//       setNetworkState(prev => ({
//         isOnline: false,
//         wasOffline: true
//       }))
//     }

//     window.addEventListener('online', handleOnline)
//     window.addEventListener('offline', handleOffline)

//     return () => {
//       window.removeEventListener('online', handleOnline)
//       window.removeEventListener('offline', handleOffline)
//     }
//   }, [])

//   return networkState
// }

// // Hook d'authentification pour Supabase
// const useAuth = () => {
//   const [authState, setAuthState] = useState<AuthState>({
//     user: null,
//     profile: null,
//     loading: true,
//     error: null
//   })

//   const isCheckingRef = useRef(false)
//   const profileCacheRef = useRef(new Map<string, UserProfile>())
//   const mountedRef = useRef(true)

//   const createTempProfile = useCallback((user: any): UserProfile => {
//     const tempProfile: UserProfile = {
//       id: user.id,
//       email: user.email || 'unknown@email.com',
//       full_name: user.user_metadata?.full_name || user.email || 'Utilisateur',
//       role: 'admin',
//       family_id: 'temp-family-id',
//       avatar_url: null,
//       phone: null,
//       is_active: true,
//       created_at: new Date().toISOString()
//     }
//     logger.auth('temp', 'Profil temporaire créé:', tempProfile.email)
//     return tempProfile
//   }, [])

//   const fetchUserProfile = useCallback(async (user: any) => {
//     if (!user?.id || !mountedRef.current) return

//     const cachedProfile = profileCacheRef.current.get(user.id)
//     if (cachedProfile) {
//       logger.auth('profile', 'Profil récupéré du cache:', cachedProfile.email)
//       setAuthState(prev => ({ ...prev, profile: cachedProfile }))
//       return
//     }

//     try {
//       logger.auth('profile', 'Récupération profil pour:', user.id)
//       const profile = await authService.getProfile(user.id)

//       if (!mountedRef.current) return

//       if (!profile) {
//         logger.auth('error', 'Profil non trouvé, création temporaire')
//         const tempProfile = createTempProfile(user)
//         setAuthState(prev => ({ ...prev, profile: tempProfile }))
//         return
//       }

//       logger.auth('success', 'Profil récupéré:', profile.email)
//       profileCacheRef.current.set(user.id, profile)
//       setAuthState(prev => ({ ...prev, profile: profile }))

//     } catch (error) {
//       logger.auth('error', 'Erreur fetchUserProfile:', error)
//       if (mountedRef.current) {
//         const tempProfile = createTempProfile(user)
//         setAuthState(prev => ({ ...prev, profile: tempProfile }))
//       }
//     }
//   }, [createTempProfile])

//   const checkAuthStatus = useCallback(async () => {
//     if (isCheckingRef.current || !mountedRef.current) {
//       return
//     }

//     isCheckingRef.current = true

//     try {
//       logger.auth('check', 'Vérification authentification Supabase...')
//       const session = authService.getSession()

//       if (!mountedRef.current) return

//       if (session.user && session.profile) {
//         logger.auth('success', 'Session Supabase trouvée:', session.user.email)
//         setAuthState(prev => ({
//           ...prev,
//           user: session.user,
//           profile: session.profile,
//           loading: false
//         }))
//         profileCacheRef.current.set(session.user.id, session.profile)
//       } else {
//         logger.auth('check', 'Aucune session Supabase trouvée')
//         setAuthState(prev => ({
//           ...prev,
//           loading: false,
//           user: null,
//           profile: null
//         }))
//       }
//     } catch (error) {
//       logger.auth('error', 'Erreur vérification auth:', error)
//       if (mountedRef.current) {
//         setAuthState(prev => ({
//           ...prev,
//           loading: false,
//           error: 'Erreur de connexion à Supabase',
//           user: null,
//           profile: null
//         }))
//       }
//     } finally {
//       isCheckingRef.current = false
//     }
//   }, [])

//   useEffect(() => {
//     mountedRef.current = true

//     const initAuth = async () => {
//       await checkAuthStatus()
//     }

//     initAuth()

//     return () => {
//       mountedRef.current = false
//       isCheckingRef.current = false
//     }
//   }, [checkAuthStatus])

//   const handleAuthSuccess = useCallback((authUser: any, userProfile: UserProfile) => {
//     logger.auth('success', 'Authentification réussie:', authUser.email)
//     profileCacheRef.current.set(authUser.id, userProfile)
//     setAuthState({
//       user: authUser,
//       profile: userProfile,
//       loading: false,
//       error: null
//     })
//   }, [])

//   const handleLogout = useCallback(async () => {
//     try {
//       logger.auth('check', 'Déconnexion Supabase...')
//       await authService.signOut()
//       profileCacheRef.current.clear()
//       setAuthState({
//         user: null,
//         profile: null,
//         loading: false,
//         error: null
//       })
//       logger.auth('success', 'Déconnexion réussie')
//     } catch (error) {
//       logger.auth('error', 'Erreur déconnexion:', error)
//     }
//   }, [])

//   return {
//     ...authState,
//     handleAuthSuccess,
//     handleLogout,
//     isAuthenticated: !!(authState.user && authState.profile)
//   }
// }

// // Hook de thème
// const useTheme = () => {
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     const saved = localStorage.getItem('theme')
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
//     return saved === 'dark' || (!saved && prefersDark)
//   })

//   useEffect(() => {
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark')
//       localStorage.setItem('theme', 'dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//       localStorage.setItem('theme', 'light')
//     }
//   }, [isDarkMode])

//   const toggleTheme = useCallback(() => {
//     setIsDarkMode(prev => !prev)
//   }, [])

//   return { isDarkMode, toggleTheme }
// }

// // Interface pour les éléments de navigation
// interface NavigationItem {
//   id: NavigationSection
//   name: string
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   color: string
//   bgColor: string
//   description: string
//   roles: string[]
// }

// // Composant principal
// const App: React.FC = () => {
//   const { user, profile, loading, error, isAuthenticated, handleAuthSuccess, handleLogout } = useAuth()
//   const { isDarkMode, toggleTheme } = useTheme()
//   const networkState = useNetworkStatus()

//   const [currentSection, setCurrentSection] = useState<NavigationSection>('dashboard')
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

//   // Navigation items
//   const navigationItems = React.useMemo((): NavigationItem[] => [
//     {
//       id: 'dashboard',
//       name: 'Tableau de Bord',
//       icon: Home,
//       color: 'text-indigo-600',
//       bgColor: 'bg-indigo-100',
//       description: 'Vue d\'ensemble',
//       roles: ['admin', 'member', 'guest']
//     },
//     {
//       id: 'members',
//       name: 'Membres',
//       icon: Users,
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-100',
//       description: 'Gestion des membres',
//       roles: ['admin', 'member']
//     },
//     {
//       id: 'cotisations',
//       name: 'Cotisations',
//       icon: CreditCard,
//       color: 'text-purple-600',
//       bgColor: 'bg-purple-100',
//       description: 'Cotisations mensuelles',
//       roles: ['admin', 'member', 'guest']
//     },
//     {
//       id: 'payments',
//       name: 'Paiements',
//       icon: Euro,
//       color: 'text-green-600',
//       bgColor: 'bg-green-100',
//       description: 'Paiements flexibles',
//       roles: ['admin', 'member']
//     },
//     {
//       id: 'activities',
//       name: 'Activités',
//       icon: Activity,
//       color: 'text-orange-600',
//       bgColor: 'bg-orange-100',
//       description: 'Activités familiales',
//       roles: ['admin', 'member']
//     },
//     {
//       id: 'settings',
//       name: 'Paramètres',
//       icon: SettingsIcon,
//       color: 'text-gray-600',
//       bgColor: 'bg-gray-100',
//       description: 'Configuration',
//       roles: ['admin', 'member', 'guest']
//     }
//   ], [])

//   const filteredNavigationItems = React.useMemo(() =>
//     navigationItems.filter(item =>
//       profile ? item.roles.includes(profile.role) : false
//     ), [navigationItems, profile]
//   )

//   const handleNavigation = useCallback((section: string) => {
//     if (['dashboard', 'members', 'cotisations', 'payments', 'activities', 'settings'].includes(section)) {
//       setCurrentSection(section as NavigationSection)
//       setIsMobileMenuOpen(false)
//     }
//   }, [])

//   const getRoleIcon = useCallback((role: string) => {
//     switch (role) {
//       case 'admin': return Crown
//       case 'member': return User
//       case 'guest': return Shield
//       default: return User
//     }
//   }, [])

//   const getRoleColor = useCallback((role: string) => {
//     switch (role) {
//       case 'admin': return 'text-yellow-600'
//       case 'member': return 'text-blue-600'
//       case 'guest': return 'text-gray-600'
//       default: return 'text-gray-600'
//     }
//   }, [])

//   // Rendu des sections
//   const renderCurrentSection = useCallback(() => {
//     if (!profile) return null

//     const hasAccess = (requiredRoles: string[]) => requiredRoles.includes(profile.role)
//     const AccessDenied = () => (
//       <div className="p-8 text-center text-gray-500">
//         <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
//         <p>Accès non autorisé pour votre rôle</p>
//       </div>
//     )

//     switch (currentSection) {
//       case 'dashboard':
//         return <Dashboard onNavigate={handleNavigation} />
//       case 'members':
//         return hasAccess(['admin', 'member']) ?
//           <Members onBack={() => handleNavigation('dashboard')} /> :
//           <AccessDenied />
//       case 'cotisations':
//         return <Cotisations onBack={() => handleNavigation('dashboard')} />
//       case 'payments':
//         return hasAccess(['admin', 'member']) ?
//           <Payments onBack={() => handleNavigation('dashboard')} /> :
//           <AccessDenied />
//       case 'activities':
//         return hasAccess(['admin', 'member']) ?
//           <Activities onBack={() => handleNavigation('dashboard')} /> :
//           <AccessDenied />
//       case 'settings':
//         return <Settings onNavigate={handleNavigation} />
//       default:
//         return <Dashboard onNavigate={handleNavigation} />
//     }
//   }, [currentSection, profile, handleNavigation])

//   // État de chargement
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Connexion à Supabase...</p>
//           <p className="text-gray-400 text-sm mt-2">
//             {networkState.isOnline ? 'En ligne • Mode Cloud' : 'Hors ligne • Connexion requise'}
//           </p>
//         </div>
//       </div>
//     )
//   }

//   // État d'erreur
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-red-50 flex items-center justify-center">
//         <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200">
//           <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//             <X className="h-8 w-8 text-red-600" />
//           </div>
//           <h3 className="text-red-800 font-bold text-lg mb-2">Erreur de connexion</h3>
//           <p className="text-red-600 text-sm mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//           >
//             Réessayer
//           </button>
//         </div>
//       </div>
//     )
//   }

//   // Vérification connexion internet pour Supabase
//   if (!networkState.isOnline) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-50 flex items-center justify-center">
//         <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-orange-200">
//           <WifiOff className="h-16 w-16 text-orange-500 mx-auto mb-4" />
//           <h3 className="text-orange-800 font-bold text-lg mb-2">Connexion requise</h3>
//           <p className="text-orange-600 text-sm mb-4">
//             Cette application nécessite une connexion internet pour fonctionner avec Supabase.
//           </p>
//           <p className="text-gray-500 text-xs">
//             Vérifiez votre connexion et actualisez la page.
//           </p>
//         </div>
//       </div>
//     )
//   }

//   // Page d'authentification
//   if (!isAuthenticated) {
//     logger.render('Affichage page authentification')
//     return <Auth onAuthSuccess={handleAuthSuccess} />
//   }

//   logger.render('Interface principale pour:', profile!.email, profile!.role)

//   // Indicateur de statut réseau
//   const NetworkIndicator = React.memo(() => (
//     <div className="flex items-center gap-2 text-xs">
//       <div className="flex items-center gap-1 text-blue-500">
//         <Cloud className="h-3 w-3" />
//         <span>Cloud</span>
//       </div>
//       <div className={`flex items-center gap-1 ${networkState.isOnline ? 'text-green-500' : 'text-red-500'}`}>
//         {networkState.isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
//         <span>{networkState.isOnline ? 'En ligne' : 'Hors ligne'}</span>
//       </div>
//     </div>
//   ))

//   // Composants memoized
//   const UserProfileCard = React.memo(() => (
//     <div className="p-4 border-b border-gray-200/20">
//       <div className="flex items-center">
//         <div className={`p-2 rounded-lg mr-3 ${profile!.role === 'admin' ? 'bg-yellow-100' :
//           profile!.role === 'member' ? 'bg-blue-100' : 'bg-gray-100'
//           }`}>
//           {(() => {
//             const RoleIcon = getRoleIcon(profile!.role)
//             return <RoleIcon className={`h-5 w-5 ${getRoleColor(profile!.role)}`} />
//           })()}
//         </div>
//         <div className="flex-1">
//           <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
//             {profile!.full_name || profile!.email}
//           </div>
//           <div className={`text-xs capitalize ${getRoleColor(profile!.role)}`}>
//             {profile!.role === 'admin' ? 'Administrateur' :
//               profile!.role === 'member' ? 'Membre' : 'Invité'}
//           </div>
//           <div className="mt-1">
//             <NetworkIndicator />
//           </div>
//         </div>
//       </div>
//     </div>
//   ))

//   const NavigationButton = React.memo(({ item, isActive }: { item: NavigationItem, isActive: boolean }) => {
//     const IconComponent = item.icon

//     return (
//       <button
//         onClick={() => handleNavigation(item.id)}
//         className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
//           ? `${item.bgColor} ${item.color} shadow-lg scale-105`
//           : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} hover:scale-105`
//           }`}
//       >
//         <div className={`p-2 rounded-lg mr-3 transition-colors ${isActive ? 'bg-white/20' : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} group-hover:${item.bgColor}`
//           }`}>
//           <IconComponent className={`h-5 w-5 ${isActive ? 'text-current' : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:${item.color}`
//             }`} />
//         </div>
//         <div className="text-left">
//           <div className={`font-medium ${isActive ? 'text-current' : ''}`}>
//             {item.name}
//           </div>
//           <div className={`text-xs ${isActive
//             ? 'text-current opacity-80'
//             : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
//             }`}>
//             {item.description}
//           </div>
//         </div>
//       </button>
//     )
//   })

//   return (
//     <div className={`min-h-screen transition-colors duration-300 ${isDarkMode
//       ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900'
//       : 'bg-gradient-to-br from-indigo-100 via-white to-purple-100'
//       }`}>

//       {/* Navigation Desktop - Sidebar */}
//       <div className={`hidden lg:block fixed inset-y-0 left-0 w-64 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'
//         } backdrop-blur-lg border-r ${isDarkMode ? 'border-gray-700' : 'border-white/20'
//         } shadow-xl z-40`}>

//         {/* Logo */}
//         <div className="p-6 border-b border-gray-200/20">
//           <div className="flex items-center">
//             <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl">
//               <Euro className="h-8 w-8 text-white" />
//             </div>
//             <div className="ml-3">
//               <h1 className={`text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ${isDarkMode ? 'text-white' : ''
//                 }`}>
//                 Caissier Pro
//               </h1>
//               <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                 Gestion Cloud
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Profil utilisateur */}
//         <UserProfileCard />

//         {/* Navigation */}
//         <nav className="p-4 space-y-2 flex-1">
//           {filteredNavigationItems.map((item) => (
//             <NavigationButton
//               key={item.id}
//               item={item}
//               isActive={currentSection === item.id}
//             />
//           ))}
//         </nav>

//         {/* Actions en bas */}
//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/20">
//           <div className="flex items-center justify-between mb-4">
//             <button
//               onClick={toggleTheme}
//               className={`p-3 rounded-xl transition-all duration-300 ${isDarkMode
//                 ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
//                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                 }`}
//               title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
//             >
//               {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//             </button>

//             <button
//               onClick={handleLogout}
//               className={`p-3 rounded-xl transition-all duration-300 ${isDarkMode
//                 ? 'bg-red-900/50 text-red-400 hover:bg-red-900'
//                 : 'bg-red-100 text-red-600 hover:bg-red-200'
//                 }`}
//               title="Se déconnecter"
//             >
//               <LogOut className="h-5 w-5" />
//             </button>
//           </div>

//           <div className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//             Version 4.0 • Mode Cloud
//           </div>
//         </div>
//       </div>

//       {/* Navigation Mobile - Top Bar */}
//       <div className={`lg:hidden sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
//         } backdrop-blur-lg border-b ${isDarkMode ? 'border-gray-700' : 'border-white/20'
//         } shadow-lg`}>
//         <div className="flex items-center justify-between p-4">
//           {/* Logo Mobile */}
//           <div className="flex items-center">
//             <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
//               <Euro className="h-6 w-6 text-white" />
//             </div>
//             <div className="ml-2">
//               <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
//                 Caissier Pro
//               </h1>
//               <div className="flex items-center gap-1">
//                 <NetworkIndicator />
//               </div>
//             </div>
//           </div>

//           {/* Actions Mobile */}
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={toggleTheme}
//               className={`p-2 rounded-lg transition-colors ${isDarkMode
//                 ? 'bg-gray-700 text-yellow-400'
//                 : 'bg-gray-100 text-gray-600'
//                 }`}
//             >
//               {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//             </button>

//             <button
//               onClick={handleLogout}
//               className={`p-2 rounded-lg transition-colors ${isDarkMode
//                 ? 'bg-red-900/50 text-red-400'
//                 : 'bg-red-100 text-red-600'
//                 }`}
//             >
//               <LogOut className="h-5 w-5" />
//             </button>

//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className={`p-2 rounded-lg transition-colors ${isDarkMode
//                 ? 'bg-gray-700 text-white'
//                 : 'bg-gray-100 text-gray-600'
//                 }`}
//             >
//               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Menu Mobile Dropdown */}
//         {isMobileMenuOpen && (
//           <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'
//             } border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
//             } shadow-lg`}>
//             <div className="p-4 space-y-2">
//               {filteredNavigationItems.map((item) => (
//                 <NavigationButton
//                   key={item.id}
//                   item={item}
//                   isActive={currentSection === item.id}
//                 />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Contenu Principal */}
//       <div className="lg:ml-64">
//         <main className="min-h-screen">
//           {renderCurrentSection()}
//         </main>
//       </div>

//       {/* Navigation Mobile Bottom */}
//       <div className={`lg:hidden fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
//         } backdrop-blur-lg border-t ${isDarkMode ? 'border-gray-700' : 'border-white/20'
//         } shadow-lg z-40`}>
//         <div className="flex items-center justify-around py-2">
//           {[...filteredNavigationItems.slice(0, 4), filteredNavigationItems.find(item => item.id === 'settings')].filter(Boolean).map((item) => {
//             if (!item) return null
//             const IconComponent = item.icon
//             const isActive = currentSection === item.id

//             return (
//               <button
//                 key={item.id}
//                 onClick={() => handleNavigation(item.id)}
//                 className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-300 ${isActive
//                   ? `${item.color} scale-105`
//                   : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
//                   }`}
//               >
//                 <div className={`p-1.5 rounded-lg ${isActive ? `${item.bgColor}` : 'transparent'
//                   }`}>
//                   <IconComponent className="h-4 w-4" />
//                 </div>
//                 <span className="text-xs mt-1 font-medium">
//                   {item.id === 'settings' ? 'Config' : item.name}
//                 </span>
//               </button>
//             )
//           })}
//         </div>
//       </div>

//       {/* Overlay pour mobile menu */}
//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//     </div>
//   )
// }

// export default App










// code sans profile
// src/App.tsx - Version Supabase sans récupération automatique de profil
// import React, { useState, useEffect, useCallback, useRef } from 'react'
// import {
//   Home,
//   Users,
//   CreditCard,
//   Euro,
//   Activity,
//   Menu,
//   X,
//   Sun,
//   Moon,
//   LogOut,
//   Shield,
//   Crown,
//   User,
//   Settings as SettingsIcon,
//   Cloud,
//   Wifi,
//   WifiOff
// } from 'lucide-react'

// // Import des services Supabase
// import { DatabaseService, authService } from './lib/supabaseService'
// import type { DbMember, DbPayment } from './lib/supabaseService'

// // Import des composants
// import Dashboard from './components/Dashboard'
// import Members from './components/Members'
// import Payments from './components/Payments'
// import Cotisations from './components/Cotisations'
// import Activities from './components/Activities'
// import Settings from './components/Settings'
// import Auth from './components/Auth'

// // Logger optimisé
// const isDev = process.env.NODE_ENV === 'development'
// const logger = {
//   auth: (type: string, ...args: any[]) => {
//     if (isDev) {
//       const emoji: Record<string, string> = {
//         check: '🔍',
//         change: '🔄',
//         profile: '📋',
//         error: '❌',
//         success: '✅',
//         temp: '🔧'
//       }
//       console.log(`${emoji[type] || '🔔'} [AUTH]`, ...args)
//     }
//   },
//   error: (...args: any[]) => console.error('❌ [ERROR]', ...args),
//   render: (...args: any[]) => isDev && console.log('🎨 [RENDER]', ...args)
// }

// // Types
// type NavigationSection = 'dashboard' | 'members' | 'cotisations' | 'payments' | 'activities' | 'settings'

// interface UserProfile {
//   id: string
//   email: string
//   full_name: string | null
//   role: 'admin' | 'member' | 'guest'
//   family_id: string
//   avatar_url: string | null
//   phone: string | null
//   is_active: boolean
//   created_at: string
// }

// interface AuthState {
//   user: any
//   profile: UserProfile | null
//   loading: boolean
//   error: string | null
// }

// interface NetworkState {
//   isOnline: boolean
//   wasOffline: boolean
// }

// // Hook de monitoring réseau
// const useNetworkStatus = () => {
//   const [networkState, setNetworkState] = useState<NetworkState>({
//     isOnline: navigator.onLine,
//     wasOffline: false
//   })

//   useEffect(() => {
//     const handleOnline = () => {
//       logger.auth('change', 'Connexion rétablie')
//       setNetworkState(prev => ({
//         isOnline: true,
//         wasOffline: prev.wasOffline || !prev.isOnline
//       }))
//     }

//     const handleOffline = () => {
//       logger.auth('change', 'Connexion perdue')
//       setNetworkState(prev => ({
//         isOnline: false,
//         wasOffline: true
//       }))
//     }

//     window.addEventListener('online', handleOnline)
//     window.addEventListener('offline', handleOffline)

//     return () => {
//       window.removeEventListener('online', handleOnline)
//       window.removeEventListener('offline', handleOffline)
//     }
//   }, [])

//   return networkState
// }

// // Hook d'authentification modifié pour Supabase
// const useAuth = () => {
//   const [authState, setAuthState] = useState<AuthState>({
//     user: null,
//     profile: null,
//     loading: true,
//     error: null
//   })

//   const isCheckingRef = useRef(false)
//   const profileCacheRef = useRef(new Map<string, UserProfile>())
//   const mountedRef = useRef(true)

//   const createTempProfile = useCallback((user: any): UserProfile => {
//     const tempProfile: UserProfile = {
//       id: user.id,
//       email: user.email || 'unknown@email.com',
//       full_name: user.user_metadata?.full_name || user.email || 'Utilisateur',
//       role: 'admin',
//       family_id: 'temp-family-id',
//       avatar_url: null,
//       phone: null,
//       is_active: true,
//       created_at: new Date().toISOString()
//     }
//     logger.auth('temp', 'Profil temporaire créé:', tempProfile.email)
//     return tempProfile
//   }, [])

//   const fetchUserProfile = useCallback(async (user: any) => {
//     if (!user?.id || !mountedRef.current) return null

//     const cachedProfile = profileCacheRef.current.get(user.id)
//     if (cachedProfile) {
//       logger.auth('profile', 'Profil récupéré du cache:', cachedProfile.email)
//       return cachedProfile
//     }

//     try {
//       logger.auth('profile', 'Récupération profil pour:', user.id)
//       const profile = await authService.getProfile(user.id)

//       if (!mountedRef.current) return null

//       if (!profile) {
//         logger.auth('error', 'Profil non trouvé, création temporaire')
//         const tempProfile = createTempProfile(user)
//         return tempProfile
//       }

//       logger.auth('success', 'Profil récupéré:', profile.email)
//       profileCacheRef.current.set(user.id, profile)
//       return profile

//     } catch (error) {
//       logger.auth('error', 'Erreur fetchUserProfile:', error)
//       if (mountedRef.current) {
//         const tempProfile = createTempProfile(user)
//         return tempProfile
//       }
//     }

//     return null
//   }, [createTempProfile])

//   const checkAuthStatus = useCallback(async () => {
//     if (isCheckingRef.current || !mountedRef.current) {
//       return
//     }

//     isCheckingRef.current = true

//     try {
//       logger.auth('check', 'Vérification authentification Supabase...')
//       const session = authService.getSession()

//       if (!mountedRef.current) return

//       if (session.user) {
//         logger.auth('success', 'Session Supabase trouvée:', session.user.email)

//         // Récupérer le profil séparément si nécessaire
//         const profile = await fetchUserProfile(session.user)

//         setAuthState(prev => ({
//           ...prev,
//           user: session.user,
//           profile: profile,
//           loading: false
//         }))
//       } else {
//         logger.auth('check', 'Aucune session Supabase trouvée')
//         setAuthState(prev => ({
//           ...prev,
//           loading: false,
//           user: null,
//           profile: null
//         }))
//       }
//     } catch (error) {
//       logger.auth('error', 'Erreur vérification auth:', error)
//       if (mountedRef.current) {
//         setAuthState(prev => ({
//           ...prev,
//           loading: false,
//           error: 'Erreur de connexion à Supabase',
//           user: null,
//           profile: null
//         }))
//       }
//     } finally {
//       isCheckingRef.current = false
//     }
//   }, [fetchUserProfile])

//   useEffect(() => {
//     mountedRef.current = true

//     const initAuth = async () => {
//       await checkAuthStatus()
//     }

//     initAuth()

//     return () => {
//       mountedRef.current = false
//       isCheckingRef.current = false
//     }
//   }, [checkAuthStatus])

//   // Fonction de callback pour l'authentification réussie (MODIFIÉE)
//   const handleAuthSuccess = useCallback(async (authUser: any) => {
//     logger.auth('success', 'Authentification réussie:', authUser.email)

//     // Récupérer le profil après l'authentification
//     const userProfile = await fetchUserProfile(authUser)

//     if (userProfile) {
//       profileCacheRef.current.set(authUser.id, userProfile)
//     }

//     setAuthState({
//       user: authUser,
//       profile: userProfile,
//       loading: false,
//       error: null
//     })
//   }, [fetchUserProfile])

//   const handleLogout = useCallback(async () => {
//     try {
//       logger.auth('check', 'Déconnexion Supabase...')
//       await authService.signOut()
//       profileCacheRef.current.clear()
//       setAuthState({
//         user: null,
//         profile: null,
//         loading: false,
//         error: null
//       })
//       logger.auth('success', 'Déconnexion réussie')
//     } catch (error) {
//       logger.auth('error', 'Erreur déconnexion:', error)
//     }
//   }, [])

//   return {
//     ...authState,
//     handleAuthSuccess,
//     handleLogout,
//     isAuthenticated: !!(authState.user && authState.profile)
//   }
// }

// // Hook de thème
// const useTheme = () => {
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     const saved = localStorage.getItem('theme')
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
//     return saved === 'dark' || (!saved && prefersDark)
//   })

//   useEffect(() => {
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark')
//       localStorage.setItem('theme', 'dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//       localStorage.setItem('theme', 'light')
//     }
//   }, [isDarkMode])

//   const toggleTheme = useCallback(() => {
//     setIsDarkMode(prev => !prev)
//   }, [])

//   return { isDarkMode, toggleTheme }
// }

// // Interface pour les éléments de navigation
// interface NavigationItem {
//   id: NavigationSection
//   name: string
//   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   color: string
//   bgColor: string
//   description: string
//   roles: string[]
// }

// // Composant principal
// const App: React.FC = () => {
//   const { user, profile, loading, error, isAuthenticated, handleAuthSuccess, handleLogout } = useAuth()
//   const { isDarkMode, toggleTheme } = useTheme()
//   const networkState = useNetworkStatus()

//   const [currentSection, setCurrentSection] = useState<NavigationSection>('dashboard')
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

//   // Navigation items
//   const navigationItems = React.useMemo((): NavigationItem[] => [
//     {
//       id: 'dashboard',
//       name: 'Tableau de Bord',
//       icon: Home,
//       color: 'text-indigo-600',
//       bgColor: 'bg-indigo-100',
//       description: 'Vue d\'ensemble',
//       roles: ['admin', 'member', 'guest']
//     },
//     {
//       id: 'members',
//       name: 'Membres',
//       icon: Users,
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-100',
//       description: 'Gestion des membres',
//       roles: ['admin', 'member']
//     },
//     {
//       id: 'cotisations',
//       name: 'Cotisations',
//       icon: CreditCard,
//       color: 'text-purple-600',
//       bgColor: 'bg-purple-100',
//       description: 'Cotisations mensuelles',
//       roles: ['admin', 'member', 'guest']
//     },
//     {
//       id: 'payments',
//       name: 'Paiements',
//       icon: Euro,
//       color: 'text-green-600',
//       bgColor: 'bg-green-100',
//       description: 'Paiements flexibles',
//       roles: ['admin', 'member']
//     },
//     {
//       id: 'activities',
//       name: 'Activités',
//       icon: Activity,
//       color: 'text-orange-600',
//       bgColor: 'bg-orange-100',
//       description: 'Activités familiales',
//       roles: ['admin', 'member']
//     },
//     {
//       id: 'settings',
//       name: 'Paramètres',
//       icon: SettingsIcon,
//       color: 'text-gray-600',
//       bgColor: 'bg-gray-100',
//       description: 'Configuration',
//       roles: ['admin', 'member', 'guest']
//     }
//   ], [])

//   const filteredNavigationItems = React.useMemo(() =>
//     navigationItems.filter(item =>
//       profile ? item.roles.includes(profile.role) : false
//     ), [navigationItems, profile]
//   )

//   const handleNavigation = useCallback((section: string) => {
//     if (['dashboard', 'members', 'cotisations', 'payments', 'activities', 'settings'].includes(section)) {
//       setCurrentSection(section as NavigationSection)
//       setIsMobileMenuOpen(false)
//     }
//   }, [])

//   const getRoleIcon = useCallback((role: string) => {
//     switch (role) {
//       case 'admin': return Crown
//       case 'member': return User
//       case 'guest': return Shield
//       default: return User
//     }
//   }, [])

//   const getRoleColor = useCallback((role: string) => {
//     switch (role) {
//       case 'admin': return 'text-yellow-600'
//       case 'member': return 'text-blue-600'
//       case 'guest': return 'text-gray-600'
//       default: return 'text-gray-600'
//     }
//   }, [])

//   // Rendu des sections
//   const renderCurrentSection = useCallback(() => {
//     if (!profile) return null

//     const hasAccess = (requiredRoles: string[]) => requiredRoles.includes(profile.role)
//     const AccessDenied = () => (
//       <div className="p-8 text-center text-gray-500">
//         <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
//         <p>Accès non autorisé pour votre rôle</p>
//       </div>
//     )

//     switch (currentSection) {
//       case 'dashboard':
//         return <Dashboard onNavigate={handleNavigation} />
//       case 'members':
//         return hasAccess(['admin', 'member']) ?
//           <Members onBack={() => handleNavigation('dashboard')} /> :
//           <AccessDenied />
//       case 'cotisations':
//         return <Cotisations onBack={() => handleNavigation('dashboard')} />
//       case 'payments':
//         return hasAccess(['admin', 'member']) ?
//           <Payments onBack={() => handleNavigation('dashboard')} /> :
//           <AccessDenied />
//       case 'activities':
//         return hasAccess(['admin', 'member']) ?
//           <Activities onBack={() => handleNavigation('dashboard')} /> :
//           <AccessDenied />
//       case 'settings':
//         return <Settings onNavigate={handleNavigation} />
//       default:
//         return <Dashboard onNavigate={handleNavigation} />
//     }
//   }, [currentSection, profile, handleNavigation])

//   // État de chargement
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Connexion à Supabase...</p>
//           <p className="text-gray-400 text-sm mt-2">
//             {networkState.isOnline ? 'En ligne • Mode Cloud' : 'Hors ligne • Connexion requise'}
//           </p>
//         </div>
//       </div>
//     )
//   }

//   // État d'erreur
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-red-50 flex items-center justify-center">
//         <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200">
//           <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//             <X className="h-8 w-8 text-red-600" />
//           </div>
//           <h3 className="text-red-800 font-bold text-lg mb-2">Erreur de connexion</h3>
//           <p className="text-red-600 text-sm mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//           >
//             Réessayer
//           </button>
//         </div>
//       </div>
//     )
//   }

//   // Vérification connexion internet pour Supabase
//   if (!networkState.isOnline) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-50 flex items-center justify-center">
//         <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-orange-200">
//           <WifiOff className="h-16 w-16 text-orange-500 mx-auto mb-4" />
//           <h3 className="text-orange-800 font-bold text-lg mb-2">Connexion requise</h3>
//           <p className="text-orange-600 text-sm mb-4">
//             Cette application nécessite une connexion internet pour fonctionner avec Supabase.
//           </p>
//           <p className="text-gray-500 text-xs">
//             Vérifiez votre connexion et actualisez la page.
//           </p>
//         </div>
//       </div>
//     )
//   }

//   // Page d'authentification
//   if (!isAuthenticated) {
//     logger.render('Affichage page authentification')
//     return <Auth onAuthSuccess={handleAuthSuccess} />
//   }

//   logger.render('Interface principale pour:', profile!.email, profile!.role)

//   // Indicateur de statut réseau
//   const NetworkIndicator = React.memo(() => (
//     <div className="flex items-center gap-2 text-xs">
//       <div className="flex items-center gap-1 text-blue-500">
//         <Cloud className="h-3 w-3" />
//         <span>Cloud</span>
//       </div>
//       <div className={`flex items-center gap-1 ${networkState.isOnline ? 'text-green-500' : 'text-red-500'}`}>
//         {networkState.isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
//         <span>{networkState.isOnline ? 'En ligne' : 'Hors ligne'}</span>
//       </div>
//     </div>
//   ))

//   // Composants memoized
//   const UserProfileCard = React.memo(() => (
//     <div className="p-4 border-b border-gray-200/20">
//       <div className="flex items-center">
//         <div className={`p-2 rounded-lg mr-3 ${profile!.role === 'admin' ? 'bg-yellow-100' :
//           profile!.role === 'member' ? 'bg-blue-100' : 'bg-gray-100'
//           }`}>
//           {(() => {
//             const RoleIcon = getRoleIcon(profile!.role)
//             return <RoleIcon className={`h-5 w-5 ${getRoleColor(profile!.role)}`} />
//           })()}
//         </div>
//         <div className="flex-1">
//           <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
//             {profile!.full_name || profile!.email}
//           </div>
//           <div className={`text-xs capitalize ${getRoleColor(profile!.role)}`}>
//             {profile!.role === 'admin' ? 'Administrateur' :
//               profile!.role === 'member' ? 'Membre' : 'Invité'}
//           </div>
//           <div className="mt-1">
//             <NetworkIndicator />
//           </div>
//         </div>
//       </div>
//     </div>
//   ))

//   const NavigationButton = React.memo(({ item, isActive }: { item: NavigationItem, isActive: boolean }) => {
//     const IconComponent = item.icon

//     return (
//       <button
//         onClick={() => handleNavigation(item.id)}
//         className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
//           ? `${item.bgColor} ${item.color} shadow-lg scale-105`
//           : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} hover:scale-105`
//           }`}
//       >
//         <div className={`p-2 rounded-lg mr-3 transition-colors ${isActive ? 'bg-white/20' : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} group-hover:${item.bgColor}`
//           }`}>
//           <IconComponent className={`h-5 w-5 ${isActive ? 'text-current' : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:${item.color}`
//             }`} />
//         </div>
//         <div className="text-left">
//           <div className={`font-medium ${isActive ? 'text-current' : ''}`}>
//             {item.name}
//           </div>
//           <div className={`text-xs ${isActive
//             ? 'text-current opacity-80'
//             : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
//             }`}>
//             {item.description}
//           </div>
//         </div>
//       </button>
//     )
//   })

//   return (
//     <div className={`min-h-screen transition-colors duration-300 ${isDarkMode
//       ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900'
//       : 'bg-gradient-to-br from-indigo-100 via-white to-purple-100'
//       }`}>

//       {/* Navigation Desktop - Sidebar */}
//       <div className={`hidden lg:block fixed inset-y-0 left-0 w-64 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'
//         } backdrop-blur-lg border-r ${isDarkMode ? 'border-gray-700' : 'border-white/20'
//         } shadow-xl z-40`}>

//         {/* Logo */}
//         <div className="p-6 border-b border-gray-200/20">
//           <div className="flex items-center">
//             <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl">
//               <Euro className="h-8 w-8 text-white" />
//             </div>
//             <div className="ml-3">
//               <h1 className={`text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ${isDarkMode ? 'text-white' : ''
//                 }`}>
//                 Caissier Pro
//               </h1>
//               <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                 Gestion Cloud
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Profil utilisateur */}
//         <UserProfileCard />

//         {/* Navigation */}
//         <nav className="p-4 space-y-2 flex-1">
//           {filteredNavigationItems.map((item) => (
//             <NavigationButton
//               key={item.id}
//               item={item}
//               isActive={currentSection === item.id}
//             />
//           ))}
//         </nav>

//         {/* Actions en bas */}
//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/20">
//           <div className="flex items-center justify-between mb-4">
//             <button
//               onClick={toggleTheme}
//               className={`p-3 rounded-xl transition-all duration-300 ${isDarkMode
//                 ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
//                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                 }`}
//               title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
//             >
//               {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//             </button>

//             <button
//               onClick={handleLogout}
//               className={`p-3 rounded-xl transition-all duration-300 ${isDarkMode
//                 ? 'bg-red-900/50 text-red-400 hover:bg-red-900'
//                 : 'bg-red-100 text-red-600 hover:bg-red-200'
//                 }`}
//               title="Se déconnecter"
//             >
//               <LogOut className="h-5 w-5" />
//             </button>
//           </div>

//           <div className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//             Version 4.0 • Mode Cloud
//           </div>
//         </div>
//       </div>

//       {/* Navigation Mobile - Top Bar */}
//       <div className={`lg:hidden sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
//         } backdrop-blur-lg border-b ${isDarkMode ? 'border-gray-700' : 'border-white/20'
//         } shadow-lg`}>
//         <div className="flex items-center justify-between p-4">
//           {/* Logo Mobile */}
//           <div className="flex items-center">
//             <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
//               <Euro className="h-6 w-6 text-white" />
//             </div>
//             <div className="ml-2">
//               <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
//                 Caissier Pro
//               </h1>
//               <div className="flex items-center gap-1">
//                 <NetworkIndicator />
//               </div>
//             </div>
//           </div>

//           {/* Actions Mobile */}
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={toggleTheme}
//               className={`p-2 rounded-lg transition-colors ${isDarkMode
//                 ? 'bg-gray-700 text-yellow-400'
//                 : 'bg-gray-100 text-gray-600'
//                 }`}
//             >
//               {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//             </button>

//             <button
//               onClick={handleLogout}
//               className={`p-2 rounded-lg transition-colors ${isDarkMode
//                 ? 'bg-red-900/50 text-red-400'
//                 : 'bg-red-100 text-red-600'
//                 }`}
//             >
//               <LogOut className="h-5 w-5" />
//             </button>

//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className={`p-2 rounded-lg transition-colors ${isDarkMode
//                 ? 'bg-gray-700 text-white'
//                 : 'bg-gray-100 text-gray-600'
//                 }`}
//             >
//               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Menu Mobile Dropdown */}
//         {isMobileMenuOpen && (
//           <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'
//             } border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
//             } shadow-lg`}>
//             <div className="p-4 space-y-2">
//               {filteredNavigationItems.map((item) => (
//                 <NavigationButton
//                   key={item.id}
//                   item={item}
//                   isActive={currentSection === item.id}
//                 />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Contenu Principal */}
//       <div className="lg:ml-64">
//         <main className="min-h-screen">
//           {renderCurrentSection()}
//         </main>
//       </div>

//       {/* Navigation Mobile Bottom */}
//       <div className={`lg:hidden fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
//         } backdrop-blur-lg border-t ${isDarkMode ? 'border-gray-700' : 'border-white/20'
//         } shadow-lg z-40`}>
//         <div className="flex items-center justify-around py-2">
//           {[...filteredNavigationItems.slice(0, 4), filteredNavigationItems.find(item => item.id === 'settings')].filter(Boolean).map((item) => {
//             if (!item) return null
//             const IconComponent = item.icon
//             const isActive = currentSection === item.id

//             return (
//               <button
//                 key={item.id}
//                 onClick={() => handleNavigation(item.id)}
//                 className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-300 ${isActive
//                   ? `${item.color} scale-105`
//                   : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
//                   }`}
//               >
//                 <div className={`p-1.5 rounded-lg ${isActive ? `${item.bgColor}` : 'transparent'
//                   }`}>
//                   <IconComponent className="h-4 w-4" />
//                 </div>
//                 <span className="text-xs mt-1 font-medium">
//                   {item.id === 'settings' ? 'Config' : item.name}
//                 </span>
//               </button>
//             )
//           })}
//         </div>
//       </div>

//       {/* Overlay pour mobile menu */}
//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//     </div>
//   )
// }

// export default App


























// src/App.tsx - Version Supabase sans récupération automatique de profil
import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Home,
  Users,
  CreditCard,
  Euro,
  Activity,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Shield,
  Crown,
  User,
  Settings as SettingsIcon,
  Cloud,
  Wifi,
  WifiOff
} from 'lucide-react'

// Import des services Supabase
import { DatabaseService, authService } from './lib/supabaseService'
import type { DbMember, DbPayment } from './lib/supabaseService'

// Import des composants
import Dashboard from './components/Dashboard'
import Members from './components/Members'
import Payments from './components/Payments'
import Cotisations from './components/Cotisations'
import Activities from './components/Activities'
import Settings from './components/Settings'
import Auth from './components/Auth'

// Logger optimisé
const isDev = process.env.NODE_ENV === 'development'
const logger = {
  auth: (type: string, ...args: any[]) => {
    if (isDev) {
      const emoji: Record<string, string> = {
        check: '🔍',
        change: '🔄',
        profile: '📋',
        error: '❌',
        success: '✅',
        temp: '🔧'
      }
      console.log(`${emoji[type] || '🔔'} [AUTH]`, ...args)
    }
  },
  error: (...args: any[]) => console.error('❌ [ERROR]', ...args),
  render: (...args: any[]) => isDev && console.log('🎨 [RENDER]', ...args)
}

// Types
type NavigationSection = 'dashboard' | 'members' | 'cotisations' | 'payments' | 'activities' | 'settings'

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

interface AuthState {
  user: any
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

interface NetworkState {
  isOnline: boolean
  wasOffline: boolean
}

// Hook de monitoring réseau
const useNetworkStatus = () => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: navigator.onLine,
    wasOffline: false
  })

  useEffect(() => {
    const handleOnline = () => {
      logger.auth('change', 'Connexion rétablie')
      setNetworkState(prev => ({
        isOnline: true,
        wasOffline: prev.wasOffline || !prev.isOnline
      }))
    }

    const handleOffline = () => {
      logger.auth('change', 'Connexion perdue')
      setNetworkState(prev => ({
        isOnline: false,
        wasOffline: true
      }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return networkState
}

// Hook d'authentification modifié pour Supabase
const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null
  })

  const isCheckingRef = useRef(false)
  const profileCacheRef = useRef(new Map<string, UserProfile>())
  const mountedRef = useRef(true)

  const createTempProfile = useCallback((user: any): UserProfile => {
    const tempProfile: UserProfile = {
      id: user.id,
      email: user.email || 'unknown@email.com',
      full_name: user.user_metadata?.full_name || user.email || 'Utilisateur',
      role: 'admin', // Toujours admin
      family_id: 'temp-family-id',
      avatar_url: null,
      phone: null,
      is_active: true,
      created_at: new Date().toISOString()
    }
    logger.auth('temp', 'Profil temporaire créé:', tempProfile.email)
    return tempProfile
  }, [])

  const fetchUserProfile = useCallback(async (user: any) => {
    if (!user?.id || !mountedRef.current) return null

    const cachedProfile = profileCacheRef.current.get(user.id)
    if (cachedProfile) {
      logger.auth('profile', 'Profil récupéré du cache:', cachedProfile.email)
      // Forcer le rôle admin même depuis le cache
      return { ...cachedProfile, role: 'admin' as const }
    }

    try {
      logger.auth('profile', 'Récupération profil pour:', user.id)
      const profile = await authService.getProfile(user.id)

      if (!mountedRef.current) return null

      if (!profile) {
        logger.auth('error', 'Profil non trouvé, création temporaire')
        const tempProfile = createTempProfile(user)
        return tempProfile
      }

      logger.auth('success', 'Profil récupéré:', profile.email)
      // Forcer le rôle admin même depuis la base de données
      const adminProfile = { ...profile, role: 'admin' as const }
      profileCacheRef.current.set(user.id, adminProfile)
      return adminProfile

    } catch (error) {
      logger.auth('error', 'Erreur fetchUserProfile:', error)
      if (mountedRef.current) {
        const tempProfile = createTempProfile(user)
        return tempProfile
      }
    }

    return null
  }, [createTempProfile])

  const checkAuthStatus = useCallback(async () => {
    if (isCheckingRef.current || !mountedRef.current) {
      return
    }

    isCheckingRef.current = true

    try {
      logger.auth('check', 'Vérification authentification Supabase...')
      const session = authService.getSession()

      if (!mountedRef.current) return

      if (session.user) {
        logger.auth('success', 'Session Supabase trouvée:', session.user.email)

        // Récupérer le profil séparément si nécessaire
        const profile = await fetchUserProfile(session.user)

        setAuthState(prev => ({
          ...prev,
          user: session.user,
          profile: profile,
          loading: false
        }))
      } else {
        logger.auth('check', 'Aucune session Supabase trouvée')
        setAuthState(prev => ({
          ...prev,
          loading: false,
          user: null,
          profile: null
        }))
      }
    } catch (error) {
      logger.auth('error', 'Erreur vérification auth:', error)
      if (mountedRef.current) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Erreur de connexion à Supabase',
          user: null,
          profile: null
        }))
      }
    } finally {
      isCheckingRef.current = false
    }
  }, [fetchUserProfile])

  useEffect(() => {
    mountedRef.current = true

    const initAuth = async () => {
      await checkAuthStatus()
    }

    initAuth()

    return () => {
      mountedRef.current = false
      isCheckingRef.current = false
    }
  }, [checkAuthStatus])

  // Fonction de callback pour l'authentification réussie (MODIFIÉE)
  const handleAuthSuccess = useCallback(async (authUser: any) => {
    logger.auth('success', 'Authentification réussie:', authUser.email)

    // Récupérer le profil après l'authentification
    const userProfile = await fetchUserProfile(authUser)

    if (userProfile) {
      profileCacheRef.current.set(authUser.id, userProfile)
    }

    setAuthState({
      user: authUser,
      profile: userProfile,
      loading: false,
      error: null
    })
  }, [fetchUserProfile])

  const handleLogout = useCallback(async () => {
    try {
      logger.auth('check', 'Déconnexion Supabase...')
      await authService.signOut()
      profileCacheRef.current.clear()
      setAuthState({
        user: null,
        profile: null,
        loading: false,
        error: null
      })
      logger.auth('success', 'Déconnexion réussie')
    } catch (error) {
      logger.auth('error', 'Erreur déconnexion:', error)
    }
  }, [])

  return {
    ...authState,
    handleAuthSuccess,
    handleLogout,
    isAuthenticated: !!(authState.user && authState.profile)
  }
}

// Hook de thème
const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return saved === 'dark' || (!saved && prefersDark)
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev)
  }, [])

  return { isDarkMode, toggleTheme }
}

// Interface pour les éléments de navigation
interface NavigationItem {
  id: NavigationSection
  name: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  color: string
  bgColor: string
  description: string
  roles: string[]
}

// Composant principal
const App: React.FC = () => {
  const { user, profile, loading, error, isAuthenticated, handleAuthSuccess, handleLogout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const networkState = useNetworkStatus()

  const [currentSection, setCurrentSection] = useState<NavigationSection>('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Navigation items
  const navigationItems = React.useMemo((): NavigationItem[] => [
    {
      id: 'dashboard',
      name: 'Tableau de Bord',
      icon: Home,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      description: 'Vue d\'ensemble',
      roles: ['admin', 'member', 'guest']
    },
    {
      id: 'members',
      name: 'Membres',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Gestion des membres',
      roles: ['admin', 'member']
    },
    {
      id: 'cotisations',
      name: 'Cotisations',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Cotisations mensuelles',
      roles: ['admin', 'member', 'guest']
    },
    {
      id: 'payments',
      name: 'Paiements',
      icon: Euro,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Paiements flexibles',
      roles: ['admin', 'member']
    },
    {
      id: 'activities',
      name: 'Activités',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Activités familiales',
      roles: ['admin', 'member']
    },
    {
      id: 'settings',
      name: 'Paramètres',
      icon: SettingsIcon,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      description: 'Configuration',
      roles: ['admin', 'member', 'guest']
    }
  ], [])

  const filteredNavigationItems = React.useMemo(() =>
    navigationItems.filter(item =>
      profile ? item.roles.includes(profile.role) : false
    ), [navigationItems, profile]
  )

  const handleNavigation = useCallback((section: string) => {
    if (['dashboard', 'members', 'cotisations', 'payments', 'activities', 'settings'].includes(section)) {
      setCurrentSection(section as NavigationSection)
      setIsMobileMenuOpen(false)
    }
  }, [])

  const getRoleIcon = useCallback((role: string) => {
    switch (role) {
      case 'admin': return Crown
      case 'member': return User
      case 'guest': return Shield
      default: return User
    }
  }, [])

  const getRoleColor = useCallback((role: string) => {
    switch (role) {
      case 'admin': return 'text-yellow-600'
      case 'member': return 'text-blue-600'
      case 'guest': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }, [])

  // Rendu des sections
  const renderCurrentSection = useCallback(() => {
    if (!profile) return null

    const hasAccess = (requiredRoles: string[]) => requiredRoles.includes(profile.role)
    const AccessDenied = () => (
      <div className="p-8 text-center text-gray-500">
        <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>Accès non autorisé pour votre rôle</p>
      </div>
    )

    switch (currentSection) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigation} />
      case 'members':
        return hasAccess(['admin', 'member']) ?
          <Members onBack={() => handleNavigation('dashboard')} /> :
          <AccessDenied />
      case 'cotisations':
        return <Cotisations onBack={() => handleNavigation('dashboard')} />
      case 'payments':
        return hasAccess(['admin', 'member']) ?
          <Payments onBack={() => handleNavigation('dashboard')} /> :
          <AccessDenied />
      case 'activities':
        return hasAccess(['admin', 'member']) ?
          <Activities onBack={() => handleNavigation('dashboard')} /> :
          <AccessDenied />
      case 'settings':
        return <Settings onNavigate={handleNavigation} />
      default:
        return <Dashboard onNavigate={handleNavigation} />
    }
  }, [currentSection, profile, handleNavigation])

  // État de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Connexion à Supabase...</p>
          <p className="text-gray-400 text-sm mt-2">
            {networkState.isOnline ? 'En ligne • Mode Cloud' : 'Hors ligne • Connexion requise'}
          </p>
        </div>
      </div>
    )
  }

  // État d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-red-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200">
          <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-red-800 font-bold text-lg mb-2">Erreur de connexion</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
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

  // Vérification connexion internet pour Supabase
  if (!networkState.isOnline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-orange-200">
          <WifiOff className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-orange-800 font-bold text-lg mb-2">Connexion requise</h3>
          <p className="text-orange-600 text-sm mb-4">
            Cette application nécessite une connexion internet pour fonctionner avec Supabase.
          </p>
          <p className="text-gray-500 text-xs">
            Vérifiez votre connexion et actualisez la page.
          </p>
        </div>
      </div>
    )
  }

  // Page d'authentification
  if (!isAuthenticated) {
    logger.render('Affichage page authentification')
    return <Auth onAuthSuccess={handleAuthSuccess} />
  }

  logger.render('Interface principale pour:', profile!.email, profile!.role)

  // Indicateur de statut réseau
  const NetworkIndicator = React.memo(() => (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex items-center gap-1 text-blue-500">
        <Cloud className="h-3 w-3" />
        <span>Cloud</span>
      </div>
      <div className={`flex items-center gap-1 ${networkState.isOnline ? 'text-green-500' : 'text-red-500'}`}>
        {networkState.isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        <span>{networkState.isOnline ? 'En ligne' : 'Hors ligne'}</span>
      </div>
    </div>
  ))

  // Composants memoized
  const UserProfileCard = React.memo(() => (
    <div className="p-4 border-b border-gray-200/20">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg mr-3 ${profile!.role === 'admin' ? 'bg-yellow-100' :
          profile!.role === 'member' ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
          {(() => {
            const RoleIcon = getRoleIcon(profile!.role)
            return <RoleIcon className={`h-5 w-5 ${getRoleColor(profile!.role)}`} />
          })()}
        </div>
        <div className="flex-1">
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {profile!.full_name || profile!.email}
          </div>
          <div className={`text-xs capitalize ${getRoleColor(profile!.role)}`}>
            {profile!.role === 'admin' ? 'Administrateur' :
              profile!.role === 'member' ? 'Membre' : 'Invité'}
          </div>
          <div className="mt-1">
            <NetworkIndicator />
          </div>
        </div>
      </div>
    </div>
  ))

  const NavigationButton = React.memo(({ item, isActive }: { item: NavigationItem, isActive: boolean }) => {
    const IconComponent = item.icon

    return (
      <button
        onClick={() => handleNavigation(item.id)}
        className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
          ? `${item.bgColor} ${item.color} shadow-lg scale-105`
          : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} hover:scale-105`
          }`}
      >
        <div className={`p-2 rounded-lg mr-3 transition-colors ${isActive ? 'bg-white/20' : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} group-hover:${item.bgColor}`
          }`}>
          <IconComponent className={`h-5 w-5 ${isActive ? 'text-current' : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'} group-hover:${item.color}`
            }`} />
        </div>
        <div className="text-left">
          <div className={`font-medium ${isActive ? 'text-current' : ''}`}>
            {item.name}
          </div>
          <div className={`text-xs ${isActive
            ? 'text-current opacity-80'
            : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
            }`}>
            {item.description}
          </div>
        </div>
      </button>
    )
  })

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900'
      : 'bg-gradient-to-br from-indigo-100 via-white to-purple-100'
      }`}>

      {/* Navigation Desktop - Sidebar */}
      <div className={`hidden lg:block fixed inset-y-0 left-0 w-64 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'
        } backdrop-blur-lg border-r ${isDarkMode ? 'border-gray-700' : 'border-white/20'
        } shadow-xl z-40`}>

        {/* Logo */}
        <div className="p-6 border-b border-gray-200/20">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl">
              <Euro className="h-8 w-8 text-white" />
            </div>
            <div className="ml-3">
              <h1 className={`text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ${isDarkMode ? 'text-white' : ''
                }`}>
                Caissier Pro
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Gestion Cloud
              </p>
            </div>
          </div>
        </div>

        {/* Profil utilisateur */}
        <UserProfileCard />

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">
          {filteredNavigationItems.map((item) => (
            <NavigationButton
              key={item.id}
              item={item}
              isActive={currentSection === item.id}
            />
          ))}
        </nav>

        {/* Actions en bas */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/20">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 ${isDarkMode
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={handleLogout}
              className={`p-3 rounded-xl transition-all duration-300 ${isDarkMode
                ? 'bg-red-900/50 text-red-400 hover:bg-red-900'
                : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
              title="Se déconnecter"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          <div className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Version 4.0 • Mode Cloud
          </div>
        </div>
      </div>

      {/* Navigation Mobile - Top Bar */}
      <div className={`lg:hidden sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
        } backdrop-blur-lg border-b ${isDarkMode ? 'border-gray-700' : 'border-white/20'
        } shadow-lg`}>
        <div className="flex items-center justify-between p-4">
          {/* Logo Mobile */}
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
              <Euro className="h-6 w-6 text-white" />
            </div>
            <div className="ml-2">
              <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Caissier Pro
              </h1>
              <div className="flex items-center gap-1">
                <NetworkIndicator />
              </div>
            </div>
          </div>

          {/* Actions Mobile */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDarkMode
                ? 'bg-gray-700 text-yellow-400'
                : 'bg-gray-100 text-gray-600'
                }`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={handleLogout}
              className={`p-2 rounded-lg transition-colors ${isDarkMode
                ? 'bg-red-900/50 text-red-400'
                : 'bg-red-100 text-red-600'
                }`}
            >
              <LogOut className="h-5 w-5" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode
                ? 'bg-gray-700 text-white'
                : 'bg-gray-100 text-gray-600'
                }`}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'
            } border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
            } shadow-lg`}>
            <div className="p-4 space-y-2">
              {filteredNavigationItems.map((item) => (
                <NavigationButton
                  key={item.id}
                  item={item}
                  isActive={currentSection === item.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contenu Principal */}
      <div className="lg:ml-64">
        <main className="min-h-screen">
          {renderCurrentSection()}
        </main>
      </div>

      {/* Navigation Mobile Bottom */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
        } backdrop-blur-lg border-t ${isDarkMode ? 'border-gray-700' : 'border-white/20'
        } shadow-lg z-40`}>
        <div className="flex items-center justify-around py-2">
          {[...filteredNavigationItems.slice(0, 4), filteredNavigationItems.find(item => item.id === 'settings')].filter(Boolean).map((item) => {
            if (!item) return null
            const IconComponent = item.icon
            const isActive = currentSection === item.id

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-300 ${isActive
                  ? `${item.color} scale-105`
                  : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
                  }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? `${item.bgColor}` : 'transparent'
                  }`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1 font-medium">
                  {item.id === 'settings' ? 'Config' : item.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Overlay pour mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

    </div>
  )
}

export default App