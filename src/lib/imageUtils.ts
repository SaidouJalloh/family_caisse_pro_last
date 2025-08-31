// // lib/imageUtils.ts
// import { useState, useCallback } from 'react'

// export class ImageUtils {
//     /**
//      * Convertit un fichier image en base64
//      */
//     static async fileToBase64(file: File): Promise<string> {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader()
//             reader.readAsDataURL(file)
//             reader.onload = () => resolve(reader.result as string)
//             reader.onerror = error => reject(error)
//         })
//     }

//     /**
//      * Redimensionne une image et la convertit en base64
//      */
//     static async resizeAndConvertToBase64(
//         file: File,
//         maxWidth: number = 200,
//         maxHeight: number = 200,
//         quality: number = 0.8
//     ): Promise<string> {
//         return new Promise((resolve, reject) => {
//             const canvas = document.createElement('canvas')
//             const ctx = canvas.getContext('2d')
//             const img = new Image()

//             img.onload = () => {
//                 // Calculer les nouvelles dimensions en gardant le ratio
//                 let { width, height } = img

//                 if (width > height) {
//                     if (width > maxWidth) {
//                         height = (height * maxWidth) / width
//                         width = maxWidth
//                     }
//                 } else {
//                     if (height > maxHeight) {
//                         width = (width * maxHeight) / height
//                         height = maxHeight
//                     }
//                 }

//                 canvas.width = width
//                 canvas.height = height

//                 // Dessiner l'image redimensionnée
//                 ctx?.drawImage(img, 0, 0, width, height)

//                 // Convertir en base64
//                 const base64 = canvas.toDataURL('image/jpeg', quality)
//                 resolve(base64)
//             }

//             img.onerror = reject
//             img.src = URL.createObjectURL(file)
//         })
//     }

//     /**
//      * Valide si le fichier est une image
//      */
//     static isValidImageFile(file: File): boolean {
//         const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
//         return validTypes.includes(file.type)
//     }

//     /**
//      * Valide la taille du fichier (en MB)
//      */
//     static isValidFileSize(file: File, maxSizeMB: number = 5): boolean {
//         const maxSizeBytes = maxSizeMB * 1024 * 1024
//         return file.size <= maxSizeBytes
//     }

//     /**
//      * Génère un avatar par défaut avec les initiales
//      */
//     static generateDefaultAvatar(name: string, size: number = 200): string {
//         const canvas = document.createElement('canvas')
//         const ctx = canvas.getContext('2d')

//         canvas.width = size
//         canvas.height = size

//         if (!ctx) return ''

//         // Couleur de fond basée sur le nom
//         const colors = [
//             '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
//             '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
//         ]
//         const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length

//         // Dessiner le cercle de fond
//         ctx.fillStyle = colors[colorIndex]
//         ctx.beginPath()
//         ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
//         ctx.fill()

//         // Ajouter les initiales
//         const initials = name
//             .split(' ')
//             .map(word => word.charAt(0).toUpperCase())
//             .slice(0, 2)
//             .join('')

//         ctx.fillStyle = 'white'
//         ctx.font = `bold ${size * 0.4}px Arial`
//         ctx.textAlign = 'center'
//         ctx.textBaseline = 'middle'
//         ctx.fillText(initials, size / 2, size / 2)

//         return canvas.toDataURL('image/png')
//     }

//     /**
//      * Crée une URL temporaire pour l'aperçu d'image
//      */
//     static createPreviewUrl(file: File): string {
//         return URL.createObjectURL(file)
//     }

//     /**
//      * Nettoie une URL temporaire
//      */
//     static revokePreviewUrl(url: string): void {
//         URL.revokeObjectURL(url)
//     }
// }

// // Hook React pour gérer l'upload d'images
// // import { useState, useCallback } from 'react'

// export interface ImageUploadState {
//     file: File | null
//     preview: string | null
//     base64: string | null
//     loading: boolean
//     error: string | null
// }

// export const useImageUpload = () => {
//     const [state, setState] = useState<ImageUploadState>({
//         file: null,
//         preview: null,
//         base64: null,
//         loading: false,
//         error: null
//     })

//     const uploadImage = useCallback(async (file: File) => {
//         setState(prev => ({ ...prev, loading: true, error: null }))

//         try {
//             // Validation
//             if (!ImageUtils.isValidImageFile(file)) {
//                 throw new Error('Format de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP.')
//             }

//             if (!ImageUtils.isValidFileSize(file, 5)) {
//                 throw new Error('Le fichier est trop volumineux. Taille maximale : 5MB.')
//             }

//             // Créer l'aperçu
//             const preview = ImageUtils.createPreviewUrl(file)

//             // Redimensionner et convertir en base64
//             const base64 = await ImageUtils.resizeAndConvertToBase64(file, 200, 200, 0.8)

//             setState({
//                 file,
//                 preview,
//                 base64,
//                 loading: false,
//                 error: null
//             })

