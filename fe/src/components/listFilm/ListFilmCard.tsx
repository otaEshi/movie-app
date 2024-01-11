import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.css';
import './listFilm.css';
import { IFirstRatePayload, IMovie, IUpdateRatingPayload } from '../../types/movies';
import { Modal } from 'react-bootstrap';
import HomeCard from '../homes/HomeCard';
import ReactStars from '../../lib/reactStar/react-star';
import { firstRateMovie, updateRating } from '../homes/homeApi';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import AddToListModal from '../homes/AddToListModal';
import EditMovieModal from '../homes/EditMovieModal';
import { deleteMovieRequest } from '../admin/adminApi';

interface ListFilmCardProps {
  item: IMovie
}

// const ListFilm: React.FC<ListFilmCardProps> = ({ item: { id, cover, name, time } }) => {
function ListFilmCard(props: ListFilmCardProps) {
  const currentUser = useAppSelector(store => store.auth.currentUser)
  const dispatch = useAppDispatch()
  const [openAddToListModal, setOpenAddToListModal] = useState<boolean>(false)
  const [openEditMovieModal, setOpenEditMovieModal] = useState<boolean>(false)
  const [openDetailMovieModal, setOpenDetailMovieModal] = useState<boolean>(false);

  const handleRatingChange = async (newRating: number) => {
    console.log('number change', newRating)
    alert(`Bạn đã đánh giá phim này ${newRating} sao!`)
    const firstRatePayload: IFirstRatePayload = {
      movie_id: props.item.id,
      rating: newRating * 2,
    }
    const res = await (dispatch(firstRateMovie(firstRatePayload)))
    if (res.meta.requestStatus === "rejected") {
      const updateRatingPayload: IUpdateRatingPayload = {
        movie_id: props.item.id,
        rating: newRating * 2,
      }
      await (dispatch(updateRating(updateRatingPayload)))
    }
  };

  const handleDeleteMovie = (id: number) => {
    dispatch(deleteMovieRequest(id));
    alert('Xóa thành công')
  }

  return (
    <>
      <div className='MovieBox'>
        <div className='img'>
          <img src={props.item.thumbnail_url} alt='' />
        </div>
        <div className='text'>
          <h3>{props.item.title}</h3>
          <span>{props.item.date_of_release}</span> <br />
          <div onClick={() => setOpenDetailMovieModal(true)} className='custom-text-deco'>
            <button>
              <div className='img'>
                <img src='./images/play-button.png' alt='' />
                <img src='./images/play.png' className='change' alt='' />
              </div>
              CHI TIẾT
            </button>
          </div>
        </div>
      </div>

      <Modal
        show={openDetailMovieModal}
        onHide={() => setOpenDetailMovieModal(false)}
        // centered
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        size='lg'
      >
        {/* <div style={{position:'relative'}}>
          <HomeCard item={props.item}></HomeCard>
          </div> */}
        <div className='m-2'>
          <div>
            <h1>{props.item.title}</h1>
            <div className='rating flex'>
              <div className=''>
                <ReactStars
                  count={5}
                  size={24}
                  half={true}
                  color2={'#e50813'}
                  value={props.item.average_rating / 2}
                  onChange={handleRatingChange}
                ></ReactStars>
              </div>
              <label>{props.item.average_rating / 2}/5 - {props.item.num_ratings} lượt đánh giá</label>
              <label>Ngày phát hành: {props.item.date_of_release}</label>
            </div>
            <p>Mô tả nội dung: {props.item.description}</p>
            <div className='cast'>
              <h4>
                <span>Thể loại: </span>
                {props.item.genre},
                {` ${props.item.subgenre}`}
              </h4>
              <h4>
                <span>Lượt xem: </span>
                {props.item.views}
                {/* {props.item.id} */}
              </h4>
            </div>

            <div className='d-flex'>
              {currentUser.id && <div className='d-flex'>
                <div className='btn btn-primary me-2' onClick={() => setOpenAddToListModal(true)}>Thêm vào danh sách</div>
                {(currentUser.is_admin || currentUser.is_content_admin) &&
                  <div>

                    <div className='btn btn-warning ms-2' onClick={() => setOpenEditMovieModal(true)}>Chỉnh sửa</div>
                    <div className='btn btn-danger ms-2' onClick={() => handleDeleteMovie(props.item.id)}>Xóa </div>
                  </div>
                }
              </div>}
              <Link to={`/watch/${props.item.id}`} className='custom-text-deco btn'>
                <button>
                  XEM NGAY
                </button>
              </Link>
            </div>
          </div>
        </div>

        <Modal
          show={openAddToListModal}
          onHide={() => setOpenAddToListModal(false)}
        >
          <AddToListModal
            currentMovie={props.item}
          >

          </AddToListModal>
        </Modal>


        <Modal
          show={openEditMovieModal}
          onHide={() => setOpenEditMovieModal(false)}
        >
          <EditMovieModal
            currentMovie={props.item}
          >

          </EditMovieModal>
        </Modal>

      </Modal>
    </>
  );
};

export default ListFilmCard;

function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
