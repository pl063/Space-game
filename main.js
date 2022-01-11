    import { render } from "./node_modules/lit-html/lit-html.js";
    import page from "./node_modules/page/page.mjs";


    import { loginView } from "./scripts/views/loginView.js";

    const mainElement = document.querySelector("#root");
    appendNavHoverAnimation(); 

    page("/login", middleWare, loginView);

    page.start(); 

    function middleWare (ctx, next) {
        ctx.render = (content) => {
            mainElement.innerHTML = "";
            render(content, mainElement);
        }
        next();
    }   



    function appendNavHoverAnimation () {
        let navElements = document.querySelectorAll("a"); 
        for(let el of navElements) {
            el.classList.add("blueHover");
        }
    }
