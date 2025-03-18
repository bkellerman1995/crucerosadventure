import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';

export function ModalGestionPuertos ({ open, handleClose }) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Gestionar Puertos
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Aquí puedes gestionar los puertos del crucero.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClose}
          sx={{ mt: 2 }}
        >
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
}
// Validación de las props con PropTypes
ModalGestionPuertos.propTypes = {
  open: PropTypes.bool.isRequired, // 'open' debe ser un booleano obligatorio
  handleClose: PropTypes.func.isRequired, // 'handleClose' debe ser una función obligatoria
};

