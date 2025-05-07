import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Home } from "./components/Home/Home.jsx";
import { ListHabitaciones } from "./components/Layout/ListHabitaciones.jsx";
import { ListBarcos } from "./components/Layout/ListBarcos.jsx";
import { ListCruceros } from "./components/Layout/ListCruceros.jsx";
import { ListComplementos } from "./components/Layout/ListComplementos.jsx";
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
import { CreateComplemento } from "./components/Layout/CreateComplemento";
import { UpdateBarco } from "./components/Layout/UpdateBarco";
import { UpdateHabitacion } from "./components/Layout/UpdateHabitacion";
import { UpdateComplemento } from "./components/Layout/UpdateComplemento";
import { CreateReserva } from "./components/Layout/CreateReserva";
import { Facturacion} from "./components/Layout/Facturacion";
import UserProvider from "./context/usuarioContext";
import { DetailComplemento } from "./components/Layout/DetailComplemento";
import { Login } from "./components/Layout/Login";
import { Logout } from "./components/Layout/Logout";
import { Signup } from "./components/Layout/Signup";
// import "bootstrap/dist/css/bootstrap.min.css";
// import UserProvider from "./components/Layout/UserProvider";

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

      //Página Complemento by ID
      { path: "/complemento/:id", element: <DetailComplemento /> },

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

          { path: "complemento", element: <ListComplementos botonCrearActivo={true} botonEditarActivo={true} /> },
          { path: "complemento/crear", element: <CreateComplemento /> },
          { path: "complemento/editar", element: <UpdateComplemento /> },


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
      {
        path: '/usuario/login',
        element: <Login />
      },
      {
        path:'/usuario/logout',
        element: <Logout />
      },
      {
        path: '/usuario/crear',
        element: <Signup />
      }
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
