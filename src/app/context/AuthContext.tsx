"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/app/utils/constants";
import { UserModel } from "@/app/models";
import { userExtras } from "@/app/models/user.model";

type AuthContextType = {
  user: UserModel | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);
const publicRoutes = ["/login", "/signup", "/VerifyCodePage", "/not-found"];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  axios.defaults.baseURL = BASE_URL;

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common['Authorization'];
    router.push("/login");
  }, [router]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await axios.post('user/login/', {
        email,
        password,
      });

      const { data } = response.data;
      const accessToken = data.access;

      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setToken(accessToken);
      localStorage.setItem("authToken", accessToken);

      const userResponse = await axios.get('user/profile/'); 
      const userData: UserModel = await userResponse.data['data'];

      setUser(userExtras(userData));
      router.push("/");
    }
    catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao fazer login"
      );
    }
  }, [router]);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("authToken");
      
      if (storedToken) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          const userResponse = await axios.get('user/profile/');
          
          setUser(userResponse.data['data']);
          setToken(storedToken);
        } catch (error) {
          console.error("Erro na verificação do token:", error);
          logout();
        }
      } else {
        delete axios.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    };

    initializeAuth();
  }, [logout]);

  useEffect(() => {
    if (!loading) {
      const isPublicPath = publicRoutes.includes(pathname);
      
      if(user?.role == 'ADMIN'){
        console.log("Usuário é ADMIN")
      }
      if(user?.role == 'MODERATOR'){
        console.log("Usuário é MODERATOR")
      }
      if(user?.role == 'COMMON'){
        console.log("Usuário é COMMON")
      }

      if (!user && !isPublicPath) {
        router.push("/login");
      }
      
      if (user && isPublicPath) {
        router.push("/");
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};