"use client"
import React, { useEffect, useState } from 'react';
import { Trash2, UserPlus, Search, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { getCourseById } from '@/lib/actions/course.action';
import { addCourseToUser, getFullUser, getUserByManyId, removeCourseFromUser } from '@/lib/actions/user.actions';
import { useParams } from 'next/navigation';


type TUserInfo = {
  _id: string;
  name: string;
  email: string;
  role: string;
  selected?: boolean;
};
type TUser = {
  _id: string;
  name: string;
  email: string;
  courses: string[];
  role: string;
  selected?: boolean;
};
  

function App() {
  const slug = useParams()
 
  const [students, setStudents] = useState<TUserInfo[]>([]);
  const [users, setUsers] = useState<TUser[]>([]);
  const [showAddSection, setShowAddSection] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingStudents, setIsAddingStudents] = useState(false);
  const [isRemovingStudents, setIsRemovingStudents] = useState(false);
  
  const studentsPerPage = 5;
  
  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const idStudent = await getCourseById(slug.idCourse as string)
        const studentInCourse = await getUserByManyId(idStudent?.students as string[])
        const user = await getFullUser()
        setUsers(user as TUser[])
        setStudents(studentInCourse!)
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetch()
  }, [slug.idCourse]);
  
  const handleDeleteSelected = async () => {
    const selectedStudents = students.filter(student => student.selected);
    if (selectedStudents.length === 0) return;
    
    setIsRemovingStudents(true);
    try {
      const idDelete = selectedStudents.map(student => student._id);
      await removeCourseFromUser(slug.idCourse as string, idDelete);
      setStudents(students.filter(student => !student.selected));
    } catch (error) {
      console.error("Lỗi khi xóa học viên:", error);
    } finally {
      setIsRemovingStudents(false);
    }
  };

  const handleAddSelected = async () => {
    const selectedUsers = users.filter(user => user.selected);
    if (selectedUsers.length === 0) return;
    
    setIsAddingStudents(true);
    try {
      const newStudents = selectedUsers.map(user => ({
        ...user,
        role: "student"
      }));

      const userIds = newStudents.map(user => user._id);
      await addCourseToUser(slug.idCourse as string, userIds);
      
      setUsers(users.filter(user => !user.selected));
      
      // Refresh student list
      const updatedCourse = await getCourseById(slug.idCourse as string);
      const updatedStudents = await getUserByManyId(updatedCourse?.students as string[]);
      setStudents(updatedStudents!);
      
      setShowAddSection(false);
    } catch (error) {
      console.error("Lỗi khi thêm học viên:", error);
    } finally {
      setIsAddingStudents(false);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
      <Loader className="h-8 w-8 animate-spin text-blue-500" />
      <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Current Students Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Danh Sách Học Viên</h2>
              <p className="text-gray-600">Quản lý học viên trong khóa học</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteSelected}
                disabled={isRemovingStudents || isLoading}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRemovingStudents ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa Học Viên
                  </>
                )}
              </button>
              <button
                onClick={() => setShowAddSection(!showAddSection)}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {showAddSection ? 'Ẩn Thêm Học Viên' : 'Thêm Học Viên'}
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm học viên theo tên hoặc email..."
              value={studentSearch}
              onChange={(e) => {
                setStudentSearch(e.target.value);
                setCurrentPage(1);
              }}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-4 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            setStudents(students.map(student => ({
                              ...student,
                              selected: e.target.checked
                            })));
                          }}
                          className="rounded"
                        />
                      </th>
                      <th className="p-4 text-left font-semibold">Tên</th>
                      <th className="p-4 text-left font-semibold">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents.length > 0 ? (
                      currentStudents.map((student) => (
                        <tr key={student._id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={student.selected || false}
                              onChange={(e) => {
                                setStudents(students.map(s => 
                                  s._id === student._id ? { ...s, selected: e.target.checked } : s
                                ));
                              }}
                              className="rounded"
                            />
                          </td>
                          <td className="p-4 font-medium">{student.name}</td>
                          <td className="p-4 text-gray-600">{student.email}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-4 text-center text-gray-500">
                          Không tìm thấy học viên nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredStudents.length > 0 && (
                <div className="flex items-center justify-between mt-4 px-4">
                  <div className="text-sm text-gray-600">
                    Hiển thị {indexOfFirstStudent + 1}-{Math.min(indexOfLastStudent, filteredStudents.length)} 
                    trong số {filteredStudents.length} học viên
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${
                          currentPage === page 
                            ? 'bg-blue-500 text-white' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Add New Students Section */}
        {showAddSection && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Thêm Học Viên Mới</h2>
              <button
                onClick={handleAddSelected}
                disabled={isAddingStudents}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingStudents ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Đang thêm...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Thêm Vào Khóa Học
                  </>
                )}
              </button>
            </div>

            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Tìm kiếm người dùng theo tên hoặc email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                disabled={isAddingStudents}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>

            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-4 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            setUsers(users.map(user => ({
                              ...user,
                              selected: e.target.checked
                            })));
                          }}
                          disabled={isAddingStudents}
                          className="rounded"
                        />
                      </th>
                      <th className="p-4 text-left font-semibold">Tên</th>
                      <th className="p-4 text-left font-semibold">Email</th>
                      <th className="p-4 text-left font-semibold">Trạng thái</th>
                      <th className="p-4 text-left font-semibold">Quyền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user._id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={user.selected || false}
                              onChange={(e) => {
                                setUsers(users.map(u => 
                                  u._id === user._id ? { ...u, selected: e.target.checked } : u
                                ));
                              }}
                              disabled={isAddingStudents}
                              className="rounded"
                            />
                          </td>
                          <td className="p-4 font-medium">{user.name}</td>
                          <td className="p-4 text-gray-600">{user.email}</td>
                          <td className="p-4 text-gray-600">
                            {slug.idCourse && user.courses.includes(slug.idCourse as string) ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                Đã tham gia
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                                Chưa tham gia
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-gray-600">{user.role}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">
                          Không tìm thấy người dùng nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;