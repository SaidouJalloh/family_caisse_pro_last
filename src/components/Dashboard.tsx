// import React, { useState, useEffect } from 'react'
// import {
//     Users,
//     CreditCard,
//     Activity,
//     TrendingUp,
//     Calendar,
//     Euro,
//     PieChart,
//     BarChart3
// } from 'lucide-react'
// import { DatabaseService } from '../services/database'
// import { DbMember, DbCotisation, DbPayment, DbActivity } from '../lib/supabase'

// interface DashboardProps {
//     onNavigate: (section: string) => void
// }

// const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
//     // État principal
//     const [members, setMembers] = useState<DbMember[]>([])
//     const [cotisations, setCotisations] = useState<DbCotisation[]>([])
//     const [payments, setPayments] = useState<DbPayment[]>([])
//     const [activities, setActivities] = useState<DbActivity[]>([])
//     const [loading, setLoading] = useState(true)

//     // Charger toutes les données
//     useEffect(() => {
//         const loadData = async () => {
//             setLoading(true)
//             try {
//                 const data = await DatabaseService.loadAllData()
//                 setMembers(data.members)
//                 setCotisations(data.cotisations)
//                 setPayments(data.payments)
//                 setActivities(data.activities)
//             } catch (error) {
//                 console.error('Erreur chargement dashboard:', error)
//             } finally {
//                 setLoading(false)
//             }
//         }

//         loadData()
//     }, [])

//     // Calculs automatiques
//     const totalCaisse = payments.reduce((sum, payment) => sum + payment.amount, 0) -
//         activities.reduce((sum, activity) => sum + activity.amount, 0)

//     const totalMembers = members.length
//     const totalCotisations = cotisations.length
//     const totalActivities = activities.length

//     // Taux de paiement du mois actuel
//     const currentMonth = new Date().toISOString().slice(0, 7)
//     const currentMonthCotisations = cotisations.filter(c => c.month === currentMonth)
//     const currentMonthPayments = payments.filter(p =>
//         currentMonthCotisations.some(c => c.id === p.cotisation_id)
//     )
//     const paymentRate = currentMonthCotisations.length > 0
//         ? Math.round((currentMonthPayments.length / (currentMonthCotisations.length * totalMembers)) * 100)
//         : 0

//     // Membres les plus actifs (qui ont le plus payé)
//     const memberPayments = members.map(member => {
//         const memberPaymentTotal = payments
//             .filter(p => p.member_id === member.id)
//             .reduce((sum, p) => sum + p.amount, 0)
//         return { ...member, totalPaid: memberPaymentTotal }
//     }).sort((a, b) => b.totalPaid - a.totalPaid)

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
//                 <div className="text-center mb-8">
//                     <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
//                         💰 Caissier Familial Pro
//                     </h1>
//                     <p className="text-gray-600 text-lg">
//                         Tableau de bord - Vue d'ensemble de la caisse familiale
//                     </p>
//                 </div>

//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     {/* Total Caisse */}
//                     <div
//                         className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
//                         onClick={() => onNavigate('payments')}
//                     >
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Total Caisse</p>
//                                 <p className="text-3xl font-bold text-green-600">
//                                     {totalCaisse.toFixed(2)}€
//                                 </p>
//                             </div>
//                             <div className="bg-green-100 p-3 rounded-full">
//                                 <Euro className="h-8 w-8 text-green-600" />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Membres */}
//                     <div
//                         className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
//                         onClick={() => onNavigate('members')}
//                     >
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Membres</p>
//                                 <p className="text-3xl font-bold text-blue-600">{totalMembers}</p>
//                             </div>
//                             <div className="bg-blue-100 p-3 rounded-full">
//                                 <Users className="h-8 w-8 text-blue-600" />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Cotisations */}
//                     <div
//                         className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
//                         onClick={() => onNavigate('cotisations')}
//                     >
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Cotisations</p>
//                                 <p className="text-3xl font-bold text-purple-600">{totalCotisations}</p>
//                             </div>
//                             <div className="bg-purple-100 p-3 rounded-full">
//                                 <CreditCard className="h-8 w-8 text-purple-600" />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Activités */}
//                     <div
//                         className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
//                         onClick={() => onNavigate('activities')}
//                     >
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Activités</p>
//                                 <p className="text-3xl font-bold text-orange-600">{totalActivities}</p>
//                             </div>
//                             <div className="bg-orange-100 p-3 rounded-full">
//                                 <Activity className="h-8 w-8 text-orange-600" />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Métriques Avancées */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

