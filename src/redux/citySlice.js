import { createSlice } from '@reduxjs/toolkit';
export const citySlice = createSlice({
    name: 'cityName',
    initialState: {
        value: null
    },
    reducers: {
        setCity: (state, action) => {
            state.value = action.payload;
        }
    }
});
export const { setCity } = citySlice.actions;
export default citySlice.reducer;
