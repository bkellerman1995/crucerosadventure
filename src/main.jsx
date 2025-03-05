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
        element: <ListHabitaciones/>,
      },

      {
        //Página Habitaciones by ID
        path: "/habitacion/:id",
        element: <DetailHabitacion/>,
      },

      {
        //Página Barcos
        path: "/barco",
        element: <ListBarcos/>,
      },

      {
        //Página Barcos by ID
        path: "/barco/:id",
        element: <DetailBarco/>,
      },

      {
        //Página Cruceros
        path: "/crucero",
        element: <ListCruceros/>,
      },

      {
        //Página Cruceros by ID
        path: "/crucero/:id",
        element: <DetailCrucero/>,
      },

      {
        //Página Reservas
        path: "/reserva",
        element: <ListReservas/>,
      },

      {
        //Página Cruceros by ID
        path: "/reserva/:id",
        element: <DetailReserva/>,
      },


    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>
);
