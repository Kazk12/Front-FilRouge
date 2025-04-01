import { User } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  password?: string;
}

/**
 * Met à jour les informations d'un utilisateur
 */
export async function updateUser(userId: number, data: UpdateUserData): Promise<User> {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Non authentifié');
    }

    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/merge-patch+json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Erreur lors de la mise à jour: ${response.status}`);
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error: any) {
    console.error("Erreur dans updateUser:", error);
    throw error;
  }
}