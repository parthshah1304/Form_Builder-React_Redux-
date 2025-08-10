import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import {
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
  startNewForm
} from '../slices/formSlice';
import { type FormField } from '../types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Grid from '@mui/material/Grid'; // using new Grid API
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const FormBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const currentForm = useSelector((state: RootState) => state.form.currentForm);
  const [openDialog, setOpenDialog] = useState(false);
  const [formName, setFormName] = useState('');
  const [newField, setNewField] = useState<Partial<FormField>>({
    type: 'text',
    label: '',
    required: false,
    validationRules: {},
  });

  const handleAddField = () => {
    if (newField.label && newField.type) {
      dispatch(addField(newField as FormField));
      setNewField({ type: 'text', label: '', required: false, validationRules: {} });
    }
  };

  const handleUpdateField = (field: FormField) => dispatch(updateField(field));
  const handleDeleteField = (id: string) => dispatch(deleteField(id));
  const handleDragEnd = (result: any) => {
    if (!result.destination || !currentForm) return;
    const items = Array.from(currentForm.fields);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    dispatch(reorderFields(items));
  };

  const handleSaveForm = () => {
    if (formName && currentForm) {
      dispatch(saveForm(formName));
      setOpenDialog(false);
      setFormName('');
    }
  };

  const fieldTypes = ['text', 'number', 'textarea', 'select', 'radio', 'checkbox', 'date'];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Form Builder</Typography>
      <Button onClick={() => dispatch(startNewForm())} variant="contained" sx={{ mb: 2 }}>
        New Form
      </Button>

      {currentForm && (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Add New Field</Typography>
            <Grid container gap={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Field Type</InputLabel>
                  <Select
                    value={newField.type}
                    onChange={(e) => setNewField({ ...newField, type: e.target.value as FormField['type'] })}
                    label="Field Type"
                  >
                    {fieldTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Label"
                  value={newField.label}
                  onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 2 }}>
                <FormControlLabel
                  control={<Switch
                    checked={newField.required}
                    onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                  />}
                  label="Required"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 2 }}>
                <Button variant="contained" onClick={handleAddField}>Add Field</Button>
              </Grid>
            </Grid>
          </Paper>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                  {currentForm.fields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(prov) => (
                        <Paper
                          sx={{ p: 2, mb: 1 }}
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                        >
                          <Grid container alignItems="center" gap={2}>
                            <Grid size={{ xs: 8 }}>
                              <Typography>{`${field.label} (${field.type})`}</Typography>
                            </Grid>
                            <Grid size={{ xs: 2 }}>
                              <FormControlLabel
                                control={<Switch
                                  checked={field.required}
                                  onChange={(e) => handleUpdateField({ ...field, required: e.target.checked })}
                                />}
                                label="Required"
                              />
                            </Grid>
                            <Grid size={{ xs: 2 }}>
                              <IconButton onClick={() => handleDeleteField(field.id)}>
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
            disabled={currentForm.fields.length === 0}
            sx={{ mt: 2 }}
          >
            Save Form
          </Button>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Save Form</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Form Name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={handleSaveForm} variant="contained" disabled={!formName}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default FormBuilder;