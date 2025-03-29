import BookList from "@/components/home/BookList";
import Hero from "@/components/home/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accueil | Librairie d'occasion",
  description: "Découvrez des livres d'occasion à petit prix proposés par des particuliers partout en France",
};

export default async function HomePage() {
  return (
    <main>
      <Hero />
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
          Dernières annonces
        </h2>
        <BookList />
      </section>
    </main>
  );
}