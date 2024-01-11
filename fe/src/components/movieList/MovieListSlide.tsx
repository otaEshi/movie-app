import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { IMovieList, IUpdateMovieList } from "../../types/movieList";
import ListFilmCard from '../listFilm/ListFilmCard';
import { Link } from 'react-router-dom';
import { delMovieList, updateMovieList } from './movieListApi';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';

const SampleNextArrow: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
    return (
        <div className='control-btn' onClick={onClick}>
            <button className='next'>
                <i className='fa fa-chevron-right'></i>
            </button>
        </div>
    );
};

const SamplePrevArrow: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
    return (
        <div className='control-btn' onClick={onClick}>
            <button className='prev'>
                <i className='fa fa-chevron-left'></i>
            </button>
        </div>
    );
};

interface IMovieListSlideProps {
    movieList: IMovieList
}

function MovieListSlide(props: IMovieListSlideProps) {
    const dispatch = useAppDispatch()
    const [openEditListModal, setOpenEditListModal] = useState<boolean>(false)
    const [name, setName] = useState<string>(props.movieList.name)
    const [description, setDescription] = useState<string>(props.movieList.description)
    const currentUser = useAppSelector(store => store.auth.currentUser)

    const settings: Settings = {
        dots: false,
        // infinite: true,
        infinite: props.movieList.movies && props.movieList.movies.length > 2,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const handleDeleteList = (listId: number) => {
        if (window.confirm(`Bạn có muốn xóa danh sách ${props.movieList.name}`)) {
            localStorage.setItem('deleted_list', listId.toString());
            dispatch(delMovieList(listId));
        }

    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'name') {
            setName(value);
        } else if (id === 'description') {
            setDescription(value)
        }
    }

    const handleUpdate = () => {
        let movie_ids: number[] = []
        // movie_ids.push(props.movieList.id)
        props.movieList.movies && props.movieList.movies.map((item) => (movie_ids.push(item.id)))
        const payload: IUpdateMovieList = {
            name: name,
            description: description,
            id: props.movieList.id,
            is_deleted: false,
            movies: movie_ids,
        }
        dispatch(updateMovieList(payload))
        alert('Cập nhật thành công')
        window.location.reload()
    }

    return (
        <>
            <section className='upcome pt-4'>
                <div className='container'>
                    <div className=' d-flex justify-content-between'>
                        <h1>{props.movieList.name}</h1>
                        {((currentUser.is_admin || currentUser.is_content_admin) || (currentUser.id === props.movieList.owner_id)) && (
                            <div>
                                <div className='btn btn-primary' onClick={() => setOpenEditListModal(true)}>
                                    Cập nhật danh sách
                                </div>
                                <button className="btn btn-danger" onClick={() => handleDeleteList(props.movieList.id)}>
                                    {/* <span aria-hidden="true">&times;</span> */}
                                    Xóa danh sách
                                </button>
                            </div>
                        )}

                        <Link to={`/movie_list/detail/${props.movieList.id}`}>Xem tất cả</Link>
                    </div>
                    <div className='m-1'>Mô tả: {props.movieList.description}</div>
                    <div className='content'>
                        <Slider {...settings}>
                            {props.movieList.movies && props.movieList.movies.map((item) => (
                                <ListFilmCard key={item.id} item={item} />
                            ))}
                        </Slider>
                    </div>
                </div>
            </section>

            <Modal
                show={openEditListModal}
                onHide={() => setOpenEditListModal(false)}
                // centered
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            // size='lg'
            >
                <div className='m-2'>
                    <div>
                        <div className="form-group m-2">
                            <label htmlFor="name">Tên danh sách</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Nhập tên danh sách"
                                value={name}
                                onChange={(e) => handleInputChange(e)}
                            />
                        </div>
                        <div className="form-group m-2">
                            <label htmlFor="description">Mô tả</label>
                            <input
                                type="text"
                                className="form-control"
                                id="description"
                                placeholder="Nhập mô tả"
                                value={description}
                                onChange={(e) => handleInputChange(e)}
                            />
                        </div>
                    </div>
                    <div className='d-flex justify-content-center'><div className='btn btn-primary' onClick={handleUpdate}>Cập nhật</div></div>
                </div>
            </Modal>
        </>
    );
}

export default MovieListSlide;