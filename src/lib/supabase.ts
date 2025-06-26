


import { createClient } from '@supabase/supabase-js'
// ⚠️ Remplacez par vos vraies clés depuis Supabase Dashboard
const supabaseUrl = 'https://crmnnrvctregeikwpusv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybW5ucnZjdHJlZ2Vpa3dwdXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NzcxMTYsImV4cCI6MjA2NjM1MzExNn0.TiVJYfJRvwqhqu_Sf3qGWuLOD5i4tfII52i6tl3wDks'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour la base de données
export interface Database {
    public: {
        Tables: {
            members: {
                Row: {
                    id: string
                    name: string
                    phone: string | null
                    email: string | null
                    balance: number
                    join_date: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    phone?: string | null
                    email?: string | null
                    balance?: number
                    join_date?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    phone?: string | null
                    email?: string | null
                    balance?: number
                    join_date?: string
                }
            }
            cotisations: {
                Row: {
                    id: string
                    name: string
                    amount: number
                    month: string
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    amount: number
                    month: string
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    amount?: number
                    month?: string
                    description?: string | null
                }
            }
            payments: {
                Row: {
                    id: string
                    member_id: string
                    cotisation_id: string
                    amount: number
                    status: 'paid' | 'partial' | 'unpaid'
                    payment_date: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    member_id: string
                    cotisation_id: string
                    amount: number
                    status: 'paid' | 'partial' | 'unpaid'
                    payment_date?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    member_id?: string
                    cotisation_id?: string
                    amount?: number
                    status?: 'paid' | 'partial' | 'unpaid'
                    payment_date?: string
                }
            }
            activities: {
                Row: {
                    id: string
                    name: string
                    amount: number
                    description: string | null
                    activity_date: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    amount: number
                    description?: string | null
                    activity_date?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    amount?: number
                    description?: string | null
                    activity_date?: string
                }
            }
        }
    }
}

// Types simplifiés pour l'app
export type DbMember = Database['public']['Tables']['members']['Row']
export type DbCotisation = Database['public']['Tables']['cotisations']['Row']
export type DbPayment = Database['public']['Tables']['payments']['Row']
export type DbActivity = Database['public']['Tables']['activities']['Row']