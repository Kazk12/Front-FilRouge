import { ChangeEvent } from "react";
import { FormState, FormErrors } from "@/types/createMyBooks";
import { bookCategories } from "@/lib/constants/constants";

type BookCategoriesSectionProps = {
  formData: FormState;
  errors: FormErrors;
  handleCategoryChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function BookCategoriesSection({ 
  formData, 
  errors, 
  handleCategoryChange 
}: BookCategoriesSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Catégories
      </h2>

      <div data-error={!!errors.categories}>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Sélectionnez au moins une catégorie <span className="text-red-500">*</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {bookCategories.map((category) => (
            <div key={category} className="flex items-center">
              <input
                id={`category-${category}`}
                name="categories"
                type="checkbox"
                value={category}
                checked={formData.categories.includes(category)}
                onChange={handleCategoryChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {category}
              </label>
            </div>
          ))}
        </div>
        {errors.categories && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.categories}</p>
        )}
      </div>
    </div>
  );
}