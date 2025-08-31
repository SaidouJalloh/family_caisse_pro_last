// // components/ImageUpload.tsx
// import React, { useRef } from 'react'
// import { Camera, User, X, Upload, Loader } from 'lucide-react'
// import { useImageUpload } from '../lib/imageUtils'

// interface ImageUploadProps {
//     onImageChange: (base64: string | null) => void
//     defaultName?: string
//     currentImage?: string | null
//     className?: string
// }

// const ImageUpload: React.FC<ImageUploadProps> = ({
//     onImageChange,
//     defaultName = '',
//     currentImage = null,
//     className = ''
// }) => {
//     const fileInputRef = useRef<HTMLInputElement>(null)
//     const { preview, base64, loading, error, uploadImage, clearImage, generateDefaultAvatar } = useImageUpload()

//     // Utiliser l'image actuelle si pas de nouvelle image uploadée
//     const displayImage = preview || currentImage

//     const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0]
//         if (file) {
//             await uploadImage(file)
//         }
//     }

//     const handleUploadClick = () => {
//         fileInputRef.current?.click()
//     }

//     const handleClear = () => {
//         clearImage()
//         onImageChange(null)
//         if (fileInputRef.current) {
//             fileInputRef.current.value = ''
//         }
//     }

//     const handleGenerateDefault = () => {
//         if (defaultName) {
//             generateDefaultAvatar(defaultName)
//         }
//     }

//     // Notifier le parent quand l'image change
//     React.useEffect(() => {
//         onImageChange(base64)
//     }, [base64, onImageChange])

//     return (
//         <div className={`flex flex-col items-center ${className}`}>
//             {/* Zone d'affichage de l'image */}
//             <div className="relative group">
//                 <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
//                     {loading ? (
//                         <Loader className="w-8 h-8 animate-spin text-gray-400" />
//                     ) : displayImage ? (
//                         <img
//                             src={displayImage}
//                             alt="Avatar"
//                             className="w-full h-full object-cover"
//                         />
//                     ) : (
//                         <User className="w-12 h-12 text-gray-400" />
//                     )}
//                 </div>

//                 {/* Overlay avec boutons */}
//                 {!loading && (
//                     <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                         <div className="flex space-x-2">
//                             <button
//                                 onClick={handleUploadClick}
//                                 className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
//                                 title="Choisir une photo"
//                             >
//                                 <Camera className="w-4 h-4" />
//                             </button>

//                             {defaultName && (
//                                 <button
//                                     onClick={handleGenerateDefault}
//                                     className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
//                                     title="Générer avatar par défaut"
//                                 >
//                                     <User className="w-4 h-4" />
//                                 </button>
//                             )}

//                             {displayImage && (
//                                 <button
//                                     onClick={handleClear}
//                                     className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
//                                     title="Supprimer"
//                                 >
//                                     <X className="w-4 h-4" />
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Zone de drop (optionnelle) */}
//             <div
//                 className="mt-4 w-full max-w-xs border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors cursor-pointer"
//                 onClick={handleUploadClick}
//                 onDragOver={(e) => {
//                     e.preventDefault()
//                     e.currentTarget.classList.add('border-indigo-400', 'bg-indigo-50')
//                 }}
//                 onDragLeave={(e) => {
//                     e.currentTarget.classList.remove('border-indigo-400', 'bg-indigo-50')
//                 }}
//                 onDrop={async (e) => {
//                     e.preventDefault()
//                     e.currentTarget.classList.remove('border-indigo-400', 'bg-indigo-50')

//                     const file = e.dataTransfer.files?.[0]
//                     if (file) {
//                         await uploadImage(file)
//                     }
//                 }}
//             >
//                 <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
//                 <p className="text-sm text-gray-600">
//                     Cliquez ou glissez une image ici
//                 </p>
//                 <p className="text-xs text-gray-400 mt-1">
//                     JPG, PNG, GIF jusqu'à 5MB
//                 </p>
//             </div>

