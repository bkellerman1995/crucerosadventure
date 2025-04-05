import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';

SelectHabitaciones.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};
export function SelectHabitaciones({ field, data }) {
  return (
    <>
      <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
        <InputLabel id="habitacion">Habitación</InputLabel>
        <Select
          {...field}
          labelId="habitacion"
          label="habitacion"
          defaultValue=""
          value={field.value}
        >
          {data &&
            data.map((habitacion) => (
              <MenuItem key={habitacion.id} value={habitacion.id}>
                {habitacion.fname} {habitacion.lname}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </>
  );
}
