// // src/lib/statisticsService.ts - Service de statistiques pour Supabase
// import { supabase } from './supabaseService'

// export interface StatisticsData {
//     totalMembers: number;
//     totalCotisations: number;
//     totalPayments: number;
//     totalActivities: number;
//     totalCaisse: number;
//     currentMonth: {
//         income: number;
//         expenses: number;
//         net: number;
//     };
//     trends: {
//         membersGrowth: number;
//         incomeGrowth: number;
//         expenseGrowth: number;
//     };
//     topContributors: Array<{
//         name: string;
//         amount: number;
//         percentage: number;
//     }>;
//     monthlyData: Array<{
//         month: string;
//         income: number;
//         expenses: number;
//         net: number;
//     }>;
//     categoryBreakdown: Array<{
//         category: string;
//         amount: number;
//         color: string;
//         percentage: number;
//     }>;
//     memberBalances: Array<{
//         name: string;
//         balance: number;
//         status: string;
//     }>;
//     paymentStatus: {
//         paid: number;
//         partial: number;
//         unpaid: number;
//     };
// }

// export class StatisticsService {
//     private static familyId: string | null = null;

//     private static async getFamilyId(): Promise<string | null> {
//         if (this.familyId) return this.familyId;

//         const { data: { user } } = await supabase.auth.getUser();
//         if (!user) return null;

//         const { data: profile } = await supabase
//             .from('profiles')
//             .select('family_id')
//             .eq('id', user.id)
//             .single();

//         this.familyId = profile?.family_id || null;
//         return this.familyId;
//     }

//     // Récupérer les statistiques complètes
//     static async getCompleteStatistics(period?: string): Promise<StatisticsData> {
//         const familyId = await this.getFamilyId();
//         if (!familyId) throw new Error('Family ID not found');

//         const [
//             basicStats,
//             currentMonthStats,
//             trends,
//             topContributors,
//             monthlyData,
//             categoryBreakdown,
//             memberBalances,
//             paymentStatus
//         ] = await Promise.all([
//             this.getBasicStats(familyId),
//             this.getCurrentMonthStats(familyId),
//             this.getTrends(familyId),
//             this.getTopContributors(familyId),
//             this.getMonthlyData(familyId),
//             this.getCategoryBreakdown(familyId),
//             this.getMemberBalances(familyId),
//             this.getPaymentStatus(familyId)
//         ]);

//         return {
//             ...basicStats,
//             currentMonth: currentMonthStats,
//             trends,
//             topContributors,
//             monthlyData,
//             categoryBreakdown,
//             memberBalances,
//             paymentStatus
//         };
//     }

//     // Statistiques de base
//     private static async getBasicStats(familyId: string) {
//         const [membersCount, cotisationsCount, paymentsCount, activitiesCount, totalCaisse] = await Promise.all([
//             this.countMembers(familyId),
//             this.countCotisations(familyId),
//             this.countPayments(familyId),
//             this.countActivities(familyId),
//             this.calculateTotalCaisse(familyId)
//         ]);

//         return {
//             totalMembers: membersCount,
//             totalCotisations: cotisationsCount,
//             totalPayments: paymentsCount,
//             totalActivities: activitiesCount,
//             totalCaisse
//         };
//     }

//     // Compter les membres
//     private static async countMembers(familyId: string): Promise<number> {
//         const { count } = await supabase
//             .from('members')
//             .select('*', { count: 'exact', head: true })
//             .eq('family_id', familyId)
//             .eq('status', 'active')
//             .is('deleted_at', null);

//         return count || 0;
//     }

//     // Compter les cotisations
//     private static async countCotisations(familyId: string): Promise<number> {
//         const { count } = await supabase
//             .from('cotisations')
//             .select('*', { count: 'exact', head: true })
//             .eq('family_id', familyId)
//             .is('deleted_at', null);

//         return count || 0;
//     }

//     // Compter les paiements
//     private static async countPayments(familyId: string): Promise<number> {
//         const { count } = await supabase
//             .from('payments')
//             .select('*', { count: 'exact', head: true })
//             .eq('family_id', familyId)
//             .is('deleted_at', null);

//         return count || 0;
//     }

//     // Compter les activités
//     private static async countActivities(familyId: string): Promise<number> {
//         const { count } = await supabase
//             .from('activities')
//             .select('*', { count: 'exact', head: true })
//             .eq('family_id', familyId)
//             .is('deleted_at', null);

