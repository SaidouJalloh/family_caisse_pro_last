// // import { supabase, Database } from '../lib/supabase'

// // type Member = Database['public']['Tables']['members']['Row']
// // type MemberInsert = Database['public']['Tables']['members']['Insert']
// // type Cotisation = Database['public']['Tables']['cotisations']['Row']
// // type Payment = Database['public']['Tables']['payments']['Row']
// // type Activity = Database['public']['Tables']['activities']['Row']

// // export class DatabaseService {
// //     // 👥 MEMBERS
// //     static async getMembers(): Promise<Member[]> {
// //         const { data, error } = await supabase
// //             .from('members')
// //             .select('*')
// //             .order('created_at', { ascending: false })

// //         if (error) throw error
// //         return data || []
// //     }

// //     static async addMember(member: MemberInsert): Promise<Member> {
// //         const { data, error } = await supabase
// //             .from('members')
// //             .insert(member)
// //             .select()
// //             .single()

// //         if (error) throw error
// //         return data
// //     }

// //     static async updateMemberBalance(id: string, balance: number): Promise<void> {
// //         const { error } = await supabase
// //             .from('members')
// //             .update({ balance })
// //             .eq('id', id)

// //         if (error) throw error
// //     }

// //     // 💰 COTISATIONS
// //     static async getCotisations(): Promise<Cotisation[]> {
// //         const { data, error } = await supabase
// //             .from('cotisations')
// //             .select('*')
// //             .order('created_at', { ascending: false })

// //         if (error) throw error
// //         return data || []
// //     }

// //     static async addCotisation(cotisation: any): Promise<Cotisation> {
// //         const { data, error } = await supabase
// //             .from('cotisations')
// //             .insert(cotisation)
// //             .select()
// //             .single()

// //         if (error) throw error
// //         return data
// //     }

// //     // 💳 PAYMENTS
// //     static async getPayments(): Promise<Payment[]> {
// //         const { data, error } = await supabase
// //             .from('payments')
// //             .select('*')
// //             .order('created_at', { ascending: false })

// //         if (error) throw error
// //         return data || []
// //     }

// //     static async addPayment(payment: any): Promise<Payment> {
// //         const { data, error } = await supabase
// //             .from('payments')
// //             .insert(payment)
// //             .select()
// //             .single()

// //         if (error) throw error
// //         return data
// //     }

// //     // 🎉 ACTIVITIES
// //     static async getActivities(): Promise<Activity[]> {
// //         const { data, error } = await supabase
// //             .from('activities')
// //             .select('*')
// //             .order('created_at', { ascending: false })

// //         if (error) throw error
// //         return data || []
// //     }

// //     static async addActivity(activity: any): Promise<Activity> {
// //         const { data, error } = await supabase
// //             .from('activities')
// //             .insert(activity)
// //             .select()
// //             .single()

// //         if (error) throw error
// //         return data
// //     }
// // }











// import { supabase, DbMember, DbCotisation, DbPayment, DbActivity } from '../lib/supabase'

// export class DatabaseService {
//     // ================================
//     // 🔄 CHARGER TOUTES LES DONNÉES
//     // ================================
//     static async loadAllData(): Promise<{
//         members: DbMember[]
//         cotisations: DbCotisation[]
//         payments: DbPayment[]
//         activities: DbActivity[]
//     }> {
//         try {
//             console.log('📡 Connexion à Supabase...')

//             const [members, cotisations, payments, activities] = await Promise.all([
//                 this.getMembers(),
//                 this.getCotisations(),
//                 this.getPayments(),
//                 this.getActivities()
//             ])

//             console.log('✅ Données chargées depuis Supabase:', {
//                 membres: members.length,
//                 cotisations: cotisations.length,
//                 paiements: payments.length,
//                 activités: activities.length
//             })

//             return { members, cotisations, payments, activities }
//         } catch (error) {
//             console.error('❌ Erreur loadAllData:', error)
//             return {
//                 members: [],
//                 cotisations: [],
//                 payments: [],
//                 activities: []
//             }
//         }
//     }

