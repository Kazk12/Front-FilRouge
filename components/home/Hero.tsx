import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-900 to-indigo-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Trouvez des livres d&apos;occasion à petits prix
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Des milliers de livres d&apos;occasion proposés par des particuliers partout en France.
              Découvrez, vendez et échangez des livres en toute simplicité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/livres"
                className="px-6 py-3 bg-white text-blue-900 font-medium rounded-md hover:bg-blue-50 transition-colors"
              >
                Parcourir le catalogue
              </Link>
              <Link
                href="/inscription"
                className="px-6 py-3 bg-blue-700 font-medium rounded-md hover:bg-blue-600 transition-colors"
              >
                Commencer à vendre
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="relative h-[400px] w-[300px]">
              <Image
                src="/images/books-stack.png"
                alt="Pile de livres"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}