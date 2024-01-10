import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IMovieList, IMovieListPublic, IUpdateMovieList } from "../../types/movieList";
import { getMovieList, updateMovieList } from "../movieList/movieListApi";
import { IMovie } from "../../types/movies";

interface AddToListModalProps {
    currentMovie: IMovie
}

function AddToListModal(props: AddToListModalProps) {
    const personalList = useAppSelector(store => store.movieList.personal_list);
    const dispatch = useAppDispatch()

    const getPersonalMovieList = async () => {
        const payload: IMovieListPublic = {
            page: 0,
            page_size: 9999,
            is_deleted: false,
        }
        await dispatch(getMovieList(payload))
    }

    useEffect(() => {
        getPersonalMovieList()
    }, [])

    const handleAddMovie = (currentList:IMovieList) => {
        let movie_ids : number[] = []
        currentList.movies.map((item) => (movie_ids.push(item.id)))
        // localStorage.setItem('')

        const payload : IUpdateMovieList = {
            name : currentList.name,
            description : currentList.description,
            is_deleted : false,
            id : currentList.id,
            movies: movie_ids,
        }
        dispatch(updateMovieList(payload))
    }

    return (
        <>
            <div>
                <h2 style={{ textAlign: 'center' }}>Lưu video vào</h2>
                <div className="d-flex flex-column " style={{ backgroundColor: '#dddddd' }}>
                    {personalList.list && personalList.list.map((item) => (
                        <div
                            className="m-2 w-50 align-self-center"
                            style={{ border: '1px solid black', textAlign: 'center', cursor: 'pointer' }}
                            onClick={() => handleAddMovie(item)}
                        > {item.name} </div>
                    ))}
                </div>
                <div className="d-flex justify-content-center">
                    <div className="btn btn-primary m-2">Tạo danh sách mới</div>
                </div>
            </div>
        </>
    );
}

export default AddToListModal;