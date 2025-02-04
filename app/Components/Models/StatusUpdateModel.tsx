'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { showErrorMessage, showSuccessMessage, useApiClient } from '../../Helper/utils';
import { BtnLoader } from '@/app/Helper/SvgProvider';

const statusSchema = yup.object({
    status: yup.string().oneOf(['Todo', 'In-Progress', 'Completed']).required('Please select a status'),
});

export default function TaskStatusModal({ selectStatus, isOpen, setIsOpen }: { selectStatus: any; isOpen: boolean; setIsOpen: (state: boolean) => void }) {
    const [isLoader, setIsLoader] = useState(false);
    const apiClient = useApiClient();
    const id = selectStatus.id;

    const methods = useForm<any>({
        resolver: yupResolver(statusSchema),
        defaultValues: { status: selectStatus.status }
    })

    const onSubmit = async (data: any) => {
        setIsLoader(true);
        console.log(data)
        await apiClient.put(`/task/update-status`, { status: data.status }, { params: { id } })
            .then(() => {
                showSuccessMessage('Task status updated.');
            })
            .catch((error) => {
                showErrorMessage(error?.response?.data?.message);
                console.log(error);
            })
            .finally(() => {
                setIsLoader(false);
                setIsOpen(false);
            });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 rounded-lg shadow-lg w-[400px] bg-gray-800">
                <h2 className="text-lg text-white font-bold mb-4">Update Task Status</h2>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm md:text-base font-medium text-white">Status</label>
                            <select {...methods.register('status')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5">
                                <option value="Todo">Todo</option>
                                <option value="In-Progress">In-Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            {methods.formState.errors.status && (
                                <span className="error">{(methods.formState.errors.status as any)?.message}</span>
                            )}
                        </div>
                        <div className="flex justify-end space-x-4 !mt-8">
                            <button disabled={isLoader} onClick={() => setIsOpen(false)} className="btn !bg-white !text-black !max-w-[120px]">Cancel</button>
                            <button type="submit" disabled={isLoader} className='btn btn-primary !max-w-[120px]'>
                                {isLoader ? <BtnLoader /> : 'Update'}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
