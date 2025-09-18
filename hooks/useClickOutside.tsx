import { useEffect } from "react";

export function useClickOutside(ref, handler) {
    useEffect(() => {
        function listener(event) {
            if (event.target.closest("button") || event.target.closest(".ant-select-dropdown") || (ref.current && ref.current.contains(event.target))) {
                return;
            }
            handler();
        }
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
}