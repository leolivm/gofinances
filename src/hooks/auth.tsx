import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import * as AuthSession from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
  loading: boolean;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}

export const AuthContext = createContext({} as IAuthContextData);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    try {
      const RESPONSE_TYPE = "token";
      const SCOPE = encodeURI("profile email");

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { type, params } = (await AuthSession.startAsync({
        authUrl,
      })) as AuthorizationResponse;

      if (type === "success") {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`
        );
        const userInfo = await response.json();

        const userLogged = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture,
        };

        setUser(userLogged);

        await AsyncStorage.setItem(
          "@GoFinances:User",
          JSON.stringify(userLogged)
        );
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  const signInWithApple = async () => {
    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credentials) {
        const name = credentials.fullName!.givenName!;
        const photo = `https://ui-avatars.com/api/?name=${name}&length=1`;

        const userLogged = {
          id: String(credentials.user),
          email: credentials.email!,
          name: credentials.fullName!.givenName!,
          photo,
        };

        setUser(userLogged);
        await AsyncStorage.setItem(
          "@GoFinances:User",
          JSON.stringify(userLogged)
        );
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  const signOut = async () => {
    setUser({} as User);
    await AsyncStorage.removeItem("@GoFinances:User");
  };

  useEffect(() => {
    const loadUserStorageData = async () => {
      const userStoraged = await AsyncStorage.getItem("@GoFinances:User");
      if (userStoraged) {
        const userLogged = JSON.parse(userStoraged) as User;
        setUser(userLogged);
      }

      setLoading(false);
    };

    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signInWithGoogle, signInWithApple, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export { AuthProvider, useAuth };
