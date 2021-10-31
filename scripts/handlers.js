   import {elementGenerator} from "./elementGenerator.js"; 
   export function loginHandler(){
        let loginView = document.createElement("div");
        let loginForm = elementGenerator("form", {className: ""})
    }

    export function registerHandler(){
        
    }

    export function avatarsHandler(){
        
    }

    export function themesHandler(){
        
    }

    export function aboutHandler(){
        
    }


    function changeView(view){
        let currentView = document.querySelector(".welcomePage-wrapper"); 
        currentView.replaceWith(view);
    }