//         return count || 0;
//     }

//     // Calculer le total de la caisse
//     private static async calculateTotalCaisse(familyId: string): Promise<number> {
//         // Revenus: paiements + dépôts
//         const { data: payments } = await supabase
//             .from('payments')
//             .select('amount')
//             .eq('family_id', familyId)
//             .eq('status', 'paid')
//             .is('deleted_at', null);

//         const { data: deposits } = await supabase
//             .from('caisse_deposits')
//             .select('amount')
//             .eq('family_id', familyId)
//             .is('deleted_at', null);

//         // Dépenses: activités
//         const { data: activities } = await supabase
//             .from('activities')
//             .select('amount')
//             .eq('family_id', familyId)
//             .is('deleted_at', null);

//         const totalPayments = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
//         const totalDeposits = deposits?.reduce((sum, d) => sum + d.amount, 0) || 0;
//         const totalActivities = activities?.reduce((sum, a) => sum + a.amount, 0) || 0;

//         return totalPayments + totalDeposits - totalActivities;
//     }

//     // Statistiques du mois en cours
//     private static async getCurrentMonthStats(familyId: string) {
//         const currentDate = new Date();
//         const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//         const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

//         const startISO = startOfMonth.toISOString();
//         const endISO = endOfMonth.toISOString();

//         // Revenus du mois
//         const { data: monthlyPayments } = await supabase
//             .from('payments')
//             .select('amount')
//             .eq('family_id', familyId)
//             .eq('status', 'paid')
//             .gte('payment_date', startISO)
//             .lte('payment_date', endISO)
//             .is('deleted_at', null);

//         const { data: monthlyDeposits } = await supabase
//             .from('caisse_deposits')
//             .select('amount')
//             .eq('family_id', familyId)
//             .gte('deposit_date', startISO)
//             .lte('deposit_date', endISO)
//             .is('deleted_at', null);

//         // Dépenses du mois
//         const { data: monthlyActivities } = await supabase
//             .from('activities')
//             .select('amount')
//             .eq('family_id', familyId)
//             .gte('activity_date', startISO)
//             .lte('activity_date', endISO)
//             .is('deleted_at', null);

//         const income = (monthlyPayments?.reduce((sum, p) => sum + p.amount, 0) || 0) +
//             (monthlyDeposits?.reduce((sum, d) => sum + d.amount, 0) || 0);
//         const expenses = monthlyActivities?.reduce((sum, a) => sum + a.amount, 0) || 0;

//         return {
//             income,
//             expenses,
//             net: income - expenses
//         };
//     }

//     // Calcul des tendances
//     private static async getTrends(familyId: string) {
//         const currentDate = new Date();
//         const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
//         const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

//         // Membres: croissance du mois dernier vs ce mois
//         const { count: lastMonthMembers } = await supabase
//             .from('members')
//             .select('*', { count: 'exact', head: true })
//             .eq('family_id', familyId)
//             .lte('created_at', currentMonth.toISOString())
//             .is('deleted_at', null);

//         const { count: currentMonthMembers } = await supabase
//             .from('members')
//             .select('*', { count: 'exact', head: true })
//             .eq('family_id', familyId)
//             .is('deleted_at', null);

//         const membersGrowth = lastMonthMembers
//             ? ((currentMonthMembers || 0) - lastMonthMembers) / lastMonthMembers * 100
//             : 0;

//         // Revenus: tendance
//         const lastMonthStats = await this.getMonthStats(familyId, lastMonth);
//         const currentMonthStats = await this.getCurrentMonthStats(familyId);

//         const incomeGrowth = lastMonthStats.income
//             ? (currentMonthStats.income - lastMonthStats.income) / lastMonthStats.income * 100
//             : 0;

//         const expenseGrowth = lastMonthStats.expenses
//             ? (currentMonthStats.expenses - lastMonthStats.expenses) / lastMonthStats.expenses * 100
//             : 0;

//         return {
//             membersGrowth: Math.round(membersGrowth * 10) / 10,
//             incomeGrowth: Math.round(incomeGrowth * 10) / 10,
//             expenseGrowth: Math.round(expenseGrowth * 10) / 10
//         };
//     }

//     // Statistiques pour un mois donné
//     private static async getMonthStats(familyId: string, date: Date) {
//         const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
//         const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

//         const startISO = startOfMonth.toISOString();
//         const endISO = endOfMonth.toISOString();

