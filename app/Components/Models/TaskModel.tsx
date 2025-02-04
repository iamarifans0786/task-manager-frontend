'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { showErrorMessage, showSuccessMessage, useApiClient } from '../../Helper/utils';
import InputField from '../Common/InputField';
import { BtnLoader } from '@/app/Helper/SvgProvider';

const taskSchema = yup.object({
    title: yup.string().min(3, 'Title must be at least 3 characters').required('Title is required'),
    desc: yup.string().min(5, 'Description must be at least 5 characters').required('Description is required'),
    user: yup.string().required('User is required'),
    status: yup.string().oneOf(['Todo', 'In-Progress', 'Completed']).required('Please select a status').default('Todo'),
});

export default function TaskModal({ id, isOpen, setIsOpen }: { id?: string; isOpen: boolean; setIsOpen: (state: boolean) => void }) {
    const [users, setUsers] = useState([]);
    const [isLoader, setIsLoader] = useState(false)
    const apiClient = useApiClient();

    const methods = useForm<any>({
        resolver: yupResolver(taskSchema),
        defaultValues: { title: '', desc: '', user: '', status: 'Todo' }
    });

    useEffect(() => {
        console.log(id)
        if (id) {
            apiClient.get(`/task/by-id/`, {
                params: { id }
            }).then((res) => {
                const taskData = res.data.data;
                methods.reset({
                    title: taskData.title,
                    desc: taskData.desc,
                    user: taskData.user?._id,
                    status: taskData.status || 'Todo',
                });
            }).catch((error) => {
                console.log("Error fetching task:", error)
            });
        }

        apiClient.get('/auth/all-users')
            .then((res) => {
                const formattedUsers = res?.data?.data
                    .filter((item: any) => item.type !== 'admin')
                    .map((item: any) => ({
                        _id: item?._id,
                        name: item?.name,
                    }));
                setUsers(formattedUsers);
            }).catch((error) => console.log("Error fetching users:", error));

    }, [id]);


    const onSubmit = async (data: any) => {
        console.log(data)
        setIsLoader(true)
        if (id) {
            await apiClient.put(`/task/`, data, {
                params: { id }
            }).then((res) => {
                showSuccessMessage('Task updated.')
            }).catch((error) => {
                showErrorMessage(error?.response?.data?.message)
                console.log(error)
            }).finally(() => {
                setIsLoader(false)
                setIsOpen(false)
            })
        } else {
            await apiClient.post(`/task/`, data)
                .then((res) => {
                    showSuccessMessage('Task Added.')
                }).catch((error) => {
                    showErrorMessage(error?.response?.data?.message)
                    console.log(error)
                }).finally(() => {
                    setIsLoader(false)
                    setIsOpen(false)
                })
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className=" p-6 rounded-lg shadow-lg w-[500px] bg-gray-800">
                <h2 className="text-lg text-white font-bold mb-4">{id ? 'Update Task' : 'Add Task'}</h2>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                        <InputField label="Title" name="title" />
                        <InputField label="desc" name="desc" />

                        <div className="flex flex-col gap-2">
                            <label className="text-sm md:text-base font-medium text-white">Select User</label>
                            <select {...methods.register('user')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5">
                                <option value="">Select a user</option>
                                {users.map((user: any) => (
                                    <option key={user._id} value={user._id}>{user.name}</option>
                                ))}
                            </select>
                            {/* Show error message if user is not selected */}
                            {methods.formState.errors.user && (
                                <span className="error">
                                    {(methods.formState.errors.user as any)?.message}
                                </span>
                            )}
                        </div>

                        {id &&
                            <div className="flex flex-col gap-2">
                                <label className="text-sm md:text-base font-medium text-white">Status</label>
                                <select {...methods.register('status')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5">
                                    <option value="Todo">Todo</option>
                                    <option value="In-Progress">In-Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                {methods.formState.errors.status && (
                                    <span className="error">
                                        {(methods.formState.errors.status as any)?.message}
                                    </span>
                                )}
                            </div>
                        }
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