//             {/* Input file caché */}
//             <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileSelect}
//                 className="hidden"
//             />

//             {/* Message d'erreur */}
//             {error && (
//                 <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
//                     {error}
//                 </div>
//             )}

//             {/* Boutons d'action supplémentaires */}
//             <div className="mt-4 flex flex-wrap gap-2 justify-center">
//                 <button
//                     onClick={handleUploadClick}
//                     className="px-4 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center"
//                 >
//                     <Camera className="w-4 h-4 mr-2" />
//                     Choisir une photo
//                 </button>

//                 {defaultName && (
//                     <button
//                         onClick={handleGenerateDefault}
//                         className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
//                     >
//                         <User className="w-4 h-4 mr-2" />
//                         Avatar auto
//                     </button>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default ImageUpload




















// code precedent sans la photo
// components/ImageUpload.tsx
import React, { useRef } from 'react'
import { Camera, User, X, Upload, Loader } from 'lucide-react'
import { useImageUpload } from '../lib/imageUtils'

interface ImageUploadProps {
    onImageChange: (base64: string | null) => void
    defaultName?: string
    currentImage?: string | null
    className?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onImageChange,
    defaultName = '',
    currentImage = null,
    className = ''
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { preview, base64, loading, error, uploadImage, clearImage, generateDefaultAvatar } = useImageUpload()

    // Utiliser l'image actuelle si pas de nouvelle image uploadée
    const displayImage = preview || currentImage

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            await uploadImage(file)
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleClear = () => {
        clearImage()
        onImageChange(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleGenerateDefault = () => {
        if (defaultName) {
            generateDefaultAvatar(defaultName)
        }
    }

    // Notifier le parent quand l'image change
    React.useEffect(() => {
        onImageChange(base64)
    }, [base64, onImageChange])

    return (
        <div className={`flex flex-col items-center ${className}`}>
            {/* Zone d'affichage de l'image */}
            <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
                    {loading ? (
                        <Loader className="w-8 h-8 animate-spin text-gray-400" />
                    ) : displayImage ? (
                        <img
                            src={displayImage}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-12 h-12 text-gray-400" />
                    )}
                </div>

                {/* Overlay avec boutons */}
                {!loading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex space-x-2">
                            <button
                                onClick={handleUploadClick}
                                className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                                title="Choisir une photo"
                            >
                                <Camera className="w-4 h-4" />
                            </button>

                            {defaultName && (
                                <button
                                    onClick={handleGenerateDefault}
                                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                                    title="Générer avatar par défaut"
                                >
                                    <User className="w-4 h-4" />
                                </button>
                            )}

                            {displayImage && (
                                <button
                                    onClick={handleClear}
                                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                    title="Supprimer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Zone de drop */}
            <div
                className="mt-4 w-full max-w-xs border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors cursor-pointer"
                onClick={handleUploadClick}
                onDragOver={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.add('border-indigo-400', 'bg-indigo-50')
                }}
                onDragLeave={(e) => {
                    e.currentTarget.classList.remove('border-indigo-400', 'bg-indigo-50')
                }}
                onDrop={async (e) => {
                    e.preventDefault()
                    e.currentTarget.classList.remove('border-indigo-400', 'bg-indigo-50')

                    const file = e.dataTransfer.files?.[0]
                    if (file) {
                        await uploadImage(file)
                    }
                }}
            >
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                    Cliquez ou glissez une image ici
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG, GIF jusqu'à 5MB
                </p>
            </div>

            {/* Input file caché */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Message d'erreur */}
            {error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Boutons d'action */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <button
                    onClick={handleUploadClick}
                    className="px-4 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center"
                >
                    <Camera className="w-4 h-4 mr-2" />
                    Choisir une photo
                </button>

                {defaultName && (
                    <button
                        onClick={handleGenerateDefault}
                        className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                    >
                        <User className="w-4 h-4 mr-2" />
                        Avatar auto
                    </button>
                )}
            </div>
        </div>
    )
}

export default ImageUpload