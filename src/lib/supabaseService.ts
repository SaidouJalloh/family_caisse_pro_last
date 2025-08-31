
// // code qui marche mais avec profil
// // src/lib/supabaseService.ts - Service complet remplaçant database.ts
// import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js'

// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrdmhjbmRvaHNsb21ld2dmaGhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzI0MTAsImV4cCI6MjA3MjE0ODQxMH0.lQycKgQ7TAHqUG5pSpbOAhdrgQhKbmo0Lz35Fo1IPfo'
// const supabaseUrl = 'https://gkvhcndohslomewgfhho.supabase.co'
// export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// // ===================================
// // TYPES - Identiques à database.ts
// // ===================================
// export interface DbProfile {
//     id: string
//     email: string
//     full_name: string | null
//     role: 'admin' | 'member' | 'guest'
//     family_id: string
//     avatar_url: string | null
//     phone: string | null
//     is_active: boolean
//     last_login: string | null
//     created_at: string
//     updated_at: string
// }

// export interface DbMember {
//     id: string
//     name: string
//     phone: string | null
//     email: string | null
//     balance: number
//     join_date: string
//     created_at: string
//     avatar_url: string | null
//     bio: string | null
//     status: 'active' | 'inactive'
// }

// export interface DbCotisation {
//     id: string
//     name: string
//     amount: number
//     month: string
//     description: string | null
//     created_at: string
// }

// export interface DbPayment {
//     id: string
//     member_id: string
//     cotisation_id: string
//     amount: number
//     status: 'paid' | 'partial' | 'unpaid'
//     payment_date: string
//     created_at: string
// }

// export interface DbActivity {
//     id: string
//     name: string
//     amount: number
//     description: string | null
//     activity_date: string
//     created_at: string
// }

// export interface DbCaisseDeposit {
//     id: string
//     amount: number
//     category: 'don' | 'remboursement' | 'vente' | 'bonus' | 'autre'
//     description: string
//     deposit_date: string
//     created_at: string
//     created_by?: string
// }

// export interface User {
//     id: string
//     email: string
//     password_hash?: string
//     email_confirmed_at?: string | null
//     created_at: string
//     updated_at: string
//     user_metadata?: string
// }

// export interface UserProfileSettings {
//     full_name: string
//     email: string
//     phone: string
//     avatar_url: string | null
//     bio: string
//     role: 'admin' | 'member' | 'guest'
// }

// export interface AppearanceSettings {
//     theme: 'light' | 'dark' | 'auto'
//     primary_color: string
//     language: 'fr' | 'en'
//     font_size: 'small' | 'medium' | 'large'
//     animations: boolean
// }

// export interface ApplicationSettings {
//     currency: 'EUR' | 'USD' | 'XOF'
//     currency_symbol: '€' | '$' | 'FCFA'
//     date_format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
//     decimal_places: 0 | 1 | 2
//     auto_backup: boolean
//     reminder_days: number
// }

// export interface DataSettings {
//     auto_export: boolean
//     export_format: 'JSON' | 'CSV' | 'EXCEL'
//     backup_frequency: 'daily' | 'weekly' | 'monthly'
//     keep_backups: number
//     last_backup: string | null
//     last_export: string | null
// }

// // ===================================
// // SERVICE D'AUTHENTIFICATION
// // ===================================
// class AuthService {
//     private static instance: AuthService | null = null
//     private currentUser: SupabaseUser | null = null
//     private currentProfile: DbProfile | null = null

//     static getInstance(): AuthService {
//         if (!AuthService.instance) {
//             AuthService.instance = new AuthService()
//         }
//         return AuthService.instance
//     }

//     constructor() {
//         this.loadSession()
//     }

//     private loadSession() {
//         // Vérifier la session Supabase
//         this.checkSupabaseSession()
//     }
//     private async checkSupabaseSession() {
//         try {
//             const { data: { user } } = await supabase.auth.getUser()
//             if (user) {
//                 this.currentUser = user  // Plus de cast nécessaire
//                 const profile = await this.getProfile(user.id)
//                 this.currentProfile = profile
//             }
//         } catch (error) {
//             console.warn('Erreur session Supabase:', error)
//         }
//     }
//     // private async checkSupabaseSession() {
//     //     try {
//     //         const { data: { user } } = await supabase.auth.getUser()
//     //         if (user) {
//     //             this.currentUser = user as User
//     //             const profile = await this.getProfile(user.id)
//     //             this.currentProfile = profile
//     //         }
//     //     } catch (error) {
//     //         console.warn('Erreur session Supabase:', error)
//     //     }
//     // }

//     async signUp(email: string, password: string, userData: { full_name?: string } = {}): Promise<{ user: SupabaseUser | null, error: string | null }> {
//         try {
//             const { data, error } = await supabase.auth.signUp({
//                 email,
//                 password,
//                 options: {
//                     data: userData
//                 }
//             })

//             if (error) {
//                 return { user: null, error: error.message }
//             }

//             if (data.user) {
//                 const newProfile: Partial<DbProfile> = {
//                     id: data.user.id,
//                     email: data.user.email!,
//                     full_name: userData.full_name || null,
//                     role: 'member',
//                     family_id: crypto.randomUUID(),
//                     is_active: true,
//                     created_at: new Date().toISOString(),
//                     updated_at: new Date().toISOString()
//                 }

//                 const { error: profileError } = await supabase
//                     .from('profiles')
//                     .insert(newProfile)

//                 if (profileError) {
//                     console.error('Erreur création profil:', profileError)
//                 }

//                 this.currentUser = data.user as SupabaseUser
//                 this.currentProfile = newProfile as DbProfile
//             }

//             return { user: data.user as SupabaseUser, error: null }
//         } catch (error) {
//             console.error('Erreur signUp:', error)
//             return { user: null, error: 'Erreur lors de la création du compte' }
//         }
//     }

//     async signIn(email: string, password: string): Promise<{ user: SupabaseUser | null, error: string | null }> {
//         try {
//             const { data, error } = await supabase.auth.signInWithPassword({
//                 email,
//                 password
//             })

//             if (error) {
//                 return { user: null, error: error.message }
//             }

//             if (data.user) {
//                 this.currentUser = data.user as SupabaseUser
//                 const profile = await this.getProfile(data.user.id)
//                 this.currentProfile = profile

