const Puzzle_ZIndex = {
    NoMoving: 0, //不移动的拼图碎片处于最下面
    Moving: 10 //正在拖拽的拼图碎片处于最上面
};

const resourceURL = "resource";
const resourceList = ["1.jpg", "2.jpg", "3.png", "4.jpg"];

//输入成功/失败时对应的图标类名
const SUCCESS_ICON_NAME = "gg-check-r";
const FAULTY_ICON_NAME = "gg-close-r";


window.onload = function(){

    let currentDifficulty = 3;//默认值为3
    let currentImage = new Image();
    currentImage.src = "resource/2.jpg";
    const segmentMargin = 1;

    //选择难度
    const difficultyInput = document.querySelector("#difficulty__input");
    const difficultyBtn = document.querySelector("#difficulty__btn");
    const difficultyInputIcon = document.querySelector("i");
    difficultyBtn.addEventListener("click", event=>{
        const input = Number(difficultyInput.value);

        if(!input || input < 0){
            difficultyInputIcon.className = FAULTY_ICON_NAME;
            difficultyInputIcon.title = "请不要输入负数及非数字字符";
            return;
        }


        currentDifficulty = input;
        difficultyInputIcon.className = SUCCESS_ICON_NAME;
        refresh();
    });


    //拼图区
    const puzzlePanel = document.querySelector(".puzzle__main");
    //放置区
    const placeSegmentPanel = document.querySelector(".panel__segment--place");
    //放置区使用gird布局 这两个属性给出每个格子的大小
    let gridWidth;
    let gridHeight;
    
    //打乱后的拼图所在的区域
    const dragSegmentPanel = document.querySelector(".panel__segment--drag");
    //可拖拽区域
    const draggablePanel = document.querySelector(".puzzle");
        //绑定拖拽开启事件
    draggablePanel.addEventListener("mousedown", event => {
        if(!event.target.isSegment)
            return ;
        //这块拼图碎片的z-index最高
        event.target.style.zIndex = Puzzle_ZIndex.Moving;

        //计算鼠标按下时相对于当前元素的位置
        event.target.relativeXOnclick = event.offsetX;
        event.target.relativeYOnclick = event.offsetY;
        this.addEventListener("mousemove", dragMove);
    });
        //绑定拖拽关闭事件
    draggablePanel.addEventListener("mouseup", event => {
        if(!event.target.isSegment)
            return ;
        this.removeEventListener("mousemove", dragMove);
        event.target.style.zIndex = Puzzle_ZIndex.NoMoving;
        delete event.target.relativeXOnclick;
        delete event.target.relativeYOnclick;

        //计算当前鼠标所指向的拼图区所在的块 判断是否位置正确
        const rowId = Math.floor((event.clientY - placeSegmentPanel.offsetTop) / gridHeight);
        const colId = Math.floor((event.clientX - placeSegmentPanel.offsetLeft) / gridWidth);
        //算出鼠标当前指向的grid 通过比较拼图随便的id与这个gird格子 就可以知道是否匹配
        console.log(rowId * currentDifficulty + colId);
        if(rowId * currentDifficulty + colId === event.target.segmentId){
            //如果匹配，将拼图移动到正确位置（吸附）
            elementMove(event.target, colId * gridWidth + placeSegmentPanel.offsetLeft + segmentMargin, rowId * gridHeight + placeSegmentPanel.offsetTop + segmentMargin);
        }
    });

    //当更换图片时
    currentImage.addEventListener("load", function(){
        //修改body的背景
        // modifyBodyBackground(currentImage);
        //图片加载完成，计算拼图区的大小
        refresh();
    });

    //将resource目录下的图片加载到页面显示
    const chosePicturePanel = document.querySelector(".picture--candidate");
    const candidatePicture = document.createDocumentFragment();
    resourceList.forEach(element => {
        const imageElement = new Image();
        imageElement.width = 50;
        imageElement.height = 50;
        imageElement.src = `${resourceURL}/${element}`;
        candidatePicture.appendChild(imageElement);
    });
    chosePicturePanel.appendChild(candidatePicture);

    chosePicturePanel.addEventListener("click", event => {
        currentImage.src = event.target.src;
    });


    //添加候选的图片
    const addPictureBtn = document.querySelector(".add_picture__btn");
    const pictureInput = document.querySelector(".picture__input");
    addPictureBtn.addEventListener("click", event=>{
        
        pictureInput.click();
    });
    pictureInput.addEventListener("change", function(event){
        const file = this.files[0];
        const url = window.URL.createObjectURL(file);
        //通过canvas将图片保存在resource


        window.URL.revokeObjectURL(url);
        //将文件名保存在本地
        // localStorage.setItem(file.name);
        // for(let i = 0; i < localStorage.length; ++i){
        //     console.log(localStorage.key(i));
        // }
        // localStorage.clear();
    });



    /**
     * 刷新页面
     * 当难度重新选择/重新选择图片时，刷新页面
     */
    function refresh(){

        placeSegmentPanel.innerHTML = "";
        const clonePlaceSegmentPanel = placeSegmentPanel;
        const cloneDragSegmentPanel = dragSegmentPanel;
        puzzlePanel.innerHTML = "";
        puzzlePanel.appendChild(clonePlaceSegmentPanel);
        puzzlePanel.appendChild(cloneDragSegmentPanel);

        gridWidth = Math.ceil(currentImage.width / currentDifficulty);
        gridHeight = Math.ceil(currentImage.height / currentDifficulty);
        
        //grid布局的行列属性
        const gridTemplateRows = [];
        const gridTemplateCols = [];
        for(let i = 0; i < currentDifficulty; ++i){
            gridTemplateRows.push(gridHeight);
            gridTemplateCols.push(gridWidth);
        }
        //修改放置区的大小
        placeSegmentPanel.style.gridTemplateRows = gridTemplateRows.join("px ") + "px";
        placeSegmentPanel.style.gridTemplateColumns = gridTemplateCols.join("px ") + "px";
        //更改放置区的背景
        modifyBackgroundByCSS(placeSegmentPanel, currentImage.src, 0, 0);
                
        //在拼图区添加有序的div，在拖拽区添加无序的div
        const placeSegmentPanelFragment = document.createDocumentFragment();
        const puzzlePanelFragment = document.createDocumentFragment();
        for(let i = 0; i < currentDifficulty * currentDifficulty; ++i){
             //在拼图区添加div元素(用来遮挡背景图片)
            let newElement = document.createElement("div");
            newElement.className = "puzzle__segment--place";
            placeSegmentPanelFragment.appendChild(newElement);

            //在拖拽区添加混乱的碎片（div元素）
            newElement = document.createElement("div");
            //初始化拼图碎片
            initSegment(newElement, currentDifficulty, gridWidth, gridHeight, segmentMargin, currentImage.src, i);
            //在拖拽区随机摆放
            placeElementRandomly(newElement, dragSegmentPanel.offsetLeft, dragSegmentPanel.offsetLeft + dragSegmentPanel.clientWidth - gridWidth, dragSegmentPanel.offsetTop, dragSegmentPanel.offsetTop + dragSegmentPanel.clientHeight - gridHeight);

            puzzlePanelFragment.appendChild(newElement);
        }

        placeSegmentPanel.appendChild(placeSegmentPanelFragment);
        puzzlePanel.append(puzzlePanelFragment);
    }
};

