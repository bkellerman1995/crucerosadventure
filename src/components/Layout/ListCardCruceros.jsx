// import React from 'react';
// //import { useEffect, useState } from 'react';
// import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';
// import CardMedia from '@mui/material/CardMedia';
// import CardContent from '@mui/material/CardContent';
// import CardActions from '@mui/material/CardActions';
// import Grid from '@mui/material/Grid2';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import AccessTime from '@mui/icons-material/AccessTime';
// import Language from '@mui/icons-material/Language';
// import { Link } from 'react-router-dom';
// import { Info } from '@mui/icons-material';
// import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
// import PropTypes from 'prop-types';
// import CruceroService from '../../services/CruceroService';

// ListCardCruceros.propTypes = {
//   data: PropTypes.array,
// };

// export function ListCardCruceros({data}) {

//     //Resultado de consumo del API, respuesta
//     const [data, setData] = useState(null);
//     //Error del API
//     const [error, setError] = useState('');
//     //Booleano para establecer sí se ha recibido respuesta
//     const [loaded, setLoaded] = useState(false);


//   return (
//     <Grid container sx={{ p: 2 }} spacing={3}>
//       {/* ()=>{} */}
//       {data &&
//         data.map((item) => (
//           <Grid size={4} key={item.id}>
//             <Card>
//               <CardHeader
//                 sx={{
//                   p: 0,
//                   backgroundColor: (theme) => theme.palette.secondary.main,
//                   color: (theme) => theme.palette.common.white,
//                 }}
//                 style={{ textAlign: 'center' }}
//                 title={item.nombre}
//                 subheader={item.fechaSalida}
//               />
              
//               <CardMedia
//                 component="img"
//                 image = {CruceroService.getMovieById(item.id)}
//                 //image={`${BASE_URL}/${item.imagen?.image}`}
//                 alt={item.title}
//               />
//               <CardContent>
//                 <Typography variant="body2" color="text.secondary">
//                   <AccessTime /> Tiempo: {item.time} minutos
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   <Language /> Idioma: {item.lang}
//                 </Typography>
//                 {isShopping && (
//                   <Typography variant="h6" align="right" gutterBottom>
//                     &cent;{item.price}
//                   </Typography>
//                 )}
//               </CardContent>
//               <CardActions
//                 disableSpacing
//                 sx={{
//                   backgroundColor: (theme) => theme.palette.action.focus,
//                   color: (theme) => theme.palette.common.white,
//                 }}
//               >
//                 <IconButton
//                   component={Link}
//                   to={`/movie/${item.id}`}
//                   aria-label="Detalle"
//                   sx={{ ml: 'auto' }}
//                 >
//                   <Info />
//                 </IconButton>
//                 {isShopping && (
//                   <IconButton
//                     aria-label="Comprar"
//                     sx={{ ml: 'auto' }}
//                   >
//                     <AddShoppingCartIcon />
//                   </IconButton>
//                 )}
//               </CardActions>
//             </Card>
//           </Grid>
//         ))}
//     </Grid>
//   );
// }
