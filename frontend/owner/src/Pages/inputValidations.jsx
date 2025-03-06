import * as Yup from 'yup';

export const addEmployeeValidationSchema = Yup.object({
  employee_uname: Yup.string()
    .required('Employee ID is required')
    .matches(/^[A-Za-z0-9]+$/, 'Employee ID must be alphanumeric'),

  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  f_name: Yup.string()
    .required('First Name is required')
    .min(2, 'First Name must be at least 2 characters')
    .max(50, 'First Name can\'t be more than 50 characters'),

  l_name: Yup.string()
    .required('Last Name is required')
    .min(2, 'Last Name must be at least 2 characters')
    .max(50, 'Last Name can\'t be more than 50 characters'),

  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),

  com_password: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password'), null], "Passwords must match"),

  entry_date: Yup.date()
    .required('Entry Date is required')
    .max(new Date(), 'Entry Date cannot be in the future'),

  role: Yup.string()
    .required('Role is required')
    .oneOf(['admin', 'manager', 'employee'], 'Role must be either admin, manager, or employee'),

  phone_1: Yup.string()
    .required('Primary Phone is required')
    .matches(/^[0-9]{10}$/, 'Primary Phone must be 10 digits'),

  phone_2: Yup.string()
    .matches(/^[0-9]{10}$/, 'Secondary Phone must be 10 digits')
    .notRequired(), // optional field
});