//                 // Mettre à jour last_login
//                 if (profile) {
//                     await supabase
//                         .from('profiles')
//                         .update({
//                             last_login: new Date().toISOString(),
//                             updated_at: new Date().toISOString()
//                         })
//                         .eq('id', data.user.id)

//                     this.currentProfile = { ...profile, last_login: new Date().toISOString() }
//                 }
//             }

//             return { user: data.user as SupabaseUser, error: null }
//         } catch (error) {
//             console.error('Erreur signIn:', error)
//             return { user: null, error: 'Erreur de connexion' }
//         }
//     }

//     async signOut(): Promise<void> {
//         await supabase.auth.signOut()
//         this.currentUser = null
//         this.currentProfile = null
//     }

//     getSession() {
//         return {
//             user: this.currentUser,
//             profile: this.currentProfile
//         }
//     }

//     isAuthenticated(): boolean {
//         return !!(this.currentUser && this.currentProfile)
//     }

//     async getProfile(userId: string): Promise<DbProfile | null> {
//         try {
//             const { data, error } = await supabase
//                 .from('profiles')
//                 .select('*')
//                 .eq('id', userId)
//                 .single()

//             if (error) {
//                 console.error('Erreur getProfile:', error)
//                 return null
//             }

//             return data
//         } catch (error) {
//             console.error('Erreur getProfile:', error)
//             return null
//         }
//     }
// }

// // ===================================
// // SERVICE DE BASE DE DONNÉES
// // ===================================
// class DatabaseManager {
//     private familyId: string | null = null

//     constructor() {
//         this.initializeFamilyId()
//     }

//     private async initializeFamilyId() {
//         try {
//             const { data: { user } } = await supabase.auth.getUser()
//             if (user) {
//                 const profile = await authService.getProfile(user.id)
//                 if (profile?.family_id) {
//                     this.familyId = profile.family_id
//                 }
//             }
//         } catch (error) {
//             console.warn('Erreur initialisation familyId:', error)
//         }
//     }

//     private async ensureFamilyId(): Promise<boolean> {
//         if (this.familyId) return true

//         const { data: { user } } = await supabase.auth.getUser()
//         if (!user) return false

//         const profile = await authService.getProfile(user.id)
//         if (profile?.family_id) {
//             this.familyId = profile.family_id
//             return true
//         }

//         return false
//     }

//     // MEMBRES
//     async getMembers(): Promise<DbMember[]> {
//         try {
//             if (!await this.ensureFamilyId()) return []

//             const { data, error } = await supabase
//                 .from('members')
//                 .select('*')
//                 .eq('family_id', this.familyId)
//                 .is('deleted_at', null)
//                 .order('created_at', { ascending: false })

//             if (error) {
//                 console.error('Erreur getMembers:', error)
//                 return []
//             }

//             return data || []
//         } catch (error) {
//             console.error('Erreur getMembers:', error)
//             return []
//         }
//     }

//     async addMember(member: {
//         name: string;
//         phone?: string;
//         email?: string;
//         avatar_url?: string;
//         bio?: string;
//     }): Promise<DbMember | null> {
//         try {
//             if (!await this.ensureFamilyId()) return null

//             const { data: { user } } = await supabase.auth.getUser()

//             const { data, error } = await supabase
//                 .from('members')
//                 .insert({
//                     family_id: this.familyId,
//                     name: member.name,
//                     phone: member.phone || null,
//                     email: member.email || null,
//                     avatar_url: member.avatar_url || null,
//                     bio: member.bio || null,
//                     balance: 0,
//                     join_date: new Date().toISOString(),
//                     status: 'active',
//                     created_by: user?.id || null
//                 })
//                 .select()
//                 .single()

//             if (error) {
//                 console.error('Erreur addMember:', error)
//                 return null
//             }

//             return data
//         } catch (error) {
//             console.error('Erreur addMember:', error)
//             return null
//         }
//     }

//     async updateMember(id: string, updates: Partial<DbMember>): Promise<boolean> {
//         try {
//             const { data: { user } } = await supabase.auth.getUser()

//             const { error } = await supabase
//                 .from('members')
//                 .update({
//                     ...updates,
//                     updated_by: user?.id || null,
//                     updated_at: new Date().toISOString()
//                 })
//                 .eq('id', id)

//             return !error
//         } catch (error) {
//             console.error('Erreur updateMember:', error)
//             return false
//         }
//     }

//     async updateMemberBalance(memberId: string, newBalance: number): Promise<boolean> {
//         return this.updateMember(memberId, { balance: newBalance })
//     }

//     async deleteMember(id: string): Promise<boolean> {
//         try {
//             // Soft delete des paiements associés
//             await supabase
//                 .from('payments')
//                 .update({ deleted_at: new Date().toISOString() })
//                 .eq('member_id', id)

//             // Soft delete du membre
//             const { error } = await supabase
//                 .from('members')
//                 .update({
//                     deleted_at: new Date().toISOString(),
//                     updated_at: new Date().toISOString()
//                 })
//                 .eq('id', id)

//             return !error
//         } catch (error) {
//             console.error('Erreur deleteMember:', error)
//             return false
//         }
//     }

//     // COTISATIONS
//     async getCotisations(): Promise<DbCotisation[]> {
//         try {
//             if (!await this.ensureFamilyId()) return []

//             const { data, error } = await supabase
//                 .from('cotisations')
//                 .select('*')
//                 .eq('family_id', this.familyId)
//                 .is('deleted_at', null)
//                 .order('created_at', { ascending: false })

//             if (error) {
//                 console.error('Erreur getCotisations:', error)
//                 return []
//             }

//             return data || []
//         } catch (error) {
//             console.error('Erreur getCotisations:', error)
//             return []
//         }
//     }

//     async addCotisation(cotisation: { name: string; amount: number; description?: string; month?: string }): Promise<DbCotisation | null> {
//         try {
//             if (!await this.ensureFamilyId()) return null

//             const { data: { user } } = await supabase.auth.getUser()