//         const { data: payments } = await supabase
//             .from('payments')
//             .select('amount')
//             .eq('family_id', familyId)
//             .eq('status', 'paid')
//             .gte('payment_date', startISO)
//             .lte('payment_date', endISO)
//             .is('deleted_at', null);

//         const { data: deposits } = await supabase
//             .from('caisse_deposits')
//             .select('amount')
//             .eq('family_id', familyId)
//             .gte('deposit_date', startISO)
//             .lte('deposit_date', endISO)
//             .is('deleted_at', null);

//         const { data: activities } = await supabase
//             .from('activities')
//             .select('amount')
//             .eq('family_id', familyId)
//             .gte('activity_date', startISO)
//             .lte('activity_date', endISO)
//             .is('deleted_at', null);

//         const income = (payments?.reduce((sum, p) => sum + p.amount, 0) || 0) +
//             (deposits?.reduce((sum, d) => sum + d.amount, 0) || 0);
//         const expenses = activities?.reduce((sum, a) => sum + a.amount, 0) || 0;

//         return { income, expenses };
//     }

//     // Top contributeurs
//     private static async getTopContributors(familyId: string) {
//         const { data } = await supabase
//             .from('payments')
//             .select(`
//         amount,
//         members!inner(name)
//       `)
//             .eq('family_id', familyId)
//             .eq('status', 'paid')
//             .is('deleted_at', null);

//         if (!data) return [];

//         // Grouper par membre
//         const contributionMap = new Map<string, number>();
//         data.forEach(payment => {
//             const memberName = payment.members.name;
//             contributionMap.set(memberName, (contributionMap.get(memberName) || 0) + payment.amount);
//         });

//         // Calculer le total
//         const total = Array.from(contributionMap.values()).reduce((sum, amount) => sum + amount, 0);

//         // Trier et formater
//         const contributors = Array.from(contributionMap.entries())
//             .map(([name, amount]) => ({
//                 name,
//                 amount,
//                 percentage: total > 0 ? (amount / total) * 100 : 0
//             }))
//             .sort((a, b) => b.amount - a.amount)
//             .slice(0, 5);

//         return contributors;
//     }

//     // Données mensuelles pour les 6 derniers mois
//     private static async getMonthlyData(familyId: string) {
//         const months = [];
//         const currentDate = new Date();

//         for (let i = 5; i >= 0; i--) {
//             const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
//             const monthStats = await this.getMonthStats(familyId, date);

//             months.push({
//                 month: date.toLocaleDateString('fr-FR', { month: 'short' }),
//                 income: monthStats.income,
//                 expenses: monthStats.expenses,
//                 net: monthStats.income - monthStats.expenses
//             });
//         }

//         return months;
//     }

//     // Répartition par catégories
//     private static async getCategoryBreakdown(familyId: string) {
//         const { data: deposits } = await supabase
//             .from('caisse_deposits')
//             .select('category, amount')
//             .eq('family_id', familyId)
//             .is('deleted_at', null);

//         const { data: payments } = await supabase
//             .from('payments')
//             .select('amount')
//             .eq('family_id', familyId)
//             .eq('status', 'paid')
//             .is('deleted_at', null);

//         const categoryMap = new Map<string, number>();

//         // Ajouter les cotisations
//         const totalPayments = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
//         if (totalPayments > 0) {
//             categoryMap.set('Cotisations', totalPayments);
//         }

//         // Ajouter les dépôts par catégorie
//         deposits?.forEach(deposit => {
//             const categoryName = this.getCategoryLabel(deposit.category);
//             categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + deposit.amount);
//         });

//         const total = Array.from(categoryMap.values()).reduce((sum, amount) => sum + amount, 0);
//         const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

//         return Array.from(categoryMap.entries())
//             .map(([category, amount], index) => ({
//                 category,
//                 amount,
//                 percentage: total > 0 ? (amount / total) * 100 : 0,
//                 color: colors[index % colors.length]
//             }))
//             .sort((a, b) => b.amount - a.amount);
//     }

//     // Soldes des membres
//     private static async getMemberBalances(familyId: string) {
//         const { data } = await supabase
//             .from('members')
//             .select('name, balance, status')
//             .eq('family_id', familyId)
//             .is('deleted_at', null)
//             .order('balance', { ascending: false });

//         return data?.map(member => ({
//             name: member.name,
//             balance: member.balance,
//             status: member.status
//         })) || [];
//     }

