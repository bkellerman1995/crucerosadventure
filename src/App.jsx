import React from 'react';
import { appTheme } from './themes/theme';
import { Layout } from './components/Layout/Layout';
import {Outlet} from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material';
// import "bootstrap/dist/css/bootstrap.min.css";

/*import { CartProvider } from './contexts/CartContext'; */

export default function App() {
  return (

      <ThemeProvider theme={appTheme}>
        <CssBaseline enableColorScheme />
        <Layout>
          <Outlet /> 
        </Layout>
      </ThemeProvider>
  );
}