"use client";

import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import AnnounceHeader from "@/components/features/books/mine/AnnounceHeader";
import AnnounceFilters from "@/components/features/books/mine/AnnouceFilters";
import AnnounceCard from "@/components/features/books/mine/AnnounceCard";
import EmptyAnnounceState from "@/components/features/books/mine/EmptyAnnounceState";
import { mockBookAnnounces, AnnounceStatus, BookCondition } from "@/types/myBooks";

const MyAnnouncesPage = () => {
  const [filter, setFilter] = useState<AnnounceStatus | "all">("all");
  const [conditionFilter, setConditionFilter] = useState<BookCondition | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

  // Filtrage des annonces
  const filteredAnnounces = mockBookAnnounces.filter((announce) => {
    const matchesStatus = filter === "all" || announce.status === filter;
    const matchesCondition = conditionFilter === "all" || announce.condition === conditionFilter;
    const matchesSearch = searchTerm === "" || 
                         announce.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         announce.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCondition && matchesSearch;
  });

  // Effet pour afficher que le filtrage est en cours
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [filter, conditionFilter, searchTerm]);

  const resetFilters = () => {
    setFilter("all");
    setConditionFilter("all");
    setSearchTerm("");
  };

  const activeFiltersCount = 
    (filter !== "all" ? 1 : 0) + 
    (conditionFilter !== "all" ? 1 : 0) + 
    (searchTerm !== "" ? 1 : 0);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[calc(100vh-8rem)]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnnounceHeader />

        <AnnounceFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filter={filter}
          setFilter={setFilter}
          conditionFilter={conditionFilter}
          setConditionFilter={setConditionFilter}
          resetFilters={resetFilters}
          activeFiltersCount={activeFiltersCount}
          filteredResultsCount={filteredAnnounces.length}
        />

        <Transition
          show={!isFiltering}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {filteredAnnounces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredAnnounces.map((announce) => (
                <AnnounceCard key={announce.id} announce={announce} />
              ))}
            </div>
          ) : (
            <EmptyAnnounceState />
          )}
        </Transition>
      </div>
    </div>
  );
};

export default MyAnnouncesPage;