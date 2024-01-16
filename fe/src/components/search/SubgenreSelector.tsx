import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';

interface SubgenreSelectorProps {
    onSubgenresSelected: (selectedSubgenres: string[]) => void;
}

const SubgenreSelector: React.FC<SubgenreSelectorProps> = ({ onSubgenresSelected }) => {
    const listViewsBySubgenre = useAppSelector(store => store.admin.listViewsBySubgenre);
    
    const [selectedSubgenres, setSelectedSubgenres] = useState<string[]>([]);
    const [options, setOptions] = useState<string[]>([]);

    useEffect(() => {
        if (listViewsBySubgenre && listViewsBySubgenre.length > 0){
            setOptions(listViewsBySubgenre.map((item: { subgenre: string }) => item.subgenre));
        }
    }, [listViewsBySubgenre]);

    const handleOptionClick = (selectedOption: string) => {
        if (!selectedSubgenres.includes(selectedOption)) {
            setSelectedSubgenres([...selectedSubgenres, selectedOption]);
            onSubgenresSelected([...selectedSubgenres, selectedOption]);
        }
    };

    const handleRemoveSubgenre = (subgenreToRemove: string) => {
        const updatedSubgenres = selectedSubgenres.filter(subgenre => subgenre !== subgenreToRemove);
        setSelectedSubgenres(updatedSubgenres);
        onSubgenresSelected(updatedSubgenres);
    };

    return (
        <div className="d-flex">

            <div className="">
                <select className="form-select me-2" onChange={(e) => handleOptionClick(e.target.value)}>
                    <option value="" disabled selected>Chọn thể loại phụ</option>
                    {options.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            </div>
            <div className='w-50 ms-3'>
                {selectedSubgenres.length > 0 && (
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={selectedSubgenres.join(', ')}
                            readOnly
                        />
                        <button className="btn btn-close pt-3" type="button" onClick={() => setSelectedSubgenres([])}>
                            <span className="visually-hidden">Clear</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="ms-2">
                {selectedSubgenres.map((subgenre, index) => (
          <button
            key={index}
            type="button"
            className="btn btn-outline-secondary me-1"
            onClick={() => handleRemoveSubgenre(subgenre)}
          >
            {subgenre} <span className="visually-hidden">Remove</span>
          </button>
        ))}
            </div>
        </div>
    );
};

export default SubgenreSelector;
