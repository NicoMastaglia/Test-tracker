import AppLayout from "../../Components/layout/AppLayout"
import Header from "../../Components/layout/Header"
import { useAuthContext } from "@/context/Auth/AuthContext"
import { useState,useEffect } from "react"
import SettingsProfile from "@/Components/features/settings/SettingsProfile"
import SettingsSecurity from "@/Components/features/settings/SettingsSecurity"
import SettingsUserSummary from "@/Components/features/settings/SettingsUserSummary"
import {useUserContext} from "@/context/User/UserContext"
import {toast} from "sonner"
import { isEmailValid } from "@/utils/helpers/validators"
const Settings = () => {

    const {user} = useAuthContext()
    const {updateMyProfile,changeMyPassword} = useUserContext()

    const [profileData, setProfileData] = useState({
        nome: user.name || '',
        cognome: user.surname || '',
        email: user.email || '',
        
        
        })

    const [securityData, setSecurityData] = useState({
        Oldpassword: '',
        Newpassword: '',
        confirmPassword: '',
    })

    useEffect(() => {
        setProfileData({
            nome: user.name || '',
            cognome: user.surname || '',
            email: user.email || '',
        })
        // fetchCurrentUser()
        
    
    
    },[user])

   

    

   // 
  const handleChange = (field, value) => {
        switch (field) {
            case 'nome':
                setProfileData(prev => ({ ...prev, nome: value }))
                break
            case 'cognome':
                setProfileData(prev => ({ ...prev, cognome: value }))
                break
            case 'email':
                setProfileData(prev => ({ ...prev, email: value }))
                break
            case 'Oldpassword':
                setSecurityData(prev => ({ ...prev, Oldpassword: value }))
                break
            case 'Newpassword':
                setSecurityData(prev => ({ ...prev, Newpassword: value }))
                break
            case 'confirmPassword':
                setSecurityData(prev => ({ ...prev, confirmPassword: value }))
                break
            default:
                break
        }
    }

    const handleUpdateProfile = async () =>{
              if (profileData.nome.trim() === '' || profileData.cognome.trim() === '' || profileData.email.trim() === '') {
            toast.error("Tutti i campi del profilo sono obbligatori")
            return
        }

        if (!isEmailValid(profileData.email)) {
            toast.error("Indirizzo email non valido")
            return
        }

        try{
            await updateMyProfile(profileData)
            toast.success("Profilo aggiornato con successo")
    
        }
        catch(error){
            const message = error.response?.data?.message || error.message

            if (message === "Email already in use") {
                toast.error("L'email inserita è già in uso, scegli un'email diversa")
                return
            }
            console.error("Errore durante l'aggiornamento del profilo:",error)
            toast.error("Errore durante l'aggiornamento del profilo: " + error.message)
        }
    }

    const handleUpdatePassword = async () => {
        
        const {Oldpassword, Newpassword, confirmPassword} = securityData

       

       
        if (!Oldpassword || !Newpassword || !confirmPassword) {
            toast.error("Tutti i campi sono obbligatori")
            return
        }
         if (Newpassword !== confirmPassword) {
            toast.error("La nuova password e la conferma non corrispondono")
            return
        }


        try{
            await changeMyPassword(Oldpassword, Newpassword)

            toast.success("Password aggiornata con successo")
            setSecurityData({
                Oldpassword: '',
                Newpassword: '',
                confirmPassword: '',
            })
        }
        catch(error){
            console.error("Errore durante l'aggiornamento della password:",error)
          toast.error("Errore: " + (error.response?.data?.message || error.message))
        }
    

    }
    


    return (

        <AppLayout title="Impostazioni Account" description="Gestisci le impostazioni del tuo account, come nome, email e password."
        hideHeader={true}>
            <Header page="settings" user={user} />
           <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-6">

            <SettingsUserSummary user={user} />

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <SettingsProfile profileData={profileData} handleSave={handleUpdateProfile} handleChange={handleChange} />
              <SettingsSecurity
               handleUpdatePassword={
handleUpdatePassword} handleChange={handleChange} securityData={securityData
              } />
        </div>

             </div>
            
        </AppLayout>
       
    )

}

export default Settings