//             const { data, error } = await supabase
//                 .from('cotisations')
//                 .insert({
//                     family_id: this.familyId,
//                     name: cotisation.name,
//                     amount: cotisation.amount,
//                     month: cotisation.month || new Date().toISOString().slice(0, 7),
//                     description: cotisation.description || null,
//                     created_by: user?.id || null
//                 })
//                 .select()
//                 .single()

//             if (error) {
//                 console.error('Erreur addCotisation:', error)
//                 return null
//             }

//             return data
//         } catch (error) {
//             console.error('Erreur addCotisation:', error)
//             return null
//         }
//     }

//     async updateCotisation(id: string, updates: Partial<DbCotisation>): Promise<boolean> {
//         try {
//             const { error } = await supabase
//                 .from('cotisations')
//                 .update({
//                     ...updates,
//                     updated_at: new Date().toISOString()
//                 })
//                 .eq('id', id)

//             return !error
//         } catch (error) {
//             console.error('Erreur updateCotisation:', error)
//             return false
//         }
//     }

//     async deleteCotisation(id: string): Promise<boolean> {
//         try {
//             // Soft delete des paiements associés
//             await supabase
//                 .from('payments')
//                 .update({ deleted_at: new Date().toISOString() })
//                 .eq('cotisation_id', id)

//             // Soft delete de la cotisation
//             const { error } = await supabase
//                 .from('cotisations')
//                 .update({
//                     deleted_at: new Date().toISOString(),
//                     updated_at: new Date().toISOString()
//                 })
//                 .eq('id', id)

//             return !error
//         } catch (error) {
//             console.error('Erreur deleteCotisation:', error)
//             return false
//         }
//     }

//     // PAIEMENTS
//     async getPayments(): Promise<DbPayment[]> {
//         try {
//             if (!await this.ensureFamilyId()) return []

//             const { data, error } = await supabase
//                 .from('payments')
//                 .select('*')
//                 .eq('family_id', this.familyId)
//                 .is('deleted_at', null)
//                 .order('created_at', { ascending: false })

//             if (error) {
//                 console.error('Erreur getPayments:', error)
//                 return []
//             }

//             return data || []
//         } catch (error) {
//             console.error('Erreur getPayments:', error)
//             return []
//         }
//     }

//     async addPayment(payment: { memberId: string; cotisationId: string; amount: number; status: 'paid' | 'partial' | 'unpaid' }): Promise<DbPayment | null> {
//         try {
//             if (!await this.ensureFamilyId()) return null

//             const { data: { user } } = await supabase.auth.getUser()

//             const { data, error } = await supabase
//                 .from('payments')
//                 .insert({
//                     family_id: this.familyId,
//                     member_id: payment.memberId,
//                     cotisation_id: payment.cotisationId,
//                     amount: payment.amount,
//                     status: payment.status,
//                     payment_date: new Date().toISOString(),
//                     created_by: user?.id || null
//                 })
//                 .select()
//                 .single()

//             if (error) {
//                 console.error('Erreur addPayment:', error)
//                 return null
//             }

//             return data
//         } catch (error) {
//             console.error('Erreur addPayment:', error)
//             return null
//         }
//     }

//     async updatePayment(id: string, updates: { amount?: number; status?: 'paid' | 'partial' | 'unpaid' }): Promise<boolean> {
//         try {
//             const { error } = await supabase
//                 .from('payments')
//                 .update({
//                     ...updates,
//                     updated_at: new Date().toISOString()
//                 })
//                 .eq('id', id)

//             return !error
//         } catch (error) {
//             console.error('Erreur updatePayment:', error)
//             return false
//         }
//     }

//     async deletePayment(id: string): Promise<boolean> {
//         try {
//             const { error } = await supabase
//                 .from('payments')
//                 .update({
//                     deleted_at: new Date().toISOString(),
//                     updated_at: new Date().toISOString()
//                 })
//                 .eq('id', id)

//             return !error
//         } catch (error) {
//             console.error('Erreur deletePayment:', error)
//             return false
//         }
//     }

//     // ACTIVITÉS
//     async getActivities(): Promise<DbActivity[]> {
//         try {
//             if (!await this.ensureFamilyId()) return []

//             const { data, error } = await supabase
//                 .from('activities')
//                 .select('*')
//                 .eq('family_id', this.familyId)
//                 .is('deleted_at', null)
//                 .order('created_at', { ascending: false })

//             if (error) {
//                 console.error('Erreur getActivities:', error)
//                 return []
//             }

//             return data || []
//         } catch (error) {
//             console.error('Erreur getActivities:', error)
//             return []
//         }
//     }

//     async addActivity(activity: { name: string; amount: number; description?: string }): Promise<DbActivity | null> {
//         try {
//             if (!await this.ensureFamilyId()) return null

//             const { data: { user } } = await supabase.auth.getUser()

//             const { data, error } = await supabase
//                 .from('activities')
//                 .insert({
//                     family_id: this.familyId,
//                     name: activity.name,
//                     amount: activity.amount,
//                     description: activity.description || null,
//                     activity_date: new Date().toISOString(),
//                     created_by: user?.id || null
//                 })
//                 .select()
//                 .single()

//             if (error) {
//                 console.error('Erreur addActivity:', error)
//                 return null
//             }

//             return data
//         } catch (error) {
//             console.error('Erreur addActivity:', error)
//             return null
//         }
//     }

//     async updateActivity(id: string, updates: Partial<DbActivity>): Promise<boolean> {
//         try {
//             const { error } = await supabase
//                 .from('activities')
//                 .update({
//                     ...updates,
//                     updated_at: new Date().toISOString()
//                 })
//                 .eq('id', id)

//             return !error
//         } catch (error) {
//             console.error('Erreur updateActivity:', error)
//             return false
//         }
//     }

//     async deleteActivity(id: string): Promise<boolean> {
//         try {
//             const { error } = await supabase
//                 .from('activities')
//                 .update({
//                     deleted_at: new Date().toISOString(),
//                     updated_at: new Date().toISOString()
//                 })
//                 .eq('id', id)

//             return !error
//         } catch (error) {
//             console.error('Erreur deleteActivity:', error)
//             return false
//         }
//     }

//     // DÉPÔTS CAISSE
//     async getCaisseDeposits(): Promise<DbCaisseDeposit[]> {
//         try {
//             if (!await this.ensureFamilyId()) return []

