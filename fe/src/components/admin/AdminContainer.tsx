import { useState } from "react";
import AddMovie from "./AddMovie";
import './style.css';

function AdminContainer() {
    const [selectedTab, setSelectedTab] = useState('thêm-phim');

    const handleTabClick = (tabName: string) => {
        setSelectedTab(tabName);
    };

    return (
        <>
            <div style={{ display: 'flex', height: '900px' }}>
                {/* Left Navigation Bar */}
                <div style={{ width: '200px', height: '100%', backgroundColor: '#333', color: '#fff', padding: '10px' }}>
                    <div className="custom-nav" style={{ cursor: 'pointer' }} onClick={() => handleTabClick('thêm-phim')}>
                        Thêm Phim
                    </div>
                    <div className="custom-nav" style={{ cursor: 'pointer' }} onClick={() => handleTabClick('quản-lí-admin')}>
                        Quản lí Admin
                    </div>
                    <div className="custom-nav" style={{ cursor: 'pointer' }} onClick={() => handleTabClick('thống-kê')}>
                        Thống kê
                    </div>
                </div>

                {/* Right Content Area */}
                <div style={{ flex: 1, padding: '20px' }}>
                    {selectedTab === 'thêm-phim' && (
                        <div>
                            <h2 style={{ textAlign: 'center' }}>Thêm Phim</h2>
                            <AddMovie></AddMovie>
                            {/* Add your content for 'Thêm Phim' tab here */}

                        </div>
                    )}

                    {selectedTab === 'quản-lí-admin' && (
                        <div>
                            <h2 style={{ textAlign: 'center' }}>Quản lí Admin</h2>
                            <div className="w-30">
                                <div className="btn btn-primary m-1"> Thêm quản trị viên nội dung </div>
                                <div className="btn btn-danger m-1"> Tước quyền quản trị viên nội dung </div>
                                <div className="btn btn-danger m-1"> Xóa tài khoản </div>
                            </div>
                            {/* Add your content for 'Quản lí Admin' tab here */}
                        </div>
                    )}

                    {selectedTab === 'thống-kê' && (
                        <div className="d-flex flex-column">
                            <h2 style={{ textAlign: 'center' }}>Thống kê</h2>

                            <div className="w-30">
                                <div className="btn btn-primary m-1"> Thống kê theo lượt xem </div>
                                <div className="btn btn-primary m-1"> Thống kê theo đánh giá </div>
                            </div>
                            {/* Add your content for 'Quản lí Admin' tab here */}
                        </div>
                    )}
                </div>
            </div>

        </>
    );
}

export default AdminContainer;