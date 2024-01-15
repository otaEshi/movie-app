import { useState } from "react";
import { ICreateMoviePayload } from "../../types/movies";
import { useAppDispatch } from "../../app/hooks";
import { createMovieRequest } from "./adminApi";

function AddMovie() {
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [date_of_release, setDate_of_release] = useState<string>('')
    const [url, setUrl] = useState<string>('')
    const [genre, setGenre] = useState<string>('Thể thao')
    const [source, setSource] = useState<string>('')
    const [thumbnail_url, setThumbnail_url] = useState<string>('')
    const [subgenre, setSubgenre] = useState<string>('')

    const dispatch = useAppDispatch();

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate_of_release(e.target.value)
    };

    const handleCreateMovie = async () => {
        if (title.trim() === ''){
            alert('Vui lòng nhập tên phim')
            return
        }
        if (description.trim() === ''){
            alert('Vui lòng nhập mô tả')
            return
        }
        if (date_of_release === ''){
            alert('Vui lòng chọn ngày ra mắt')
            return
        }
        if (url.trim() === ''){
            alert('Vui lòng nhập đường dẫn phim')
            return
        }
        if (subgenre.length === 0){
            alert('Vui lòng nhập thể loại phụ')
            return
        }
        if (source.trim() === ''){
            alert('Vui lòng nhập đường dẫn ảnh mô tả')
            return
        }
        const payload : ICreateMoviePayload = {
            title : title.trim(),
            description : description.trim(),
            date_of_release : date_of_release,
            url : url.trim(),
            genre : genre,
            subgenre: subgenre.trim(),
            source : source.trim(),
            thumbnail_url : thumbnail_url.trim(),
        }
        const res = await dispatch(createMovieRequest(payload))

        if (res.type === "api/create_movie/fulfilled"){
            alert('Thêm phim thành công')
        }
    }

    return (
        <>
            <div>
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
                    />
                </div>
                <div className="btn btn-primary" onClick={handleCreateMovie}>Thêm phim</div>
            </div>
        </>
    );
}

export default AddMovie;