//             const { data, error } = await supabase
//                 .from('caisse_deposits')
//                 .select('*')
//                 .eq('family_id', this.familyId)
//                 .is('deleted_at', null)
//                 .order('created_at', { ascending: false })

//             if (error) {
//                 console.error('Erreur getCaisseDeposits:', error)
//                 return []
//             }

//             return data || []
//         } catch (error) {
//             console.error('Erreur getCaisseDeposits:', error)
//             return []
//         }
//     }

//     async addCaisseDeposit(deposit: {
//         amount: number;
//         category: 'don' | 'remboursement' | 'vente' | 'bonus' | 'autre';
//         description: string;
//     }): Promise<DbCaisseDeposit | null> {
//         try {
//             if (!await this.ensureFamilyId()) return null

//             const { data: { user } } = await supabase.auth.getUser()

//             const { data, error } = await supabase
//                 .from('caisse_deposits')
//                 .insert({
//                     family_id: this.familyId,
//                     amount: deposit.amount,
//                     category: deposit.category,
//                     description: deposit.description,
//                     deposit_date: new Date().toISOString(),
//                     created_by: user?.id || null
//                 })
//                 .select()
//                 .single()

//             if (error) {
//                 console.error('Erreur addCaisseDeposit:', error)
//                 return null
//             }

//             return data
//         } catch (error) {
//             console.error('Erreur addCaisseDeposit:', error)
//             return null
//         }
//     }

//     async deleteCaisseDeposit(id: string): Promise<boolean> {
//         try {
//             const { error } = await supabase
//                 .from('caisse_deposits')
//                 .update({
//                     deleted_at: new Date().toISOString(),
//                     updated_at: new Date().toISOString()
//                 })
//                 .eq('id', id)

//             return !error
//         } catch (error) {
//             console.error('Erreur deleteCaisseDeposit:', error)
//             return false
//         }
//     }

//     // STATISTIQUES
//     async loadAllData(): Promise<{
//         members: DbMember[]
//         cotisations: DbCotisation[]
//         payments: DbPayment[]
//         activities: DbActivity[]
//         deposits: DbCaisseDeposit[]
//     }> {
//         const [members, cotisations, payments, activities, deposits] = await Promise.all([
//             this.getMembers(),
//             this.getCotisations(),
//             this.getPayments(),
//             this.getActivities(),
//             this.getCaisseDeposits()
//         ])

//         return { members, cotisations, payments, activities, deposits }
//     }

//     async getTotalCaisse(): Promise<number> {
//         try {
//             const [payments, activities, deposits] = await Promise.all([
//                 this.getPayments(),
//                 this.getActivities(),
//                 this.getCaisseDeposits()
//             ])

//             const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0)
//             const totalActivities = activities.reduce((sum, activity) => sum + activity.amount, 0)
//             const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.amount, 0)

//             return totalPayments + totalDeposits - totalActivities
//         } catch (error) {
//             console.error('Erreur getTotalCaisse:', error)
//             return 0
//         }
//     }

//     async getGeneralStats() {
//         const data = await this.loadAllData()
//         const totalCaisse = await this.getTotalCaisse()

//         return {
//             totalMembers: data.members.length,
//             totalCotisations: data.cotisations.length,
//             totalPayments: data.payments.length,
//             totalActivities: data.activities.length,
//             totalDeposits: data.deposits.length,
//             totalCaisse
//         }
//     }

//     // PARAMÈTRES UTILISATEUR (simplifiés)
//     async getUserSettings(userId: string): Promise<{
//         profile: UserProfileSettings,
//         appearance: AppearanceSettings,
//         application: ApplicationSettings,
//         data: DataSettings
//     }> {
//         return {
//             profile: {
//                 full_name: '',
//                 email: '',
//                 phone: '',
//                 avatar_url: null,
//                 bio: '',
//                 role: 'member'
//             },
//             appearance: {
//                 theme: 'light',
//                 primary_color: '#3B82F6',
//                 language: 'fr',
//                 font_size: 'medium',
//                 animations: true
//             },
//             application: {
//                 currency: 'EUR',
//                 currency_symbol: '€',
//                 date_format: 'DD/MM/YYYY',
//                 decimal_places: 2,
//                 auto_backup: true,
//                 reminder_days: 7
//             },
//             data: {
//                 auto_export: false,
//                 export_format: 'JSON',
//                 backup_frequency: 'weekly',
//                 keep_backups: 5,
//                 last_backup: null,
//                 last_export: null
//             }
//         }
//     }

//     async updateUserSetting(userId: string, category: any, key: string, value: any): Promise<boolean> {
//         return true
//     }

//     async updateMultipleSettings(userId: string, category: any, settings: Record<string, any>): Promise<boolean> {
//         return true
//     }

//     async exportUserData(userId: string, format: any): Promise<string | null> {
//         const data = await this.loadAllData()
//         return JSON.stringify({
//             export_date: new Date().toISOString(),
//             user_id: userId,
//             data
//         }, null, 2)
//     }

//     async resetUserSettings(userId: string): Promise<boolean> {
//         return true
//     }
// }

// // ===================================
// // EXPORTS - Identiques à database.ts
// // ===================================
// export const authService = AuthService.getInstance()
// export const databaseManager = new DatabaseManager()

// // Service compatible avec l'ancien code
// export class DatabaseService {
//     static async loadAllData() {
//         return databaseManager.loadAllData()
//     }

//     static async getMembers() {
//         return databaseManager.getMembers()
//     }

//     static async addMember(member: {
//         name: string;
//         phone?: string;
//         email?: string;
//         avatar_url?: string;
//         bio?: string;
//     }) {
//         return databaseManager.addMember(member)
//     }

//     static async updateMember(id: string, updates: Partial<DbMember>) {
//         return databaseManager.updateMember(id, updates)
//     }

//     static async updateMemberBalance(memberId: string, newBalance: number) {
//         return databaseManager.updateMemberBalance(memberId, newBalance)
//     }

//     static async deleteMember(id: string) {
//         return databaseManager.deleteMember(id)
//     }

//     static async getCotisations() {
//         return databaseManager.getCotisations()
//     }

//     static async addCotisation(cotisation: { name: string; amount: number; description?: string; month?: string }) {
//         return databaseManager.addCotisation(cotisation)
//     }

