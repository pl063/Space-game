    import * as handlers from "./handlers.js"; 
    import {twinkle} from "./twinkle.js";

    function main(){
        manageNavbar();
        const startButton = document.querySelector("#start");
    }

    function manageNavbar(){
        const navigationHyperlinks = document.querySelectorAll("a");
        for(let link of navigationHyperlinks){
            link.classList.add("blueHover");
        }

        //Add event listeners
        const navBar = document.querySelector("nav");
        navBar.addEventListener("click", (e) => {
            let currentTargetId = e.target.id; 
            switch(currentTargetId){
                case "login": handlers.loginHandler(); break; 
                case "register": handlers.registerHandler(); break;
                case "avatars": handlers.avatarsHandler(); break; 
                case "themes": handlers.themesHandler(); break;
                case "about": handlers.aboutHandler(); break;
            }
        })
    }

    main();