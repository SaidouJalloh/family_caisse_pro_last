// src/components/LoadingScreen.tsx
import React from 'react'

const LoadingScreen: React.FC = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-700 dark:text-gray-200 text-xl font-semibold">Chargement...</p>
        </div>
    </div>
)

export default LoadingScreen
