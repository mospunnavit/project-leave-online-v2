import SeesionProvider from "next-auth/react"

export default ({children}) => {
    return (
      <SessionProvider>
        {children}
      </SessionProvider>
    );
  }