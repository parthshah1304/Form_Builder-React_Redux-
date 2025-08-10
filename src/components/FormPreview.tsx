import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';
import { type FormField } from '../types';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Button, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const FormPreview: React.FC = () => {
  const currentForm = useSelector((state: RootState) => state.form.currentForm);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: FormField, value: any): string => {
    if (!field.validationRules) return '';
    
    if (field.required && !value) return 'This field is required';
    if (field.validationRules.notEmpty && !value) return 'This field cannot be empty';
    if (field.validationRules.minLength && typeof value === 'string' && value.length < field.validationRules.minLength) {
      return `Minimum length is ${field.validationRules.minLength}`;
    }
    if (field.validationRules.maxLength && typeof value === 'string' && value.length > field.validationRules.maxLength) {
      return `Maximum length is ${field.validationRules.maxLength}`;
    }
    if (field.validationRules.email && typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Invalid email format';
    }
    if (field.validationRules.password && typeof value === 'string' && !/^(?=.*\d).{8,}$/.test(value)) {
      return 'Password must be at least 8 characters and contain a number';
    }
    return '';
  };

  const handleChange = (fieldId: string, field: FormField, value: any) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
    setErrors(prev => ({ ...prev, [fieldId]: validateField(field, value) }));

    // Update derived fields
    if (currentForm) {
      currentForm.fields.forEach(f => {
        if (f.isDerived && f.parentFields?.includes(fieldId)) {
          // Simple example derivation: concatenate parent field values
          const derivedValue = f.parentFields
            .map(id => formValues[id] || '')
            .join(' ');
          setFormValues(prev => ({ ...prev, [f.id]: derivedValue }));
        }
      });
    }
  };

  const handleSubmit = () => {
    if (!currentForm) return;
    const newErrors: Record<string, string> = {};
    let isValid = true;

    currentForm.fields.forEach(field => {
      const error = validateField(field, formValues[field.id]);
      if (error) {
        isValid = false;
        newErrors[field.id] = error;
      }
    });

    setErrors(newErrors);
    if (isValid) {
      alert('Form submitted successfully!');
    }
  };

  if (!currentForm) {
    return <Typography>No form selected</Typography>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>{currentForm.name}</Typography>
        {currentForm.fields.map(field => (
          <Box key={field.id} mb={2}>
            {field.type === 'text' || field.type === 'number' ? (
              <TextField
                fullWidth
                type={field.type}
                label={field.label}
                required={field.required}
                value={formValues[field.id] || ''}
                onChange={(e) => handleChange(field.id, field, e.target.value)}
                error={!!errors[field.id]}
                helperText={errors[field.id]}
                disabled={field.isDerived}
              />
            ) : field.type === 'textarea' ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                label={field.label}
                required={field.required}
                value={formValues[field.id] || ''}
                onChange={(e) => handleChange(field.id, field, e.target.value)}
                error={!!errors[field.id]}
                helperText={errors[field.id]}
                disabled={field.isDerived}
              />
            ) : field.type === 'select' ? (
              <FormControl fullWidth error={!!errors[field.id]}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleChange(field.id, field, e.target.value)}
                  disabled={field.isDerived}
                >
                  {field.options?.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : field.type === 'radio' ? (
              <FormControl component="fieldset" error={!!errors[field.id]}>
                <Typography>{field.label}</Typography>
                {field.options?.map(option => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        checked={formValues[field.id] === option}
                        onChange={() => handleChange(field.id, field, option)}
                        disabled={field.isDerived}
                      />
                    }
                    label={option}
                  />
                ))}
              </FormControl>
            ) : field.type === 'checkbox' ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues[field.id] || false}
                    onChange={(e) => handleChange(field.id, field, e.target.checked)}
                    disabled={field.isDerived}
                  />
                }
                label={field.label}
              />
            ) : field.type === 'date' ? (
              <DatePicker
                label={field.label}
                value={formValues[field.id] || null}
                onChange={(date) => handleChange(field.id, field, date)}
                disabled={field.isDerived}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors[field.id]}
                    helperText={errors[field.id]}
                  />
                )}
              />
            ) : null}
          </Box>
        ))}
        <Button variant="contained" onClick={handleSubmit} disabled={Object.values(errors).some(e => e)}>
          Submit
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default FormPreview;