"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./Context/AuthContext";
import { useApiClient } from "./Helper/utils";
import FullScreenLoader from "./Components/Common/Loader";
import { useRouter } from "next/navigation";
import ProtectedRoute from "./Components/ProtectedRoute";

const Dashboard = () => {
  const Router = useRouter()
  const [data, setData] = useState([])
  const [allUser, setAllUser] = useState([])

  const { user } = useAuth()
  const apiClient = useApiClient()
  const [isLoader, setIsLoader] = useState(false)
  const route = user?.type === 'admin' ? '/task/all/' : '/task'

  useEffect(() => {
    setIsLoader(true)
    const GetTask = async () => {
      await apiClient.get(route)
        .then((res) => {
          setData(res?.data?.data)
        }).catch((error) => {
          console.log(error)
        }).finally(() => {
          setIsLoader(false)
        })
    }
    user && GetTask();
  }, [user])

  useEffect(() => {
    setIsLoader(true)
    const GetTask = async () => {
      await apiClient.get('/auth/all-users')
        .then((res) => {
          setAllUser(res?.data?.data)
        }).catch((error) => {
          console.log(error)
        }).finally(() => {
          setIsLoader(false)
        })
    }
    if (user?.type === 'admin') GetTask();
  }, [user])

  const latestTasks = [...data].reverse().slice(0, 4)
  const latestUsers = [...allUser].reverse().filter((item: any) => item?.type !== 'admin').slice(0, 4)

  return (
    <ProtectedRoute>
      <div className="w-full h-full">
        {isLoader && <FullScreenLoader />}
        {/* Stats Cards */}
        {
          user?.type === 'user' &&
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold">Assigned Tasks</h3>
              <p className="text-2xl font-bold">{data.filter((item: any) => item.status === 'Todo').length || 0}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold">Pending Tasks</h3>
              <p className="text-2xl font-bold">{data.filter((item: any) => item.status === 'In-Progress').length || 0}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold">Completed Tasks</h3>
              <p className="text-2xl font-bold">{data.filter((item: any) => item.status === 'Completed').length || 0}</p>
            </div>
          </div>
        }

        {
          user?.type === 'admin' &&
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold">Asigned Tasks</h3>
              <p className="text-2xl font-bold">{data.length || 0}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-2xl font-bold">{allUser.length - 1 || 0}</p>
            </div>
          </div>
        }

        {/* Recent Tasks Table */}
        <div className="mt-6 bg-white shadow-md rounded-lg p-4 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Tasks</h3>
            <button onClick={() => Router.push('/tasks')} className="text-blue-500 hover:underline">View All</button>
          </div>
          {
            data.length !== 0 ?
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-2">Title</th>
                    <th className="p-2">Description</th>
                    {
                      user?.type === 'admin' &&
                      <th className="p-2">Asigned To</th>
                    }
                    <th className="p-2">Status</th>
                    {/* <th className="p-2">Date</th> */}
                  </tr>
                </thead>
                <tbody>
                  {
                    data && latestTasks?.map((item: any, index: number) => {
                      return (
                        <tr key={index} className="border-t">
                          <td className="p-2">{item?.title || "-"}</td>
                          <td className="p-2">{item?.desc || "-"}</td>
                          {
                            user?.type === 'admin' &&
                            <td className="p-2">{item?.user?.name || "-"}</td>
                          }
                          <td className={`p-2 ${item?.status === 'Todo' ? 'text-red-600' : item?.status === 'In-Progress' ? 'text-yellow-600' : ' text-green-600'} `}>{item?.status || "-"}</td>
                          {/* <td className="p-2">
                          {item?.createdAt ? new Date(item?.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", }) : "-"}
                        </td> */}
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
              :
              <div className="w-full bg-gray-200 flex items-start justify-center text-lg font-bold p-2 rounded-md">
                {`No Task Found`}
              </div>
          }
        </div>

        {/* Recent Users Table */}
        {
          user?.type === 'admin' &&
          <div className="mt-6 bg-white shadow-md rounded-lg p-4 overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Users</h3>
              <button onClick={() => Router.push('/users')} className="text-blue-500 hover:underline">View All</button>
            </div>
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
        }

      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
