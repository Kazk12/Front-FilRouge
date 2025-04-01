"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookAnnounce, conditionBadge } from "@/types/myBooks";

interface AnnounceCardProps {
  announce: BookAnnounce;
}

const AnnounceCard = ({ announce }: AnnounceCardProps) => {
  const statusClasses = {
    active: "bg-green-100 text-green-800 border border-green-200",
    pending: "bg-amber-100 text-amber-800 border border-amber-200",
    expired: "bg-red-100 text-red-800 border border-red-200",
  };

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col h-full group">
      {/* Badge de statut en position absolue */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            statusClasses[announce.status]
          } shadow-sm`}
        >
          {announce.status === "active" && "Active"}
          {announce.status === "pending" && "En attente"}
          {announce.status === "expired" && "Expirée"}
        </span>
      </div>

      {/* Image avec overlay au survol */}
      <div className="relative h-56 w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <Image
          src={announce.imageUrl}
          alt={`Couverture de ${announce.title}`}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">{announce.title}</h3>
          <span className="font-medium text-lg text-indigo-700 dark:text-indigo-400">{announce.price.toFixed(2)} €</span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">par {announce.author}</p>
        
        <div className="flex flex-wrap gap-2 my-2">
          <span className={`text-xs px-2 py-1 rounded-full ${conditionBadge[announce.condition]}`}>
            {announce.condition}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
            {announce.publicationYear}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">
            {announce.category}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{announce.description}</p>
        
        <div className="border-t pt-3 mt-auto border-gray-100 dark:border-gray-700">
          <div className="flex justify-end items-center mb-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Posté le {new Date(announce.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <Link
              href={`/announces/${announce.id}/edit`}
              className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg flex-1 text-center transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium"
            >
              Modifier
            </Link>
            
            {!showConfirmDelete ? (
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="text-sm bg-white border border-red-500 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg flex-1 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-gray-800 dark:hover:bg-gray-700 font-medium"
              >
                Supprimer
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex-1 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 animate-pulse font-medium"
              >
                Confirmer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnounceCard;