import { IMovieInTopList } from "../../types/admin";

interface TopListMovieCardProps {
    item: IMovieInTopList
}

function TopListMovieCard(props: TopListMovieCardProps) {
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
                    <strong>Số lần được thêm vào danh sách: </strong> {props.item.ml_count} 
                </div>
            </div>
        </>
     );
}

export default TopListMovieCard;