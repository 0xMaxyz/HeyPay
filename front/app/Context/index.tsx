import type { ReactNode } from "react";
import { useEffect, createContext, useState, useContext } from "react";
import { decodeJwt } from "jose";
interface JWTObject{
  email:string,
  email_verified:boolean,
  nonce:string
}
export interface UserContextProps {
  setEmail:React.Dispatch<React.SetStateAction<string>>;
  email:string;
  jwt:string;
  setJwt:React.Dispatch<React.SetStateAction<string>>;
}

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps,
);
export const useUserContext = () => {
  return useContext(UserContext);
}

export function UserContextProvider({
  children
}: {
  children: ReactNode;
}): JSX.Element {
  const [email,setEmail] = useState("");
  const [jwt,setJwt] = useState("")

  useEffect(() => {
    if(localStorage.getItem("JWT")){
      loadJwt(localStorage.getItem("JWT")!);
    }
  }, []);
  useEffect(() => {
    if(jwt)
      SaveJwt(jwt);
    else{
      setEmail("");
      localStorage.setItem("JWT",jwt);
    }
  }, [jwt]);
  const SaveJwt = async(jwt:string)=>{
    try {
      const decode = decodeJwt(jwt || "");
      const decodeObject = decode as unknown as JWTObject;
      const email = decodeObject.email;
      localStorage.setItem("JWT",jwt);
      console.log("Email:",email);
      setEmail(email);
    } catch (error) {
      console.log("Error Parsing JWT:",error)
    }
  }
  const loadJwt = async(jwt:string)=>{
    try {
      const decode = decodeJwt(jwt || "");
      const decodeObject = decode as unknown as JWTObject;
      const email = decodeObject.email;
      console.log("Email:",email);
      setEmail(email);
      setJwt(jwt);
    } catch (error) {
      console.log("Error Parsing JWT:",error)
    }

  }
  
  return (
    <UserContext.Provider
      value={{
        setEmail,
        email,
        setJwt,
        jwt
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
