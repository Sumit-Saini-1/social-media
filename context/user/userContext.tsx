import { createContext } from "react";

interface UserContextType {
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    profilePic: string;
    setProfilePic: React.Dispatch<React.SetStateAction<string>>;
    Logout: () => void;
}

const UserContext: React.Context<UserContextType> = createContext({} as UserContextType);

export default UserContext;