//     // ================================
//     // 👥 GESTION DES MEMBRES
//     // ================================
//     static async getMembers(): Promise<DbMember[]> {
//         try {
//             const { data, error } = await supabase
//                 .from('members')
//                 .select('*')
//                 .order('created_at', { ascending: false })

//             if (error) {
//                 console.error('Erreur getMembers:', error)
//                 throw error
//             }

//             return data || []
//         } catch (error) {
//             console.error('DatabaseService.getMembers:', error)
//             return []
//         }
//     }

//     static async addMember(member: {
//         name: string
//         phone?: string
//         email?: string
//     }): Promise<DbMember | null> {
//         try {
//             const { data, error } = await supabase
//                 .from('members')
//                 .insert({
//                     name: member.name,
//                     phone: member.phone || null,
//                     email: member.email || null,
//                     balance: 0,
//                     join_date: new Date().toISOString()
//                 })
//                 .select()
//                 .single()

//             if (error) {
//                 console.error('Erreur addMember:', error)
//                 throw error
//             }

//             return data
//         } catch (error) {
//             console.error('DatabaseService.addMember:', error)
//             return null
//         }
//     }

//     static async updateMemberBalance(memberId: string, newBalance: number): Promise<boolean> {
//         try {
//             const { error } = await supabase
//                 .from('members')
//                 .update({ balance: newBalance })
//                 .eq('id', memberId)

//             if (error) {
//                 console.error('Erreur updateMemberBalance:', error)
//                 throw error
//             }

//             return true
//         } catch (error) {
//             console.error('DatabaseService.updateMemberBalance:', error)
//             return false
//         }
//     }

//     // ================================
//     // 💰 GESTION DES COTISATIONS
//     // ================================
//     static async getCotisations(): Promise<DbCotisation[]> {
//         try {
//             const { data, error } = await supabase
//                 .from('cotisations')
//                 .select('*')
//                 .order('created_at', { ascending: false })

//             if (error) {
//                 console.error('Erreur getCotisations:', error)
//                 throw error
//             }

//             return data || []
//         } catch (error) {
//             console.error('DatabaseService.getCotisations:', error)
//             return []
//         }
//     }

//     static async addCotisation(cotisation: {
//         name: string
//         amount: number
//         description?: string
//     }): Promise<DbCotisation | null> {
//         try {
//             const currentMonth = new Date().toISOString().slice(0, 7)

//             const { data, error } = await supabase
//                 .from('cotisations')
//                 .insert({
//                     name: cotisation.name,
//                     amount: cotisation.amount,
//                     month: currentMonth,
//                     description: cotisation.description || null
//                 })
//                 .select()
//                 .single()

//             if (error) {
//                 console.error('Erreur addCotisation:', error)
//                 throw error
//             }

//             return data
//         } catch (error) {
//             console.error('DatabaseService.addCotisation:', error)
//             return null
//         }
//     }

//     // ================================
//     // 💳 GESTION DES PAIEMENTS
//     // ================================
//     static async getPayments(): Promise<DbPayment[]> {
//         try {
//             const { data, error } = await supabase
//                 .from('payments')
//                 .select('*')
//                 .order('created_at', { ascending: false })

//             if (error) {
//                 console.error('Erreur getPayments:', error)
//                 throw error
//             }

//             return data || []
//         } catch (error) {
//             console.error('DatabaseService.getPayments:', error)
//             return []
//         }
//     }

//     static async addPayment(payment: {
//         memberId: string
//         cotisationId: string
//         amount: number
//         status: 'paid' | 'partial' | 'unpaid'
//     }): Promise<DbPayment | null> {
//         try {
//             const { data, error } = await supabase
//                 .from('payments')
//                 .insert({
//                     member_id: payment.memberId,
//                     cotisation_id: payment.cotisationId,
//                     amount: payment.amount,
//                     status: payment.status,
//                     payment_date: new Date().toISOString()
//                 })
//                 .select()
//                 .single()

//             if (error) {
//                 console.error('Erreur addPayment:', error)
//                 throw error
//             }

