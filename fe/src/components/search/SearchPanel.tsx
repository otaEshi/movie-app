import { useEffect, useState } from "react";
import { IAdvancedSearchPayload } from "../../types/search";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { advancedSearchRequest } from "./searchApi";
import SubgenreSelector from "./SubgenreSelector";

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
    max_rating: number;
    setMax_Rating: (rating: number) => void;
    min_rating: number;
    setMin_Rating: (rating: number) => void;
    is_for_one_genre: boolean;
}

function SearchPanel(props: SearchPanelProps) {
    const dispatch = useAppDispatch();
    const searchList = useAppSelector(store => store.search.search_list)

    const handleSearch = () => {
        if (props.max_rating < props.min_rating) {
            alert("Đánh giá tối đa phải lớn hơn hoặc bằng đánh giá tối thiểu");
            return;
        }
        props.setCurrentPage(1);
        const payload: IAdvancedSearchPayload = {
            page: 0,
            page_size: 12,
            title: props.title,
            genre: props.genre,
            subgenre: props.subgenre,
            source: props.source,
            max_rating: props.max_rating,
            min_rating: props.min_rating,
            is_deleted: false,
        }
        const res = dispatch(advancedSearchRequest(payload));
    }

    // const [subgenre, setSubgenre] = useState('');

    const handleSubgenresSelected = (selectedSubgenres: string[]) => {
        props.setSubgenre(selectedSubgenres.join(', '));
    };

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
                    disabled={props.is_for_one_genre}
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
                <SubgenreSelector onSubgenresSelected={handleSubgenresSelected} />
                {/* <input
                    type="text"
                    className="form-control"
                    id="subgenre"
                    value={props.subgenre}
                    onChange={(e) => {
                        props.setSubgenre(e.target.value)
                    }}
                    placeholder="Thể loại phụ 1, thể loại phụ 2, thể loại phụ 3,..."
                /> */}
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
            <div>
                <div className="mb-3">
                    <label htmlFor="max_rating" className="form-label">
                        Đánh giá tối đa
                    </label>
                    <select
                        className="form-select"
                        id="max_rating"
                        value={props.max_rating}
                        onChange={(e) => props.setMax_Rating(Number(e.target.value))}
                    >
                        <option value={0}>0</option>
                        <option value={1}>0.5</option>
                        <option value={2}>1</option>
                        <option value={3}>1.5</option>
                        <option value={4}>2</option>
                        <option value={5}>2.5</option>
                        <option value={6}>3</option>
                        <option value={7}>3.5</option>
                        <option value={8}>4</option>
                        <option value={9}>4.5</option>
                        <option value={10}>5</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="min_rating" className="form-label">
                        Đánh giá tối thiểu
                    </label>
                    <select
                        className="form-select"
                        id="min_rating"
                        value={props.min_rating}
                        onChange={(e) => props.setMin_Rating(Number(e.target.value))}
                    >
                        <option value={0}>0</option>
                        <option value={1}>0.5</option>
                        <option value={2}>1</option>
                        <option value={3}>1.5</option>
                        <option value={4}>2</option>
                        <option value={5}>2.5</option>
                        <option value={6}>3</option>
                        <option value={7}>3.5</option>
                        <option value={8}>4</option>
                        <option value={9}>4.5</option>
                        <option value={10}>5</option>
                    </select>
                </div>
            </div>
            <div className="btn btn-primary" onClick={handleSearch}>Tìm kiếm</div>
        </>
    );
}

export default SearchPanel;