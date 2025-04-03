import { ChangeEvent, RefObject, MouseEvent } from "react";
import Image from "next/image";
import { FormState, FormErrors } from "@/types/createMyBooks";

type BookImageSectionProps = {
  formData: FormState;
  errors: FormErrors;
  imagePreview: string | null;
  fileInputRef: RefObject<HTMLInputElement>;
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
};

export default function BookImageSection({ 
  formData, 
  errors, 
  imagePreview, 
  fileInputRef, 
  handleImageChange, 
  handleRemoveImage 
}: BookImageSectionProps) {
  
  // Nouvelle fonction pour gérer l'ouverture du sélecteur de fichier
  const handleBrowseClick = (e: MouseEvent) => {
    e.preventDefault(); // Empêche la propagation des événements
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Photo du livre
      </h2>

      <div className="flex flex-col md:flex-row gap-6" data-error={!!errors.image}>
        {/* Zone de prévisualisation */}
        <div className="md:w-1/3 flex flex-col">
          <div className={`relative rounded-lg border-2 border-dashed ${errors.image ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600'} overflow-hidden flex items-center justify-center h-60`}>
            {imagePreview ? (
              <>
                <Image
                  src={imagePreview}
                  alt="Prévisualisation"
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                  aria-label="Supprimer l'image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="text-center p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Aucune image sélectionnée</p>
              </div>
            )}
          </div>
        </div>

        {/* Zone d'upload - Affichage unifié */}
        <div className="md:w-2/3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Photo du livre <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="image"
            name="image"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          
          <div className="mt-1">
            {/* Afficher toujours le bloc de parcourir/déposer, mais conditionnel pour certains éléments */}
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600">
              <div className="space-y-1 text-center">
                {/* Affichage différent selon qu'une image est sélectionnée ou non */}
                {!imagePreview ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      {/* Suppression du htmlFor et modification du gestionnaire d'événement */}
                      <button 
                        type="button"
                        onClick={handleBrowseClick}
                        className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus:outline-none"
                      >
                        <span className="px-2 py-1.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30">Parcourir</span>
                      </button>
                      <p className="pl-1">ou glissez-déposez</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG ou GIF jusqu'à 5MB
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Une image a été sélectionnée
                    </p>
                    <div className="flex space-x-3 justify-center">
                      <button
                        type="button"
                        onClick={handleBrowseClick}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Choisir une autre image
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Supprimer l'image
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {errors.image && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.image}</p>
          )}
        </div>
      </div>
    </div>
  );
}