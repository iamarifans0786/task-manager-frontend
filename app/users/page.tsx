"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../Context/AuthContext";
import { showErrorMessage, showSuccessMessage, useApiClient } from "../Helper/utils";
import FullScreenLoader from "../Components/Common/Loader";
import { DeleteIcon, EditIcon } from "../Helper/SvgProvider";
import AddUserModel from "../Components/Models/AddUserModel";

const UsersPage = () => {
    const Router = useRouter()
    const [data, setData] = useState([])
    const { user } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const apiClient = useApiClient()
    const [isLoader, setIsLoader] = useState(false)

    const GetUser = async () => {
        setIsLoader(true)
        await apiClient.get('/auth/all-users')
            .then((res) => {
                setData(res?.data?.data)
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                setIsLoader(false)
            })
    }
    useEffect(() => {
        user && GetUser();
    }, [user])

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return
        await apiClient.delete(`/auth/`, {
            params: { id }
        }).then(() => {
            showSuccessMessage('User deleted.')
        }).catch((error) => {
            showErrorMessage(error?.response?.data?.message)
            console.log(error)
        }).finally(() => {
            GetUser();
        })
    };

    const handleEditUser = (id: string) => {
        setSelectedUserId(id);
        setIsModalOpen(true);
    };

    const latestUsers = [...data].reverse().filter((item: any) => item?.type !== 'admin')

    return (
        <div className="w-full h-full">
            {isLoader && <FullScreenLoader />}

            {isModalOpen && (
                <AddUserModel
                    id={selectedUserId as string}
                    isOpen={isModalOpen}
                    setIsOpen={(state: boolean) => {
                        setIsModalOpen(state);
                        if (!state) setSelectedUserId(null);
                        GetUser();
                    }}
                />
            )}

            {/* Recent Users Table */}
            <div className="w-full flex justify-between bg-white p-4 rounded-md">
                <h2 className="text-lg font-bold">All Tasks</h2>
                {user?.type === 'admin' && <button
                    onClick={() => { setIsModalOpen(true); setSelectedUserId(null); }}
                    className="btn btn-primary max-w-[140px]"
                >
                    Add User
                </button>}
            </div>
            <div className="mt-6 bg-white shadow-md rounded-lg p-4 overflow-x-auto">
                {
                    data.length !== 0 ?
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-200 text-left">
                                    <th className="p-2">No.</th>
                                    <th className="p-2">Name</th>
                                    <th className="p-2">Email Id</th>
                                    <th className="p-2">Phone No.</th>
                                    <th className="p-2">Date</th>
                                    {user?.type === 'admin' && <th className="p-2">Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data && latestUsers?.map((item: any, index: number) => {
                                        return (
                                            <tr key={index} className="border-t">
                                                <td className="p-2">{index + 1 || "-"}</td>
                                                <td className="p-2">{item?.name || "-"}</td>
                                                <td className="p-2">{item?.email || "-"}</td>
                                                <td className="p-2">{`${item?.phone || "-"}`}</td>
                                                <td className="p-2">
                                                    {item?.createdAt ? new Date(item?.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", }) : "-"}
                                                </td>
                                                {user?.type === 'admin' && <td className="p-2 flex gap-3">
                                                    <span onClick={() => handleDeleteUser(item._id)} className="cursor-pointer">
                                                        <DeleteIcon />
                                                    </span>
                                                    <span onClick={() => handleEditUser(item._id)} className="cursor-pointer">
                                                        <EditIcon />
                                                    </span>
                                                </td>}
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        :
                        <div className="w-full bg-gray-200 flex items-start justify-center text-lg font-bold p-2 rounded-md">
                            {`No Users Found`}
                        </div>
                }
            </div>
        </div>
    );
};

export default UsersPage;
