import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IGetAllUserPayload } from "../../types/admin";
import { getAllUserRequest } from "./adminApi";
import UserCard from "./UserCard";
import { IUserInfoResponse } from "../../types/auth";
import { Modal } from "react-bootstrap";
import DetailUserInfoModal from "./DetailUserInfoModal";

function ManageUser() {
    const [username, setUsername] = useState('');
    const [userCurrentPage, setUserCurrentPage] = useState(1);
    const [isSearch, setIsSearch] = useState(false);
    const [openDetailUserInfoModal, setOpenDetailUserInfoModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<IUserInfoResponse>({} as IUserInfoResponse);

    const currentUserList = useAppSelector(store => store.admin.userList);
    const dispatch = useAppDispatch();

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
        let payload : IGetAllUserPayload 
        if (username.trim() !== '') {
             payload = {
                user_name: username.trim(),
                is_content_admin: false,
                page: userCurrentPage - 1,
                page_size: 6,
            }
        } else {
             payload = {
                is_content_admin: false,
                page: userCurrentPage - 1,
                page_size: 6,
            }
        }
        dispatch(getAllUserRequest(payload))
    }

    useEffect(() => {
        handleGetNotAdmin();
    }, [userCurrentPage])

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // if (username.trim() !== '') {
            handleGetNotAdmin();
            setIsSearch(true);
            // }
        }
    };

    const handleOpenDetailUserInfoModal = (user: IUserInfoResponse) => {
        setOpenDetailUserInfoModal(true);
        setCurrentUser(user);
    }

    return (
        <>
            <div
            // className="container w-100"
            >
                <div
                // className="row w-100"
                >
                    <div
                    // className="col border"
                    >
                        <input
                            type="text"
                            onKeyDown={handleKeyPress}
                            className="form-control align-self-center mt-2 mb-2"
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
                                        onClick={() => handleOpenDetailUserInfoModal(item)}
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

                </div>
            </div>
            <Modal
                show={openDetailUserInfoModal}
                onHide={() => setOpenDetailUserInfoModal(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <div className="m-2">
                    <DetailUserInfoModal
                        currentUser={currentUser}
                        setOpenDetailUserInfoModal={setOpenDetailUserInfoModal}
                    />
                </div>

            </Modal>
        </>
    );
}

export default ManageUser;

function dispatch(arg0: any) {
    throw new Error("Function not implemented.");
}
