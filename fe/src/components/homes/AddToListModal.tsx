import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IMovieList, IMovieListPublic, IUpdateMovieList } from "../../types/movieList";
import { getMovieList, updateMovieList } from "../movieList/movieListApi";
import { IMovie } from "../../types/movies";
import { Modal } from "react-bootstrap";
import CreateMovieListModal from "../movieList/CreateMovieListModal";

interface AddToListModalProps {
    currentMovie: IMovie
}

function AddToListModal(props: AddToListModalProps) {
    const personalList = useAppSelector(store => store.movieList.personal_list);
    const dispatch = useAppDispatch()
    const [openCreateNewListModal, setOpenCreateNewListModal] = useState<boolean>(false)

    const getPersonalMovieList = async () => {
        const payload: IMovieListPublic = {
            page: 0,
            page_size: 999,
            is_deleted: false,
        }
        await dispatch(getMovieList(payload))
    }

    useEffect(() => {
        getPersonalMovieList()
    }, [])

    const handleAddMovie = (currentList:IMovieList) => {
        let chosenList = JSON.parse(localStorage.getItem('chosenList') || '[]')
        if (currentList.movies && (currentList.movies.find((item) => (item.id === props.currentMovie.id)) || chosenList.map((item: number) => (item === props.currentMovie.id)))) {
            alert('Phim đã có trong danh sách')
        } else {
            let movie_ids : number[] = []
            movie_ids.push(props.currentMovie.id)
            currentList.movies && currentList.movies.map((item) => (movie_ids.push(item.id)))
            // localStorage.setItem('')
    
            const payload : IUpdateMovieList = {
                name : currentList.name,
                description : currentList.description,
                is_deleted : false,
                id : currentList.id,
                movies: movie_ids,
            }
            dispatch(updateMovieList(payload))
            
            chosenList.push(props.currentMovie.id)
            localStorage.setItem('chosenList', JSON.stringify(chosenList))
            alert('Thêm thành công')
        }
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
                    <div className="btn btn-primary m-2" onClick={() => setOpenCreateNewListModal(true)}>Tạo danh sách mới</div>
                </div>
            </div>
            <Modal
                show={openCreateNewListModal}
                onHide={() => setOpenCreateNewListModal(false)}
                // centered
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            // size='lg'
            >
                <CreateMovieListModal
                    setOpenCreateMovieModal={setOpenCreateNewListModal}
                >

                </CreateMovieListModal>
            </Modal>

        </>
    );
}

export default AddToListModal;