//             return data
//         } catch (error) {
//             console.error('DatabaseService.addPayment:', error)
//             return null
//         }
//     }

//     static async updatePayment(paymentId: string, updates: {
//         amount?: number
//         status?: 'paid' | 'partial' | 'unpaid'
//     }): Promise<boolean> {
//         try {
//             const { error } = await supabase
//                 .from('payments')
//                 .update(updates)
//                 .eq('id', paymentId)

//             if (error) {
//                 console.error('Erreur updatePayment:', error)
//                 throw error
//             }

//             return true
//         } catch (error) {
//             console.error('DatabaseService.updatePayment:', error)
//             return false
//         }
//     }

//     // ================================
//     // 🎉 GESTION DES ACTIVITÉS
//     // ================================
//     static async getActivities(): Promise<DbActivity[]> {
//         try {
//             const { data, error } = await supabase
//                 .from('activities')
//                 .select('*')
//                 .order('created_at', { ascending: false })

//             if (error) {
//                 console.error('Erreur getActivities:', error)
//                 throw error
//             }

//             return data || []
//         } catch (error) {
//             console.error('DatabaseService.getActivities:', error)
//             return []
//         }
//     }

//     static async addActivity(activity: {
//         name: string
//         amount: number
//         description?: string
//     }): Promise<DbActivity | null> {
//         try {
//             const { data, error } = await supabase
//                 .from('activities')
//                 .insert({
//                     name: activity.name,
//                     amount: activity.amount,
//                     description: activity.description || null,
//                     activity_date: new Date().toISOString()
//                 })
//                 .select()
//                 .single()

//             if (error) {
//                 console.error('Erreur addActivity:', error)
//                 throw error
//             }

//             return data
//         } catch (error) {
//             console.error('DatabaseService.addActivity:', error)
//             return null
//         }
//     }
// }














// import { supabase, DbMember, DbCotisation, DbPayment, DbActivity } from '../lib/supabase'

// export class DatabaseService {
//     // ================================
//     // 🔄 CHARGER TOUTES LES DONNÉES
//     // ================================
//     static async loadAllData(): Promise<{
//         members: DbMember[]
//         cotisations: DbCotisation[]
//         payments: DbPayment[]
//         activities: DbActivity[]
//     }> {
//         try {
//             console.log('📡 Connexion à Supabase...')

//             const [members, cotisations, payments, activities] = await Promise.all([
//                 this.getMembers(),
//                 this.getCotisations(),
//                 this.getPayments(),
//                 this.getActivities()
//             ])

//             console.log('✅ Données chargées depuis Supabase:', {
//                 membres: members.length,
//                 cotisations: cotisations.length,
//                 paiements: payments.length,
//                 activités: activities.length
//             })

//             return { members, cotisations, payments, activities }
//         } catch (error) {
//             console.error('❌ Erreur loadAllData:', error)
//             return {
//                 members: [],
//                 cotisations: [],
//                 payments: [],
//                 activities: []
//             }
//         }
//     }

//     // ================================
//     // 👥 GESTION DES MEMBRES
//     // ================================
//     static async getMembers(): Promise<DbMember[]> {
//         try {
//             const { data, error } = await supabase
//                 .from('members')
//                 .select('*')
//                 .order('created_at', { ascending: false })

//             if (error) {
//                 console.error('Erreur getMembers:', error)
//                 throw error
//             }

//             return data || []
//         } catch (error) {
//             console.error('DatabaseService.getMembers:', error)
//             return []
//         }
//     }

//     static async addMember(member: {
//         name: string
//         phone?: string
//         email?: string
//     }): Promise<DbMember | null> {
//         try {
//             const { data, error } = await supabase
//                 .from('members')
//                 .insert({
//                     name: member.name,
//                     phone: member.phone || null,
//                     email: member.email || null,
//                     balance: 0,
//                     join_date: new Date().toISOString()
//                 })
//                 .select()
//                 .single()

//             if (error) {
//                 console.error('Erreur addMember:', error)
//                 throw error
//             }

