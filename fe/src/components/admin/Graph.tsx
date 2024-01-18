import { Bar } from "react-chartjs-2";

import { useAppSelector } from "../../app/hooks";
import { useEffect, useState } from "react";
import BarChart from "./BarChar";

function Graph() {
    const listViewsByGenre = useAppSelector(store => store.admin.listViewsByGenre);
    const listRatingsByGenre = useAppSelector(store => store.admin.listRatingsByGenre);
    const listViewsBySubgenre = useAppSelector(store => store.admin.listViewsBySubgenre);
    // const topListed = useAppSelector(store => store.admin.topListed);
    const [viewByGenreData, setViewByGenreData] = useState({
        labels: listViewsByGenre.map((item: { genre: string }) => item.genre),
        datasets: [
            {
                label: 'Lượt xem',
                data: listViewsByGenre.map((item: { viewcount: number }) => item.viewcount),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    });

    const [viewBySubGenreData, setViewBySubGenreData] = useState({
        labels: listViewsBySubgenre.map((item: { subgenre: string }) => item.subgenre),
        datasets: [
            {
                label: 'Lượt xem',
                data: listViewsBySubgenre.map((item: { viewcount: number }) => item.viewcount),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    });

    const [ratingByGenre, setRatingByGenre] = useState({
        labels: listRatingsByGenre.map((item: { genre: string }) => item.genre),
        datasets: [
            {
                label: 'Điểm đánh giá',
                data: listRatingsByGenre.map((item: { rating: number }) => item.rating / 2),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    });

    const [mainGenreGraphOpen, setMainGenreGraphOpen] = useState(false);
    const [subGenreGraphOpen, setSubGenreGraphOpen] = useState(false);
    const [ratingGraphOpen, setRatingGraphOpen] = useState(false);

    const toggleMainGenreGraph = () => {
        setMainGenreGraphOpen(!mainGenreGraphOpen);
        setSubGenreGraphOpen(false);
        setRatingGraphOpen(false);
    };

    const toggleSubGenreGraph = () => {
        setSubGenreGraphOpen(!subGenreGraphOpen);
        setMainGenreGraphOpen(false);
        setRatingGraphOpen(false);
    }

    const toggleRatingGraph = () => {
        setRatingGraphOpen(!ratingGraphOpen);
        setMainGenreGraphOpen(false);
        setSubGenreGraphOpen(false);
    }

    return (
        <>
            <div>
                <div>
                    <div
                        // className="btn btn-primary m-1"
                        className={`btn btn-primary mb-2 me-2 ms-2 ${mainGenreGraphOpen ? 'active' : ''}`}
                        onClick={toggleMainGenreGraph}
                    >
                        Lượt xem theo thể loại chính </div>
                    <div
                        // className="btn btn-primary m-1"
                        className={`btn btn-primary mb-2 me-2 ms-2 ${subGenreGraphOpen ? 'active' : ''}`}
                        onClick={toggleSubGenreGraph}
                    >
                        Lượt xem theo thể loại phụ </div>
                    <div
                        // className="btn btn-primary m-1"
                        className={`btn btn-primary mb-2 me-2 ms-2 ${ratingGraphOpen ? 'active' : ''}`}
                        onClick={toggleRatingGraph}
                    >
                        Đánh giá trung bình thể loại chính </div>
                </div>
                <div>
                    <div className={`collapse ${mainGenreGraphOpen ? 'show' : ''}`}>
                        <BarChart chartData={viewByGenreData} />
                    </div>
                </div>
                <div>
                    <div className={`collapse ${subGenreGraphOpen ? 'show' : ''}`} >
                        <BarChart chartData={viewBySubGenreData} />
                    </div>
                </div>
                <div>
                    <div className={`collapse ${ratingGraphOpen ? 'show' : ''}`}>
                        <BarChart chartData={ratingByGenre} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Graph;