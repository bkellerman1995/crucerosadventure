import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Home } from "./components/Home/Home.jsx";
import { ListHabitaciones } from "./components/Layout/ListHabitaciones.jsx";
import { ListBarcos } from "./components/Layout/ListBarcos.jsx";
//import { ListCruceros } from "./components/Layout/ListCruceros.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PageNotFound } from "./components/Home/PageNotFound.jsx";
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
        //Página Barcos
        path: "/barco",
        element: <ListBarcos/>,
      },
      // {
      //   //Página Cruceros
      //   path: "/crucero",
      //   element: <ListCruceros/>,
      // }

      

    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>
);
