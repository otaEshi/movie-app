import { SetStateAction, useEffect, useState } from 'react';
import { sport, music, travel } from '../../dummyData';
import ListFilmCard from '../listFilm/ListFilmCard';
import './viewAllPage.scss';
import { IAdvancedSearchPayload, ISearchPayload, ISearchResponse } from '../../types/search';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { advancedSearchRequest, searchRequest } from '../search/searchApi';
import SearchPanel from '../search/SearchPanel';
import { moviesViewBySubGenreRequest } from '../admin/adminApi';

function ViewAllPageMusic() {
    const dispatch = useAppDispatch()
    const musicList = useAppSelector(store => store.search.search_list)

    const [search, setSearch] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'search') {
            setSearch(value);
        }
    };
    const searchMusic = async () => {
        const payload: ISearchPayload = {
            search_string: 'Âm nhạc',
            page_size: 12,
            is_deleted: false,
        }
        await dispatch(searchRequest(payload))
    }

    const filteredMusicList = musicList.list.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        searchMusic()
    }, [])

    // advance search
    const searchList = useAppSelector(store => store.search.search_list)
    const [currentPage, setCurrentPage] = useState<number>(0);

    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("Âm nhạc");
    const [subgenre, setSubgenre] = useState("");
    const [source, setSource] = useState("");
    const [max_rating, setMax_Rating] = useState(10);
    const [min_rating, setMin_Rating] = useState(0);

    const MoviesSearch = () => {
        return searchList.list.map((item) => (
            <div className="m-4" key={item.id}>
                <ListFilmCard item={item} />
            </div>
        ));
    };

    const changePage = (page: number) => {
        if (page < 1) {
            return;
        }
        if (page > searchList.max_page) {
            setCurrentPage(searchList.max_page)
            return;
        }
        setCurrentPage(page);
    }

    useEffect(() => {
        getMoviePerPage(currentPage-1)
    }, [currentPage])

    const getMoviePerPage = (page: number) => {
        const payload: IAdvancedSearchPayload = {
            page: page,
            page_size: 12,
            title: title,
            genre: genre,
            subgenre: subgenre,
            source: source,
            max_rating: max_rating,
            min_rating: min_rating,
            is_deleted: false,
        }
        const res = dispatch(advancedSearchRequest(payload));
    }

    useEffect(() => {
      dispatch(moviesViewBySubGenreRequest())
    },[])

    return (
        // <>
        //     <div>
        //         <div>
        //             <h1 style={{textAlign:'center'}}> Thể loại: Âm nhạc</h1>
        //             <div className='ms-4' >
        //                 <button className="ms-2 header-button" ><i className="fa fa-search custom-i" aria-hidden="true"></i></button>
        //                 <div className='d-flex justify-content-center'>
        //                     <input id='search'  className="form-control w-50" type="text" name="q" placeholder="  Tìm kiếm theo tên" autoComplete="off" onChange={(e) => handleInputChange(e)}></input>
        //                 </div>
        //             </div>
        //             <div className="mt-3 ms-5">
        //             </div>
        //             <div className="d-flex flex-wrap justify-content-start">
        //                 {filteredMusicList.map((item) => (
        //                     <div className='me-3 ms-4 mt-4 mb-4' key={item.id}>
        //                         {/* <button className="btn btn-danger ms-1 mb-1" onClick={() => handleDeleteMovieFromList(item.id)}>xóa phim khỏi danh sách</button> */}
        //                         <ListFilmCard key={item.id} item={item} />
        //                     </div>
        //                 ))}
        //             </div>
        //         </div>

        //     </div>
        // </>
        <>
            <div className="m-3 ">
                <div
                    className="btn btn-primary mb-2"
                    data-bs-toggle='collapse'
                    data-bs-target='#collapseSearchPanel'
                    aria-expanded="false"
                    aria-controls="collapseSearchPanel"
                >
                    Tìm kiếm nâng cao
                </div>
                <div className="collapse" id="collapseSearchPanel">
                    <SearchPanel
                        changePage={changePage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        title={title}
                        setTitle={setTitle}
                        genre={genre}
                        setGenre={setGenre}
                        subgenre={subgenre}
                        setSubgenre={setSubgenre}
                        source={source}
                        setSource={setSource}
                        max_rating={max_rating}
                        setMax_Rating={setMax_Rating}
                        min_rating={min_rating}
                        setMin_Rating={setMin_Rating}
                        is_for_one_genre={true}
                    >

                    </SearchPanel>
                </div>

            </div>
            <div className="d-flex flex-wrap">
                <MoviesSearch></MoviesSearch>
            </div>
            {searchList &&
                <div className="pagination-container pt-4 mt-3">
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
                        (page > 0 && page <= searchList.max_page) ? (
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
                        className={`pagination-item ${currentPage === searchList.max_page ? 'disabled' : ''}`}
                        onClick={() => changePage(currentPage + 1)}
                    >
                        {'>'}
                    </span>
                    <span
                        className={`pagination-item ${currentPage === searchList.max_page ? 'disabled' : ''}`}
                        onClick={() => changePage(searchList.max_page)}
                    >
                        {'>>'}
                    </span>
                </div>
            }
        </>
    );
}

export default ViewAllPageMusic;