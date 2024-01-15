import { useEffect, useState } from "react";
import { IAdvancedSearchPayload } from "../../types/search";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { advancedSearchRequest } from "./searchApi";

interface SearchPanelProps {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    changePage: (page: number) => void;
    title: string;
    setTitle: (title: string) => void;
    genre: string;
    setGenre: (genre: string) => void;
    subgenre: string;
    setSubgenre: (subgenre: string) => void;
    source: string;
    setSource: (source: string) => void;
}

function SearchPanel(props: SearchPanelProps) {
    const dispatch = useAppDispatch();
    const searchList = useAppSelector(store => store.search.search_list)

    // const [title, setTitle] = useState("");
    // const [genre, setGenre] = useState("The thao");
    // const [subgenre, setSubgenre] = useState("");
    // const [source, setSource] = useState("");

    


    // const changePage = (page: number) => {
    //     if (page < 1) {
    //         return;
    //     }
    //     if (page > searchList.max_page) {
    //         setCurrentPage(searchList.max_page)
    //         return;
    //     }
    //     setCurrentPage(page);
    // }

    // const getMoviePerPage = (page: number) => {
    //     // if (page < 1) {
    //     //     return;
    //     // }
    //     // if (page > searchList.max_page) {
    //     //     setCurrentPage(searchList.max_page)
    //     //     return;
    //     // }
    //     props.setCurrentPage(page);
    //     const payload: IAdvancedSearchPayload = {
    //         page: page,
    //         page_size: 12,
    //         title: title,
    //         genre: genre,
    //         subgenre: subgenre,
    //         source: source,
    //     }
    //     const res = dispatch(advancedSearchRequest(payload));
    // }

    

    const handleSearch = () => {
        const payload: IAdvancedSearchPayload = {
            page: 0,
            page_size: 12,
            title: props.title,
            genre: props.genre,
            subgenre: props.subgenre,
            source: props.source,
        }
        const res = dispatch(advancedSearchRequest(payload));
    }

    return (
        <>
            <div className="mb-3">
                <label htmlFor="title" className="form-label">
                    Tên Phim
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={props.title}
                    onChange={(e) => props.setTitle(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="genre" className="form-label">
                    Thể loại chính
                </label>
                <select
                    className="form-select"
                    id="genre"
                    value={props.genre}
                    onChange={(e) => props.setGenre(e.target.value)}
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
                    value={props.subgenre}
                    onChange={(e) => {
                        props.setSubgenre(e.target.value)
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
                    value={props.source}
                    onChange={(e) => props.setSource(e.target.value)}
                    placeholder="Youtube, Tiktok, ..."
                />
            </div>
            <div className="btn btn-primary" onClick={handleSearch}>Tìm kiếm</div>
        </>
    );
}

export default SearchPanel;