//     static async updateCotisation(id: string, updates: Partial<DbCotisation>) {
//         return databaseManager.updateCotisation(id, updates)
//     }

//     static async deleteCotisation(id: string) {
//         return databaseManager.deleteCotisation(id)
//     }

//     static async getPayments() {
//         return databaseManager.getPayments()
//     }

//     static async addPayment(payment: { memberId: string; cotisationId: string; amount: number; status: 'paid' | 'partial' | 'unpaid' }) {
//         return databaseManager.addPayment(payment)
//     }

//     static async updatePayment(id: string, updates: { amount?: number; status?: 'paid' | 'partial' | 'unpaid' }) {
//         return databaseManager.updatePayment(id, updates)
//     }

//     static async deletePayment(id: string) {
//         return databaseManager.deletePayment(id)
//     }

//     static async getActivities() {
//         return databaseManager.getActivities()
//     }

//     static async addActivity(activity: { name: string; amount: number; description?: string }) {
//         return databaseManager.addActivity(activity)
//     }

//     static async updateActivity(id: string, updates: Partial<DbActivity>) {
//         return databaseManager.updateActivity(id, updates)
//     }

//     static async deleteActivity(id: string) {
//         return databaseManager.deleteActivity(id)
//     }

//     static async getCaisseDeposits() {
//         return databaseManager.getCaisseDeposits()
//     }

//     static async addCaisseDeposit(deposit: {
//         amount: number;
//         category: 'don' | 'remboursement' | 'vente' | 'bonus' | 'autre';
//         description: string;
//     }) {
//         return databaseManager.addCaisseDeposit(deposit)
//     }

//     static async deleteCaisseDeposit(id: string) {
//         return databaseManager.deleteCaisseDeposit(id)
//     }

//     static async getTotalCaisse() {
//         return databaseManager.getTotalCaisse()
//     }

//     static async getGeneralStats() {
//         return databaseManager.getGeneralStats()
//     }

//     // Méthodes de paramètres
//     static async getUserSettings(userId: string) {
//         return databaseManager.getUserSettings(userId)
//     }

//     static async updateUserSetting(userId: string, category: any, key: string, value: any) {
//         return databaseManager.updateUserSetting(userId, category, key, value)
//     }

//     static async updateMultipleSettings(userId: string, category: any, settings: Record<string, any>) {
//         return databaseManager.updateMultipleSettings(userId, category, settings)
//     }

//     static async exportUserData(userId: string, format: any) {
//         return databaseManager.exportUserData(userId, format)
//     }

//     static async resetUserSettings(userId: string) {
//         return databaseManager.resetUserSettings(userId)
//     }
// }
// // export const supabaseAuth = authService
// export const supabaseData = databaseManager
// export const supabaseAuth = authService











// code sans profil
import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js'

const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrdmhjbmRvaHNsb21ld2dmaGhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzI0MTAsImV4cCI6MjA3MjE0ODQxMH0.lQycKgQ7TAHqUG5pSpbOAhdrgQhKbmo0Lz35Fo1IPfo'
const supabaseUrl = 'https://gkvhcndohslomewgfhho.supabase.co'
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// ===================================
// TYPES - Identiques à database.ts
// ===================================
export interface DbProfile {
    id: string
    email: string
    full_name: string | null
    role: 'admin' | 'member' | 'guest'
    family_id: string
    avatar_url: string | null
    phone: string | null
    is_active: boolean
    last_login: string | null
    created_at: string
    updated_at: string
}

export interface DbMember {
    id: string
    name: string
    phone: string | null
    email: string | null
    balance: number
    join_date: string
    created_at: string
    avatar_url: string | null
    bio: string | null
    status: 'active' | 'inactive'
}

export interface DbCotisation {
    id: string
    name: string
    amount: number
    month: string
    description: string | null
    created_at: string
}

export interface DbPayment {
    id: string
    member_id: string
    cotisation_id: string
    amount: number
    status: 'paid' | 'partial' | 'unpaid'
    payment_date: string
    created_at: string
}

export interface DbActivity {
    id: string
    name: string
    amount: number
    description: string | null
    activity_date: string
    created_at: string
}

export interface DbCaisseDeposit {
    id: string
    amount: number
    category: 'don' | 'remboursement' | 'vente' | 'bonus' | 'autre'
    description: string
    deposit_date: string
    created_at: string
    created_by?: string
}

export interface User {
    id: string
    email: string
    password_hash?: string
    email_confirmed_at?: string | null
    created_at: string
    updated_at: string
    user_metadata?: string
}

export interface UserProfileSettings {
    full_name: string
    email: string
    phone: string
    avatar_url: string | null
    bio: string
    role: 'admin' | 'member' | 'guest'
}

export interface AppearanceSettings {
    theme: 'light' | 'dark' | 'auto'
    primary_color: string
    language: 'fr' | 'en'
    font_size: 'small' | 'medium' | 'large'
    animations: boolean
}

export interface ApplicationSettings {
    currency: 'EUR' | 'USD' | 'XOF'
    currency_symbol: '€' | '$' | 'FCFA'
    date_format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
    decimal_places: 0 | 1 | 2
    auto_backup: boolean
    reminder_days: number
}

export interface DataSettings {
    auto_export: boolean
    export_format: 'JSON' | 'CSV' | 'EXCEL'
    backup_frequency: 'daily' | 'weekly' | 'monthly'
    keep_backups: number
    last_backup: string | null
    last_export: string | null
}

