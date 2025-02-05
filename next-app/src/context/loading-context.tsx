"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  JSX,
  Dispatch,
  SetStateAction,
} from "react";

// Define the shape of the context
interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

// Create the Loadingentication context
export const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);

interface LoadingContextProviderProps {
  children: ReactNode;
}

export function LoadingContextProvider({
  children,
}: LoadingContextProviderProps): JSX.Element {
  // Set up state to track the Loadingenticated user and loading status
  const [isLoading, setIsLoading] = useState(false);

  // Provide the Loadingentication context to child components
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within an LoadingContextProvider");
  }
  return context;
}
