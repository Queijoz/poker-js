window.onload = async function() {
    divBody = document.body;
    menu = document.getElementById("menu");
    buttonPlay = document.getElementById("button-play");
    dinamicStyle = document.getElementById("dinamic-style");

    buttonPlay.addEventListener("click", newGame);
    buttonPlay.addEventListener("click", opacidadeCardBox);

    dinamicStyle.innerHTML += '#menu { opacity: 1; }'
    
    async function newGame(){
        dinamicStyle.innerHTML = '#menu { opacity: 0; }'
        await new Promise(r => setTimeout(r, 500));
        divBody.innerHTML = '<h1>carregando'

        ai = {difficulty: 9, cardsNumbers: [0,0,0,0,0,0,0,0,0,0,0,0,0,0], cardsSuits: [0,0,0,0]};

        var html = ''
        +'<button id="button-finish">Finish</button>'
        +'<button id="button-reroll">Reroll</button>'
        +'<div id="card-box">'
        for (var i = 0; i <= 4; i++) {
            html += '<div id="card-'+(i+1)+'" class="card"></div>';
        }html += '</div><div id="card-box2">'
        for (var i = 5; i <= 9; i++) {
            html += '<div id="card-'+(i+1)+'" class="card"></div>';
        }html += '</div>'
        divBody.innerHTML = html;

        card = document.getElementsByClassName("card");
        
        for(var i = 0; i <= 9; i++){
            card[i].suit = Math.floor( Math.random() * 4 + 1);
            card[i].number = Math.floor( Math.random() * 13 + 1);
            for(var j = 0; j < i; j++){
                if(card[j].suit == card[i].suit && card[j].number == card[i].number){
                    card[i].suit = Math.floor( Math.random() * 4 + 1);
                    card[i].number = Math.floor( Math.random() * 13 + 1);
                    j=-1;
                }
            }if(i <= ai.difficulty){dinamicStyle.innerHTML += ''
            +'#card-'+(i+1)+'{'
                +'background-image: url(cards/'+ card[i].suit +'-'+ card[i].number +'.png);'
            +'}'}else{dinamicStyle.innerHTML += ''
            +'#card-'+(i+1)+'{'
                +'background-image: url(cards/verse.png);'
            +'}'}
            

            card[i].addEventListener("click", function(){
                // Extrai o número da id ('id=card-1') do objeto card
                var r = /\d+/;
                id = this.id.match(r); 

                verse(id);
            });
        }

        buttonFinish = document.getElementById("button-finish");
        buttonFinish.addEventListener("click", finish);
        buttonFinish.addEventListener("click", opacidadeMenu);

        buttonReroll = document.getElementById("button-reroll");
        buttonReroll.addEventListener("click", reroll);
        
        // Verifica as cartas que a AI possui e a pontuação
        for(var i = 5; i <= 9; i++){
            ai.cardsNumbers[card[i].number]++;
            ai.cardsSuits[card[i].suit-1]++;
            //sequencia = 4, familia = 5, fullhouse = 6
            if(ai.cardsNumbers[card[i].number] == 4){
                ai.quadra = card[i].number, ai.result = 7;
            }else if(ai.cardsNumbers[card[i].number] == 3 && ai.par){
                ai.trinca = card[i].number, ai.result = 6;
            }else if(ai.cardsNumbers[card[i].number] == 2 && ai.trinca){
                ai.par = card[i].number, ai.result = 6;
            }else if(ai.cardsSuits[card[i].suit] == 5){
                ai.familia = card[i].suit, ai.result = 5;
            }else if(ai.cardsNumbers[i] && ai.cardsNumbers[i-1] && ai.cardsNumbers[i-2] && ai.cardsNumbers[i-3] && ai.cardsNumbers[i-4]){
                ai.sequencia = card[i].number, ai.result = 4;
            }else if(ai.cardsNumbers[card[i].number] == 3){
                ai.trinca = card[i].number, ai.result = 3;
            }else if(ai.cardsNumbers[card[i].number] == 2 && ai.par && ai.par != card[i].number){
                ai.par2 = card[i].number, ai.result = 2;
            }else if(ai.cardsNumbers[card[i].number] == 2 && !ai.par){
                ai.par = card[i].number, ai.result = 1;
            }
        }if(!ai.result){ai.result = 0}
        // Age conforme a pontuação da AI
        if(ai.result == 3){
            for(var i = 5; i <= 9; i++){
                if(card[i].number != ai.trinca){
                    card[i].switched = true;
                }
            }
        }else if(ai.result == 2){
            for(var i = 5; i <= 9; i++){
                if(card[i].number != ai.par && card[i].number != ai.par2){
                    card[i].switched = true;
                }
            }
        }else if(ai.result == 1){
            for(var i = 5; i <= 9; i++){
                if(card[i].number != ai.par){
                    card[i].switched = true;
                }
            }
        }else if(ai.result == 0){
            for(var i = 5; i <= 9; i++){
                card[i].switched = true;
            }
        }
    }

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

    function reroll() {
        if(buttonReroll.used){return 0;}

        for(var i = 0; i <= 9; i++){
            if(card[i].switched){
                //alert("a carta "+(i+1)+" está virada");
                card[i].switched = false;
                card[i].suit = Math.floor( Math.random() * 4 + 1);
                card[i].number = Math.floor( Math.random() * 13 + 1);
                for(var j = 0; j <= 9; j++){
                    //console.log(j)
                    if(i != j && card[j].suit == card[i].suit && card[j].number == card[i].number){
                        card[i].suit = Math.floor( Math.random() * 4 + 1);
                        card[i].number = Math.floor( Math.random() * 13 + 1);
                        j=-1;
                    }
                }
                if (i <= ai.difficulty){
                    dinamicStyle.innerHTML += ''
                    +'#card-'+(i+1)+'{'
                        +'background-image: url(cards/'+ card[i].suit +'-'+ card[i].number +'.png);'
                    +'}'
                }
            }
        }buttonReroll.used = true;
        dinamicStyle.innerHTML += ''
        +'#card-box .card{'
            +'cursor: default;'
        +'}'
    }

    async function finish(){
        dinamicStyle.innerHTML += '#card-box { opacity: 0; } #card-box2 { opacity: 0; }'
        await new Promise(r => setTimeout(r, 750));

        // Verifica se o jogador possui alguma pontuação
        player = {cardsNumbers: [0,0,0,0,0,0,0,0,0,0,0,0,0,0], cardsSuits: [0,0,0,0]};
        for(var i = 0; i <= 4; i++){
            player.cardsNumbers[card[i].number]++;
            player.cardsSuits[card[i].suit-1]++;
            //sequencia = 4, familia = 5, fullhouse = 6
            if(player.cardsNumbers[card[i].number] == 3){
                player.quadra = card[i].number, player.result = 7;
            }else if(player.cardsNumbers[card[i].number] == 3 && player.par){
                player.trinca = card[i].number, player.result = 6;
            }else if(player.cardsNumbers[card[i].number] == 2 && player.trinca){
                player.par = card[i].number, player.result = 6;
            }else if(player.cardsSuits[card[i].suit] == 5){
                player.familia = card[i].suit, player.result = 5;
            }else if(player.cardsNumbers[i] && player.cardsNumbers[i-1] && player.cardsNumbers[i-2] && player.cardsNumbers[i-3] && player.cardsNumbers[i-4]){
                player.sequencia = card[i].number, player.result = 4;
            }else if(player.cardsNumbers[card[i].number] == 3){
                player.trinca = card[i].number, player.result = 3;
            }else if(player.cardsNumbers[card[i].number] == 2 && player.par && player.par != card[i].number){
                player.par2 = card[i].number, player.result = 2;
            }else if(player.cardsNumbers[card[i].number] == 2 && !player.par){
                player.par = card[i].number, player.result = 1;
            }
        }if (!player.result){player.result = 0}

        // Verifica as cartas que a AI possui e a pontuação
        ai.cardsNumbers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        ai.cardsSuits = [0,0,0,0];
        for(var i = 5; i <= 9; i++){
            ai.cardsNumbers[card[i].number]++;
            ai.cardsSuits[card[i].suit-1]++;
            //sequencia = 4, familia = 5, fullhouse = 6
            if(ai.cardsNumbers[card[i].number] == 4){
                ai.quadra = card[i].number, ai.result = 7;
            }else if(ai.cardsNumbers[card[i].number] == 3 && ai.par){
                ai.trinca = card[i].number, ai.result = 6;
            }else if(ai.cardsNumbers[card[i].number] == 2 && ai.trinca){
                ai.par = card[i].number, ai.result = 6;
            }else if(ai.cardsSuits[card[i].suit] == 5){
                ai.familia = card[i].suit, ai.result = 5;
            }else if(ai.cardsNumbers[i] && ai.cardsNumbers[i-1] && ai.cardsNumbers[i-2] && ai.cardsNumbers[i-3] && ai.cardsNumbers[i-4]){
                ai.sequencia = card[i].number, ai.result = 4;
            }else if(ai.cardsNumbers[card[i].number] == 3){
                ai.trinca = card[i].number, ai.result = 3;
            }else if(ai.cardsNumbers[card[i].number] == 2 && ai.par && ai.par != card[i].number){
                ai.par2 = card[i].number, ai.result = 2;
            }else if(ai.cardsNumbers[card[i].number] == 2 && !ai.par){
                ai.par = card[i].number, ai.result = 1;
            }
        }if(!ai.result){ai.result = 0}

        // Verifica quem venceu
        if  (player.result > ai.result){
            h1 = "Você venceu!!!"
        }else if  (player.result < ai.result){
            h1 = "Você perdeu!!!"
        }else {
            h1 = "Empatou!!!"
        }console.log("pontuação do jogador: "+player.result+" / pontuação da ai: "+ai.result);

        divBody.innerHTML = ''
        +'<div id="menu">'
            +'<h1>'+h1+'</h1>'
            +'<button id="button-playAgain">Play Again</button>'
        +'</div>'

        buttonPlayAgain = document.getElementById("button-playAgain");
        buttonPlayAgain.addEventListener("click", playAgain);
        buttonPlayAgain.addEventListener("click", opacidadeCardBox);
    }

    async function playAgain(){
        dinamicStyle.innerHTML += '#menu { opacity: 0; }'
        newGame();
    }
};