//             return data
//         } catch (error) {
//             console.error('DatabaseService.addMember:', error)
//             return null
//         }
//     }

//     static async updateMember(id: string, updates: {
//         name?: string
//         phone?: string | null
//         email?: string | null
//         balance?: number
//     }): Promise<boolean> {
//         try {
//             const { error } = await supabase
//                 .from('members')
//                 .update(updates)
//                 .eq('id', id)

//             if (error) {
//                 console.error('Erreur updateMember:', error)
//                 throw error
//             }

//             return true
//         } catch (error) {
//             console.error('DatabaseService.updateMember:', error)
//             return false
//         }
//     }

//     static async updateMemberBalance(memberId: string, newBalance: number): Promise<boolean> {
//         try {
//             const { error } = await supabase
//                 .from('members')
//                 .update({ balance: newBalance })
//                 .eq('id', memberId)

//             if (error) {
//                 console.error('Erreur updateMemberBalance:', error)
//                 throw error
//             }

//             return true
//         } catch (error) {
//             console.error('DatabaseService.updateMemberBalance:', error)
//             return false
//         }
//     }

//     static async deleteMember(id: string): Promise<boolean> {
//         try {
//             // D'abord supprimer tous les paiements associés
//             const { error: paymentsError } = await supabase
//                 .from('payments')
//                 .delete()
//                 .eq('member_id', id)

//             if (paymentsError) {
//                 console.error('Erreur suppression paiements membre:', paymentsError)
//                 throw paymentsError
//             }

//             // Puis supprimer le membre
//             const { error } = await supabase
//                 .from('members')
//                 .delete()
//                 .eq('id', id)

//             if (error) {
//                 console.error('Erreur deleteMember:', error)
//                 throw error
//             }

//             return true
//         } catch (error) {
//             console.error('DatabaseService.deleteMember:', error)
//             return false
//         }
//     }

//     // ================================
//     // 💰 GESTION DES COTISATIONS
//     // ================================
//     static async getCotisations(): Promise<DbCotisation[]> {
//         try {
//             const { data, error } = await supabase
//                 .from('cotisations')
//                 .select('*')
//                 .order('created_at', { ascending: false })

//             if (error) {
//                 console.error('Erreur getCotisations:', error)
//                 throw error
//             }

//             return data || []
//         } catch (error) {
//             console.error('DatabaseService.getCotisations:', error)
//             return []
//         }
//     }

//     static async addCotisation(cotisation: {
//         name: string
//         amount: number
//         description?: string
//     }): Promise<DbCotisation | null> {
//         try {
//             const currentMonth = new Date().toISOString().slice(0, 7)

//             const { data, error } = await supabase
//                 .from('cotisations')
//                 .insert({
//                     name: cotisation.name,
//                     amount: cotisation.amount,
//                     month: currentMonth,
//                     description: cotisation.description || null
//                 })
//                 .select()
//                 .single()

//             if (error) {
//                 console.error('Erreur addCotisation:', error)
//                 throw error
//             }

//             return data
//         } catch (error) {
//             console.error('DatabaseService.addCotisation:', error)
//             return null
//         }
//     }

//     static async updateCotisation(id: string, updates: {
//         name?: string
//         amount?: number
//         month?: string
//         description?: string | null
//     }): Promise<boolean> {
//         try {
//             const { error } = await supabase
//                 .from('cotisations')
//                 .update(updates)
//                 .eq('id', id)

//             if (error) {
//                 console.error('Erreur updateCotisation:', error)
//                 throw error
//             }

//             return true
//         } catch (error) {
//             console.error('DatabaseService.updateCotisation:', error)
//             return false
//         }
//     }

//     static async deleteCotisation(id: string): Promise<boolean> {
//         try {
//             // D'abord supprimer tous les paiements associés
//             const { error: paymentsError } = await supabase
//                 .from('payments')
//                 .delete()
//                 .eq('cotisation_id', id)

//             if (paymentsError) {
//                 console.error('Erreur suppression paiements cotisation:', paymentsError)
//                 throw paymentsError
//             }

