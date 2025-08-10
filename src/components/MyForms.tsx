import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store';
import { loadForm } from '../slices/formSlice';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';

const MyForms: React.FC = () => {
  const savedForms = useSelector((state: RootState) => state.form.savedForms);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePreview = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/preview');
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>My Forms</Typography>
      {savedForms.length === 0 ? (
        <Typography>No forms saved yet.</Typography>
      ) : (
        <List>
          {savedForms.map(form => (
            <ListItem key={form.id} secondaryAction={
              <Button variant="contained" onClick={() => handlePreview(form.id)}>
                Preview
              </Button>
            }>
              <ListItemText
                primary={form.name}
                secondary={`Created: ${new Date(form.createdAt).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default MyForms;