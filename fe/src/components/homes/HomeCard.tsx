import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.css';
import ReactStars from '../../lib/reactStar/react-star';
import Stars from '../../lib/reactStar/react-star';
import { IFirstRatePayload, IMovie, IUpdateRatingPayload } from '../../types/movies';
import { firstRateMovie, updateRating } from './homeApi';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Modal } from 'react-bootstrap';
import AddToListModal from './AddToListModal';
import EditMovieModal from './EditMovieModal';
import { deleteMovieRequest } from '../admin/adminApi';

interface HomeCardProps {
  item: IMovie
}

function HomeCard(props: HomeCardProps) {
  const dispatch = useAppDispatch();
  // const HomeCard: React.FC<HomeCardProps> = ({ item: { id, cover, name, userRating, average_rating, time, desc, genres, subGenre, videoURL } }) => {
  // const [ratingStar, setRatingStar] = useState(0);
  const currentUser = useAppSelector(store => store.auth.currentUser)
  const [openAddToListModal, setOpenAddToListModal] = useState<boolean>(false)
  const [openEditMovieModal, setOpenEditMovieModal] = useState<boolean>(false)

  const handleRatingChange = async (newRating: number) => {
    if (!currentUser.id) {
      alert('Bạn cần đăng nhập để đánh giá phim!')
      return;
    }
    alert(`Bạn đã đánh giá phim này ${newRating} sao!`)
    const firstRatePayload: IFirstRatePayload = {
      movie_id: props.item.id,
      rating: newRating * 2,
    }
    const res = await (dispatch(firstRateMovie(firstRatePayload)))
    console.log(res.meta.requestStatus)
    if (res.meta.requestStatus === "rejected") {
      const updateRatingPayload: IUpdateRatingPayload = {
        movie_id: props.item.id,
        rating: newRating * 2,
      }
      await (dispatch(updateRating(updateRatingPayload)))
    }

    // setRatingStar(newRating);
    // console.log('rating', ratingStar)
  };

  const handleDeleteMovie = (id: number) => {
    if (window.confirm('Bạn có chắc rằng muốn xóa phim này?')){
      localStorage.setItem('deleted_movie', id.toString());
      dispatch(deleteMovieRequest(id));
      // window.location.reload()
    }
  }

  return (
    <>
      <div className='box'>
        <div className='coverImage'>
          <img src={props.item.thumbnail_url} alt='' />
        </div>
        <div className='content flex'>
          <div className='row'>
            <h1>{props.item.title}</h1>
            <div className='rating flex'>
              {/* Modidy rating here */}
              {/* <div className='rate'>
                <i className='fas fa-star'></i>
                <i className='fa fa-star'></i>
                <i className='fa fa-star'></i>
                <i className='fa fa-star'></i>
                <i className='fa fa-star'></i>
              </div> */}
              {/* <ReactStars 
              count={5}
              size={24}
              color2={'#ffd700'}
              ></ReactStars> */}
              <div className=''>
                <ReactStars
                  count={5}
                  size={24}
                  half={true}
                  color2={'#e50813'}
                  value={props.item.average_rating / 2}
                  // edit={false}
                  onChange={handleRatingChange}
                // color2={'#ffd700'}

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
              {currentUser.id && <div className='d-flex'>
                <div className='btn btn-primary me-2' onClick={() => setOpenAddToListModal(true)}>Thêm vào danh sách</div>
                {(currentUser.is_admin || currentUser.is_content_admin) &&
                  <div>

                    <div className='btn btn-warning ms-2' onClick={() => setOpenEditMovieModal(true)}>Chỉnh sửa</div>
                    <div className='btn btn-danger ms-2' onClick={() => handleDeleteMovie(props.item.id)}>Xóa </div>
                  </div>
                }
              </div>}
            </div>

          </div>
          <div className='palyButton row'>
            <Link to={`/watch/${props.item.id}`} className='custom-text-deco'>
              <button>
                <div className='img'>
                  <img src='./images/play-button.png' alt='' />
                  <img src='./images/play.png' className='change' alt='' />
                </div>
                XEM NGAY
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Modal
        show={openAddToListModal}
        onHide={() => {
          localStorage.removeItem('chosenList')
          setOpenAddToListModal(false)}
        }
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
          setOpenedModal={setOpenEditMovieModal}
        >

        </EditMovieModal>
      </Modal>
    </>
  );
};

export default HomeCard;