//             // Puis supprimer la cotisation
//             const { error } = await supabase
//                 .from('cotisations')
//                 .delete()
//                 .eq('id', id)

//             if (error) {
//                 console.error('Erreur deleteCotisation:', error)
//                 throw error
//             }

//             return true
//         } catch (error) {
//             console.error('DatabaseService.deleteCotisation:', error)
//             return false
//         }
//     }

//     // ================================
//     // 💳 GESTION DES PAIEMENTS
//     // ================================
//     static async getPayments(): Promise<DbPayment[]> {
//         try {
//             const { data, error } = await supabase
//                 .from('payments')
//                 .select('*')
//                 .order('created_at', { ascending: false })

//             if (error) {
//                 console.error('Erreur getPayments:', error)
//                 throw error
//             }

//             return data || []
//         } catch (error) {
//             console.error('DatabaseService.getPayments:', error)
//             return []
//         }
//     }

//     static async addPayment(payment: {
//         memberId: string
//         cotisationId: string
//         amount: number
//         status: 'paid' | 'partial' | 'unpaid'
//     }): Promise<DbPayment | null> {
//         try {
//             const { data, error } = await supabase
//                 .from('payments')
//                 .insert({
//                     member_id: payment.memberId,
//                     cotisation_id: payment.cotisationId,
//                     amount: payment.amount,
//                     status: payment.status,
//                     payment_date: new Date().toISOString()
//                 })
//                 .select()
//                 .single()

//             if (error) {
//                 console.error('Erreur addPayment:', error)
//                 throw error
//             }

//             return data
//         } catch (error) {
//             console.error('DatabaseService.addPayment:', error)
//             return null
//         }
//     }

//     static async updatePayment(paymentId: string, updates: {
//         amount?: number
//         status?: 'paid' | 'partial' | 'unpaid'
//     }): Promise<boolean> {
//         try {
//             const { error } = await supabase
//                 .from('payments')
//                 .update(updates)
//                 .eq('id', paymentId)

//             if (error) {
//                 console.error('Erreur updatePayment:', error)
//                 throw error
//             }

//             return true
//         } catch (error) {
//             console.error('DatabaseService.updatePayment:', error)
//             return false
//         }
//     }

//     static async deletePayment(id: string): Promise<boolean> {
//         try {
//             const { error } = await supabase
//                 .from('payments')
//                 .delete()
//                 .eq('id', id)

//             if (error) {
//                 console.error('Erreur deletePayment:', error)
//                 throw error
//             }

//             return true
//         } catch (error) {
//             console.error('DatabaseService.deletePayment:', error)
//             return false
//         }
//     }

//     // ================================
//     // 🎉 GESTION DES ACTIVITÉS
//     // ================================
//     static async getActivities(): Promise<DbActivity[]> {
//         try {
//             const { data, error } = await supabase
//                 .from('activities')
//                 .select('*')
//                 .order('created_at', { ascending: false })

//             if (error) {
//                 console.error('Erreur getActivities:', error)
//                 throw error
//             }

//             return data || []
//         } catch (error) {
//             console.error('DatabaseService.getActivities:', error)
//             return []
//         }
//     }

//     static async addActivity(activity: {
//         name: string
//         amount: number
//         description?: string
//     }): Promise<DbActivity | null> {
//         try {
//             const { data, error } = await supabase
//                 .from('activities')
//                 .insert({
//                     name: activity.name,
//                     amount: activity.amount,
//                     description: activity.description || null,
//                     activity_date: new Date().toISOString()
//                 })
//                 .select()
//                 .single()

//             if (error) {
//                 console.error('Erreur addActivity:', error)
//                 throw error
//             }

//             return data
//         } catch (error) {
//             console.error('DatabaseService.addActivity:', error)
//             return null
//         }
//     }

//     static async updateActivity(id: string, updates: {
//         name?: string
//         amount?: number
//         description?: string | null
//         activity_date?: string
//     }): Promise<boolean> {
//         try {
//             const { error } = await supabase
//                 .from('activities')
//                 .update(updates)
//                 .eq('id', id)