//                     {/* Taux de Paiement */}
//                     <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-lg font-semibold text-gray-800">Taux de Paiement Ce Mois</h3>
//                             <TrendingUp className="h-6 w-6 text-green-600" />
//                         </div>
//                         <div className="relative">
//                             <div className="flex items-center justify-center">
//                                 <div className="relative w-32 h-32">
//                                     <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
//                                         {/* Cercle de fond */}
//                                         <circle
//                                             cx="64"
//                                             cy="64"
//                                             r="56"
//                                             stroke="currentColor"
//                                             strokeWidth="8"
//                                             fill="none"
//                                             className="text-gray-200"
//                                         />
//                                         {/* Cercle de progression */}
//                                         <circle
//                                             cx="64"
//                                             cy="64"
//                                             r="56"
//                                             stroke="currentColor"
//                                             strokeWidth="8"
//                                             fill="none"
//                                             strokeLinecap="round"
//                                             className="text-green-600"
//                                             strokeDasharray={`${(paymentRate / 100) * 351.86} 351.86`}
//                                         />
//                                     </svg>
//                                     <div className="absolute inset-0 flex items-center justify-center">
//                                         <span className="text-2xl font-bold text-green-600">{paymentRate}%</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Top Contributeurs */}
//                     <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-lg font-semibold text-gray-800">Top Contributeurs</h3>
//                             <BarChart3 className="h-6 w-6 text-purple-600" />
//                         </div>
//                         <div className="space-y-3">
//                             {memberPayments.slice(0, 5).map((member, index) => (
//                                 <div key={member.id} className="flex items-center justify-between">
//                                     <div className="flex items-center">
//                                         <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${index === 0 ? 'bg-yellow-500' :
//                                             index === 1 ? 'bg-gray-400' :
//                                                 index === 2 ? 'bg-orange-400' : 'bg-blue-500'
//                                             }`}>
//                                             {index + 1}
//                                         </div>
//                                         <span className="font-medium text-gray-700">{member.name}</span>
//                                     </div>
//                                     <span className="font-bold text-green-600">{member.totalPaid.toFixed(2)}€</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Actions Rapides */}
//                 <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                         <PieChart className="h-6 w-6 text-indigo-600 mr-2" />
//                         Actions Rapides
//                     </h3>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                         <button
//                             onClick={() => onNavigate('members')}
//                             className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
//                         >
//                             <Users className="h-6 w-6 mx-auto mb-2" />
//                             <span className="text-sm font-medium">Gérer Membres</span>
//                         </button>

//                         <button
//                             onClick={() => onNavigate('cotisations')}
//                             className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
//                         >
//                             <CreditCard className="h-6 w-6 mx-auto mb-2" />
//                             <span className="text-sm font-medium">Cotisations</span>
//                         </button>

//                         <button
//                             onClick={() => onNavigate('payments')}
//                             className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg"
//                         >
//                             <Euro className="h-6 w-6 mx-auto mb-2" />
//                             <span className="text-sm font-medium">Paiements</span>
//                         </button>

//                         <button
//                             onClick={() => onNavigate('activities')}
//                             className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-lg"
//                         >
//                             <Activity className="h-6 w-6 mx-auto mb-2" />
//                             <span className="text-sm font-medium">Activités</span>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Activités Récentes */}
//                 {activities.length > 0 && (
//                     <div className="mt-8 bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                             <Calendar className="h-6 w-6 text-orange-600 mr-2" />
//                             Activités Récentes
//                         </h3>
//                         <div className="space-y-3">
//                             {activities.slice(0, 5).map(activity => (
//                                 <div key={activity.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
//                                     <div>
//                                         <p className="font-medium text-gray-700">{activity.name}</p>
//                                         <p className="text-sm text-gray-500">
//                                             {new Date(activity.activity_date).toLocaleDateString('fr-FR')}
//                                         </p>
//                                     </div>
//                                     <span className="font-bold text-orange-600">-{activity.amount.toFixed(2)}€</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//             </div>
//         </div>
//     )
// }

// export default Dashboard












import React, { useState, useEffect } from 'react'
import {
    Users,
    CreditCard,
    Activity,
    TrendingUp,
    Calendar,
    Euro,
    PieChart,
    BarChart3
} from 'lucide-react'
import { DatabaseService } from '../services/database'
import { DbMember, DbCotisation, DbPayment, DbActivity } from '../lib/supabase'

interface DashboardProps {
    onNavigate: (section: 'dashboard' | 'members' | 'cotisations' | 'payments' | 'activities') => void
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    // État principal
    const [members, setMembers] = useState<DbMember[]>([])
    const [cotisations, setCotisations] = useState<DbCotisation[]>([])
    const [payments, setPayments] = useState<DbPayment[]>([])
    const [activities, setActivities] = useState<DbActivity[]>([])
    const [loading, setLoading] = useState(true)

