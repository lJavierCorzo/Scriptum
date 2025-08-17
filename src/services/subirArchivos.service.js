import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from '../config';

export const subirArchivosApi = createApi({
  reducerPath: "subirArchivosApi",
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
    // obtenerTreeData: build.query({
    //   query: () => ({
    //     url: `/cuadro-general/tree/json/data/1`,
    //     method: "GET",
    //   }),
    // }),
    findDocument: build.query({
      query: ({ idArchivo, id }) => ({
        url: `documentos/areas/json/${idArchivo}/${id}`,
        method: "GET",
      }),
    }),
    eventosDocumento: build.query({
      query: (id) => ({
        url: `documentos/json/${id}/eventos`,
        method: "GET",
      }),
    }),

    // tiposPermisos: build.query({
    //   query: () => ({
    //     url: `tipos/permisos/json/data`,
    //     method: "GET",
    //   }),
    // }),
    // usuarios: build.query({
    //   query: () => ({
    //     url: `usuarios/json/data`,
    //     method: "GET",
    //   }),
    // }),
    // roles: build.query({
    //   query: () => ({
    //     url: `roles/json/data`,
    //     method: "GET",
    //   }),
    // }),
    permisos: build.query({
      query: (id) => ({
        url: `documentos/json/${id}/permisos`,
        method: "GET",
      }),
    }),

    aperturarExpediente: build.mutation({
      query: ({ documento, idNivel, asunto, fechaApertura }) => ({
        url: `expedientes/direccion-general/aperturar`,
        method: "POST",
        params: {
          documento: documento,
          idNivel: idNivel,
          asunto: asunto,
          fechaApertura: fechaApertura,
        },
      }),
    }),

    cerrarExpediente: build.mutation({
      query: ({ idDocumento, fechaCierre }) => ({
        url: `expedientes/${idDocumento}/cerrar`,  // Asegúrate de que idDocumento no sea undefined
        method: "POST",
        params: {
          fechaCierre: fechaCierre,
        },
      }),
    }),

    renombrarDocumento: build.mutation({
      query: ({ idDocumento, documento, extension }) => ({
        url: `/documentos/save/renombrar`,
        method: "POST",
        params: {
          documento: documento,
          idDocumento: idDocumento,
          extension: extension,
        },
      }),
    }),

    eliminarDocumento: build.mutation({
      query: ({ idDocumento }) => ({
        url: `/documentos/delete`,
        method: "POST",
        params: {
          idDocumento: idDocumento,
        },
      }),
    }),

    cargarDocumento: build.mutation({
      query: ({ idDocumentoPadre, documento }) => {
        const formData = new FormData();
        formData.append("file", documento);

        return {
          url: `explorador/dir-obras-publicas/cargar`,
          method: "POST",
          params: {
            idDocumentoPadre,
            mode: "html5",
          },
          body: formData,
        };
      },
    }),
  }),
});
export const {
  //useObtenerTreeDataQuery,
  useFindDocumentQuery,
  useEventosDocumentoQuery,
  useAperturarExpedienteMutation,
  useRenombrarDocumentoMutation,
  useEliminarDocumentoMutation,
  useCargarDocumentoMutation,
  useTiposPermisosQuery,
  useRolesQuery,
  useUsuariosQuery,
  usePermisosQuery,
  useCerrarExpedienteMutation,
} = subirArchivosApi;