/**
 * 更换背景图片
 * @param {HTMLElement} element
 * @param {string} url 
 * @param {number} left 
 * @param {number} top 
 */
function modifyBackgroundByCSS(element, url, left, top){
    element.style.backgroundImage = "url(" + url + ")";
    element.style.backgroundPosition = left + "px " + top + "px";
}

/**
 * 初始化一个拼图碎片
 * @param {HTMLElement} segment 拼图碎片 
 * @param {number} containerWidth 容器宽度
 * @param {number} containerHeight 容器高度
 * @param {number} segmentMargin 拼图碎片在容器中的外边框
 * @param {url:string} backgroundImage 背景图片url
 * @param {number} segmentId 拼图ID 根据这个id 算出被禁图片的便宜
 */
function initSegment(segment, difficulty,containerWidth, containerHeight,segmentMargin,backgroundImageUrl, segmentId){
    //首先计算拼图碎片的大小，grid布局的每格容器的宽和高各减去2 * margin
    const segmentWidth = containerWidth - 2 * segmentMargin;
    const segmentHeight = containerHeight - 2 * segmentMargin;
    segment.isSegment = true;
    segment.className = "puzzle__segment--drag";
    segment.style.width = segmentWidth + "px";
    segment.style.height = segmentHeight + "px";
    //给碎片添加背景
    modifyBackgroundByCSS(segment, backgroundImageUrl, -(Math.floor(segmentId%difficulty) * containerWidth + segmentMargin), -(Math.floor(segmentId/difficulty) * containerHeight + segmentMargin));
    segment.segmentId = segmentId;//拼图碎片的ID
}


/**
 * 拖拽过程中 元素移动
 * @param {Event} event 
 */
function dragMove(event){
    elementMove(event.target, event.clientX - event.target.relativeXOnclick, event.clientY - event.target.relativeYOnclick);
}

/**
 * 使用绝对定位移动元素
 * @param {HTMLElement}} element 
 * @param {number} left 
 * @param {number} top 
 */
function elementMove(element, left, top){
    element.style.left = left + "px";
    element.style.top = top + "px";
}


/**
 * 将一个元素放置在一个范围内的随机位置
 * @param {HTMLElement} element 
 * @param {number} lowBoundaryOfLeft left值的下界
 * @param {number} highBoundaryOfLeft left值的上界
 * @param {number} lowBoundaryOfTop top值的下界
 * @param {number} highBoundaryOfTop top值的上界
 * @param {number} lowBoundaryOfZIndex z-index的下界
 * @param {number} highBoundaryOfZIndex z-index的上界
 */
function placeElementRandomly(element, lowBoundaryOfLeft, highBoundaryOfLeft, lowBoundaryOfTop, highBoundaryOfTop, lowBoundaryOfZIndex, highBoundaryOfZIndex){
    const randomLeft = Math.floor(Math.random() * (highBoundaryOfLeft - lowBoundaryOfLeft) + lowBoundaryOfLeft);
    const randomTop = Math.floor(Math.random() * (highBoundaryOfTop - lowBoundaryOfTop) + lowBoundaryOfTop);
    const randomZIndex = Math.floor(Math.random() * (highBoundaryOfZIndex - lowBoundaryOfZIndex) + lowBoundaryOfZIndex);
    elementMove(element, randomLeft, randomTop);
    element.style.zIndex = randomZIndex;
}

/**
 * 修改body的背景
 * @param {HTMLImageElement} img
 */
function modifyBodyBackground(img){
    const canvas = document.querySelector("#bodyBackground");
    canvas.setAttribute("width", document.body.scrollWidth + "px");
    canvas.setAttribute("height",document.body.scrollHeight + "px" );
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0,canvas.width, canvas.height);
    console.log(canvas.width);
}
