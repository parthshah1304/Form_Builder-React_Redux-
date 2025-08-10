# Form_Builder-React_Redux

1) Form builder is a dynamic form builder using React, Typescript, MUI, and localStorage.
Users should be able to:
1. Create dynamic forms with customizable fields and validations
2. Preview how a form behaves for the end user
3. View a list of saved forms
4. Persist all form configurations in localStorage (No backend required)

2) Here is route and their description :
Route /create	->  Build a new form by dynamically adding and configuring fields

Route /preview -> Interact with the currently built form like an end user

Route /myforms -> View all previously saved forms from localStorage

3) how to run :

npm install react react-dom react-router-dom @mui/material @mui/icons-material @mui/x-date-pickers @reduxjs/toolkit react-redux react-beautiful-dnd date-fns uuid @emotion/react @emotion/styled @hello-pangea/dnd --legacy-peer-deps

npm run dev
