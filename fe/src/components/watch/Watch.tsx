import React, { useState, useEffect } from 'react';
import './style.css';
import { useParams } from 'react-router-dom';
import { homeData, recommended } from '../../dummyData';
import { IMovie } from '../../types/movies';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getMovieRequest, updateMovieViewRequest } from './watchApi';
import { IComment, ICreateCommentPayload, IDeleteCommentPayload, IGetCommentPayload, IUpdateCommentPayload } from '../../types/comment';
import { createCommentRequest, deleteCommentRequest, getCommentRequest, updateCommentRequest } from '../comment/commentApi';
import CommentCard from '../comment/CommentCard';
import { Modal } from 'react-bootstrap';
import EditCommentModal from '../comment/EditCommentModal';
// import Upcomming from '../listFilm/ListFilm';

// interface IWatchProps {
//   movie: IMovie
// }

// const Watch: React.FC = () => {
function Watch() {
  const { id } = useParams<{ id: string }>();
  const currentMovie = useAppSelector(store => store.watch.movie)
  const comment_list = useAppSelector(store => store.comment.comment_list)
  // const [item, setItem] = useState<Item | null>(null);
  const dispatch = useAppDispatch();
  const [openEditCommentModal, setOpenEditCommentModal] = useState<boolean>(false)
  const [currentComment, setCurrentComment] = useState<IComment>()
  const [newComment, setNewComment] = useState<string>('')

  const currentUser = useAppSelector(store => store.auth.currentUser)

  // useEffect(() => {
  //   if (id) {
  //     let foundItem = homeData.find((item) => item.id === parseInt(id));
  //     if (foundItem) {
  //       setItem(foundItem);
  //     }
  //   }
  // }, [id]);

  const getMovie = async () => {
    if (id) {
      await dispatch(getMovieRequest(id));

      const commentPayload: IGetCommentPayload = {
        movie_id: parseInt(id),
        page: 0,
        page_size: 999,
      }
      await dispatch(getCommentRequest(commentPayload))
      dispatch(updateMovieViewRequest(id));
    }
  }

  useEffect(() => {
    getMovie()
  }, [])

  const _handleOpenEditCommentModal = (comment_id: number) => {
    setCurrentComment(comment_list.list.find(item => item.id === comment_id))
    setOpenEditCommentModal(true);
  }

  const _handleCancel = () => {
    setOpenEditCommentModal(false);
  }

  const _handleUpdateComment = async () => {
    const payload: IUpdateCommentPayload = {
      movie_id: currentMovie.id,
      movie_comment_id: currentComment!.id,
      comment: currentComment!.comment,
      is_deleted: false,
    }
    await dispatch(updateCommentRequest(payload))
    setOpenEditCommentModal(false)
  }

  const _handleDeleteComment = async () => {
    const payload: IDeleteCommentPayload = {
      movie_id: currentMovie.id,
      movie_comment_id: currentComment!.id,
    }
    await dispatch(deleteCommentRequest(payload))
    setOpenEditCommentModal(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'newComment') {
      setNewComment(value);
    }
  }

  const handleCreateComment = async () => {
    if (newComment.trim() === ''){
      alert('Bình luận không được để trống')
      return;
    }
    const payload : ICreateCommentPayload = {
      movie_id : currentMovie.id,
      comment : newComment,
    }
    await dispatch(createCommentRequest(payload))
    alert('Bình luận thành công!')
    setNewComment('')
  }

  return (
    <>
      {currentMovie ? (
        <>
          <section className='watch'>
            <div className='watchHeading'>
              <h1>{currentMovie.title}</h1> <span> | {currentMovie.date_of_release} | </span> <span> HD </span>
            </div>
            <div className='container'>
              <div style={{ height: "600px" }}>
                <iframe
                  src={currentMovie.url}
                  height="100%"
                  allowFullScreen
                >
                </iframe>
                <h3>Ngày phát hành : {currentMovie.date_of_release}</h3>
                <p> Mô tả: {currentMovie.description}</p>
                <div className='comment-container'>
                  <div  style={{ textAlign: 'center' , fontWeight: '600', fontSize: '24px'}}>BÌNH LUẬN CỦA NGƯỜI DÙNG</div>
                  {currentUser.id && <div className='d-flex justify-content-center mt-2 pb-3'>
                    <input
                      type="text"
                      className="form-control"
                      id='newComment'
                      style={{ width: '90%' }}
                      value={newComment}
                      onChange={(e) => handleInputChange(e)}
                      placeholder='Bình luận'
                    >
                    </input>
                    <div className='btn btn-primary ms-1' onClick={handleCreateComment}>Gửi</div>
                  </div>}
                  {comment_list ? comment_list.list.map((item) => (
                    <CommentCard
                      handleOpenEditCommentModal={_handleOpenEditCommentModal}
                      item={item}
                    >
                    </CommentCard>
                  ))
                    :
                    <div> Không có bình luận nào </div>
                  }
                </div>
              </div>
            </div>
          </section>
          {/* <Upcomming items={rec} title='Recommended Movies' /> */}

        </>
      ) : (
        'Xin lỗi vì sự bất tiện này'
      )}

      <Modal
        show={openEditCommentModal}
        onHide={() => setOpenEditCommentModal(false)}
      >
        <EditCommentModal
          item={currentComment!}
          handleUpdateComment={_handleUpdateComment}
          handleCancel={_handleCancel}
          handleDeleteComment={_handleDeleteComment}
        >
        </EditCommentModal>

      </Modal>

    </>
  );
};

export default Watch;