//     // Statut des paiements
//     private static async getPaymentStatus(familyId: string) {
//         const { data } = await supabase
//             .from('payments')
//             .select('status')
//             .eq('family_id', familyId)
//             .is('deleted_at', null);

//         const statusCount = { paid: 0, partial: 0, unpaid: 0 };
//         data?.forEach(payment => {
//             statusCount[payment.status]++;
//         });

//         return statusCount;
//     }

//     // Utilitaires
//     private static getCategoryLabel(category: string): string {
//         const labels: Record<string, string> = {
//             'don': 'Dons',
//             'remboursement': 'Remboursements',
//             'vente': 'Ventes',
//             'bonus': 'Bonus',
//             'autre': 'Autres'
//         };
//         return labels[category] || category;
//     }

//     // Génération de rapports
//     static async generateReportData(type: 'monthly' | 'annual' | 'custom', filters?: any): Promise<any> {
//         const familyId = await this.getFamilyId();
//         if (!familyId) throw new Error('Family ID not found');

//         const stats = await this.getCompleteStatistics();

//         switch (type) {
//             case 'monthly':
//                 return {
//                     ...stats,
//                     period: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
//                     type: 'monthly'
//                 };

//             case 'annual':
//                 return {
//                     ...stats,
//                     period: new Date().getFullYear().toString(),
//                     type: 'annual'
//                 };

//             case 'custom':
//                 return {
//                     ...stats,
//                     period: 'Personnalisé',
//                     type: 'custom',
//                     filters
//                 };

//             default:
//                 return stats;
//         }
//     }

//     // Export des données
//     static async exportData(format: 'json' | 'csv'): Promise<string> {
//         const familyId = await this.getFamilyId();
//         if (!familyId) throw new Error('Family ID not found');

//         const stats = await this.getCompleteStatistics();

//         if (format === 'json') {
//             return JSON.stringify(stats, null, 2);
//         } else {
//             // Conversion CSV simplifiée
//             const csvData = [
//                 ['Métrique', 'Valeur'],
//                 ['Membres actifs', stats.totalMembers.toString()],
//                 ['Total caisse', `${stats.totalCaisse.toFixed(2)}€`],
//                 ['Revenus du mois', `${stats.currentMonth.income.toFixed(2)}€`],
//                 ['Dépenses du mois', `${stats.currentMonth.expenses.toFixed(2)}€`],
//                 ...stats.topContributors.map(c => [c.name, `${c.amount.toFixed(2)}€`])
//             ];

//             return csvData.map(row => row.join(',')).join('\n');
//         }
//     }
// }

// // Export par défaut
// export default StatisticsService;















// code corriger 
// src/lib/statisticsService.ts - Service de statistiques pour Supabase
import { supabase } from './supabaseService'

// Interfaces pour le typage des réponses Supabase exactes
interface SupabasePaymentWithMember {
    amount: number;
    members: {
        name: string;
    }[];
}

interface SupabaseCaisseDepositData {
    amount: number;
    category: string;
}

interface SupabasePaymentStatus {
    status: 'paid' | 'partial' | 'unpaid';
}

export interface StatisticsData {
    totalMembers: number;
    totalCotisations: number;
    totalPayments: number;
    totalActivities: number;
    totalCaisse: number;
    currentMonth: {
        income: number;
        expenses: number;
        net: number;
    };
    trends: {
        membersGrowth: number;
        incomeGrowth: number;
        expenseGrowth: number;
    };
    topContributors: Array<{
        name: string;
        amount: number;
        percentage: number;
    }>;
    monthlyData: Array<{
        month: string;
        income: number;
        expenses: number;
        net: number;
    }>;
    categoryBreakdown: Array<{
        category: string;
        amount: number;
        color: string;
        percentage: number;
    }>;
    memberBalances: Array<{
        name: string;
        balance: number;
        status: string;
    }>;
    paymentStatus: {
        paid: number;
        partial: number;
        unpaid: number;
    };
}

export class StatisticsService {
    private static familyId: string | null = null;

    private static async getFamilyId(): Promise<string | null> {
        if (this.familyId) return this.familyId;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data: profile } = await supabase
            .from('profiles')
            .select('family_id')
            .eq('id', user.id)
            .single();

