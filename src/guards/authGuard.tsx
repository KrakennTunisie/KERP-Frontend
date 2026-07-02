"use client";

import PageLoader from "@/shared/components/ui/pageLoader";
import { useAuthStore } from "@/store/authStore";
import { useRouter }
from "next/navigation";

import { useEffect }
from "react";


export default function AuthGuard({

 children

}:{

 children:React.ReactNode

}){


 const router = useRouter();

 const {

   loading,

   isAuthenticated

 } = useAuthStore();


 useEffect(()=>{

    if(

      !loading &&

      !isAuthenticated

    ){

       router.replace("/auth");

    }

 },[loading,isAuthenticated]);


 if(loading){

    return (<PageLoader label="Chargement..."/>)

 }

 if(!isAuthenticated){

    return null;

 }

 return children;

}