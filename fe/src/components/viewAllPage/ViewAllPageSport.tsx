import { SetStateAction, useEffect, useState } from 'react';
import ListFilmCard from '../listFilm/ListFilmCard';
import './viewAllPage.scss';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { IAdvancedSearchPayload, ISearchPayload } from '../../types/search';
import { advancedSearchRequest, searchRequest } from '../search/searchApi';
import { moviesViewBySubGenreRequest } from '../admin/adminApi';
import SearchPanel from '../search/SearchPanel';

function ViewAllPageSport() {
    const dispatch = useAppDispatch()
    const sportList = useAppSelector(store => store.search.search_list)

    const [search, setSearch] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'search') {
            setSearch(value);
        }
    };
    const searchSport = async () => {
        const payload: ISearchPayload = {
            search_string: 'Thể thao',
            page_size: 12,
            is_deleted: false,
        }
        await dispatch(searchRequest(payload))
    }

    const filteredSportList = sportList.list.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        searchSport()
    }, [])

    // advance search
    const searchList = useAppSelector(store => store.search.search_list)
    const [currentPage, setCurrentPage] = useState<number>(0);

    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("Thể thao");
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
                        onClick={() => changePage(searchList.max_page )}
                      >
                        {'>>'}
                      </span>
                    </div>
                  }
        </>
    );
}


export default ViewAllPageSport;