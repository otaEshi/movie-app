import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { IUserInfoResponse } from "../../types/auth";
import { IUpdateUserActivePayload } from "../../types/admin";
import { updateUserActive } from "./adminApi";

interface DetailUserInfoModalProps {
    currentUser: IUserInfoResponse;
    setOpenDetailUserInfoModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function DetailUserInfoModal(props: DetailUserInfoModalProps) {
    const dispatch = useAppDispatch();

    const [is_active, setIs_active] = useState<boolean>(props.currentUser.is_active);

    const handleUpdateUserActive = () => {
        if (window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái hoạt động của tài khoản này?')) {
            props.setOpenDetailUserInfoModal(false);
            const payload : IUpdateUserActivePayload = {
                user_id: props.currentUser.id,
                is_active: is_active,
            }
            dispatch(updateUserActive(payload));
        }
    }
    return (
        <>
            <div className="row w-100">
                <div className="col-3">
                    {props.currentUser.avatar_url ?
                        <img src={`${props.currentUser.avatar_url}`} alt='' style={{ width: '120px', height: '120px', objectFit: 'cover' }}></img>
                        :
                        <i className="fa fa-user mt-4" aria-hidden="true"></i>
                    }
                </div>
                <div className="col">
                    <div className="mb-2">
                        <label htmlFor="username" className="form-label">Tên tài khoản</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={props.currentUser.username}
                            disabled />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={props.currentUser.email}
                            disabled />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="fullname" className="form-label">Họ tên</label>
                        <input
                            type="email"
                            className="form-control"
                            id="fullname"
                            value={props.currentUser.name}
                            disabled
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="date" className="col-form-label">Ngày sinh</label>
                        <input
                            type="date"
                            className="form-control"
                            id="date"
                            value={props.currentUser.date_of_birth}
                            disabled
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="role" className="col-form-label">Vai trò</label>
                        <input
                            type="text"
                            className="form-control"
                            id="role"
                            value={props.currentUser.is_admin ? "Quản trị viên chính" : (props.currentUser.is_content_admin ? "Quản trị viên nội dung" : "Người dùng thường") }
                            disabled
                        />
                    </div>
                    <div className="mb-3">
                <label htmlFor="is_active" className="form-label">
                    Tình trạng hoạt động
                </label>
                <select
                    className="form-select"
                    id="is_active"
                    value={is_active.toString()} 
                    onChange={(e) => {
                        if (e.target.value === "true") {
                            setIs_active(true)
                        } else {
                            setIs_active(false)
                        }
                    }}
                >
                    <option value="true">Hoạt động</option>
                    <option value="false">Khóa</option>
                </select>
            </div>
                    <div className="ms-5 ps-5">
                        <div className="btn btn-primary ms-5" onClick={handleUpdateUserActive}>Cập nhật</div>
                        <div className="btn btn-primary ms-5" onClick={() => props.setOpenDetailUserInfoModal(false)}>Đóng</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DetailUserInfoModal;