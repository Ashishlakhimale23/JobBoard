import { ConformationModalState } from "@/store/atom"
import { useEffect,useRef } from "react"
import { useRecoilState } from "recoil"
import { api } from "@/utils/AxioApi"
import { CustomAxiosError } from "@/types/type"
import {toast} from "react-hot-toast"
export function ConformationModal({joblink,updateShowButton}:{joblink:string,updateShowButton:()=>void}){
  console.log(joblink)
    const [conformationmodal,setConformationmodal] = useRecoilState(ConformationModalState)
    const conformationRef = useRef<HTMLDivElement>(null)
    const ButtonRef = useRef<HTMLButtonElement>(null)
    const handleConfirmation=async()=>{
      toast.loading('Applying...',{id:"applying"})
      try{
          const response = await api.post('/applicant/sumbitapplication',{joblink:joblink})
          if(response.status===200){
            setConformationmodal(false);
            updateShowButton()
            return toast.success("Applied")
          }
          return toast.error("Internal server error");
      }catch(error){
      if (error) {
        const axiosError = error as CustomAxiosError;

        if (
          axiosError.response &&
          axiosError.response.data &&
          axiosError.response.data.message
        ) {
          return toast.error(axiosError.response.data.message);
        } else {
          return toast.error("An unexpected error occurred");
        }
      }
    }finally{
      toast.dismiss("applying")
    }
  }
    useEffect(()=>{
      if(conformationmodal){
        document.body.addEventListener("mousedown",UnselectTheDeleteSpace)
        if(ButtonRef.current){
        ButtonRef.current.disabled =false 
        ButtonRef.current.innerText = "Confirm"
        }
      }else{
        document.body.removeEventListener("mousedown",UnselectTheDeleteSpace)
      }
    },[conformationmodal])

    function UnselectTheDeleteSpace(e:MouseEvent){
      if(e && conformationRef.current && !conformationRef.current.contains(e.target as Node) ){
        setConformationmodal(false)
        if(ButtonRef.current){
        ButtonRef.current.disabled =false 
        ButtonRef.current.innerText = "Confirm"
        }
      }
    }
    return(
<>
    <div className={` max-w-96 bg-white space-y-4 rounded-md px-3 py-6 `} ref={conformationRef}>
          <div className="space-y-2">
            <p className="text-center text-2xl font-semibold">Confirmation</p>
            <p className="text-gray-500 text-center">
              Before applying please check your profile because it will be treated as your resume. 
            </p>
          </div>
          <div className="space-y-2">
            <div>
            <button className="w-full bg-black text-white py-2 rounded-md" disabled={false} ref={ButtonRef} onClick={handleConfirmation}>Confirm</button>
            </div>
          </div>
        </div>
        
      </>

    )

}