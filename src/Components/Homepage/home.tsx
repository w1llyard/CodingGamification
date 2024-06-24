"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { doSignInWithGoogle } from "@/firebaseConfig/auth";
import { AuthError, User } from "firebase/auth";
import { Toaster, toast } from "sonner";
import { useAuth } from "@/contexts/authContext";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig/firebase";
import Loading from "../Loader/logos";

export default function Home() {
  const router = useRouter();
  const auth = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);

  setTimeout(() => {
    setLoading(false);
  }, 1500);

  const handleGoogleSignIn = async () => {
    setIsSigning(true);
    try {
      const result = await doSignInWithGoogle();
      const user: User = result.user;
      const promiseResult = await saveUser(user);
      if (promiseResult) router.push("/Game");
    } catch (error) {
      setIsSigning(false);
      if ((error as AuthError).code === "auth/popup-closed-by-user") {
        toast.error("Popup was closed by user");
      } else if ((error as AuthError).code === "auth/user-cancelled") {
        toast.error("User refused to grant permission");
      } else {
        toast.error((error as AuthError).message);
      }
    } finally {
      setIsSigning(false);
    }
  };

  async function saveUser(user: User) {
    const savePromise = new Promise(async (resolve, reject) => {
      try {
        const userEmail = user.email as string;
        const docRef = doc(db, "Users", userEmail);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          const userCollection = collection(db, "Users");
          const userDoc = doc(userCollection, userEmail);
          await setDoc(userDoc, {
            name: user.displayName,
            email: userEmail,
            avatar:
              user.photoURL ||
              "https://images.saymedia-content.com/.image/c_limit%2Ccs_srgb%2Cq_auto:eco%2Cw_276/MTc2NDY0MTkxMzMzNDEwNzc4/skin-minecraft-characters-successfully-after-reading-this-minecraft-skin-info-guide.webp",
            xp: 0,
            status: "active",
            lowCodeLevel: 0,
            movedCharacter: false,
            chestOpened: false,
            lizardKilled: false,
          });
        }
        resolve({ name: userEmail });
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(savePromise, {
      loading: "Loading...",
      success: () => {
        return `Success`;
      },
      error: "Failed to save user data, please try again",
    });

    return savePromise;
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // You can adjust this breakpoint as needed
    };

    handleResize(); // Check initial screen size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (loading) return <Loading />;

  return (
    <main>
      <Toaster position="top-center" richColors closeButton />
      <div className="navbar custom-navbar">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn ">
              <Image
                src="/Icons/hamburgerIcon.png"
                alt="hamburger"
                width={40}
                height={40}
                className="inline-block w-7 h-7"
              />
            </div>
          </div>
          <a className="btn btn-ghost text-xl">CODE MANIACS</a>
        </div>

        <div className="navbar-end">
          <div className="button blue">
            <button
              onClick={() => {
                if (auth.userLoggedIn) {
                  router.push("/Game");
                } else {
                  handleGoogleSignIn();
                }
              }}
            >
              {auth.userLoggedIn
                ? "Dashboard"
                : isSigning
                ? "Signing in..."
                : " SIGN IN"}
            </button>
          </div>
        </div>
      </div>

      <div className="h-screen overflow-hidden">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
          <div className="flex h-screen items-center justify-center md:col-span-2">
            <div
              className={`artboard ${
                isMobile ? "phone-2" : "artboard-horizontal phone-3"
              } custom-artboard bg-artboardColor bg-art-bg bg-cover bg-center`}
            >
              <div className="flex flex-col justify-around items-center mb-10 h-full">
                <Image
                  src="/LOGO.png"
                  alt="Logo"
                  width={200}
                  height={150}
                  className="inline-block"
                />
                <div className="flex flex-col items-center">
                  <h1 className="text-2xl font-bold text-white text-center">
                    Learn to Code,
                  </h1>
                  <h1 className="text-xl font-bold text-white text-center">
                    Free Adventurous Learning For All
                  </h1>
                </div>
                <div className="px-4">
                  <div className="button blue flex">
                    <button
                      onClick={() => {
                        if (auth.userLoggedIn) {
                          router.push("/Game");
                        } else {
                          handleGoogleSignIn();
                        }
                      }}
                    >
                      {auth.userLoggedIn
                        ? "Dashboard"
                        : isSigning
                        ? "Signing in..."
                        : " SIGN IN"}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-white">
                    By playing CodeManiacs you are agreeing to
                  </p>
                  <h1 className="text-sm text-white">
                    {" "}
                    our privacy policy and terms and conditions
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
