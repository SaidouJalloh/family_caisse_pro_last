// ================================
// 🎯 TYPES GLOBAUX DE L'APPLICATION
// ================================

// 👤 AUTH & ROLES
export type UserRole = 'admin' | 'visitor';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    created_at: string;
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

// 👥 MEMBRES
export interface Member {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    balance: number;
    join_date: string;
    created_at: string;
    updated_at: string;
}

export interface MemberFormData {
    name: string;
    phone?: string;
    email?: string;
}

// 💰 COTISATIONS
export interface Cotisation {
    id: string;
    name: string;
    amount: number;
    month: string; // Format: YYYY-MM
    description?: string;
    created_at: string;
    created_by: string; // admin qui a créé
}

export interface CotisationFormData {
    name: string;
    amount: number;
    description?: string;
}

// 💳 PAIEMENTS
export type PaymentStatus = 'paid' | 'partial' | 'unpaid';

export interface Payment {
    id: string;
    member_id: string;
    cotisation_id: string;
    amount: number;
    status: PaymentStatus;
    payment_date: string;
    note?: string;
    created_at: string;
    created_by: string; // admin qui a validé
}

export interface PaymentFormData {
    member_id: string;
    cotisation_id: string;
    amount: number;
    note?: string;
}

// 🎉 ACTIVITÉS
export interface Activity {
    id: string;
    name: string;
    amount: number;
    description?: string;
    activity_date: string;
    created_at: string;
    created_by: string; // admin qui a ajouté
}

export interface ActivityFormData {
    name: string;
    amount: number;
    description?: string;
}

// 📊 STATISTIQUES
export interface DashboardStats {
    total_caisse: number;
    total_members: number;
    payment_rate: number;
    current_month_collected: number;
    pending_payments: number;
    recent_activities: Activity[];
}

// 🔔 NOTIFICATIONS
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

// 📱 RESPONSIVE
export interface ScreenSize {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    width: number;
    height: number;
}

// 🎨 THEME
export interface ThemeState {
    isDark: boolean;
    primaryColor: string;
    accentColor: string;
}

// 📋 FORMS
export interface FormErrors {
    [key: string]: string;
}

export interface FormState<T> {
    data: T;
    errors: FormErrors;
    isSubmitting: boolean;
    isValid: boolean;
}

// 🔍 FILTERS & SEARCH
export interface MemberFilter {
    search?: string;
    status?: 'all' | 'paid' | 'unpaid' | 'partial';
    sortBy?: 'name' | 'balance' | 'join_date';
    sortOrder?: 'asc' | 'desc';
}

export interface ActivityFilter {
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    minAmount?: number;
    maxAmount?: number;
}

// 📊 PAGINATION
export interface PaginationState {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

// ⚙️ APP CONFIG
export interface AppConfig {
    app_name: string;
    currency: string;
    date_format: string;
    default_cotisation_amount: number;
    max_members: number;
    features: {
        notifications: boolean;
        exports: boolean;
        analytics: boolean;
    };
}

// 🔄 API RESPONSES
export interface ApiResponse<T> {
    data: T;
    error?: string;
    message?: string;
}

export interface ApiError {
    message: string;
    code?: string;
    details?: any;
}