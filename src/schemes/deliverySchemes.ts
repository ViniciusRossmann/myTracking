import * as yup from 'yup';

export const create = yup.object().shape({
    description: yup.string().required(),
    user: yup.string().required(),
    status: yup.number()
});

export const update = yup.object().shape({
    status: yup.number(),
    location: yup.object()
});