    // Charger toutes les données
    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                const data = await DatabaseService.loadAllData()
                setMembers(data.members)
                setCotisations(data.cotisations)
                setPayments(data.payments)
                setActivities(data.activities)
            } catch (error) {
                console.error('Erreur chargement dashboard:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    // Calculs automatiques
    const totalCaisse = payments.reduce((sum, payment) => sum + payment.amount, 0) -
        activities.reduce((sum, activity) => sum + activity.amount, 0)

    const totalMembers = members.length
    const totalCotisations = cotisations.length
    const totalActivities = activities.length

    // Taux de paiement du mois actuel
    const currentMonth = new Date().toISOString().slice(0, 7)
    const currentMonthCotisations = cotisations.filter(c => c.month === currentMonth)
    const currentMonthPayments = payments.filter(p =>
        currentMonthCotisations.some(c => c.id === p.cotisation_id)
    )
    const paymentRate = currentMonthCotisations.length > 0
        ? Math.round((currentMonthPayments.length / (currentMonthCotisations.length * totalMembers)) * 100)
        : 0

    // Membres les plus actifs (qui ont le plus payé)
    const memberPayments = members.map(member => {
        const memberPaymentTotal = payments
            .filter(p => p.member_id === member.id)
            .reduce((sum, p) => sum + p.amount, 0)
        return { ...member, totalPaid: memberPaymentTotal }
    }).sort((a, b) => b.totalPaid - a.totalPaid)

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
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        💰 Caissier Familial Pro
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Tableau de bord - Vue d'ensemble de la caisse familiale
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Caisse */}
                    <div
                        className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
                        onClick={() => onNavigate('payments')}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Caisse</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {totalCaisse.toFixed(2)}€
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <Euro className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Membres */}
                    <div
                        className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
                        onClick={() => onNavigate('members')}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Membres</p>
                                <p className="text-3xl font-bold text-blue-600">{totalMembers}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Cotisations */}
                    <div
                        className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
                        onClick={() => onNavigate('cotisations')}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Cotisations</p>
                                <p className="text-3xl font-bold text-purple-600">{totalCotisations}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <CreditCard className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    {/* Activités */}
                    <div
                        className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
                        onClick={() => onNavigate('activities')}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Activités</p>
                                <p className="text-3xl font-bold text-orange-600">{totalActivities}</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-full">
                                <Activity className="h-8 w-8 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Métriques Avancées */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                    {/* Taux de Paiement */}
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Taux de Paiement Ce Mois</h3>
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="relative">
                            <div className="flex items-center justify-center">
                                <div className="relative w-32 h-32">
                                    <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                                        {/* Cercle de fond */}
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="none"
                                            className="text-gray-200"
                                        />
                                        {/* Cercle de progression */}
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeLinecap="round"
                                            className="text-green-600"
                                            strokeDasharray={`${(paymentRate / 100) * 351.86} 351.86`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-green-600">{paymentRate}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Contributeurs */}
                    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Top Contributeurs</h3>
                            <BarChart3 className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="space-y-3">
                            {memberPayments.slice(0, 5).map((member, index) => (
                                <div key={member.id} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${index === 0 ? 'bg-yellow-500' :
                                                index === 1 ? 'bg-gray-400' :
                                                    index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <span className="font-medium text-gray-700">{member.name}</span>
                                    </div>
                                    <span className="font-bold text-green-600">{member.totalPaid.toFixed(2)}€</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions Rapides */}
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <PieChart className="h-6 w-6 text-indigo-600 mr-2" />
                        Actions Rapides
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            onClick={() => onNavigate('members')}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            <Users className="h-6 w-6 mx-auto mb-2" />
                            <span className="text-sm font-medium">Gérer Membres</span>
                        </button>

                        <button
                            onClick={() => onNavigate('cotisations')}
                            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            <CreditCard className="h-6 w-6 mx-auto mb-2" />
                            <span className="text-sm font-medium">Cotisations</span>
                        </button>

                        <button
                            onClick={() => onNavigate('payments')}
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            <Euro className="h-6 w-6 mx-auto mb-2" />
                            <span className="text-sm font-medium">Paiements</span>
                        </button>

                        <button
                            onClick={() => onNavigate('activities')}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            <Activity className="h-6 w-6 mx-auto mb-2" />
                            <span className="text-sm font-medium">Activités</span>
                        </button>
                    </div>
                </div>

                {/* Activités Récentes */}
                {activities.length > 0 && (
                    <div className="mt-8 bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Calendar className="h-6 w-6 text-orange-600 mr-2" />
                            Activités Récentes
                        </h3>
                        <div className="space-y-3">
                            {activities.slice(0, 5).map(activity => (
                                <div key={activity.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-700">{activity.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(activity.activity_date).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                    <span className="font-bold text-orange-600">-{activity.amount.toFixed(2)}€</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Dashboard