import { ReactNode } from "react";


export function Container ({children} : {children:ReactNode}) {
    return(
        
        <body className="bg-white">
            <div className="w-full max-w-7xl max-h-screen p-4 mx-auto rounded-md">
                {children}
            </div>
        </body>

    )
}