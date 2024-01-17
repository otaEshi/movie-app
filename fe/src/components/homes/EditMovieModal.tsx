import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IMovieList, IMovieListPublic, IUpdateMovieList } from "../../types/movieList";
import { getMovieList, updateMovieList } from "../movieList/movieListApi";
import { IMovie, IUpdateMoviePayload } from "../../types/movies";
import { updateMovieRequest } from "../admin/adminApi";

interface EditMovieModalProps {
    currentMovie: IMovie
    setOpenedModal: React.Dispatch<React.SetStateAction<boolean>>
}

function EditMovieModal(props: EditMovieModalProps) {
    const dispatch = useAppDispatch()

    const [title, setTitle] = useState<string>(props.currentMovie.title || '')
    const [description, setDescription] = useState<string>(props.currentMovie.description || '')
    const [date_of_release, setDate_of_release] = useState<string>(props.currentMovie.date_of_release || '')
    const [url, setUrl] = useState<string>(props.currentMovie.url || '')
    const [genre, setGenre] = useState<string>(props.currentMovie.genre || '')
    const [source, setSource] = useState<string>(props.currentMovie.source || '')
    const [subgenre, setSubgenre] = useState<string>(props.currentMovie.subgenre || '')
    const [thumbnail_url, setThumbnail_url] = useState<string>(props.currentMovie.thumbnail_url || '')

    const handleUpdateMovie = () => {
        const payload: IUpdateMoviePayload = {
            id: props.currentMovie.id,
            title: title.trim(),
            description: description.trim(),
            date_of_release: date_of_release.trim(),
            url: url.trim(),
            genre: genre.trim(),
            source: source.trim(),
            subgenre: subgenre.trim(),
            is_deleted: false,
            thumbnail_url: thumbnail_url,
        }
        dispatch(updateMovieRequest(payload))
        alert('Cập nhật thành công')
        props.setOpenedModal(false)

        // window.location.reload();
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
                        placeholder="https://www.youtube.com/embed/<video-id>"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="thumbnail_url" className="form-label">
                        Đường dẫn ảnh mô tả
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="thumbnail_url"
                        value={thumbnail_url}
                        onChange={(e) => setThumbnail_url(e.target.value)}
                        placeholder="https://img.youtube.com/vi/<video-id>/hqdefault.jpg"
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
                        <option value="Thể thao">Thể thao</option>
                        <option value="Âm nhạc">Âm nhạc</option>
                        <option value="Du lịch">Du lịch</option>
                    </select>
                </div>
                <div className="mb-3">
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
                            // const new_subgenres = e.target.value.split(',').map((s) => s.trim())
                            setSubgenre(e.target.value)
                        }}
                        placeholder="Thể loại phụ 1, thể loại phụ 2, thể loại phụ 3,..."
                    />
                </div>
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
                <div className="d-flex justify-content-center">
                    <div className="btn btn-primary" onClick={handleUpdateMovie}>Cập nhật</div>
                </div>
                {/* <div className="btn btn-danger" onClick={handleCreateMovie}>Xóa</div> */}
                {/* <div className="btn btn-warning" onClick={handleCreateMovie}>Hủy</div> */}
            </div>
        </>
    );
}

export default EditMovieModal;