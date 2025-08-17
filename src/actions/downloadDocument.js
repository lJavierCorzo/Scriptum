import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../config';

export const downloadDocument = createAsyncThunk(
    'documents/download',
    async ({ uuid, token }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}documentos/descargar/${uuid}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.blob(); // Si esperas un PDF o archivo binario
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
}
}
);