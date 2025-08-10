import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from './store';
import FormBuilder from './components/FormBuilder';
import FormPreview from './components/FormPreview';
import MyForms from './components/MyForms';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/create" element={<FormBuilder />} />
            <Route path="/preview" element={<FormPreview />} />
            <Route path="/myforms" element={<MyForms />} />
            <Route path="/" element={<FormBuilder />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;