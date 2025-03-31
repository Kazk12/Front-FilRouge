import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Connexion - Librairie d'occasion",
  description: "Connectez-vous à votre compte pour accéder à nos services",
};

export default function ConnexionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <LoginForm />
      </div>
    </div>
  );
}