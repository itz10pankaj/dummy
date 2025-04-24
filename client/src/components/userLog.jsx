import React, { useEffect, useState } from "react";
import { getUserLogsApi } from "../services/apiServices";
import { useSelector,useDispatch} from "react-redux";
import {setLogs} from "../redux/slices/logsSLice.js"
const UserLogs = () => {
  const dispatch=useDispatch();
  const logs = useSelector((state) => state.logs.userId || []);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const usedId = user?.id;
  useEffect(() => {
    if (!usedId) return;
    const fetchLogs = async () => {
      setLoading(true);
      const data = await getUserLogsApi(usedId);
      dispatch(setLogs({userId:data}));
      setLoading(false);
    };
    fetchLogs();
  }, [usedId,dispatch]);

  return (
    <div className="p-4">
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading logs...</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No logs found</div>
      ) : (
        <div className="h-screen bg-white p-4 overflow-y-auto scrollbar-hide">
          <h2 className="text-xl font-bold mb-4">User Logs</h2>
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-300">
              <tr>
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Action</th>
                <th className="py-2 px-3">Time</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{index + 1}</td>
                  <td className="py-2 px-3">{log.action || "N/A"}</td>
                  <td className="py-2 px-3">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-3">
                    {log.status ? (
                      <div>✅</div>
                    ) : (
                      <div>❌</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserLogs;
