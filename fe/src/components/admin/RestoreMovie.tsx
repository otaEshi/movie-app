import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ISearchStringPayload } from "../../types/search";
import { getDeletedRequest } from "./adminApi";
import './style.css';
import ListFilmCard from "../listFilm/ListFilmCard";
import { Modal } from "react-bootstrap";
import RestoreMovieCard from "./RestoreMovieCard";

function RestoreMovie() {
    const [search, setSearch] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(0);
    
    const dispatch = useAppDispatch();
    const deletedMovieList = useAppSelector(store => store.admin.deletedMovieList)

    const handleSearch = async (page: number) => {
        if (search.trim() === '') {
            return;
        }
        const payload: ISearchStringPayload = {
            search_string: search.trim(),
            page: page,
            page_size: 12,
            is_deleted: true
        }
        await dispatch(getDeletedRequest(payload))
    }

    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { id, value } = e.target;
    //     if (id === 'search') {
    //         setSearch(value);
    //     }
    // };

    const changePage = (page: number) => {
        if (page < 1) {
            return;
        }
        if (page > deletedMovieList.max_page) {
            setCurrentPage(deletedMovieList.max_page)
            return;
        }
        setCurrentPage(page);
    }

    useEffect(() => {
        handleSearch(currentPage-1)
    }, [currentPage])


    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (search.trim() !== '') {
                handleSearch(0);
            }
        }
    };
    return (
        <>
            <div>
                {/* <button className="ms-2 header-button" onClick={handleSearch}><i className="fa fa-search custom-i" aria-hidden="true"></i></button> */}
                {/* <input id='search' onKeyDown={handleKeyPress} className="input-search" type="text" name="q" placeholder="  Tìm kiếm theo tên/thể loại" autoComplete="off" onChange={(e) => handleInputChange(e)}></input> */}
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        <strong style={{ fontSize: '20px' }}>Tìm kiếm</strong>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                </div>
                <div className="d-flex flex-wrap">
                    {deletedMovieList && deletedMovieList.list && deletedMovieList.list.map((item) => (
                        <div className="m-4" key={item.id}>
                            <RestoreMovieCard item={item} />
                        </div>
                    ))}
                </div>
                {deletedMovieList &&
                    <div className="pagination-container">
                        <span
                            className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={() => changePage(1)}
                        >
                            {'<<'}
                        </span>
                        <span
                            className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={() => changePage(currentPage - 1)}
                        >
                            {'<'}
                        </span>
                        {Array.from({ length: 5 }, (_, index) => currentPage - 2 + index).map((page) =>
                            (page > 0 && page <= deletedMovieList.max_page) ? (
                                <span
                                    key={page}
                                    className={`pagination-item ${page === currentPage ? 'active' : ''}`}
                                    onClick={() => changePage(page)}
                                >
                                    {page}
                                </span>
                            ) : null
                        )}
                        <span
                            className={`pagination-item ${currentPage === deletedMovieList.max_page ? 'disabled' : ''}`}
                            onClick={() => changePage(currentPage + 1)}
                        >
                            {'>'}
                        </span>
                        <span
                            className={`pagination-item ${currentPage === deletedMovieList.max_page ? 'disabled' : ''}`}
                            onClick={() => changePage(deletedMovieList.max_page)}
                        >
                            {'>>'}
                        </span>
                    </div>
                }
            </div>

        </>
    );
}

export default RestoreMovie;