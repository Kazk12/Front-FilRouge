import useBookForm from "@/hooks/useBookForm";
import FormHeader from "./FormHeader";
import FormNotifications from "./FormNotifications";
import BookInfoSection from "./BookInfoSection";
import BookImageSection from "./BookImageSection";
import BookCategoriesSection from "./BookCategoriesSection";
import FormActions from "./FormActions";

export default function BookFormWrapper() {
  const {
    formData,
    imagePreview,
    errors,
    isSubmitting,
    submitSuccess,
    fileInputRef,
    handleChange,
    handleCategoryChange,
    handleImageChange,
    handleRemoveImage,
    handleSubmit
  } = useBookForm();

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FormHeader />
        
        <FormNotifications 
          submitSuccess={submitSuccess} 
          errors={errors}
        />

        <form onSubmit={handleSubmit} className="space-y-8">
          <BookInfoSection
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
          
          <BookImageSection
            formData={formData}
            errors={errors}
            imagePreview={imagePreview}
            fileInputRef={fileInputRef}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleRemoveImage}
          />
          
          <BookCategoriesSection
            formData={formData}
            errors={errors}
            handleCategoryChange={handleCategoryChange}
          />
          
          <FormActions isSubmitting={isSubmitting} />
        </form>
      </div>
    </div>
  );
}