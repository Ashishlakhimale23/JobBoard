import { AxiosError,AxiosResponse } from "axios"
export interface CustomAxiosError extends AxiosError{
  response?:AxiosResponse<{message:string}>

}
