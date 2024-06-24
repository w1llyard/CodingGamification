import { auth, db } from "@/firebaseConfig/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useAuth } from "./authContext";

interface UserData {
  name: string | null;
  email: string | null;
  profilePic: string | null;
  journeyStarted: boolean;
  xp: number;
  status: string | null;
}

const initialUserData: UserData = {
  name: null,
  email: null,
  profilePic: null,
  journeyStarted: false,
  xp: 0,
  status: null,
};

const UserContext = createContext<UserData>(initialUserData);

export const useUserContext = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const auth = useAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const docRef = doc(db, "Users", user.email as string);

      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        try {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data) {
              setUserData((prevUserData) => ({
                ...prevUserData,
                journeyStarted: data.journeyStarted,
                xp: data.xp,
                status: data.status,
              }));
            }
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error retrieving user data:", error);
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        name: user.displayName,
        email: user.email,
        profilePic: user.photoURL,
      }));
    }
  }, [user]);

  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
}
