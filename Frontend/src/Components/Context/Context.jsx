import { createContext, useState } from "react";

export const NotesContext = createContext();

const NotesContextProvider = (props)=>{

    const [token,setToken] = useState(false);

 const value={
       token,setToken
    }

    return(
        <NotesContext.Provider value={value}>
            {props.children}
        </NotesContext.Provider>
    )

}

export default NotesContextProvider;