import { createSlice } from '@reduxjs/toolkit';
export const langSlice = createSlice({
    name: 'lang',
    initialState: {
        value: 'fr'
    },
    reducers: {
        setLang: (state, action) => {
            state.value = action.payload;
        }
    }
});
export const { setLang } = langSlice.actions;
export default langSlice.reducer;
