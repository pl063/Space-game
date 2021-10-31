    export function elementGenerator(typeOfElement, attributes, events){
        let element = document.createElement(typeOfElement); 
        if(attr.length){
            for(let attr in attributes){
                element.attr = attributes[attr];
            }
        } 
        if(events.length){
            for(let eventType in events){
                element.addEventListener(eventType, events[eventType]);
            }
        }
        return element
    }