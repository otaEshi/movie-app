import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { createMovieList } from "./movieListApi";
import { ICreateMovieListPayload } from "../../types/movies";

interface CreateMovieListModalProps {
    setOpenCreateMovieModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreateMovieListModal(props: CreateMovieListModalProps) {
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [movieIds, setMovieIds] = useState<number[]>([])

    const dispatch = useAppDispatch()

    const handleCreateMovieList = async () => {
        if (name === '') {
            window.alert('Tên danh sách không được để trống');
            return;
        } 
        const payload: ICreateMovieListPayload = {
            name: name,
            description: description,
            movie_ids: movieIds,
        }
        await dispatch(createMovieList(payload))
        props.setOpenCreateMovieModal(false)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {id, value} = e.target;
        if (id === 'name'){
            setName(value);
        } else if (id === 'description'){
            setDescription(value)
        }
    }

    const handleCancel = () => {
        setName('');
        setDescription('');
        props.setOpenCreateMovieModal(false);
    }

    return (
        <>
            <div className="form-group m-2">
                <label htmlFor="name">Tên danh sách</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Nhập tên danh sách"
                    onChange={(e) => handleInputChange(e)}
                />
            </div>
            <div className="form-group m-2">
                <label htmlFor="description">Mô tả</label>
                <input
                    type="text"
                    className="form-control"
                    id="description"
                    placeholder="Nhập mô tả"
                    onChange={(e) => handleInputChange(e)}
                />
            </div>
            <div className="d-flex justify-content-center">
                <div className="btn btn-primary m-1" onClick={handleCreateMovieList}>Xác nhận</div>
                <div className="btn btn-warning m-1" onClick={handleCancel}>Hủy</div>
            </div>
        </>
    );
}

export default CreateMovieListModal;