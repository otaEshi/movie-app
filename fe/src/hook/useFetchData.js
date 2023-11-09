import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Promise } from "q";
import useEffectWithAuthenticated from "./useEffectWithAuthenticated";
import { showAlert } from "../utils/showAlert";


function useFetchData(value) {
    const dispatch = useAppDispatch()

    const isAuthenticated = useAppSelector(store => store.auth.isAuthenticated)
    const [notify, setNotify] = useState([])

    useEffect(() => {
        if (!isAuthenticated) return
        const fetchData = async () => {
            let allPromises = []
    
            Promise.all(allPromises)
        }
        fetchData();
    }, [dispatch, isAuthenticated])

    useEffect(() => {
        if (!isAuthenticated) return
        let idToken = localStorage.getItem("id_token")

        const newSocket = new WebSocket(`ws://192.168.0.156/join`);

        console.log(newSocket);

        newSocket.onopen = () => {
            console.log('WebSocket connection opened');
        };

        newSocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            setNotify((prevnotify) => [...prevnotify, message]);
            showAlert('', "info")
        };

        // newSocket.onclose = () => {
        //     console.log('WebSocket connection closed');
        // };

        // Clean up socket connection when component unmounts
        return () => {
            newSocket.close();
        };
    }, [isAuthenticated])
}

export default useFetchData;