// ===================================
// SERVICE D'AUTHENTIFICATION (MODIFIÉ)
// ===================================
class AuthService {
    private static instance: AuthService | null = null
    private currentUser: SupabaseUser | null = null
    // Plus de currentProfile dans le service d'auth

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService()
        }
        return AuthService.instance
    }

    constructor() {
        this.loadSession()
    }

    private loadSession() {
        // Vérifier SEULEMENT la session Supabase, pas le profil
        this.checkSupabaseSession()
    }

    private async checkSupabaseSession() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                this.currentUser = user
                // NE PAS récupérer le profil automatiquement
            }
        } catch (error) {
            console.warn('Erreur session Supabase:', error)
        }
    }

    async signUp(email: string, password: string, userData: { full_name?: string } = {}): Promise<{ user: SupabaseUser | null, error: string | null }> {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: userData
                }
            })

            if (error) {
                return { user: null, error: error.message }
            }

            if (data.user) {
                // Créer le profil mais ne pas le stocker dans le service d'auth
                const newProfile: Partial<DbProfile> = {
                    id: data.user.id,
                    email: data.user.email!,
                    full_name: userData.full_name || null,
                    role: 'member',
                    family_id: crypto.randomUUID(),
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }

                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert(newProfile)

                if (profileError) {
                    console.error('Erreur création profil:', profileError)
                }

                this.currentUser = data.user as SupabaseUser
                // Ne pas stocker le profil ici
            }

            return { user: data.user as SupabaseUser, error: null }
        } catch (error) {
            console.error('Erreur signUp:', error)
            return { user: null, error: 'Erreur lors de la création du compte' }
        }
    }

    async signIn(email: string, password: string): Promise<{ user: SupabaseUser | null, error: string | null }> {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                return { user: null, error: error.message }
            }

            if (data.user) {
                this.currentUser = data.user as SupabaseUser

                // Mettre à jour last_login dans la base mais ne pas récupérer le profil
                try {
                    await supabase
                        .from('profiles')
                        .update({
                            last_login: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', data.user.id)
                } catch (profileError) {
                    console.warn('Erreur mise à jour last_login:', profileError)
                    // Ne pas faire échouer la connexion pour ça
                }
            }

            return { user: data.user as SupabaseUser, error: null }
        } catch (error) {
            console.error('Erreur signIn:', error)
            return { user: null, error: 'Erreur de connexion' }
        }
    }

    async signOut(): Promise<void> {
        await supabase.auth.signOut()
        this.currentUser = null
        // Plus de currentProfile à nettoyer
    }

    getSession() {
        return {
            user: this.currentUser
            // Plus de profile dans la session
        }
    }

    isAuthenticated(): boolean {
        return !!this.currentUser
        // Plus besoin de vérifier le profil
    }

    // Méthode séparée pour récupérer le profil quand nécessaire
    async getProfile(userId: string): Promise<DbProfile | null> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('Erreur getProfile:', error)
                return null
            }

            return data
        } catch (error) {
            console.error('Erreur getProfile:', error)
            return null
        }
    }

    // Nouvelle méthode pour récupérer le profil de l'utilisateur connecté
    async getCurrentUserProfile(): Promise<DbProfile | null> {
        if (!this.currentUser) return null
        return this.getProfile(this.currentUser.id)
    }
}

// ===================================
// SERVICE DE BASE DE DONNÉES (MODIFIÉ)
// ===================================
class DatabaseManager {
    private familyId: string | null = null

    constructor() {
        // Ne pas initialiser automatiquement le familyId
    }

