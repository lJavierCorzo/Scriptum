import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.REACT_APP_API_BASE_URL,
        prepareHeaders: (headers, {getState}) => {
            const token = getState().auth.userInfo.token;
            if(token){
                headers.set('authorization', `Bearer ${token}`)
                return headers;
            }
        },
    }),
    endpoints: (build) => ({
        getDetails: build.query({
            query: () => ({
                url: 'perfil',
                method: 'GET',
            }),
        }),
    }),
});

export const {useGetDetailsQuery} = authApi;