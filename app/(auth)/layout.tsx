import React from "react";

//This Layout will be inherited by all the children pages in the Auth
const AuthLayout = ({ children }: { children: React.ReactNode; }) => {
    return (
        <div className="flex items-center justify-center h-full">
            {children}
        </div>
    );
}

export default AuthLayout;