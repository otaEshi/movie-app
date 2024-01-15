import { IUserInfoResponse } from "../../types/auth";

interface UserCardProps {
    user: IUserInfoResponse;
}

function UserCard(props: UserCardProps) {
    return (
        <>
            <div className="d-flex">
                <div className="me-2">
                    {props.user.avatar_url ?
                        <img src={`${props.user.avatar_url}`} alt='' style={{ width: '40px', height: '48px', objectFit: 'cover' }}></img>
                        :
                        <i className="fa fa-user-large" aria-hidden="true" style={{ width: '40px', height: '48px', objectFit: 'cover', paddingLeft:'12px', paddingTop:'14px' }}></i>
                    }
                </div>

                <div className="flex-grow-1">
                    <div><strong>Tên tài khoản: </strong>{props.user.username}</div>
                    <div>
                        {!props.user.is_content_admin ? (
                            <div><strong>Vai trò:</strong> Người dùng thường</div>
                        ) : (
                            props.user.is_admin ? (
                                <div>Vai trò: Quản trị viên chính</div>
                            ) : (
                                <div>Vai trò: Quản trị viên nội dung</div>
                            )
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}

export default UserCard;