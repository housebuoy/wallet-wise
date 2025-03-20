declare module "@/firebaseConfig" {
    export const auth: import("firebase/auth").Auth;
    export const googleProvider: import("firebase/googleProvider").GoogleAuthProvider;
    export const githubAuthProvider : import("firebase/githubAuthProvider ").GoogleAuthProvider;
  }
  