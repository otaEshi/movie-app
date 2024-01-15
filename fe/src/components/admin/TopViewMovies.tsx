import { IMovie } from "../../types/movies";

interface TopViewMoviesProps {
    item: IMovie
}

function TopViewMovies(props: TopViewMoviesProps) {
    return ( 
        <>
            <div className=" d-flex">
                <div className="m-2 me-3 ">
                    <strong>Id: </strong> {props.item.id}
                </div>
                <div className="m-2 me-3">
                    <strong>Tên phim: </strong> {props.item.title} 
                </div>
                <div className="m-2">
                    <strong>Số lượt xem: </strong> {props.item.views} 
                </div>
            </div>
        </>
     );
}

export default TopViewMovies;