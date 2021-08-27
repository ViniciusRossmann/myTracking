import * as yup from 'yup';

export const create = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required()
});

export const login = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required()
});