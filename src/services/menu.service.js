import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../config";
import { parseStringPromise } from "xml2js";

// Función para decodificar entidades HTML
function decodeHtmlEntities(text) {
  const txt = typeof document !== "undefined" ? document.createElement("textarea") : null;
  if (!txt) return text; // En caso de no estar en navegador
  txt.innerHTML = text;
  return txt.value;
}

export const menuApi = createApi({
  reducerPath: "menuApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    findMenu: build.query({
      query: (user) => ({
        url: `/tokens/xml/navigation`,
        method: "GET",
        params: {
          user: user,
        },
        responseHandler: (response) => response.text(), // Obtener la respuesta en texto
      }),
transformResponse: async (responseText) => {
  const decodedResponse = decodeHtmlEntities(responseText);
  console.log("XML crudo recibido:", decodedResponse);  // Verifica si recibes el XML esperado

  const options = {
    strict: false,
    normalizeTags: true,
    trim: true,
    explicitArray: false,
  };

  try {
    const json = await parseStringPromise(decodedResponse, options);
    console.log("JSON resultante:", json); // Verifica si el XML se convierte correctamente
    return json; // Retorna el JSON convertido
  } catch (error) {
    console.error("Error al convertir el XML:", error);
    return {};  // Retorna un objeto vacío en caso de error
  }
},

    }),
  }),
});

export const {
  useFindMenuQuery,
} = menuApi;
