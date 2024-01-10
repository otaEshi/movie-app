import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IMovieListPublic } from "../../types/movieList";
import { delMovieList, getMovieList } from "./movieListApi";
import MovieListSlide from "./MovieListSlide";
import { Modal } from "react-bootstrap";
import CreateMovieListModal from "./CreateMovieListModal";

function MovieListContainer() {
    const dispatch = useAppDispatch();
    const personalList = useAppSelector(store => store.movieList.personal_list);
    const [openCreateNewListModal, setOpenCreateNewListModal] = useState<boolean>(false)

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

    const handleDeleteList = (listId: number) => {
        if (window.confirm(`Bạn có muốn xóa danh sách ${personalList.list.find(item => item.id === listId)?.name}`)) {
            localStorage.setItem('deleted_list', listId.toString());
            dispatch(delMovieList(listId));
        }

    }



    return (
        <>
            <button className="btn btn-primary" onClick={() => setOpenCreateNewListModal(true)}> Tạo danh sách mới </button>
            <div>Tìm kiếm</div>
            {personalList.list.length > 0 ? personalList.list.map((item) => (
                <div className="position-relative">
                    <button className="btn btn-danger top-0 end-0" onClick={() => handleDeleteList(item.id)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <MovieListSlide key={item.id} movieList={item}></MovieListSlide>
                </div>

            ))
                :
                <div style={{ textAlign: 'center' }}>Hiện không có danh sách</div>
            }

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

export default MovieListContainer;