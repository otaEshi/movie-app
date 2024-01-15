import { useEffect, useState } from "react";
import { IAdjustUserPermissionPayload, IGetAllUserPayload } from "../../types/admin";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { adjustUserPermissionRequest, getAllAdminRequest, getAllUserRequest } from "./adminApi";
import UserCard from "./UserCard";
import './style.css';

function ContentAdmin() {
    const [username, setUsername] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const dispatch = useAppDispatch();
    const currentContentAdminList = useAppSelector(store => store.admin.adminList);
    const currentUserList = useAppSelector(store => store.admin.userList);
    const [isSearch, setIsSearch] = useState(false);

    const changePage = (page: number) => {
        if (page < 1) {
            return;
        }
        if (page > currentContentAdminList.max_page) {
            setCurrentPage(currentContentAdminList.max_page)
            return;
        }
        setCurrentPage(page);
    }

    const handleGetAllAdmin = async () => {
        const payload: IGetAllUserPayload = {
            is_content_admin: true,
            page: currentPage - 1,
            page_size: 6,
        }
        await dispatch(getAllAdminRequest(payload))
    }

    useEffect(() => {
        handleGetAllAdmin()
    }, [])

    useEffect(() => {
        handleGetAllAdmin();
    }, [currentPage])

    const removeContentAdminPermission = async (user_id: number) => {
        const payload: IAdjustUserPermissionPayload = {
            user_id: user_id,
            is_content_admin: false,
        }
        await dispatch(adjustUserPermissionRequest(payload))
        alert('Xóa quản trị viên nội dung thành công')
    }

    // Search user 
    const [userCurrentPage, setUserCurrentPage] = useState(1);
    const changeUserPage = (page: number) => {
        if (page < 1) {
            return;
        }
        if (page > currentUserList.max_page) {
            setUserCurrentPage(currentUserList.max_page)
            return;
        }
        setUserCurrentPage(page);
    }
    const handleGetNotAdmin = async () => {
        const payload: IGetAllUserPayload = {
            user_name: username,
            is_content_admin: false,
            page: userCurrentPage - 1,
            page_size: 6,
        }
        await dispatch(getAllUserRequest(payload))
    }
    useEffect(() => {
        handleGetNotAdmin();
    }, [userCurrentPage])

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (username.trim() !== '') {
                handleGetNotAdmin();
                setIsSearch(true);
            }
        }
    };
    const addToContentAdmin = async (user_id: number) => {
        const payload: IAdjustUserPermissionPayload = {
            user_id: user_id,
            is_content_admin: true,
        }
        await dispatch(adjustUserPermissionRequest(payload))
        alert('Thêm quản trị viên nội dung thành công')
    }

    return (
        <>
            <div className="container w-100">
                <div className="row w-100">
                    <div className="col border">
                        {/* <label htmlFor="username" className="form-label">
                            Tên tài khoản
                        </label> */}
                        {/* <button className="ms-2 header-button" onClick={handleGetAllAdmin}><i className="fa fa-search custom-i" aria-hidden="true"></i></button> */}
                        <input
                            type="text"
                            onKeyDown={handleKeyPress}
                            className="form-control align-self-center mt-2"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Tên tài khoản"
                            autoComplete="off"
                        />
                        {
                            currentUserList.list.length > 0 ? (
                                currentUserList.list.map((item) => (
                                    <div
                                        className="border d-flex m-1 position-relative"
                                        key={item.id}
                                        onClick={() => addToContentAdmin(item.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <UserCard user={item} />

                                    </div>
                                ))
                            ) : (
                                isSearch && <div className="mt-2"> Không tìm thấy tài khoản</div>
                            )
                        }


                        {currentUserList.list.length > 0 &&
                            <div className="pagination-container">
                                <span
                                    className={`pagination-item ${userCurrentPage === 1 ? 'disabled' : ''}`}
                                    onClick={() => changeUserPage(1)}
                                >
                                    {'<<'}
                                </span>
                                <span
                                    className={`pagination-item ${userCurrentPage === 1 ? 'disabled' : ''}`}
                                    onClick={() => changeUserPage(userCurrentPage - 1)}
                                >
                                    {'<'}
                                </span>
                                {Array.from({ length: 5 }, (_, index) => userCurrentPage - 2 + index).map((page) =>
                                    (page > 0 && page <= currentUserList.max_page) ? (
                                        <span
                                            key={page}
                                            className={`pagination-item ${page === userCurrentPage ? 'active' : ''}`}
                                            onClick={() => changeUserPage(page)}
                                        >
                                            {page}
                                        </span>
                                    ) : null
                                )}
                                <span
                                    className={`pagination-item ${userCurrentPage === currentUserList.max_page ? 'disabled' : ''}`}
                                    onClick={() => changeUserPage(userCurrentPage + 1)}
                                >
                                    {'>'}
                                </span>
                                <span
                                    className={`pagination-item ${userCurrentPage === currentUserList.max_page ? 'disabled' : ''}`}
                                    onClick={() => changeUserPage(currentUserList.max_page)}
                                >
                                    {'>>'}
                                </span>
                            </div>
                        }
                    </div>

                    <div className="col">
                        <div style={{ textAlign: 'center' }} className="mb-3">
                            <strong style={{ fontSize: '20px' }}>Danh sách quản trị viên</strong>
                        </div>
                        {
                            currentContentAdminList.list.length > 0 ? currentContentAdminList.list.map((item) => (
                                <div className="border d-flex m-1 position-relative">
                                    <UserCard
                                        user={item}
                                    >

                                    </UserCard>
                                    <button
                                        // style={{top: '0', right: '0' }}
                                        onClick={() => removeContentAdminPermission(item.id)}
                                        type="button"
                                        className="btn btn-close ms-4 mt-3"
                                        aria-label="Close">

                                    </button>
                                </div>
                            ))
                                :
                                <div> Hiện chưa có quản trị viên</div>
                        }
                        {currentContentAdminList &&
                            <div className="pagination-container">
                                <span
                                    className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}
                                    onClick={() => changePage(1)}
                                >
                                    {'<<'}
                                </span>
                                <span
                                    className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}
                                    onClick={() => changePage(currentPage - 1)}
                                >
                                    {'<'}
                                </span>
                                {Array.from({ length: 5 }, (_, index) => currentPage - 2 + index).map((page) =>
                                    (page > 0 && page <= currentContentAdminList.max_page) ? (
                                        <span
                                            key={page}
                                            className={`pagination-item ${page === currentPage ? 'active' : ''}`}
                                            onClick={() => changePage(page)}
                                        >
                                            {page}
                                        </span>
                                    ) : null
                                )}
                                <span
                                    className={`pagination-item ${currentPage === currentContentAdminList.max_page ? 'disabled' : ''}`}
                                    onClick={() => changePage(currentPage + 1)}
                                >
                                    {'>'}
                                </span>
                                <span
                                    className={`pagination-item ${currentPage === currentContentAdminList.max_page ? 'disabled' : ''}`}
                                    onClick={() => changePage(currentContentAdminList.max_page)}
                                >
                                    {'>>'}
                                </span>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default ContentAdmin;