    private async initializeFamilyId() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const profile = await authService.getProfile(user.id)
                if (profile?.family_id) {
                    this.familyId = profile.family_id
                }
            }
        } catch (error) {
            console.warn('Erreur initialisation familyId:', error)
        }
    }

    private async ensureFamilyId(): Promise<boolean> {
        if (this.familyId) return true

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return false

        const profile = await authService.getProfile(user.id)
        if (profile?.family_id) {
            this.familyId = profile.family_id
            return true
        }

        return false
    }

    // MEMBRES
    async getMembers(): Promise<DbMember[]> {
        try {
            if (!await this.ensureFamilyId()) return []

            const { data, error } = await supabase
                .from('members')
                .select('*')
                .eq('family_id', this.familyId)
                .is('deleted_at', null)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Erreur getMembers:', error)
                return []
            }

            return data || []
        } catch (error) {
            console.error('Erreur getMembers:', error)
            return []
        }
    }

    async addMember(member: {
        name: string;
        phone?: string;
        email?: string;
        avatar_url?: string;
        bio?: string;
    }): Promise<DbMember | null> {
        try {
            if (!await this.ensureFamilyId()) return null

            const { data: { user } } = await supabase.auth.getUser()

            const { data, error } = await supabase
                .from('members')
                .insert({
                    family_id: this.familyId,
                    name: member.name,
                    phone: member.phone || null,
                    email: member.email || null,
                    avatar_url: member.avatar_url || null,
                    bio: member.bio || null,
                    balance: 0,
                    join_date: new Date().toISOString(),
                    status: 'active',
                    created_by: user?.id || null
                })
                .select()
                .single()

            if (error) {
                console.error('Erreur addMember:', error)
                return null
            }

            return data
        } catch (error) {
            console.error('Erreur addMember:', error)
            return null
        }
    }

    async updateMember(id: string, updates: Partial<DbMember>): Promise<boolean> {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            const { error } = await supabase
                .from('members')
                .update({
                    ...updates,
                    updated_by: user?.id || null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            return !error
        } catch (error) {
            console.error('Erreur updateMember:', error)
            return false
        }
    }

    async updateMemberBalance(memberId: string, newBalance: number): Promise<boolean> {
        return this.updateMember(memberId, { balance: newBalance })
    }

    async deleteMember(id: string): Promise<boolean> {
        try {
            // Soft delete des paiements associés
            await supabase
                .from('payments')
                .update({ deleted_at: new Date().toISOString() })
                .eq('member_id', id)

            // Soft delete du membre
            const { error } = await supabase
                .from('members')
                .update({
                    deleted_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            return !error
        } catch (error) {
            console.error('Erreur deleteMember:', error)
            return false
        }
    }

    // COTISATIONS
    async getCotisations(): Promise<DbCotisation[]> {
        try {
            if (!await this.ensureFamilyId()) return []

            const { data, error } = await supabase
                .from('cotisations')
                .select('*')
                .eq('family_id', this.familyId)
                .is('deleted_at', null)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Erreur getCotisations:', error)
                return []
            }

            return data || []
        } catch (error) {
            console.error('Erreur getCotisations:', error)
            return []
        }
    }

    async addCotisation(cotisation: { name: string; amount: number; description?: string; month?: string }): Promise<DbCotisation | null> {
        try {
            if (!await this.ensureFamilyId()) return null

            const { data: { user } } = await supabase.auth.getUser()

            const { data, error } = await supabase
                .from('cotisations')
                .insert({
                    family_id: this.familyId,
                    name: cotisation.name,
                    amount: cotisation.amount,
                    month: cotisation.month || new Date().toISOString().slice(0, 7),
                    description: cotisation.description || null,
                    created_by: user?.id || null
                })
                .select()
                .single()

            if (error) {
                console.error('Erreur addCotisation:', error)
                return null
            }

            return data
        } catch (error) {
            console.error('Erreur addCotisation:', error)
            return null
        }
    }

    async updateCotisation(id: string, updates: Partial<DbCotisation>): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('cotisations')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            return !error
        } catch (error) {
            console.error('Erreur updateCotisation:', error)
            return false
        }
    }

    async deleteCotisation(id: string): Promise<boolean> {
        try {
            // Soft delete des paiements associés
            await supabase
                .from('payments')
                .update({ deleted_at: new Date().toISOString() })
                .eq('cotisation_id', id)

            // Soft delete de la cotisation
            const { error } = await supabase
                .from('cotisations')
                .update({
                    deleted_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            return !error
        } catch (error) {
            console.error('Erreur deleteCotisation:', error)
            return false
        }
    }

    // PAIEMENTS
    async getPayments(): Promise<DbPayment[]> {
        try {
            if (!await this.ensureFamilyId()) return []

            const { data, error } = await supabase
                .from('payments')
                .select('*')
                .eq('family_id', this.familyId)
                .is('deleted_at', null)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Erreur getPayments:', error)
                return []
            }

            return data || []
        } catch (error) {
            console.error('Erreur getPayments:', error)
            return []
        }
    }

    async addPayment(payment: { memberId: string; cotisationId: string; amount: number; status: 'paid' | 'partial' | 'unpaid' }): Promise<DbPayment | null> {
        try {
            if (!await this.ensureFamilyId()) return null

            const { data: { user } } = await supabase.auth.getUser()

            const { data, error } = await supabase
                .from('payments')
                .insert({
                    family_id: this.familyId,
                    member_id: payment.memberId,
                    cotisation_id: payment.cotisationId,
                    amount: payment.amount,
                    status: payment.status,
                    payment_date: new Date().toISOString(),
                    created_by: user?.id || null
                })
                .select()
                .single()

            if (error) {
                console.error('Erreur addPayment:', error)
                return null
            }

            return data
        } catch (error) {
            console.error('Erreur addPayment:', error)
            return null
        }
    }

    async updatePayment(id: string, updates: { amount?: number; status?: 'paid' | 'partial' | 'unpaid' }): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('payments')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            return !error
        } catch (error) {
            console.error('Erreur updatePayment:', error)
            return false
        }
    }

    async deletePayment(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('payments')
                .update({
                    deleted_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            return !error
        } catch (error) {
            console.error('Erreur deletePayment:', error)
            return false
        }
    }

    // ACTIVITÉS
    async getActivities(): Promise<DbActivity[]> {
        try {
            if (!await this.ensureFamilyId()) return []

            const { data, error } = await supabase
                .from('activities')
                .select('*')
                .eq('family_id', this.familyId)
                .is('deleted_at', null)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Erreur getActivities:', error)
                return []
            }

            return data || []
        } catch (error) {
            console.error('Erreur getActivities:', error)
            return []
        }
    }

    async addActivity(activity: { name: string; amount: number; description?: string }): Promise<DbActivity | null> {
        try {
            if (!await this.ensureFamilyId()) return null

            const { data: { user } } = await supabase.auth.getUser()

            const { data, error } = await supabase
                .from('activities')
                .insert({
                    family_id: this.familyId,
                    name: activity.name,
                    amount: activity.amount,
                    description: activity.description || null,
                    activity_date: new Date().toISOString(),
                    created_by: user?.id || null
                })
                .select()
                .single()

            if (error) {
                console.error('Erreur addActivity:', error)
                return null
            }

            return data
        } catch (error) {
            console.error('Erreur addActivity:', error)
            return null
        }
    }

    async updateActivity(id: string, updates: Partial<DbActivity>): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('activities')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            return !error
        } catch (error) {
            console.error('Erreur updateActivity:', error)
            return false
        }
    }

    async deleteActivity(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('activities')
                .update({
                    deleted_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            return !error
        } catch (error) {
            console.error('Erreur deleteActivity:', error)
            return false
        }
    }

    // DÉPÔTS CAISSE
    async getCaisseDeposits(): Promise<DbCaisseDeposit[]> {
        try {
            if (!await this.ensureFamilyId()) return []

            const { data, error } = await supabase
                .from('caisse_deposits')
                .select('*')
                .eq('family_id', this.familyId)
                .is('deleted_at', null)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Erreur getCaisseDeposits:', error)
                return []
            }

            return data || []
        } catch (error) {
            console.error('Erreur getCaisseDeposits:', error)
            return []
        }
    }

    async addCaisseDeposit(deposit: {
        amount: number;
        category: 'don' | 'remboursement' | 'vente' | 'bonus' | 'autre';
        description: string;
    }): Promise<DbCaisseDeposit | null> {
        try {
            if (!await this.ensureFamilyId()) return null

            const { data: { user } } = await supabase.auth.getUser()

            const { data, error } = await supabase
                .from('caisse_deposits')
                .insert({
                    family_id: this.familyId,
                    amount: deposit.amount,
                    category: deposit.category,
                    description: deposit.description,
                    deposit_date: new Date().toISOString(),
                    created_by: user?.id || null
                })
                .select()
                .single()

            if (error) {
                console.error('Erreur addCaisseDeposit:', error)
                return null
            }

            return data
        } catch (error) {
            console.error('Erreur addCaisseDeposit:', error)
            return null
        }
    }

    async deleteCaisseDeposit(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('caisse_deposits')
                .update({
                    deleted_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            return !error
        } catch (error) {
            console.error('Erreur deleteCaisseDeposit:', error)
            return false
        }
    }

    // STATISTIQUES
    async loadAllData(): Promise<{
        members: DbMember[]
        cotisations: DbCotisation[]
        payments: DbPayment[]
        activities: DbActivity[]
        deposits: DbCaisseDeposit[]
    }> {
        const [members, cotisations, payments, activities, deposits] = await Promise.all([
            this.getMembers(),
            this.getCotisations(),
            this.getPayments(),
            this.getActivities(),
            this.getCaisseDeposits()
        ])

        return { members, cotisations, payments, activities, deposits }
    }

    async getTotalCaisse(): Promise<number> {
        try {
            const [payments, activities, deposits] = await Promise.all([
                this.getPayments(),
                this.getActivities(),
                this.getCaisseDeposits()
            ])

            const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0)
            const totalActivities = activities.reduce((sum, activity) => sum + activity.amount, 0)
            const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.amount, 0)

            return totalPayments + totalDeposits - totalActivities
        } catch (error) {
            console.error('Erreur getTotalCaisse:', error)
            return 0
        }
    }

    async getGeneralStats() {
        const data = await this.loadAllData()
        const totalCaisse = await this.getTotalCaisse()

        return {
            totalMembers: data.members.length,
            totalCotisations: data.cotisations.length,
            totalPayments: data.payments.length,
            totalActivities: data.activities.length,
            totalDeposits: data.deposits.length,
            totalCaisse
        }
    }

    // PARAMÈTRES UTILISATEUR (simplifiés)
    async getUserSettings(userId: string): Promise<{
        profile: UserProfileSettings,
        appearance: AppearanceSettings,
        application: ApplicationSettings,
        data: DataSettings
    }> {
        return {
            profile: {
                full_name: '',
                email: '',
                phone: '',
                avatar_url: null,
                bio: '',
                role: 'member'
            },
            appearance: {
                theme: 'light',
                primary_color: '#3B82F6',
                language: 'fr',
                font_size: 'medium',
                animations: true
            },
            application: {
                currency: 'EUR',
                currency_symbol: '€',
                date_format: 'DD/MM/YYYY',
                decimal_places: 2,
                auto_backup: true,
                reminder_days: 7
            },
            data: {
                auto_export: false,
                export_format: 'JSON',
                backup_frequency: 'weekly',
                keep_backups: 5,
                last_backup: null,
                last_export: null
            }
        }
    }

    async updateUserSetting(userId: string, category: any, key: string, value: any): Promise<boolean> {
        return true
    }

    async updateMultipleSettings(userId: string, category: any, settings: Record<string, any>): Promise<boolean> {
        return true
    }

    async exportUserData(userId: string, format: any): Promise<string | null> {
        const data = await this.loadAllData()
        return JSON.stringify({
            export_date: new Date().toISOString(),
            user_id: userId,
            data
        }, null, 2)
    }

    async resetUserSettings(userId: string): Promise<boolean> {
        return true
    }
}

