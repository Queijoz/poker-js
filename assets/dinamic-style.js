async function opacidadeCardBox() {
        await new Promise(r => setTimeout(r, 750));
        dinamicStyle.innerHTML += '#card-box { opacity: 1; } #card-box2 { opacity: 1; }'
    }
    async function opacidadeMenu() {
        await new Promise(r => setTimeout(r, 1250));
        dinamicStyle.innerHTML += '#menu { opacity: 1; }'
    }

    function verse(id) {
        if(buttonReroll.used || id > 5){return 0;}

        if(card[id-1].switched){
            card[id-1].switched = false;

            dinamicStyle.innerHTML += ''
            +'#card-'+id+'{'
                +'background-image: url("cards/'+card[id-1].suit+'-'+card[id-1].number+'.png");'
            +'}'
        }else{
            card[id-1].switched = true;

            dinamicStyle.innerHTML += ''
            +'#card-'+id+'{'
                +'background-image: url("cards/verse.png");'
            +'}'
        }
    }