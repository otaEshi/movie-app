// import { Store, NOTIFICATION_TYPE, iNotification } from "react-notifications-component";

import { Store, NOTIFICATION_TYPE, iNotification } from "react-notifications-component";

export const showAlert = (message: string | React.ReactNode | React.FunctionComponent, type?: NOTIFICATION_TYPE, options?: iNotification) => {
    Store.addNotification({
        message: message,
        type: type || "default",
        insert: options?.insert || "bottom",
        container: options?.container || "bottom-center",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: options?.dismiss?.duration || 2500,
            onScreen: false,
            showIcon: true,
        },
        content: options?.content
    });
};