//             if (error) {
//                 console.error('Erreur updateActivity:', error)
//                 throw error
//             }

//             return true
//         } catch (error) {
//             console.error('DatabaseService.updateActivity:', error)
//             return false
//         }
//     }

//     static async deleteActivity(id: string): Promise<boolean> {
//         try {
//             const { error } = await supabase
//                 .from('activities')
//                 .delete()
//                 .eq('id', id)

//             if (error) {
//                 console.error('Erreur deleteActivity:', error)
//                 throw error
//             }

//             return true
//         } catch (error) {
//             console.error('DatabaseService.deleteActivity:', error)
//             return false
//         }
//     }

//     // ================================
//     // 📊 MÉTHODES UTILITAIRES
//     // ================================

//     // Calculer le solde total de la caisse
//     static async getTotalCaisse(): Promise<number> {
//         try {
//             const [payments, activities] = await Promise.all([
//                 this.getPayments(),
//                 this.getActivities()
//             ])

//             const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0)
//             const totalActivities = activities.reduce((sum, activity) => sum + activity.amount, 0)

//             return totalPayments - totalActivities
//         } catch (error) {
//             console.error('DatabaseService.getTotalCaisse:', error)
//             return 0
//         }
//     }

//     // Obtenir les statistiques générales
//     static async getGeneralStats(): Promise<{
//         totalMembers: number
//         totalCotisations: number
//         totalPayments: number
//         totalActivities: number
//         totalCaisse: number
//     }> {
//         try {
//             const data = await this.loadAllData()
//             const totalCaisse = await this.getTotalCaisse()

//             return {
//                 totalMembers: data.members.length,
//                 totalCotisations: data.cotisations.length,
//                 totalPayments: data.payments.length,
//                 totalActivities: data.activities.length,
//                 totalCaisse
//             }
//         } catch (error) {
//             console.error('DatabaseService.getGeneralStats:', error)
//             return {
//                 totalMembers: 0,
//                 totalCotisations: 0,
//                 totalPayments: 0,
//                 totalActivities: 0,
//                 totalCaisse: 0
//             }
//         }
//     }
// }
















import { supabase, DbMember, DbCotisation, DbPayment, DbActivity } from '../lib/supabase'

export class DatabaseService {
    // ================================
    // 🔄 CHARGER TOUTES LES DONNÉES
    // ================================
    static async loadAllData(): Promise<{
        members: DbMember[]
        cotisations: DbCotisation[]
        payments: DbPayment[]
        activities: DbActivity[]
    }> {
        try {
            console.log('📡 Connexion à Supabase...')

            const [members, cotisations, payments, activities] = await Promise.all([
                this.getMembers(),
                this.getCotisations(),
                this.getPayments(),
                this.getActivities()
            ])

            console.log('✅ Données chargées depuis Supabase:', {
                membres: members.length,
                cotisations: cotisations.length,
                paiements: payments.length,
                activités: activities.length
            })

            return { members, cotisations, payments, activities }
        } catch (error) {
            console.error('❌ Erreur loadAllData:', error)
            return {
                members: [],
                cotisations: [],
                payments: [],
                activities: []
            }
        }
    }

