let defaultItems = [
    "images/image1.png",
    "images/image2.png",
    "images/image3.png",
        "images/image1.png",
    "images/image2.png",
    "images/image3.png"
];

let items=JSON.parse(localStorage.getItem("spinItems"))||defaultItems;

let spinning=false;
let spinLoop;
let speed=8;

function saveItems(){
    localStorage.setItem("spinItems",JSON.stringify(items));
}

function buildRoulette(){

    $("#roulette").empty();

    items.forEach(src=>{
        $("#roulette").append(`
            <div class="card" data-src="${src}">
                <div class="inner">
                    <div class="front"></div>
                    <div class="back"><img src="${src}"></div>
                </div>
            </div>
        `);
    });

}

buildRoulette();

function recycleCards(){

    let first=$(".card").first();
    let cardWidth=first.outerWidth(true);

    let currentX=$("#roulette").data("x")||0;

    if(Math.abs(currentX)>=cardWidth){

        $("#roulette").append(first);
        currentX+=cardWidth;

        $("#roulette").data("x",currentX);
        $("#roulette").css("transform",`translateX(${currentX}px)`);

    }
}

$("#spinBtn").click(function(){

    if(spinning||items.length===0) return;

    spinning=true;

    let currentX=0;
    $("#roulette").data("x",0);

    spinLoop=setInterval(function(){

        currentX-=speed;

        $("#roulette").data("x",currentX);
        $("#roulette").css("transform",`translateX(${currentX}px)`);

        recycleCards();

    },16);

    let stopDelay=2500+Math.random()*1500;

    setTimeout(function(){

        clearInterval(spinLoop);

        // pick random remaining item
        let chosen=items[Math.floor(Math.random()*items.length)];

        // find card element with that src
        let target=$(`.card[data-src='${chosen}']`).first();

        let wrapperCenter=$(".roulette-wrapper").offset().left+
                          $(".roulette-wrapper").width()/2;

        let targetCenter=target.offset().left+
                         target.outerWidth()/2;

        let adjust=wrapperCenter-targetCenter;

        currentX+=adjust;

        $("#roulette").css({
            transition:"transform 0.6s cubic-bezier(.17,.67,.28,.99)",
            transform:`translateX(${currentX}px)`
        });

        setTimeout(function(){

            target.addClass("flip");

            let index=items.indexOf(chosen);
            if(index>-1){
                items.splice(index,1);
                saveItems();
            }

            spinning=false;

            setTimeout(()=>{
                $("#roulette").css("transition","none");
            },600);

        },600);

    },stopDelay);

});
