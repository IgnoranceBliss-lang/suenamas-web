// src/contexts/types.ts
import type { User } from "firebase/auth";

export interface AuthContextType {
  currentUser: User | null;
  userRole: "patient" | "clinician" | null;
  loading: boolean;
}

// Valor por defecto para el contexto
export const defaultAuthContext: AuthContextType = {
  currentUser: null,
  userRole: null,
  loading: true,
};
