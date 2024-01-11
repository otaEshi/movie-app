import { useAppSelector } from "../../app/hooks";
import ListFilmCard from "../listFilm/ListFilmCard";

function SearchResultContainer() {
    const searchList = useAppSelector(store => store.search.search_list)
    console.log('searching', searchList.list)

    const MoviesSearch = () => {
        return searchList.list.map((item) => (
            <div className="m-4" key={item.id}>
                <ListFilmCard item={item} />
            </div>
        ));
    };


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
            <div className="d-flex flex-wrap">
                <MoviesSearch></MoviesSearch>
            </div>
        </>
    );
}

export default SearchResultContainer;