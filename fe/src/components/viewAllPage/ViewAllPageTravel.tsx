import { SetStateAction, useState } from 'react';
import { sport, music, travel } from '../../dummyData';
import ListFilmCard from '../listFilm/ListFilmCard';
import './viewAllPage.scss';

// interface ViewAllPageProps {
//     items: Array<{
//         id: number;
//         cover: string;
//         name: string;
//         time: string;
//     }>;
//     title: string;
// }

function ViewAllPageTravel() {
    const [travels, setTravels] = useState(travel);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [moviesPerPage, setMoviesPerPage] = useState<number>(20);

    const indexOfLastItem = currentPage * moviesPerPage;
    const indexOfFirstItem = indexOfLastItem - moviesPerPage;
    const currentItems = travels.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(travels.length / moviesPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleMoviesPerPageChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setMoviesPerPage(value);
        setCurrentPage(1);
    };

    const renderPaginationButtons = () => {
        const buttons = [];

        const displayPages = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (currentPage <= 2) {
            endPage = Math.min(displayPages, totalPages);
        } else if (currentPage >= totalPages - 2) {
            startPage = Math.max(1, totalPages - displayPages + 1);
        }

        const buttonStyle = {
            textDecoration: 'none',
            fontSize: '24px',
        };

        // First page button
        buttons.push(
            <button key="<<-" onClick={() => paginate(1)} style={buttonStyle}>
                {"<< "}
            </button>
        );

        // Previous page button
        buttons.push(
            <button key="<-" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} style={buttonStyle}>
                {"< "}
            </button>
        );

        // Page number buttons
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => paginate(i)}
                    style={{ ...buttonStyle, textDecoration: currentPage === i ? 'underline' : 'none' }}
                >
                    {i}
                </button>
            );
        }

        // Next page button
        buttons.push(
            <button key="->" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} style={buttonStyle}>
                {"> "}
            </button>
        );

        // Last page button
        buttons.push(
            <button key="->>" onClick={() => paginate(totalPages)} style={buttonStyle}>
                {">> "}
            </button>
        );

        return buttons;
    };

    return (
        <>
            <div>
                <div className="mt-3 ms-5">
                    <label>
                        Hiện
                        <select className='m-1' value={moviesPerPage} onChange={handleMoviesPerPageChange}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        phim
                    </label>

                </div>
                <div className="d-flex flex-wrap justify-content-start">
                    {currentItems.map((travel) => (
                        <div className='me-3 ms-4 mt-4 mb-4' key={travel.id}>
                            <ListFilmCard key={travel.id} item={travel} />
                        </div>
                    ))}
                </div>
                <div className="pagination justify-content-center ms-5 me-5 custom-btn-container">
                    {renderPaginationButtons()}
                </div>
            </div>
        </>
    );
}

export default ViewAllPageTravel;