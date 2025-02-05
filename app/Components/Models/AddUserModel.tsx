'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { showErrorMessage, showSuccessMessage, useApiClient } from '../../Helper/utils';
import InputField from '../Common/InputField';
import { BtnLoader } from '@/app/Helper/SvgProvider';

const userSchema = yup.object({
    name: yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().matches(/^[0-9]{10}$/, 'Phone must be a 10-digit number').required('Phone is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').when('$isEditing', (isEditing, schema) =>
        isEditing ? schema.notRequired() : schema.required('Password is required')
    ),
});

export default function AddUserModel({ id, isOpen, setIsOpen }: any) {
    const [isLoader, setIsLoader] = useState(false);
    const apiClient = useApiClient();
    console.log(id)

    const methods = useForm({
        resolver: yupResolver(userSchema),
        defaultValues: { name: '', email: '', phone: '', password: '' },
        context: { isEditing: !!id }
    });

    useEffect(() => {
        if (id) {
            apiClient.get(`/auth/user/`, { params: { id } })
                .then((res) => {
                    const userData = res.data.data;
                    methods.reset({
                        name: userData.name,
                        email: userData.email,
                        phone: userData.phone,
                    });
                })
                .catch((error) => console.log("Error fetching user:", error));
        }
    }, [id]);

    const onSubmit = async (data: any) => {
        setIsLoader(true)
        if (id) {
            await apiClient.put(`/auth/edit-user`, data, { params: { id } })
                .then(() => showSuccessMessage('User updated.'))
                .catch((error) => showErrorMessage(error?.response?.data?.message))
                .finally(() => {
                    setIsLoader(false);
                    setIsOpen(false);
                });
        } else {
            await apiClient.post(`/auth/create-user`, data)
                .then((res) => {
                    console.log(res?.data?.data)
                    showSuccessMessage('User Added.')
                })
                .catch((error) => {
                    console.log(error)
                    showErrorMessage(error?.response?.data?.message)
                })
                .finally(() => {
                    setIsLoader(false);
                    setIsOpen(false);
                });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 rounded-lg shadow-lg w-[500px] bg-gray-800">
                <h2 className="text-lg text-white font-bold mb-4">{id ? 'Update User' : 'Add User'}</h2>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                        <InputField label="Name" name="name" />
                        <InputField label="Email" name="email" type="email" />
                        <InputField label="Phone" name="phone" type="tel" />
                        {!id && <InputField label="Password" name="password" type="password" />}
                        <div className="flex justify-end space-x-4 !mt-8">
                            <button disabled={isLoader} onClick={() => setIsOpen(false)} className="btn !bg-white max-w-[120px] !text-black">Cancel</button>
                            <button type="submit" disabled={isLoader} className='btn btn-primary max-w-[120px]'>
                                {isLoader ? <BtnLoader /> : id ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