    // ================================
    // 👥 GESTION DES MEMBRES
    // ================================
    static async getMembers(): Promise<DbMember[]> {
        try {
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Erreur getMembers:', error)
                throw error
            }

            return data || []
        } catch (error) {
            console.error('DatabaseService.getMembers:', error)
            return []
        }
    }

    static async addMember(member: {
        name: string
        phone?: string
        email?: string
    }): Promise<DbMember | null> {
        try {
            const { data, error } = await supabase
                .from('members')
                .insert({
                    name: member.name,
                    phone: member.phone || null,
                    email: member.email || null,
                    balance: 0,
                    join_date: new Date().toISOString()
                })
                .select()
                .single()

            if (error) {
                console.error('Erreur addMember:', error)
                throw error
            }

            return data
        } catch (error) {
            console.error('DatabaseService.addMember:', error)
            return null
        }
    }

    static async updateMember(id: string, updates: {
        name?: string
        phone?: string | null
        email?: string | null
        balance?: number
    }): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('members')
                .update(updates)
                .eq('id', id)

            if (error) {
                console.error('Erreur updateMember:', error)
                throw error
            }

            return true
        } catch (error) {
            console.error('DatabaseService.updateMember:', error)
            return false
        }
    }

    static async updateMemberBalance(memberId: string, newBalance: number): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('members')
                .update({ balance: newBalance })
                .eq('id', memberId)

            if (error) {
                console.error('Erreur updateMemberBalance:', error)
                throw error
            }

            return true
        } catch (error) {
            console.error('DatabaseService.updateMemberBalance:', error)
            return false
        }
    }

    static async deleteMember(id: string): Promise<boolean> {
        try {
            // D'abord supprimer tous les paiements associés
            const { error: paymentsError } = await supabase
                .from('payments')
                .delete()
                .eq('member_id', id)

            if (paymentsError) {
                console.error('Erreur suppression paiements membre:', paymentsError)
                throw paymentsError
            }

            // Puis supprimer le membre
            const { error } = await supabase
                .from('members')
                .delete()
                .eq('id', id)

            if (error) {
                console.error('Erreur deleteMember:', error)
                throw error
            }

            return true
        } catch (error) {
            console.error('DatabaseService.deleteMember:', error)
            return false
        }
    }

    // ================================
    // 💰 GESTION DES COTISATIONS
    // ================================
    static async getCotisations(): Promise<DbCotisation[]> {
        try {
            const { data, error } = await supabase
                .from('cotisations')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Erreur getCotisations:', error)
                throw error
            }

            return data || []
        } catch (error) {
            console.error('DatabaseService.getCotisations:', error)
            return []
        }
    }

    static async addCotisation(cotisation: {
        name: string
        amount: number
        description?: string
        month?: string
    }): Promise<DbCotisation | null> {
        try {
            const currentMonth = cotisation.month || new Date().toISOString().slice(0, 7)

            const { data, error } = await supabase
                .from('cotisations')
                .insert({
                    name: cotisation.name,
                    amount: cotisation.amount,
                    month: currentMonth,
                    description: cotisation.description || null
                })
                .select()
                .single()

            if (error) {
                console.error('Erreur addCotisation:', error)
                throw error
            }

            return data
        } catch (error) {
            console.error('DatabaseService.addCotisation:', error)
            return null
        }
    }

    static async updateCotisation(id: string, updates: {
        name?: string
        amount?: number
        month?: string
        description?: string | null
    }): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('cotisations')
                .update(updates)
                .eq('id', id)

            if (error) {
                console.error('Erreur updateCotisation:', error)
                throw error
            }

            return true
        } catch (error) {
            console.error('DatabaseService.updateCotisation:', error)
            return false
        }
    }

    static async deleteCotisation(id: string): Promise<boolean> {
        try {
            // D'abord supprimer tous les paiements associés
            const { error: paymentsError } = await supabase
                .from('payments')
                .delete()
                .eq('cotisation_id', id)

            if (paymentsError) {
                console.error('Erreur suppression paiements cotisation:', paymentsError)
                throw paymentsError
            }

            // Puis supprimer la cotisation
            const { error } = await supabase
                .from('cotisations')
                .delete()
                .eq('id', id)

            if (error) {
                console.error('Erreur deleteCotisation:', error)
                throw error
            }

            return true
        } catch (error) {
            console.error('DatabaseService.deleteCotisation:', error)
            return false
        }
    }

    // ================================
    // 💳 GESTION DES PAIEMENTS
    // ================================
    static async getPayments(): Promise<DbPayment[]> {
        try {
            const { data, error } = await supabase
                .from('payments')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Erreur getPayments:', error)
                throw error
            }

            return data || []
        } catch (error) {
            console.error('DatabaseService.getPayments:', error)
            return []
        }
    }

    static async addPayment(payment: {
        memberId: string
        cotisationId: string
        amount: number
        status: 'paid' | 'partial' | 'unpaid'
    }): Promise<DbPayment | null> {
        try {
            const { data, error } = await supabase
                .from('payments')
                .insert({
                    member_id: payment.memberId,
                    cotisation_id: payment.cotisationId,
                    amount: payment.amount,
                    status: payment.status,
                    payment_date: new Date().toISOString()
                })
                .select()
                .single()

            if (error) {
                console.error('Erreur addPayment:', error)
                throw error
            }

            return data
        } catch (error) {
            console.error('DatabaseService.addPayment:', error)
            return null
        }
    }

    static async updatePayment(paymentId: string, updates: {
        amount?: number
        status?: 'paid' | 'partial' | 'unpaid'
    }): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('payments')
                .update(updates)
                .eq('id', paymentId)

            if (error) {
                console.error('Erreur updatePayment:', error)
                throw error
            }

            return true
        } catch (error) {
            console.error('DatabaseService.updatePayment:', error)
            return false
        }
    }

    static async deletePayment(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('payments')
                .delete()
                .eq('id', id)

            if (error) {
                console.error('Erreur deletePayment:', error)
                throw error
            }

            return true
        } catch (error) {
            console.error('DatabaseService.deletePayment:', error)
            return false
        }
    }

    // ================================
    // 🎉 GESTION DES ACTIVITÉS
    // ================================
    static async getActivities(): Promise<DbActivity[]> {
        try {
            const { data, error } = await supabase
                .from('activities')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Erreur getActivities:', error)
                throw error
            }

            return data || []
        } catch (error) {
            console.error('DatabaseService.getActivities:', error)
            return []
        }
    }

    static async addActivity(activity: {
        name: string
        amount: number
        description?: string
    }): Promise<DbActivity | null> {
        try {
            const { data, error } = await supabase
                .from('activities')
                .insert({
                    name: activity.name,
                    amount: activity.amount,
                    description: activity.description || null,
                    activity_date: new Date().toISOString()
                })
                .select()
                .single()

            if (error) {
                console.error('Erreur addActivity:', error)
                throw error
            }

            return data
        } catch (error) {
            console.error('DatabaseService.addActivity:', error)
            return null
        }
    }

    static async updateActivity(id: string, updates: {
        name?: string
        amount?: number
        description?: string | null
        activity_date?: string
    }): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('activities')
                .update(updates)
                .eq('id', id)

            if (error) {
                console.error('Erreur updateActivity:', error)
                throw error
            }

            return true
        } catch (error) {
            console.error('DatabaseService.updateActivity:', error)
            return false
        }
    }

    static async deleteActivity(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('activities')
                .delete()
                .eq('id', id)

            if (error) {
                console.error('Erreur deleteActivity:', error)
                throw error
            }

            return true
        } catch (error) {
            console.error('DatabaseService.deleteActivity:', error)
            return false
        }
    }

    // ================================
    // 📊 MÉTHODES UTILITAIRES
    // ================================

    // Calculer le solde total de la caisse
    static async getTotalCaisse(): Promise<number> {
        try {
            const [payments, activities] = await Promise.all([
                this.getPayments(),
                this.getActivities()
            ])

            const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0)
            const totalActivities = activities.reduce((sum, activity) => sum + activity.amount, 0)

            return totalPayments - totalActivities
        } catch (error) {
            console.error('DatabaseService.getTotalCaisse:', error)
            return 0
        }
    }

    // Obtenir les statistiques générales
    static async getGeneralStats(): Promise<{
        totalMembers: number
        totalCotisations: number
        totalPayments: number
        totalActivities: number
        totalCaisse: number
    }> {
        try {
            const data = await this.loadAllData()
            const totalCaisse = await this.getTotalCaisse()

            return {
                totalMembers: data.members.length,
                totalCotisations: data.cotisations.length,
                totalPayments: data.payments.length,
                totalActivities: data.activities.length,
                totalCaisse
            }
        } catch (error) {
            console.error('DatabaseService.getGeneralStats:', error)
            return {
                totalMembers: 0,
                totalCotisations: 0,
                totalPayments: 0,
                totalActivities: 0,
                totalCaisse: 0
            }
        }
    }
}