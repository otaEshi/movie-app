import { Modal } from "react-bootstrap";
import { IFirstRatePayload, IMovie, IUpdateMoviePayload, IUpdateRatingPayload } from "../../types/movies";
import ReactStars from "../../lib/reactStar/react-star";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { firstRateMovie, updateRating } from "../homes/homeApi";
import { restoreMovieRequest, updateMovieRequest } from "./adminApi";

interface RestoreMovieCardProps {
    item: IMovie
}

function RestoreMovieCard(props: RestoreMovieCardProps) {
    const currentUser = useAppSelector(store => store.auth.currentUser)
    const dispatch = useAppDispatch()
    const [openDetailMovieModal, setOpenDetailMovieModal] = useState<boolean>(false);


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
        if (res.meta.requestStatus === "rejected") {
            const updateRatingPayload: IUpdateRatingPayload = {
                movie_id: props.item.id,
                rating: newRating * 2,
            }
            await (dispatch(updateRating(updateRatingPayload)))
        }
    };

    const handleRestoreMovie = () => {
        const payload : IUpdateMoviePayload = {
            id: props.item.id,
            title: props.item.title,
            description: props.item.description,
            date_of_release: props.item.date_of_release,
            url: props.item.url,
            genre: props.item.genre,
            subgenre: props.item.subgenre,
            source: props.item.source,
            thumbnail_url: props.item.thumbnail_url,
            is_deleted: false,
        }
        dispatch(restoreMovieRequest(payload))
        alert('Khôi phục thành công')
        setOpenDetailMovieModal(false)
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
                                <div className='btn btn-primary me-2' onClick={handleRestoreMovie}>Khôi phục phim</div>
                            </div>}
                        </div>
                    </div>
                </div>

            </Modal>
        </>
    );
}

export default RestoreMovieCard;