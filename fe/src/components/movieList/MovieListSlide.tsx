import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { IMovieList } from "../../types/movieList";
import ListFilmCard from '../listFilm/ListFilmCard';
import { Link } from 'react-router-dom';

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

    return (
        <>
            <section className='upcome pt-4'>
                <div className='container'>
                    <div className='heading flexSB'>
                        <h1>{props.movieList.name}</h1>
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
        </>
    );
}

export default MovieListSlide;