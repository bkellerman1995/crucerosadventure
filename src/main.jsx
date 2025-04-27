import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Home } from "./components/Home/Home.jsx";
import { ListHabitaciones } from "./components/Layout/ListHabitaciones.jsx";
import { ListBarcos } from "./components/Layout/ListBarcos.jsx";
import { ListCruceros } from "./components/Layout/ListCruceros.jsx";
import { ListReservas } from "./components/Layout/ListReservas.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PageNotFound } from "./components/Home/PageNotFound.jsx";
import { DetailHabitacion } from "./components/Layout/DetailHabitacion";
import { DetailBarco } from "./components/Layout/DetailBarco";
import { DetailCrucero } from "./components/Layout/DetailCrucero";
import { DetailReserva } from "./components/Layout/DetailReserva";
import { AdminView } from "./components/Layout/AdminView";
import { CreateBarco } from "./components/Layout/CreateBarco";
import { CreateCrucero } from "./components/Layout/CreateCrucero";
import { CreateHabitacion } from "./components/Layout/CreateHabitacion";
import { UpdateBarco } from "./components/Layout/UpdateBarco";
import { UpdateHabitacion } from "./components/Layout/UpdateHabitacion";
import { CreateReserva } from "./components/Layout/CreateReserva";
import { Facturacion} from "./components/Layout/Facturacion";
import UserProvider from "./context/usuarioContext";
// import "bootstrap/dist/css/bootstrap.min.css";

const rutas = createBrowserRouter([
  {
    element: <App />,

    //Paginas hijas a desplegar en el navegador
    children: [
      {
        //Página Home
        path: "/",
        element: <Home />,
      },

      {
        //Página No Encontrada
        path: "*",
        element: <PageNotFound />,
      },

      {
        //Página Habitaciones
        path: "/habitacion",
        element: <ListHabitaciones />,
      },

      {
        //Página Habitaciones by ID
        path: "/habitacion/:id",
        element: <DetailHabitacion />,
      },

      {
        //Página Barcos
        path: "/barco",
        element: <ListBarcos />,
      },

      {
        //Página Barcos by ID
        path: "/barco/:id",
        element: <DetailBarco />,
      },

      {
        //Página Cruceros
        path: "/crucero",
        element: <ListCruceros />,
      },

      {
        //Página Cruceros by ID
        path: "/crucero/:id",
        element: <DetailCrucero />,
      },

      {
        //Página Reservas
        path: "/reserva",
        element: <ListReservas />,
      },

      {
        //Página Cruceros by ID
        path: "/reserva/:id",
        element: <DetailReserva />,
      },

      {
        //Página create barco
        path: "/CreateBarco/",
        element: <CreateBarco />,
      },

      {
        //Página create habitacion
        path: "/CreateHabitacion/",
        element: <CreateHabitacion />,
      },

      {
        //Página AdminView
        path: "/admin",
        element: <AdminView />,
        children: [
          { path: "habitacion", element: <ListHabitaciones botonCrearActivo={true} botonEditarActivo={true}/> },
          { path: "habitacion/crear", element: <CreateHabitacion /> },
          { path: "habitacion/editar", element: <UpdateHabitacion /> },

          { path: "barco", element: <ListBarcos botonCrearActivo={true} botonEditarActivo={true} /> },
          { path: "barco/crear", element: <CreateBarco /> },
          { path: "barco/editar", element: <UpdateBarco /> },

          {
            path: "crucero",
            element: (
              <ListCruceros botonCrearActivo={true} tituloActivo={true} />
            ),
          },
          //Página create Crucero
          { path: "crucero/crear", element: <CreateCrucero /> },
        ],
      },

      {
        //Página Reservar
        path: "/reserva/crear",
        element: <CreateReserva />,
      },
      {
        //Página Facturación
        path: "/reserva/factura",
        element: <Facturacion />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={rutas} />
    </UserProvider>
  </StrictMode>
);