// ===================================
// EXPORTS - Identiques à database.ts
// ===================================
export const authService = AuthService.getInstance()
export const databaseManager = new DatabaseManager()

// Service compatible avec l'ancien code
export class DatabaseService {
    static async loadAllData() {
        return databaseManager.loadAllData()
    }

    static async getMembers() {
        return databaseManager.getMembers()
    }

    static async addMember(member: {
        name: string;
        phone?: string;
        email?: string;
        avatar_url?: string;
        bio?: string;
    }) {
        return databaseManager.addMember(member)
    }

    static async updateMember(id: string, updates: Partial<DbMember>) {
        return databaseManager.updateMember(id, updates)
    }

    static async updateMemberBalance(memberId: string, newBalance: number) {
        return databaseManager.updateMemberBalance(memberId, newBalance)
    }

    static async deleteMember(id: string) {
        return databaseManager.deleteMember(id)
    }

    static async getCotisations() {
        return databaseManager.getCotisations()
    }

    static async addCotisation(cotisation: { name: string; amount: number; description?: string; month?: string }) {
        return databaseManager.addCotisation(cotisation)
    }

    static async updateCotisation(id: string, updates: Partial<DbCotisation>) {
        return databaseManager.updateCotisation(id, updates)
    }

    static async deleteCotisation(id: string) {
        return databaseManager.deleteCotisation(id)
    }

    static async getPayments() {
        return databaseManager.getPayments()
    }

    static async addPayment(payment: { memberId: string; cotisationId: string; amount: number; status: 'paid' | 'partial' | 'unpaid' }) {
        return databaseManager.addPayment(payment)
    }

    static async updatePayment(id: string, updates: { amount?: number; status?: 'paid' | 'partial' | 'unpaid' }) {
        return databaseManager.updatePayment(id, updates)
    }

    static async deletePayment(id: string) {
        return databaseManager.deletePayment(id)
    }

    static async getActivities() {
        return databaseManager.getActivities()
    }

    static async addActivity(activity: { name: string; amount: number; description?: string }) {
        return databaseManager.addActivity(activity)
    }

    static async updateActivity(id: string, updates: Partial<DbActivity>) {
        return databaseManager.updateActivity(id, updates)
    }

    static async deleteActivity(id: string) {
        return databaseManager.deleteActivity(id)
    }

    static async getCaisseDeposits() {
        return databaseManager.getCaisseDeposits()
    }

    static async addCaisseDeposit(deposit: {
        amount: number;
        category: 'don' | 'remboursement' | 'vente' | 'bonus' | 'autre';
        description: string;
    }) {
        return databaseManager.addCaisseDeposit(deposit)
    }

    static async deleteCaisseDeposit(id: string) {
        return databaseManager.deleteCaisseDeposit(id)
    }

    static async getTotalCaisse() {
        return databaseManager.getTotalCaisse()
    }

    static async getGeneralStats() {
        return databaseManager.getGeneralStats()
    }

    // Méthodes de paramètres
    static async getUserSettings(userId: string) {
        return databaseManager.getUserSettings(userId)
    }

    static async updateUserSetting(userId: string, category: any, key: string, value: any) {
        return databaseManager.updateUserSetting(userId, category, key, value)
    }

    static async updateMultipleSettings(userId: string, category: any, settings: Record<string, any>) {
        return databaseManager.updateMultipleSettings(userId, category, settings)
    }

    static async exportUserData(userId: string, format: any) {
        return databaseManager.exportUserData(userId, format)
    }

    static async resetUserSettings(userId: string) {
        return databaseManager.resetUserSettings(userId)
    }
}

// EXPORTS FINAUX
export const supabaseData = databaseManager
export const supabaseAuth = authService