//         } catch (error) {
//             setState(prev => ({
//                 ...prev,
//                 loading: false,
//                 error: error instanceof Error ? error.message : 'Erreur lors du traitement de l\'image'
//             }))
//         }
//     }, [])

//     const clearImage = useCallback(() => {
//         if (state.preview) {
//             ImageUtils.revokePreviewUrl(state.preview)
//         }
//         setState({
//             file: null,
//             preview: null,
//             base64: null,
//             loading: false,
//             error: null
//         })
//     }, [state.preview])

//     const generateDefaultAvatar = useCallback((name: string) => {
//         const defaultAvatar = ImageUtils.generateDefaultAvatar(name)
//         setState({
//             file: null,
//             preview: defaultAvatar,
//             base64: defaultAvatar,
//             loading: false,
//             error: null
//         })
//     }, [])

//     return {
//         ...state,
//         uploadImage,
//         clearImage,
//         generateDefaultAvatar
//     }
// }
























// code precedent marche bien mais sans la photo
// lib/imageUtils.ts
import { useState, useCallback } from 'react'

export class ImageUtils {
    /**
     * Convertit un fichier image en base64
     */
    static async fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = error => reject(error)
        })
    }

    /**
     * Redimensionne une image et la convertit en base64
     */
    static async resizeAndConvertToBase64(
        file: File,
        maxWidth: number = 200,
        maxHeight: number = 200,
        quality: number = 0.8
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()

            img.onload = () => {
                // Calculer les nouvelles dimensions en gardant le ratio
                let { width, height } = img

                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width
                        width = maxWidth
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height
                        height = maxHeight
                    }
                }

                canvas.width = width
                canvas.height = height

                // Dessiner l'image redimensionnée
                ctx?.drawImage(img, 0, 0, width, height)

                // Convertir en base64
                const base64 = canvas.toDataURL('image/jpeg', quality)
                resolve(base64)
            }

            img.onerror = reject
            img.src = URL.createObjectURL(file)
        })
    }

    /**
     * Valide si le fichier est une image
     */
    static isValidImageFile(file: File): boolean {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        return validTypes.includes(file.type)
    }

    /**
     * Valide la taille du fichier (en MB)
     */
    static isValidFileSize(file: File, maxSizeMB: number = 5): boolean {
        const maxSizeBytes = maxSizeMB * 1024 * 1024
        return file.size <= maxSizeBytes
    }

    /**
     * Génère un avatar par défaut avec les initiales
     */
    static generateDefaultAvatar(name: string, size: number = 200): string {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        canvas.width = size
        canvas.height = size

        if (!ctx) return ''

        // Couleur de fond basée sur le nom
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ]
        const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length

        // Dessiner le cercle de fond
        ctx.fillStyle = colors[colorIndex]
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
        ctx.fill()

        // Ajouter les initiales
        const initials = name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('')

        ctx.fillStyle = 'white'
        ctx.font = `bold ${size * 0.4}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(initials, size / 2, size / 2)

        return canvas.toDataURL('image/png')
    }

    /**
     * Crée une URL temporaire pour l'aperçu d'image
     */
    static createPreviewUrl(file: File): string {
        return URL.createObjectURL(file)
    }

    /**
     * Nettoie une URL temporaire
     */
    static revokePreviewUrl(url: string): void {
        URL.revokeObjectURL(url)
    }
}

// Hook React pour gérer l'upload d'images
export interface ImageUploadState {
    file: File | null
    preview: string | null
    base64: string | null
    loading: boolean
    error: string | null
}

export const useImageUpload = () => {
    const [state, setState] = useState<ImageUploadState>({
        file: null,
        preview: null,
        base64: null,
        loading: false,
        error: null
    })

    const uploadImage = useCallback(async (file: File) => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            // Validation
            if (!ImageUtils.isValidImageFile(file)) {
                throw new Error('Format de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP.')
            }

            if (!ImageUtils.isValidFileSize(file, 5)) {
                throw new Error('Le fichier est trop volumineux. Taille maximale : 5MB.')
            }

            // Créer l'aperçu
            const preview = ImageUtils.createPreviewUrl(file)

            // Redimensionner et convertir en base64
            const base64 = await ImageUtils.resizeAndConvertToBase64(file, 200, 200, 0.8)

            setState({
                file,
                preview,
                base64,
                loading: false,
                error: null
            })

        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Erreur lors du traitement de l\'image'
            }))
        }
    }, [])

    const clearImage = useCallback(() => {
        if (state.preview) {
            ImageUtils.revokePreviewUrl(state.preview)
        }
        setState({
            file: null,
            preview: null,
            base64: null,
            loading: false,
            error: null
        })
    }, [state.preview])

    const generateDefaultAvatar = useCallback((name: string) => {
        const defaultAvatar = ImageUtils.generateDefaultAvatar(name)
        setState({
            file: null,
            preview: defaultAvatar,
            base64: defaultAvatar,
            loading: false,
            error: null
        })
    }, [])

    return {
        ...state,
        uploadImage,
        clearImage,
        generateDefaultAvatar
    }
}

export default ImageUtils