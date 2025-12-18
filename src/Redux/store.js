import { configureStore } from '@reduxjs/toolkit';
import Actions from './Reducer/Actions';
import FetchApi from './Reducer/FetchApi';

export const store = configureStore({
    reducer: {
        FetchApi: FetchApi,
        Actions: Actions,
    },
});
