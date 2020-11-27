const Difficulty = {
    Easy : 3,
    Medium: 4,
    Difficult: 5
};



window.onload = function(){


    let currentDifficulty = Difficulty.Easy;
    let currentImage = new Image();
    currentImage.src = "resource/2.jpg";



    //拼图区DOM
    const orderlySegmentPanel = document.querySelector(".panel__segment--orderly");

    //当更换图片时
    currentImage.addEventListener("load", e=>{
        //图片加载完成，计算拼图区的大小
        const segmentWidth = currentImage.width / currentDifficulty;
        const segmentHeight = currentImage.height / currentDifficulty;
        
        //grid布局的行列属性
        const gridTemplateRows = [];
        const gridTemplateCols = [];
        for(let i = 0; i < currentDifficulty; ++i){
            gridTemplateRows.push(segmentHeight);
            gridTemplateCols.push(segmentWidth);
        }
        //更改拼图区的背景
        orderlySegmentPanel.style.gridTemplateRows = gridTemplateRows.join("px ") + "px";
        orderlySegmentPanel.style.gridTemplateColumns = gridTemplateCols.join("px ") + "px";
        orderlySegmentPanel.style.backgroundImage = "url(" + currentImage.src + ")";
    
        //填充相应数量的div
        for(let i = 0; i < )
    });
};