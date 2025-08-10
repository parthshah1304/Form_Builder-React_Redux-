import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { type FormField , type FormSchema} from '../types';

interface FormState {
  currentForm: FormSchema | null;
  savedForms: FormSchema[];
}

const initialState: FormState = {
  currentForm: null,
  savedForms: JSON.parse(localStorage.getItem('savedForms') || '[]'),
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    startNewForm: (state) => {
      state.currentForm = {
        id: uuidv4(),
        name: '',
        createdAt: new Date().toISOString(),
        fields: [],
      };
    },
    addField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        state.currentForm.fields.push({ ...action.payload, id: uuidv4() });
      }
    },
    updateField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        const index = state.currentForm.fields.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.currentForm.fields[index] = action.payload;
        }
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
      }
    },
    reorderFields: (state, action: PayloadAction<FormField[]>) => {
      if (state.currentForm) {
        state.currentForm.fields = action.payload;
      }
    },
    saveForm: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.name = action.payload;
        state.savedForms.push(state.currentForm);
        localStorage.setItem('savedForms', JSON.stringify(state.savedForms));
        state.currentForm = null;
      }
    },
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload);
      if (form) {
        state.currentForm = { ...form };
      }
    },
  },
});

export const { startNewForm, addField, updateField, deleteField, reorderFields, saveForm, loadForm } = formSlice.actions;
export default formSlice.reducer;