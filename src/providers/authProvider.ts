"use client";

import { authAPI } from "@/features/auth/services/api";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";



export function AuthProvider({

 children

}:{

 children:React.ReactNode

}){

 const {

   setUser,

   setLoading

 } = useAuthStore();


 useEffect(()=>{

   const init = async ()=>{

      try{

        const user =
        await authAPI.me();

        setUser(user);

      }

      catch{

        setUser(null);

      }

      finally{

        setLoading(false);

      }

   }

   init();

 },[]);


 return children;

}