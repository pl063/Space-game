    export function twinkle(element){
        element.classList.add("twinkle");
        setTimeout(() => {
            element.classList.remove("twinkle");
        }, 500);
    }