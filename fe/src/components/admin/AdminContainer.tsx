import { useEffect, useState } from "react";
import AddMovie from "./AddMovie";
import './style.css';
import ContentAdmin from "./ContentAdmin";
import ManageUser from "./ManageUser";
import Statistical from "./Statistical";
import Graph from "./Graph";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { moviesAvgRatingByGenreRequest, moviesViewByGenreRequest, moviesViewBySubGenreRequest } from "./adminApi";
import RestoreMovie from "./RestoreMovie";

function AdminContainer() {
  const [selectedTab, setSelectedTab] = useState('thêm-phim');
  const currentUser = useAppSelector(store => store.auth.currentUser)

  const dispatch = useAppDispatch();

  const handleTabClick = (tabName: string) => {
    setSelectedTab(tabName);
  };

  const getDataForGraph = async () => {
    await dispatch(moviesViewByGenreRequest());
    await dispatch(moviesAvgRatingByGenreRequest());
    await dispatch(moviesViewBySubGenreRequest());
  }

  useEffect(() => {
    getDataForGraph();
  }, [])

  // useEffect(() => {
  //     const contentAdminPanel = document.getElementById('collapseContentAdminPanel');
  //     const userPanel = document.getElementById('collapseUserPanel');

  //     if (selectedTab === 'quản-lí-admin') {
  //         contentAdminPanel?.classList.add('show');
  //         userPanel?.classList.remove('show');

  //     } else if (selectedTab === 'thêm-phim') {
  //         userPanel?.classList.add('show');
  //         userPanel?.classList.remove('show');
  //     }

  //     if (contentAd)
  // })

  const [contentAdminPanelOpen, setContentAdminPanelOpen] = useState(false);
  const [userPanelOpen, setUserPanelOpen] = useState(false);

  const toggleContentAdminPanel = () => {
    setContentAdminPanelOpen(!contentAdminPanelOpen);
    setUserPanelOpen(false);
  };

  const toggleUserPanel = () => {
    setUserPanelOpen(!userPanelOpen);
    setContentAdminPanelOpen(false);
  };

  const [statisticalPanelOpen, setStatisticalPanelOpen] = useState(false);
  const [graphPanelOpen, setGraphPanelOpen] = useState(false);

  const toggleStatisticalPanel = () => {
    setStatisticalPanelOpen(!statisticalPanelOpen);
    setGraphPanelOpen(false);
  };

  const toggleGraphPanel = () => {
    setGraphPanelOpen(!graphPanelOpen);
    setStatisticalPanelOpen(false);
  }

  return (
    <>
      <div className="h-100" style={{ display: 'flex' }}>
        {/* Left Navigation Bar */}
        <div style={{ width: '150px', height: '921px', backgroundColor: '#333', color: '#fff', padding: '10px' }}>
          <div className="custom-nav" style={{ cursor: 'pointer' }} onClick={() => handleTabClick('thêm-phim')}>
            Thêm Phim
          </div>
          <div className="custom-nav" style={{ cursor: 'pointer' }} onClick={() => handleTabClick('restore-movie')}>
            Khôi phục phim
          </div>
          {currentUser.is_admin && <div className="custom-nav" style={{ cursor: 'pointer' }} onClick={() => handleTabClick('quản-lí-admin')}>
            Quản lí tài khoản
          </div>}
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

          {selectedTab === 'restore-movie' && (
            <div>
              <h2 style={{ textAlign: 'center' }}>Khôi phục phim</h2>
              <RestoreMovie></RestoreMovie>

            </div>
          )}

          {selectedTab === 'quản-lí-admin' && (
            <div>
              <h2 style={{ textAlign: 'center' }}>Quản lí tài khoản</h2>
              <div className="d-flex">
                <div className="m-2">
                  <div
                    className={`btn btn-primary mb-2 me-2 ms-2 ${contentAdminPanelOpen ? 'active' : ''}`}
                    onClick={toggleContentAdminPanel}
                  >
                    Quản lí quản trị viên nội dung
                  </div>
                  <div
                    className={`btn btn-primary mb-2 me-2 ${userPanelOpen ? 'active' : ''}`}
                    onClick={toggleUserPanel}
                  >
                    Quản lí tài khoản
                  </div>
                </div>
              </div>
              <div className="m-3 accordion-group">
                <div className={`collapse ${contentAdminPanelOpen ? 'show' : ''}`}>
                  <div>
                    <ContentAdmin />
                  </div>
                </div>
                <div className={`collapse ${userPanelOpen ? 'show' : ''}`}>
                  <div className="">
                    <ManageUser />
                  </div>
                </div>
              </div>
            </div>

          )}

          {selectedTab === 'thống-kê' && (
            <div className="d-flex flex-column">
              <h2 style={{ textAlign: 'center' }}>Thống kê</h2>

              <div className="w-30">
                <div
                  // className="btn btn-primary m-1"
                  className={`btn btn-primary mb-2 me-2 ms-2 ${statisticalPanelOpen ? 'active' : ''}`}
                  onClick={toggleStatisticalPanel}
                >
                  Thống kê  </div>
                <div
                  // className="btn btn-primary m-1"
                  className={`btn btn-primary mb-2 me-2 ms-2 ${graphPanelOpen ? 'active' : ''}`}
                  onClick={toggleGraphPanel}
                >
                  Biểu đồ </div>
              </div>
              <div className="m-3 accordion-group">
                <div className={`collapse ${statisticalPanelOpen ? 'show' : ''}`}>
                  <div>
                    <Statistical />
                  </div>
                </div>
                <div className={`collapse ${graphPanelOpen ? 'show' : ''}`}>
                  <div className="">
                    <Graph />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </>
  );
}

export default AdminContainer;