        this.familyId = profile?.family_id || null;
        return this.familyId;
    }

    // Récupérer les statistiques complètes
    static async getCompleteStatistics(period?: string): Promise<StatisticsData> {
        const familyId = await this.getFamilyId();
        if (!familyId) throw new Error('Family ID not found');

        const [
            basicStats,
            currentMonthStats,
            trends,
            topContributors,
            monthlyData,
            categoryBreakdown,
            memberBalances,
            paymentStatus
        ] = await Promise.all([
            this.getBasicStats(familyId),
            this.getCurrentMonthStats(familyId),
            this.getTrends(familyId),
            this.getTopContributors(familyId),
            this.getMonthlyData(familyId),
            this.getCategoryBreakdown(familyId),
            this.getMemberBalances(familyId),
            this.getPaymentStatus(familyId)
        ]);

        return {
            ...basicStats,
            currentMonth: currentMonthStats,
            trends,
            topContributors,
            monthlyData,
            categoryBreakdown,
            memberBalances,
            paymentStatus
        };
    }

    // Statistiques de base
    private static async getBasicStats(familyId: string) {
        const [membersCount, cotisationsCount, paymentsCount, activitiesCount, totalCaisse] = await Promise.all([
            this.countMembers(familyId),
            this.countCotisations(familyId),
            this.countPayments(familyId),
            this.countActivities(familyId),
            this.calculateTotalCaisse(familyId)
        ]);

        return {
            totalMembers: membersCount,
            totalCotisations: cotisationsCount,
            totalPayments: paymentsCount,
            totalActivities: activitiesCount,
            totalCaisse
        };
    }

    // Compter les membres
    private static async countMembers(familyId: string): Promise<number> {
        const { count } = await supabase
            .from('members')
            .select('*', { count: 'exact', head: true })
            .eq('family_id', familyId)
            .eq('status', 'active')
            .is('deleted_at', null);

        return count || 0;
    }

    // Compter les cotisations
    private static async countCotisations(familyId: string): Promise<number> {
        const { count } = await supabase
            .from('cotisations')
            .select('*', { count: 'exact', head: true })
            .eq('family_id', familyId)
            .is('deleted_at', null);

        return count || 0;
    }

    // Compter les paiements
    private static async countPayments(familyId: string): Promise<number> {
        const { count } = await supabase
            .from('payments')
            .select('*', { count: 'exact', head: true })
            .eq('family_id', familyId)
            .is('deleted_at', null);

        return count || 0;
    }

    // Compter les activités
    private static async countActivities(familyId: string): Promise<number> {
        const { count } = await supabase
            .from('activities')
            .select('*', { count: 'exact', head: true })
            .eq('family_id', familyId)
            .is('deleted_at', null);

        return count || 0;
    }

    // Calculer le total de la caisse
    private static async calculateTotalCaisse(familyId: string): Promise<number> {
        // Revenus: paiements + dépôts
        const { data: payments } = await supabase
            .from('payments')
            .select('amount')
            .eq('family_id', familyId)
            .eq('status', 'paid')
            .is('deleted_at', null);

        const { data: deposits } = await supabase
            .from('caisse_deposits')
            .select('amount')
            .eq('family_id', familyId)
            .is('deleted_at', null);

        // Dépenses: activités
        const { data: activities } = await supabase
            .from('activities')
            .select('amount')
            .eq('family_id', familyId)
            .is('deleted_at', null);

        const totalPayments = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
        const totalDeposits = deposits?.reduce((sum, d) => sum + d.amount, 0) || 0;
        const totalActivities = activities?.reduce((sum, a) => sum + a.amount, 0) || 0;

        return totalPayments + totalDeposits - totalActivities;
    }

    // Statistiques du mois en cours
    private static async getCurrentMonthStats(familyId: string) {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const startISO = startOfMonth.toISOString();
        const endISO = endOfMonth.toISOString();

        // Revenus du mois
        const { data: monthlyPayments } = await supabase
            .from('payments')
            .select('amount')
            .eq('family_id', familyId)
            .eq('status', 'paid')
            .gte('payment_date', startISO)
            .lte('payment_date', endISO)
            .is('deleted_at', null);

        const { data: monthlyDeposits } = await supabase
            .from('caisse_deposits')
            .select('amount')
            .eq('family_id', familyId)
            .gte('deposit_date', startISO)
            .lte('deposit_date', endISO)
            .is('deleted_at', null);

        // Dépenses du mois
        const { data: monthlyActivities } = await supabase
            .from('activities')
            .select('amount')
            .eq('family_id', familyId)
            .gte('activity_date', startISO)
            .lte('activity_date', endISO)
            .is('deleted_at', null);

        const income = (monthlyPayments?.reduce((sum, p) => sum + p.amount, 0) || 0) +
            (monthlyDeposits?.reduce((sum, d) => sum + d.amount, 0) || 0);
        const expenses = monthlyActivities?.reduce((sum, a) => sum + a.amount, 0) || 0;

        return {
            income,
            expenses,
            net: income - expenses
        };
    }

    // Calcul des tendances
    private static async getTrends(familyId: string) {
        const currentDate = new Date();
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

        // Membres: croissance du mois dernier vs ce mois
        const { count: lastMonthMembers } = await supabase
            .from('members')
            .select('*', { count: 'exact', head: true })
            .eq('family_id', familyId)
            .lte('created_at', currentMonth.toISOString())
            .is('deleted_at', null);

        const { count: currentMonthMembers } = await supabase
            .from('members')
            .select('*', { count: 'exact', head: true })
            .eq('family_id', familyId)
            .is('deleted_at', null);

        const membersGrowth = lastMonthMembers
            ? ((currentMonthMembers || 0) - lastMonthMembers) / lastMonthMembers * 100
            : 0;

        // Revenus: tendance
        const lastMonthStats = await this.getMonthStats(familyId, lastMonth);
        const currentMonthStats = await this.getCurrentMonthStats(familyId);

        const incomeGrowth = lastMonthStats.income
            ? (currentMonthStats.income - lastMonthStats.income) / lastMonthStats.income * 100
            : 0;

        const expenseGrowth = lastMonthStats.expenses
            ? (currentMonthStats.expenses - lastMonthStats.expenses) / lastMonthStats.expenses * 100
            : 0;

        return {
            membersGrowth: Math.round(membersGrowth * 10) / 10,
            incomeGrowth: Math.round(incomeGrowth * 10) / 10,
            expenseGrowth: Math.round(expenseGrowth * 10) / 10
        };
    }

    // Statistiques pour un mois donné
    private static async getMonthStats(familyId: string, date: Date) {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const startISO = startOfMonth.toISOString();
        const endISO = endOfMonth.toISOString();

        const { data: payments } = await supabase
            .from('payments')
            .select('amount')
            .eq('family_id', familyId)
            .eq('status', 'paid')
            .gte('payment_date', startISO)
            .lte('payment_date', endISO)
            .is('deleted_at', null);

        const { data: deposits } = await supabase
            .from('caisse_deposits')
            .select('amount')
            .eq('family_id', familyId)
            .gte('deposit_date', startISO)
            .lte('deposit_date', endISO)
            .is('deleted_at', null);

        const { data: activities } = await supabase
            .from('activities')
            .select('amount')
            .eq('family_id', familyId)
            .gte('activity_date', startISO)
            .lte('activity_date', endISO)
            .is('deleted_at', null);

        const income = (payments?.reduce((sum, p) => sum + p.amount, 0) || 0) +
            (deposits?.reduce((sum, d) => sum + d.amount, 0) || 0);
        const expenses = activities?.reduce((sum, a) => sum + a.amount, 0) || 0;

        return { income, expenses };
    }

    // Top contributeurs
    private static async getTopContributors(familyId: string) {
        const { data } = await supabase
            .from('payments')
            .select(`
                amount,
                members!inner(name)
            `)
            .eq('family_id', familyId)
            .eq('status', 'paid')
            .is('deleted_at', null);

        if (!data) return [];

        // Grouper par membre avec typage correct
        const contributionMap = new Map<string, number>();
        data.forEach((payment: SupabasePaymentWithMember) => {
            // members est un tableau, prendre le premier élément
            const memberName = payment.members[0]?.name;
            if (memberName) {
                contributionMap.set(memberName, (contributionMap.get(memberName) || 0) + payment.amount);
            }
        });

        // Calculer le total
        const total = Array.from(contributionMap.values()).reduce((sum, amount) => sum + amount, 0);

        // Trier et formater
        const contributors = Array.from(contributionMap.entries())
            .map(([name, amount]) => ({
                name,
                amount,
                percentage: total > 0 ? (amount / total) * 100 : 0
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);

        return contributors;
    }

    // Données mensuelles pour les 6 derniers mois
    private static async getMonthlyData(familyId: string) {
        const months = [];
        const currentDate = new Date();

        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthStats = await this.getMonthStats(familyId, date);

            months.push({
                month: date.toLocaleDateString('fr-FR', { month: 'short' }),
                income: monthStats.income,
                expenses: monthStats.expenses,
                net: monthStats.income - monthStats.expenses
            });
        }

        return months;
    }

    // Répartition par catégories
    private static async getCategoryBreakdown(familyId: string) {
        const { data: deposits } = await supabase
            .from('caisse_deposits')
            .select('category, amount')
            .eq('family_id', familyId)
            .is('deleted_at', null);

        const { data: payments } = await supabase
            .from('payments')
            .select('amount')
            .eq('family_id', familyId)
            .eq('status', 'paid')
            .is('deleted_at', null);

        const categoryMap = new Map<string, number>();

        // Ajouter les cotisations
        const totalPayments = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
        if (totalPayments > 0) {
            categoryMap.set('Cotisations', totalPayments);
        }

        // Ajouter les dépôts par catégorie
        deposits?.forEach((deposit: SupabaseCaisseDepositData) => {
            const categoryName = this.getCategoryLabel(deposit.category);
            categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + deposit.amount);
        });

        const total = Array.from(categoryMap.values()).reduce((sum, amount) => sum + amount, 0);
        const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

        return Array.from(categoryMap.entries())
            .map(([category, amount], index) => ({
                category,
                amount,
                percentage: total > 0 ? (amount / total) * 100 : 0,
                color: colors[index % colors.length]
            }))
            .sort((a, b) => b.amount - a.amount);
    }

    // Soldes des membres
    private static async getMemberBalances(familyId: string) {
        const { data } = await supabase
            .from('members')
            .select('name, balance, status')
            .eq('family_id', familyId)
            .is('deleted_at', null)
            .order('balance', { ascending: false });

        return data?.map(member => ({
            name: member.name,
            balance: member.balance,
            status: member.status
        })) || [];
    }

    // Statut des paiements - CORRECTION FINALE
    private static async getPaymentStatus(familyId: string) {
        const { data } = await supabase
            .from('payments')
            .select('status')
            .eq('family_id', familyId)
            .is('deleted_at', null);

        const statusCount: { paid: number; partial: number; unpaid: number } = {
            paid: 0,
            partial: 0,
            unpaid: 0
        };

        // Correction finale avec typage approprié
        data?.forEach((payment: SupabasePaymentStatus) => {
            const status = payment.status;
            statusCount[status]++;
        });

        return statusCount;
    }

    // Utilitaires
    private static getCategoryLabel(category: string): string {
        const labels: Record<string, string> = {
            'don': 'Dons',
            'remboursement': 'Remboursements',
            'vente': 'Ventes',
            'bonus': 'Bonus',
            'autre': 'Autres'
        };
        return labels[category] || category;
    }

    // Génération de rapports
    static async generateReportData(type: 'monthly' | 'annual' | 'custom', filters?: any): Promise<any> {
        const familyId = await this.getFamilyId();
        if (!familyId) throw new Error('Family ID not found');

        const stats = await this.getCompleteStatistics();

        switch (type) {
            case 'monthly':
                return {
                    ...stats,
                    period: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
                    type: 'monthly'
                };

            case 'annual':
                return {
                    ...stats,
                    period: new Date().getFullYear().toString(),
                    type: 'annual'
                };

            case 'custom':
                return {
                    ...stats,
                    period: 'Personnalisé',
                    type: 'custom',
                    filters
                };

            default:
                return stats;
        }
    }

    // Export des données
    static async exportData(format: 'json' | 'csv'): Promise<string> {
        const familyId = await this.getFamilyId();
        if (!familyId) throw new Error('Family ID not found');

        const stats = await this.getCompleteStatistics();

        if (format === 'json') {
            return JSON.stringify(stats, null, 2);
        } else {
            // Conversion CSV simplifiée
            const csvData = [
                ['Métrique', 'Valeur'],
                ['Membres actifs', stats.totalMembers.toString()],
                ['Total caisse', `${stats.totalCaisse.toFixed(2)}€`],
                ['Revenus du mois', `${stats.currentMonth.income.toFixed(2)}€`],
                ['Dépenses du mois', `${stats.currentMonth.expenses.toFixed(2)}€`],
                ...stats.topContributors.map(c => [c.name, `${c.amount.toFixed(2)}€`])
            ];

            return csvData.map(row => row.join(',')).join('\n');
        }
    }
}

// Export par défaut
export default StatisticsService;