// src/app/context/FilterContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface FilterState {
  onlyQRCode: boolean;
  showProductDetails: boolean;
  showUserInfo: boolean;
  showCompanyInfo: boolean;
  removeImages: boolean; // nova propriedade
}

interface FilterContextProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>({
    onlyQRCode: false,
    showProductDetails: true,
    showUserInfo: true,
    showCompanyInfo: true,
    removeImages: false,
  });

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
