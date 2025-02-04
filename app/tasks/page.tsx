'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../Context/AuthContext";
import { showErrorMessage, showSuccessMessage, useApiClient } from "../Helper/utils";
import FullScreenLoader from "../Components/Common/Loader";
import { DeleteIcon, EditIcon } from "../Helper/SvgProvider";
import TaskModal from "../Components/Models/TaskModel";
import TaskStatusModal from "../Components/Models/StatusUpdateModel";

const TaskPage = () => {
    const Router = useRouter();
    const { user } = useAuth();
    const apiClient = useApiClient();

    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectStatus, setSelectStatus] = useState<{ id: string | null, status: string }>({ id: null, status: '' })
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isLoader, setIsLoader] = useState(false);

    const route = user?.type === 'admin' ? '/task/all/' : '/task';

    useEffect(() => {
        if (user) fetchTasks();
    }, [user]);

    const fetchTasks = async () => {
        setIsLoader(true);
        try {
            const res = await apiClient.get(route);
            setData(res?.data?.data || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setIsLoader(false);
        }
    };

    const handleEditTask = (id: string) => {
        setSelectedTaskId(id);
        setIsModalOpen(true);
    };

    const handleEditStatus = (id: string, status: string) => {
        setSelectStatus({ id: id, status: status })
        setIsStatusModalOpen(true)
    }

    const handleDeleteTask = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return
        await apiClient.delete(`/task/`, {
            params: { id }
        }).then(() => {
            showSuccessMessage('Task deleted.')
        }).catch((error) => {
            showErrorMessage(error?.response?.data?.message)
            console.log(error)
        }).finally(() => {
            fetchTasks()
        })
    };

    return (
        <div className="w-full h-full">
            {isLoader && <FullScreenLoader />}

            {/* Task Modal */}
            {isModalOpen && (
                <TaskModal
                    id={selectedTaskId as string}
                    isOpen={isModalOpen}
                    setIsOpen={(state: boolean) => {
                        setIsModalOpen(state);
                        if (!state) setSelectedTaskId(null);
                        fetchTasks();
                    }}
                />
            )}

            {isStatusModalOpen && (
                <TaskStatusModal
                    selectStatus={selectStatus}
                    isOpen={isStatusModalOpen}
                    setIsOpen={(state: boolean) => {
                        setIsStatusModalOpen(state);
                        if (!state) setSelectStatus({ id: null, status: '' });
                        fetchTasks();
                    }}
                />
            )}

            {/* Header */}
            <div className="w-full flex justify-between bg-white p-4 rounded-md">
                <h2 className="text-lg font-bold">All Tasks</h2>
                {user?.type === 'admin' && <button
                    onClick={() => { setIsModalOpen(true); setSelectedTaskId(null); }}
                    className="btn btn-primary max-w-[140px]"
                >
                    Add Task
                </button>}
            </div>

            {/* Task Table */}
            <div className="w-full mt-6 bg-white shadow-md rounded-lg p-4">
                {data.length ? (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="p-2">Title</th>
                                <th className="p-2">Description</th>
                                {user?.type === 'admin' && <th className="p-2">Assigned To</th>}
                                <th className="p-2">Status</th>
                                <th className="p-2">Date</th>
                                <th className="p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...data].reverse().map((task: any) => (
                                <tr key={task._id} className="border-t">
                                    <td className="p-2">{task?.title || "-"}</td>
                                    <td className="p-2">{task?.desc || "-"}</td>
                                    {user?.type === 'admin' && <td className="p-2">{task?.user?.name || "-"}</td>}
                                    <td className={`p-2 text-${task.status === 'Todo' ? 'red' : task.status === 'In-Progress' ? 'yellow' : 'green'}-600`}>
                                        {task?.status || "-"}
                                    </td>
                                    <td className="p-2">
                                        {task?.createdAt ? new Date(task.createdAt).toLocaleDateString("en-US") : "-"}
                                    </td>
                                    <td className="p-2 flex gap-3">
                                        <span onClick={() => {
                                            if (user?.type === 'admin') handleEditTask(task._id)
                                            else handleEditStatus(task?._id, task?.status)
                                        }} className="cursor-pointer">
                                            <EditIcon />
                                        </span>
                                        {user?.type === 'admin' &&
                                            <span onClick={() => handleDeleteTask(task._id)} className="cursor-pointer">
                                                <DeleteIcon />
                                            </span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="w-full bg-gray-200 flex justify-center p-2 rounded-md">
                        No Task Found
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskPage;
