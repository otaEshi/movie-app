import { useState } from "react";
import { IComment } from "../../types/comment";
import { useAppSelector } from "../../app/hooks";

interface EditCommentModalProps {
    item: IComment
    handleUpdateComment: (newComment : string) => void
    handleCancel: () => void
    handleDeleteComment: () => void
}

function EditCommentModal(props: EditCommentModalProps) {
    const [comment, setComment] = useState<string>(props.item.comment)
    const currentUser = useAppSelector(store => store.auth.currentUser)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'comment') {
            setComment(value);
        }
    }

    const handleApply = () => {
        if (comment === '') {
            alert('Bình luận không được để trống')
            return;
        }
        props.handleUpdateComment(comment)
    }

    return (
        <>
            <div className="d-flex justify-content-center mt-3 pb-3">
                <input
                    type="text"
                    className="form-control"
                    id='comment'
                    value={comment}
                    style={{ width: '90%' }}
                    onChange={(e) => handleInputChange(e)}
                    disabled={currentUser.id !== props.item.user_id}
                >
                </input>
            </div>
            <div className="d-flex justify-content-center">
                <div
                    className="btn btn-primary m-1"
                    onClick={() => handleApply()}
                >
                    Xác nhận
                </div>
                <div className="btn btn-danger m-1" onClick={props.handleDeleteComment}>Xóa</div>
                <div className="btn btn-warning m-1" onClick={props.handleCancel}>Hủy</div>
            </div>

        </>
    );
}

export default EditCommentModal;