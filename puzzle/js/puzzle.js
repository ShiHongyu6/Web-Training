const Difficulty = {
    Easy : 3,
    Medium: 4,
    Difficult: 5
};



window.onload = function(){


    let currentDifficulty = Difficulty.Easy;
    let currentImage = new Image();
    currentImage.src = "resource/2.jpg";
    const segmentMargin = 1;


    //拼图区DOM
    const orderlySegmentPanel = document.querySelector(".panel__segment--orderly");
    //拖拽区DOM
    const disorderSegemntPanel = document.querySelector(".panel__segment--disorder");
    

    //当更换图片时
    currentImage.addEventListener("load", e=>{
        //图片加载完成，计算拼图区的大小
        const gridWidth = currentImage.width / currentDifficulty;
        const gridHeight = currentImage.height / currentDifficulty;
        
        //grid布局的行列属性
        const gridTemplateRows = [];
        const gridTemplateCols = [];
        for(let i = 0; i < currentDifficulty; ++i){
            gridTemplateRows.push(gridHeight);
            gridTemplateCols.push(gridWidth);
        }
        //更改拼图区的背景
        orderlySegmentPanel.style.gridTemplateRows = gridTemplateRows.join("px ") + "px";
        orderlySegmentPanel.style.gridTemplateColumns = gridTemplateCols.join("px ") + "px";
        orderlySegmentPanel.style.backgroundImage = "url(" + currentImage.src + ")";
    

        
        //在拼图区添加有序的div，在拖拽区添加无序的div
        for(let i = 0; i < currentDifficulty * currentDifficulty; ++i){
             //在拼图区添加div元素
            let newElement = document.createElement("div");
            newElement.className = "puzzle__segment--orderly";
            newElement.segmentId = i;//拼图碎片的ID
            orderlySegmentPanel.appendChild(newElement);


            //在拖拽区添加div元素
            //首先计算拼图碎片的大小，grid布局的每格容器的宽和高各减去2 * margin
            const segmentWidth = gridWidth - 2 * segmentMargin;
            const segmentHeight = gridHeight - 2 * segmentMargin;
            newElement = document.createElement("div");
            newElement.className = "puzzle__segment--disorder";
            newElement.style.width = segmentWidth + "px";
            newElement.style.height = segmentHeight + "px";
            //给碎片添加背景
            newElement.style.background = "url( " + currentImage.src + ")";
            //设置位置
            newElement.style.backgroundPosition = "-" + (Math.floor(i%currentDifficulty) * gridWidth + segmentMargin) + "px " + "-" + (Math.floor(i/currentDifficulty) * gridHeight + segmentMargin) + "px";
            newElement.segmentId = i;

            disorderSegemntPanel.appendChild(newElement);
        }
        

    });
};