import React, { useState, useEffect } from 'react';
import './style.css';
import { useParams } from 'react-router-dom';
import { homeData, recommended } from '../../dummyData';
import { IFirstRatePayload, IMovie, IUpdateRatingPayload } from '../../types/movies';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getMovieRequest, updateMovieViewRequest } from './watchApi';
import { IComment, ICreateCommentPayload, IDeleteCommentPayload, IGetCommentPayload, IUpdateCommentPayload } from '../../types/comment';
import { createCommentRequest, deleteCommentRequest, getCommentRequest, updateCommentRequest } from '../comment/commentApi';
import CommentCard from '../comment/CommentCard';
import { Modal } from 'react-bootstrap';
import EditCommentModal from '../comment/EditCommentModal';
import ReactStars from '../../lib/reactStar/react-star';
import { firstRateMovie, updateRating } from '../homes/homeApi';
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
  const [commentPage, setCommentPage] = useState<number>(1)

  const currentUser = useAppSelector(store => store.auth.currentUser)

  // useEffect(() => {
  //   if (id) {
  //     let foundItem = homeData.find((item) => item.id === parseInt(id));
  //     if (foundItem) {
  //       setItem(foundItem);
  //     }
  //   }
  // }, [id]);
  const getCommentPerPage = (page: number) => {
    // setCommentPage(page)
    if (id) {
      const commentPayload: IGetCommentPayload = {
        movie_id: parseInt(id),
        page: commentPage - 1,
        page_size: 5,
        is_deleted: false,
      }
      dispatch(getCommentRequest(commentPayload))
    }
  }

  useEffect(() => {
    getCommentPerPage(commentPage)
  }, [commentPage])

  const changePage = (page: number) => {
    if (page < 1) {
      return;
    }
    if (page > comment_list.max_page) {
      setCommentPage(comment_list.max_page)
      return;
    }
    setCommentPage(page);
  }

  const getMovie = async () => {
    if (id) {
      await dispatch(getMovieRequest(id));

      const commentPayload: IGetCommentPayload = {
        movie_id: parseInt(id),
        page: commentPage - 1,
        page_size: 5,
        is_deleted: false,
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

  const _handleUpdateComment = async (newComment: string) => {
    if (currentUser.id === currentComment!.user_id) {
      const payload: IUpdateCommentPayload = {
        movie_id: currentMovie.id,
        movie_comment_id: currentComment!.id,
        comment: newComment,
        is_deleted: false,
      }
      await dispatch(updateCommentRequest(payload))
      setOpenEditCommentModal(false)
      alert('Cập nhật thành công')
    } else {
      alert('Bạn không thể cập nhật bình luận của người khác')
    }
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
    if (newComment.trim() === '') {
      alert('Bình luận không được để trống')
      return;
    }
    const payload: ICreateCommentPayload = {
      movie_id: currentMovie.id,
      comment: newComment,
    }
    await dispatch(createCommentRequest(payload))
    alert('Bình luận thành công!')
    setNewComment('')
  }

  const handleRatingChange = async (newRating: number) => {
    if (!currentUser.id) {
      alert('Bạn cần đăng nhập để đánh giá phim!')
      return;
    }
    alert(`Bạn đã đánh giá phim này ${newRating} sao!`)
    const firstRatePayload: IFirstRatePayload = {
      movie_id: currentMovie.id,
      rating: newRating * 2,
    }
    const res = await (dispatch(firstRateMovie(firstRatePayload)))
    if (res.meta.requestStatus === "rejected") {
      const updateRatingPayload: IUpdateRatingPayload = {
        movie_id: currentMovie.id,
        rating: newRating * 2,
      }
      await (dispatch(updateRating(updateRatingPayload)))
    }
  };


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
                <div className='rating flex mb-2'>
                  <div className=''>
                    <ReactStars
                      count={5}
                      size={24}
                      half={true}
                      color2={'#e50813'}
                      value={currentMovie.average_rating / 2}
                      onChange={handleRatingChange}
                    ></ReactStars>
                  </div>
                  <label>{currentMovie.average_rating / 2}/5 - {currentMovie.num_ratings} lượt đánh giá</label>

                </div>
                <div className='comment-container'>
                  <div style={{ textAlign: 'center', fontWeight: '600', fontSize: '24px' }}>BÌNH LUẬN CỦA NGƯỜI DÙNG</div>
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

                  {comment_list &&
                    <div className="pagination-container">
                      <span
                        className={`pagination-item ${commentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => changePage(1)}
                      >
                        {'<<'}
                      </span>
                      <span
                        className={`pagination-item ${commentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => changePage(commentPage - 1)}
                      >
                        {'<'}
                      </span>
                      {Array.from({ length: 5 }, (_, index) => commentPage - 2 + index).map((page) =>
                        (page > 0 && page <= comment_list.max_page) ? (
                          <span
                            key={page}
                            className={`pagination-item ${page === commentPage ? 'active' : ''}`}
                            onClick={() => changePage(page)}
                          >
                            {page}
                          </span>
                        ) : null
                      )}
                      <span
                        className={`pagination-item ${commentPage === comment_list.max_page ? 'disabled' : ''}`}
                        onClick={() => changePage(commentPage + 1)}
                      >
                        {'>'}
                      </span>
                      <span
                        className={`pagination-item ${commentPage === comment_list.max_page ? 'disabled' : ''}`}
                        onClick={() => changePage(comment_list.max_page)}
                      >
                        {'>>'}
                      </span>
                    </div>
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