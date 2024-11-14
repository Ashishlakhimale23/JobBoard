import { ShareModalState } from "@/store/atom"
import {Twitter,MessageCircle,X} from "lucide-react"
import { useSetRecoilState } from "recoil"

export function ShareModal({CompanyName,JobTitle}:{CompanyName:string,JobTitle:string}){
    const setShareModalState = useSetRecoilState(ShareModalState)
    const ShareOnWhatsApp = ()=>{
        const input = encodeURIComponent(`Check out this job posting :${JobTitle} at ${CompanyName} -${window.location.href}`)
        window.open(`https://wa.me/?text=${input}`, '_blank');
    }
    const ShareOnTwitter= ()=>{
        const input = encodeURIComponent(`Check out this job posting :${JobTitle} at ${CompanyName}`)
        const url = encodeURIComponent(window.location.href)
        window.open(`https://twitter.com/intent/tweet?text=${input}&url=${url}`, '_blank');
    } 
    return (
        <>
        <div className="w-full max-w-80 bg-zinc-900 rounded-md">
            <div className="text-white p-4 space-y-4">
                <div className="flex items-center justify-between">
                <span className="font-semibold">Share</span>
                <button onClick={()=>{
                    setShareModalState(false)
                }}>
                    <X size={18}/>
                </button>
                </div>
                
                <button className="w-full flex gap-2 items-center rounded-md px-3 py-2 bg-zinc-700/50"
                onClick={ShareOnTwitter}
                >
                    <Twitter size={16}/>
                    <span>Share on Twitter</span>
                </button>
                <button className="w-full flex gap-2 items-center px-3 py-2 bg-zinc-700/50 rounded-md" 
                onClick={ShareOnWhatsApp}
                >
                    <MessageCircle size={16}/>
                    <span>Share on WhatsApp</span>
                </button>

            </div>
        </div>
        </>
    )
}