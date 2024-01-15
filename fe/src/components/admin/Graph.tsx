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
                label: 'Lượt xem',
                data: listRatingsByGenre.map((item: { viewcount: number }) => item.viewcount),
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

    return (
        <>
            <div>
                <div>
                    <div className="mt-2">Lượt xem theo thể loại chính</div>
                    <BarChart chartData={viewByGenreData} />
                </div>
                <div>
                    <div className="mt-2">Lượt xem theo thể loại phụ</div>
                    <BarChart chartData={viewBySubGenreData} />
                </div>
                <div>
                    <div className="mt-2">Đánh giá trung bình theo thể loại chính</div>
                    <BarChart chartData={ratingByGenre} />
                </div>
            </div>
        </>
    );
}

export default Graph;