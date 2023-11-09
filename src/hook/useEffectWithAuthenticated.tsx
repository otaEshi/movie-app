import { useEffect } from "react";

function useEffectWithAuthenticated(callback: any, deps: any) {
    const isAuthenticated = true;
    deps.push(isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) return;
        return callback();
    }, [deps]);

    return null;
}

export default useEffectWithAuthenticated;