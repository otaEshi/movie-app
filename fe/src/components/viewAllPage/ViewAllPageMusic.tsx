import { SetStateAction, useEffect, useState } from 'react';
import { sport, music, travel } from '../../dummyData';
import ListFilmCard from '../listFilm/ListFilmCard';
import './viewAllPage.scss';
import { ISearchPayload, ISearchResponse } from '../../types/search';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { searchRequest } from '../search/searchApi';

function ViewAllPageMusic() {
    const dispatch = useAppDispatch()
    const musicList = useAppSelector(store => store.search.search_list)

    const [search, setSearch] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'search') {
            setSearch(value);
        }
    };
    const searchMusic = async () => {
        const payload: ISearchPayload = {
            search_string: 'Âm nhạc',
            page_size: 99999,
            is_deleted: false,
        }
        await dispatch(searchRequest(payload))
    }

    const filteredMusicList = musicList.list.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        searchMusic()
    }, [])

    return (
        <>
            <div>
                <div>
                    <h1 style={{textAlign:'center'}}> Thể loại: Âm nhạc</h1>
                    <div className='ms-4' >
                        <button className="ms-2 header-button" ><i className="fa fa-search custom-i" aria-hidden="true"></i></button>
                        <div className='d-flex justify-content-center'>
                            <input id='search'  className="form-control w-50" type="text" name="q" placeholder="  Tìm kiếm theo tên" autoComplete="off" onChange={(e) => handleInputChange(e)}></input>
                        </div>
                    </div>
                    <div className="mt-3 ms-5">
                    </div>
                    <div className="d-flex flex-wrap justify-content-start">
                        {filteredMusicList.map((item) => (
                            <div className='me-3 ms-4 mt-4 mb-4' key={item.id}>
                                {/* <button className="btn btn-danger ms-1 mb-1" onClick={() => handleDeleteMovieFromList(item.id)}>xóa phim khỏi danh sách</button> */}
                                <ListFilmCard key={item.id} item={item} />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
}

export default ViewAllPageMusic;