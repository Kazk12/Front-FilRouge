import { FormState, FormErrors } from "@/types/createMyBooks";
import { ChangeEvent } from "react";

interface BookCategoriesSectionProps {
  formData: FormState;
  errors: FormErrors;
  handleCategoryChange: (e: ChangeEvent<HTMLInputElement>) => void;
  categoryOptions: { id: string; name: string }[];
  isLoadingOptions: boolean;
}

export default function BookCategoriesSection({
  formData,
  errors,
  handleCategoryChange,
  categoryOptions,
  isLoadingOptions,
}: BookCategoriesSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Catégories
      </h2>

      <div data-error={!!errors.categories}>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Sélectionnez au moins une catégorie{" "}
          <span className="text-red-500">*</span>
        </div>

        {isLoadingOptions ? (
          <div className="flex justify-center py-4">
            <div className="animate-pulse text-gray-500 dark:text-gray-400">
              Chargement des catégories...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categoryOptions.map((category) => (
              <div key={`cat-${category.id}`} className="flex items-center">
                <input
                  id={`category-${category.id}`}
                  name="categories"
                  type="checkbox"
                  value={category.id}
                  checked={formData.categories.includes(category.id)}
                  onChange={handleCategoryChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        )}

        {errors.categories && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.categories}
          </p>
        )}
      </div>
    </div>
  );
}
