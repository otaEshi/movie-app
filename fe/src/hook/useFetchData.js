import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Promise } from "q";
import useEffectWithAuthenticated from "./useEffectWithAuthenticated";
import { showAlert } from "../utils/showAlert";


function useFetchData(value) {
    const dispatch = useAppDispatch()

    // const isAuthenticated = useAppSelector(store => store.auth.isAuthenticated)
    // const [notify, setNotify] = useState([])

    // useEffect(() => {
    //     if (!isAuthenticated) return
    //     const fetchData = async () => {
    //         let allPromises = []
    
    //         Promise.all(allPromises)
    //     }
    //     fetchData();
    // }, [dispatch, isAuthenticated])
    // const getMovieForHomePage () => {
    //     dispatch(topTrendingMoviesRequest())

    // }
    // useEffect(() => {
    // }, [])
}

export default useFetchData;