import RegisterForm from "@/components/features/auth/RegisterForm";

export const metadata = {
  title: "Inscription - Librairie d'occasion",
  description: "Créez votre compte pour acheter et vendre des livres d'occasion",
};

export default function InscriptionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <RegisterForm />
      </div>
    </div>
  );
}