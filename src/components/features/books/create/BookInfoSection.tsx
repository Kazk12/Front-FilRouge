import { ChangeEvent } from "react";
import { FormState, FormErrors } from "@/types/createMyBooks";
import { stateOptions } from "@/lib/constants/constants";

type BookInfoSectionProps = {
  formData: FormState;
  errors: FormErrors;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

export default function BookInfoSection({ formData, errors, handleChange }: BookInfoSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Informations du livre
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Titre */}
        <div data-error={!!errors.title}>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Titre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.title ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white shadow-sm`}
            placeholder="Le titre du livre"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
          )}
        </div>

        {/* Auteur */}
        <div data-error={!!errors.author}>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Auteur <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.author ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white shadow-sm`}
            placeholder="L'auteur du livre"
          />
          {errors.author && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.author}</p>
          )}
        </div>
      </div>

      {/* État du livre */}
      <div className="mt-6" data-error={!!errors.state}>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          État du livre <span className="text-red-500">*</span>
        </label>
        <select
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 rounded-lg border ${errors.state ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white shadow-sm appearance-none bg-no-repeat`}
          style={{ backgroundPosition: "right 0.75rem center", backgroundImage: "url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 20 20\"%3E%3Cpath stroke=\"%236b7280\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M6 8l4 4 4-4\"/%3E%3C/svg%3E')", backgroundSize: "1.5em 1.5em" }}
        >
          <option value="">Sélectionnez l'état du livre</option>
          {stateOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.state && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.state}</p>
        )}
      </div>

      {/* Prix */}
      <div className="mt-6" data-error={!!errors.price}>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Prix (€) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.price ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white shadow-sm pr-10`}
            placeholder="0.00"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400">€</span>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Entrez le prix sans le symbole € (ex: 12.50)
        </p>
        {errors.price && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
        )}
      </div>

      {/* Court résumé */}
      <div className="mt-6" data-error={!!errors.shortDescription}>
        <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Court résumé <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="shortDescription"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          maxLength={100}
          className={`w-full px-4 py-2.5 rounded-lg border ${errors.shortDescription ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white shadow-sm`}
          placeholder="Résumé court (max 100 caractères)"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {formData.shortDescription.length}/100 caractères
        </p>
        {errors.shortDescription && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.shortDescription}</p>
        )}
      </div>

      {/* Description complète */}
      <div className="mt-6" data-error={!!errors.description}>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description détaillée <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-2.5 rounded-lg border ${errors.description ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white shadow-sm`}
          placeholder="Décrivez l'état du livre, ses particularités, etc."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
        )}
      </div>
    </div>
  );
}