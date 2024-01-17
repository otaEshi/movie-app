import { Key, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IMovieInTopList, ITopListPayload } from "../../types/admin";
import { topListRequest } from "./adminApi";
import TopListMovieCard from "./TopListMovieCard";
import { ITrendingMoviesPayload } from "../../types/movies";
import { topTrendingForGenreRequest, topTrendingMoviesRequest, topTrendingMoviesRequestForAdmin } from "../homes/homeApi";
import TopViewMovies from "./TopViewMovies";

function Statistical() {
    const dispatch = useAppDispatch();

    // Toplist
    const [topListNumber, setTopListNumber] = useState(1);
    const topListed = useAppSelector(store => store.admin.topListed);
    const handleGetTopList = () => {
        if (topListNumber > 0) {
            const payload: ITopListPayload = {
                top_k: topListNumber,
            }
            dispatch(topListRequest(payload))
        }
    }

    // Top trending all movies
    const [topTrendingAllMoviesNumber, setTopTrendingAllMoviesNumber] = useState(1);
    const topTrendingMoviesAllGenreList = useAppSelector(store => store.home.trendingListAllForAdmin);
    const handleGetTopTrendingAllMovies = () => {
        if (topTrendingAllMoviesNumber > 0) {
            const payload: ITrendingMoviesPayload = {
                top_k: topTrendingAllMoviesNumber,
                is_deleted: false,
            }
            dispatch(topTrendingMoviesRequestForAdmin(payload))
        }
    }

    // Top trending for each genre
    const [genre, setGenre] = useState<string>("Thể thao");
    const [topTrendingGenreMovieNumber, setTopTrendingGenreMovieNumber] = useState(1); // topTrendingAllMoviesNumber
    const topTrendingListForGenre = useAppSelector(store => store.home.trendingListForGenre);
    const handleGetTopTrendingListForGenre = () => {
        if (topTrendingGenreMovieNumber > 0) {
            const payload: ITrendingMoviesPayload = {
                top_k: topTrendingGenreMovieNumber,
                is_deleted: false,
                genre: genre,
            }
            dispatch(topTrendingForGenreRequest(payload))
        }
    }

    // Thống kê
    return (
        <>
            <div>
                <div>
                    <div className="d-flex mb-2">
                        <input
                            type="number"
                            className="form-control align-self-center mt-2"
                            value={topTrendingAllMoviesNumber}
                            onChange={(e) => {
                                const inputValue = Number(e.target.value);

                                if (!isNaN(inputValue) && inputValue >= 0) {
                                    setTopTrendingAllMoviesNumber(inputValue);
                                }
                            }}
                            autoComplete="off"
                            style={{ width: '60px' }}
                        />
                        <span className="mt-3 ms-2 me-3 text-primary" style={{ fontSize: '20px' }}>Phim được xem nhiều nhất</span>
                        <div className="btn btn-primary mt-2" style={{ height: '38px' }} onClick={handleGetTopTrendingAllMovies}>
                            Tìm
                        </div>
                    </div>
                    <div className="border">
                        {topTrendingMoviesAllGenreList.movies.length > 0 && topTrendingMoviesAllGenreList.movies.map((item: any, index: any) => (
                            <div key={index}>
                                <TopViewMovies item={item}></TopViewMovies>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="d-flex mb-2">
                        <input
                            type="number"
                            className="form-control align-self-center mt-2"
                            value={topListNumber}
                            onChange={(e) => {
                                const inputValue = Number(e.target.value);

                                if (!isNaN(inputValue) && inputValue >= 0) {
                                    setTopListNumber(inputValue);
                                }
                            }}
                            autoComplete="off"
                            style={{ width: '60px' }}
                        />
                        <span className="mt-3 ms-2 me-3 text-primary" style={{ fontSize: '20px' }}>Phim được thêm vào danh sách nhiều nhất</span>
                        <div className="btn btn-primary mt-2" style={{ height: '38px' }} onClick={handleGetTopList}>
                            Tìm
                        </div>
                    </div>
                    <div className="border">
                        {topListed && topListed.map((item: IMovieInTopList, index: Key | null | undefined) => (
                            <div key={index}>
                                <TopListMovieCard item={item}></TopListMovieCard>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="d-flex mb-2">
                        <input
                            type="number"
                            className="form-control align-self-center mt-2"
                            value={topTrendingGenreMovieNumber}
                            onChange={(e) => {
                                const inputValue = Number(e.target.value);

                                if (!isNaN(inputValue) && inputValue >= 0) {
                                    setTopTrendingGenreMovieNumber(inputValue);
                                }
                            }}
                            autoComplete="off"
                            style={{ width: '60px' }}
                        />
                        <span className="mt-3 ms-2 me-3 d-flex">
                            <span className="me-2 mt-1 text-primary" style={{ fontSize: '20px' }}>Phim thuộc thể loại</span>
                            <select
                                className="form-select"
                                id="genre"
                                // value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                style={{ width: '120px' }}
                            >
                                <option value="Thể thao">Thể thao</option>
                                <option value="Âm nhạc">Âm nhạc</option>
                                <option value="Du lịch">Du lịch</option>
                            </select>
                            <span className="ms-2 mt-1 text-primary" style={{ fontSize: '20px' }}>được xem nhiều nhất</span>
                        </span>
                        <div className="btn btn-primary mt-3" style={{ height: '38px' }} onClick={handleGetTopTrendingListForGenre}>
                            Tìm
                        </div>
                    </div>
                    <div className="border">
                        {topTrendingListForGenre.movies.length > 0 && topTrendingListForGenre.movies.map((item: any, index: any) => (
                            <div key={index}>
                                <TopViewMovies item={item}></TopViewMovies>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Statistical;