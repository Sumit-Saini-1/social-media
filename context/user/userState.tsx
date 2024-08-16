import { useState } from "react";
import UserContext from "./userContext";

const UserState = (props:any) => {
    const [username, setUsername] = useState<string>("");
    const [profilePic, setProfilePic] = useState<string>("");
    function Logout() {
        setUsername("");
        setProfilePic("");
    }

    return (
        <UserContext.Provider value={{ username, setUsername, profilePic, setProfilePic, Logout }}>
            {
                props.children
            }
        </UserContext.Provider>
    )
}


export default UserState;