import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getDetailMovieList, updateMovieList } from "./movieListApi";
import { useEffect, useState } from "react";
import ListFilmCard from "../listFilm/ListFilmCard";
import { IUpdateMovieList } from "../../types/movieList";

function DetailMovieList() {
    const dispatch = useAppDispatch();
    const currentItems = useAppSelector(store => store.detailMovieList.detaiMovieList);
    const { id } = useParams<{ id: string }>();
    const getDetailList = async () => {
        await dispatch(getDetailMovieList(id!))
    }

    useEffect(() => {
        getDetailList();
    }, [])

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [moviesPerPage, setMoviesPerPage] = useState<number>(20);

    const indexOfLastItem = currentPage * moviesPerPage
    const indexOfFirstItem = indexOfLastItem - moviesPerPage;

    // const totalPages = Math.ceil(currentItems.movies.length / moviesPerPage);

    // const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // const handleMoviesPerPageChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    //     const value = parseInt(event.target.value, 10);
    //     setMoviesPerPage(value);
    //     setCurrentPage(1);
    // };

    // const renderPaginationButtons = () => {
    //     const buttons = [];

    //     const displayPages = 5;
    //     let startPage = Math.max(1, currentPage - 2);
    //     let endPage = Math.min(totalPages, currentPage + 2);

    //     if (currentPage <= 2) {
    //         endPage = Math.min(displayPages, totalPages);
    //     } else if (currentPage >= totalPages - 2) {
    //         startPage = Math.max(1, totalPages - displayPages + 1);
    //     }

    //     const buttonStyle = {
    //         textDecoration: 'none',
    //         fontSize: '24px',
    //     };

    //     // First page button
    //     buttons.push(
    //         <button key="<<-" onClick={() => paginate(1)} style={buttonStyle}>
    //             {"<< "}
    //         </button>
    //     );

    //     // Previous page button
    //     buttons.push(
    //         <button key="<-" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} style={buttonStyle}>
    //             {"< "}
    //         </button>
    //     );

    //     // Page number buttons
    //     for (let i = startPage; i <= endPage; i++) {
    //         buttons.push(
    //             <button
    //                 key={i}
    //                 onClick={() => paginate(i)}
    //                 style={{ ...buttonStyle, textDecoration: currentPage === i ? 'underline' : 'none' }}
    //             >
    //                 {i}
    //             </button>
    //         );
    //     }

    //     // Next page button
    //     buttons.push(
    //         <button key="->" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} style={buttonStyle}>
    //             {"> "}
    //         </button>
    //     );

    //     // Last page button
    //     buttons.push(
    //         <button key="->>" onClick={() => paginate(totalPages)} style={buttonStyle}>
    //             {">> "}
    //         </button>
    //     );

    //     return buttons;
    // };

    const handleDeleteMovieFromList = (movie_id: number) => {
        let movie_ids: number[] = []
        currentItems.movies && currentItems.movies.map((item) => (movie_ids.push(item.id)))
        movie_ids = movie_ids.filter((item) => item !== movie_id)
        const payload: IUpdateMovieList = {
            name: currentItems.name,
            description: currentItems.description,
            is_deleted: false,
            id: currentItems.id,
            movies: movie_ids,
        }
        dispatch(updateMovieList(payload))
        alert('Xóa phim khỏi danh sách thành công')
        window.location.reload()
    }

    return (
        <>
            <div>
                <div className="mt-3 ms-5">
                </div>
                <div className="d-flex flex-wrap justify-content-start">
                    {currentItems.movies ? currentItems.movies.map((item) => (
                        <div className='me-3 ms-4 mt-4 mb-4' key={item.id}>
                            <button className="btn btn-danger ms-1 mb-1" onClick={() => handleDeleteMovieFromList(item.id)}>xóa phim khỏi danh sách</button>
                            <ListFilmCard key={item.id} item={item} />
                        </div>
                    ))
                        :
                        <div className="m-1 ms-4">
                            Không có phim nào trong danh sách
                        </div>
                    }
                </div>
            </div>
        </>
    );
}

export default DetailMovieList;