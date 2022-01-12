
   
   export function starAnimation () {
       let isPlayed = false;

        setTimeout(3000, () => {
            let stars = document.querySelectorAll("stars"); 
            for( let star of stars ) {
                if(!isPlayed) {
                    star.style.opacity = 0.5; 
                    isPlayed = true;
                } else {
                    isPlayed = false;
                    star.style.opacity = 1; 
                }
               
            }
        })
    }

    