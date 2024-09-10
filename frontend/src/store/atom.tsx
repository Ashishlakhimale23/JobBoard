import {atom} from "recoil"
export const LoggedState = atom<boolean>({
   key:"LoggedState",
   default:false
})