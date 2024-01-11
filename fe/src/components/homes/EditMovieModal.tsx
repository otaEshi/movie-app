import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IMovieList, IMovieListPublic, IUpdateMovieList } from "../../types/movieList";
import { getMovieList, updateMovieList } from "../movieList/movieListApi";
import { IMovie, IUpdateMoviePayload } from "../../types/movies";
import { updateMovieRequest } from "../admin/adminApi";

interface EditMovieModalProps {
    currentMovie: IMovie
}

function EditMovieModal(props: EditMovieModalProps) {
    const dispatch = useAppDispatch()
    
    const [title, setTitle] = useState<string>(props.currentMovie.title)
    const [description, setDescription] = useState<string>(props.currentMovie.description)
    const [date_of_release, setDate_of_release] = useState<string>(props.currentMovie.date_of_release)
    const [url, setUrl] = useState<string>(props.currentMovie.url)
    const [genre, setGenre] = useState<string>(props.currentMovie.genre)
    const [source, setSource] = useState<string>(props.currentMovie.source)
    // const [subgenre, setSubgenre] = useState<string[]>(props.currentMovie.subgenre)

    const handleUpdateMovie = () => {


        const payload: IUpdateMoviePayload = {
            id: props.currentMovie.id,
            title: title,
            description: description,
            date_of_release: date_of_release,
            url: url,
            genre: genre,
            source: source,
            // subgenre: subgenre,
            is_deleted: false
        }
        dispatch(updateMovieRequest(payload))
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate_of_release(e.target.value)
    };



    return (
        <>
            <div className="m-2">
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Tên Phim
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Mô tả
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="date" className="col-form-label">
                        Ngày ra mắt
                    </label>
                    <input
                        type="date"
                        className="form-control"
                        id="date"
                        value={date_of_release}
                        onChange={handleDateChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="url" className="form-label">
                        Đường dẫn phim
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="genre" className="form-label">
                        Thể loại chính
                    </label>
                    <select
                        className="form-select"
                        id="genre"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                    >
                        <option value="The thao">Thể thao</option>
                        <option value="Am nhac">Âm nhạc</option>
                        <option value="Du lich">Du lịch</option>
                    </select>
                </div>
                {/* <div className="mb-3">
                    <label htmlFor="subgenre" className="form-label">
                        Thể loại phụ
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="subgenre"
                        value={subgenre}
                        onChange={(e) => {
                            // Split by comma and remove all spaces
                            const new_subgenres = e.target.value.split(',').map((s) => s.trim())
                            setSubgenre(new_subgenres)
                        }}
                        placeholder="Thể loại phụ 1, thể loại phụ 2, thể loại phụ 3,..."
                    />
                </div> */}
                <div className="mb-3">
                    <label htmlFor="source" className="form-label">
                        Nguồn
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="source"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        placeholder="Youtube, Tiktok, ..."
                    />
                </div>
                <div className="btn btn-primary" onClick={handleUpdateMovie}>Cập nhật</div>
                {/* <div className="btn btn-danger" onClick={handleCreateMovie}>Xóa</div> */}
                {/* <div className="btn btn-warning" onClick={handleCreateMovie}>Hủy</div> */}
            </div>
        </>
    );
}

export default EditMovieModal;