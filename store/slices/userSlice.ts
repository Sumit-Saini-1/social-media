import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserDetails {
    id: string;
    email: string;
    name: string;
    username: string;
}

const initialState: UserDetails = {
    id: '',
    email: '',
    name: '',
    username: '',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserDetails>) => {
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.username = action.payload.username;
        },
        clearUser: (state) => {
            state.id = '';
            state.email = '';
            state.name = '';
            state.username = '';
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;