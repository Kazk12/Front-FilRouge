interface ProfessionalInfoProps {
    professionalDetails?: {
      companyName: string;
      companyAdress: string;
    };
  }
  
  export default function ProfessionalInfo({ professionalDetails }: ProfessionalInfoProps) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Informations professionnelles</h2>
        
        {professionalDetails ? (
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Nom de l'entreprise</dt>
              <dd className="mt-1 text-lg text-gray-900 dark:text-white">{professionalDetails.companyName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Adresse professionnelle</dt>
              <dd className="mt-1 text-lg text-gray-900 dark:text-white">{professionalDetails.companyAdress}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            Aucune information professionnelle disponible.
          </p>
        )}
      </div>
    );
  }