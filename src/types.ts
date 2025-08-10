export interface FormField {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  required: boolean;
  defaultValue?: string | number | boolean;
  validationRules?: {
    notEmpty?: boolean;
    minLength?: number;
    maxLength?: number;
    email?: boolean;
    password?: boolean;
  };
  options?: string[]; // For select and radio
  isDerived?: boolean;
  parentFields?: string[];
  formula?: string;
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: FormField[];
}