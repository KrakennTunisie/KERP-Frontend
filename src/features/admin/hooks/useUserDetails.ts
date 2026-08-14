import { appToast } from "@/shared/lib/toast";
import { usersAPI } from "../services/api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { useEffect, useState } from "react";
import { UserDetails } from "../models/user";
import { useRouter } from "next/navigation";

export type useUserDetailsProps = {
    idUser: string
} 

export default function useUserDetails({idUser}:useUserDetailsProps){
    const [user, setUser]= useState<UserDetails | null>(null)
    const [loading, setLoading]=useState(true)
    const [updateStatusOpen, setUpdateStatusOpen]=useState(false)
    const [activeOpen, setActiveOpen]=useState(false)
    const [sendOpen, setSendOpen]=useState(false)
    
    const router = useRouter()

    
    const totalActions = 0;

    const getUserById = async ()=>{
          if(!idUser){
            appToast.error("Id utilisateur non existante")
            return;
          }
            console.log('userId', idUser)
          try {
            const response = await usersAPI.getUserDetails(idUser)
            setUser(response)
          } catch (error) {
            appToast.error("Erreur fetch user", getApiErrorMessage(error))
          }
          finally{
            setLoading(false)
          }
        }
    useEffect(()=>{
        getUserById()
    },[idUser])


    return{
        user, 
        totalActions,
        loading,
        router,
        updateStatusOpen, setUpdateStatusOpen,
        activeOpen, setActiveOpen,
        sendOpen, setSendOpen,
        getUserById
    }
}