import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ListFilmCard from "../listFilm/ListFilmCard";
import SearchPanel from "./SearchPanel";
import { IAdvancedSearchPayload } from "../../types/search";
import { advancedSearchRequest } from "./searchApi";
import { moviesViewBySubGenreRequest } from "../admin/adminApi";

function SearchResultContainer() {
    const dispatch = useAppDispatch();
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
        // if (page < 1) {
        //     return;
        // }
        // if (page > searchList.max_page) {
        //     setCurrentPage(searchList.max_page)
        //     return;
        // }
        // setCurrentPage(page);
        const payload: IAdvancedSearchPayload = {
            page: page,
            page_size: 12,
            title: title,
            genre: genre,
            subgenre: subgenre,
            source: source,
            max_rating: max_rating,
            min_rating: min_rating,
        }
        const res = dispatch(advancedSearchRequest(payload));
    }

    useEffect(() => {
      dispatch(moviesViewBySubGenreRequest())
    },[])

    return (
        <>
            {/* <div>temp</div>
            {searchList.list.map((item) => {
                <>
                    <ListFilmCard key={item.id} item={item} />
                    <div> check working</div>
                </>
            })}
            <div>temp 2</div> */}
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
                        is_for_one_genre={false}
                    >

                    </SearchPanel>
                </div>
                
            </div>
            <div className="d-flex flex-wrap">
                <MoviesSearch></MoviesSearch>
            </div>
            {searchList &&
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

export default SearchResultContainer;