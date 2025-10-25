// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../api/firebase';

/**
 * OK Equipo, este es el "cerebro" de la autenticación.
 * Revertimos el refactor de 'hooks'. Todo vuelve a estar aquí.
 * Define el Contexto, el Proveedor (Provider) y el Hook (useAuth).
 */

// 1. Definimos la "forma" de nuestro contexto
interface AuthContextType {
  currentUser: User | null;
  userRole: 'patient' | 'clinician' | null;
  loading: boolean;
}

// 2. Creamos el Contexto
// El 'defaultAuthContext' de 'types.ts' ya no es necesario
const AuthContext = createContext<AuthContextType>({ currentUser: null, userRole: null, loading: true });

// 3. Creamos el Hook (esto es lo que consumen las páginas)
// Esto es lo que estaba en el archivo 'hooks' que borramos
export const useAuth = () => useContext(AuthContext);

// 4. Creamos el Proveedor (este envuelve a toda la <App>)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'patient' | 'clinician' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged es el oyente de Firebase.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Si hay usuario, vamos a Firestore a buscar su 'rol'
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        } else {
          // Si el usuario existe en Auth pero no en DB (raro), no tiene rol
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
    
  // 👇 ¡FIX CRÍTICO!
  // Esta era la línea que causaba el bucle infinito.
  // Le faltaba el '[]' al final.
  }, []); 

  const value = { currentUser, userRole, loading };

  return (
    <AuthContext.Provider value={value}>
      {/* No mostramos la app hasta que termine de cargar el usuario */}
      {!loading && children}
    </AuthContext.Provider>
  );
};