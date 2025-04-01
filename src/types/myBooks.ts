export type AnnounceStatus = "active" | "pending" | "expired";
export type BookCondition = "neuf" | "très bon" | "bon" | "acceptable" | "usé";

export interface BookAnnounce {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
  status: AnnounceStatus;
  condition: BookCondition;
  publicationYear: number;
  category: string;
}

// Badges pour l'état des livres avec code couleur
export const conditionBadge = {
  "neuf": "bg-emerald-100 text-emerald-800 border border-emerald-200",
  "très bon": "bg-green-100 text-green-800 border border-green-200",
  "bon": "bg-blue-100 text-blue-800 border border-blue-200",
  "acceptable": "bg-amber-100 text-amber-800 border border-amber-200",
  "usé": "bg-orange-100 text-orange-800 border border-orange-200"
};

// Données fictives pour les annonces de livres de l'utilisateur
export const mockBookAnnounces: BookAnnounce[] = [
  {
    id: "1",
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    description: "Édition illustrée, couverture rigide en très bon état. Quelques annotations au crayon à papier.",
    price: 12.50,
    imageUrl: "/images/placeholder.jpg",
    createdAt: "2023-05-15",
    status: "active",
    condition: "très bon",
    publicationYear: 2018,
    category: "Littérature jeunesse",
  },
  // Ajoutez d'autres exemples si nécessaire
];