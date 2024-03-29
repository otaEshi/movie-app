import { Dropdown } from "react-bootstrap";
import { useAppSelector } from "../../app/hooks";
import { IComment } from "../../types/comment";
import './style.css';

interface ICommentCardProps {
    item: IComment
    handleOpenEditCommentModal: (comment_id: number) => void
}

function CommentCard(props: ICommentCardProps) {
    const currentUser = useAppSelector(store => store.auth.currentUser)

    return (
        <div className="m-2 d-flex pb-4">
            {props.item.user_avatar ? <img src={`${props.item.user_avatar}`} alt='' style={{ width: '40px', height: '40px', objectFit: 'cover' }}></img>
                :
                <i className="fa fa-user" style={{ width: '40px', height: '40px', objectFit: 'cover' }}></i>
            }
            <div className="custom-comment d-flex">
                <i className="fa fa-angle-left fa-arrow" style={{ color: 'rgb(216,216,216)', fontSize: '20px' }}></i>
                <div className="info">
                    <div className="comment-header d-flex justify-content-between">
                        <span className="authorname "> {props.item.user_name} </span>
                        {((currentUser.is_admin || currentUser.is_content_admin) || (currentUser.id === props.item.user_id)) ? <i className="fas fa-ellipsis-h m-1 ms-3 custom-comment-button" onClick={() => props.handleOpenEditCommentModal(props.item.id)}></i> : <></>}
                    </div>
                    <div className="comment-content">
                        {props.item.comment}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommentCard;