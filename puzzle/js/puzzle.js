const Puzzle_ZIndex = {
    Finish: 0,
    NoMoving: 1, 
    Moving: 10 //正在拖拽的拼图碎片处于最上面
};

const resourceURL = "resource";
const resourceList = ["1.jpg", "2.jpg", "3.png"];
const objectURLOfResource = [];//图片对应的objectURL

//输入成功/失败时对应的图标类名
const SUCCESS_ICON_NAME = "gg-check-r";
const FAULTY_ICON_NAME = "gg-close-r";

//图片宽度 高度按比例放缩
let PICTURE_WIDTH;

let relativeXOnclick = 0;
let relativeYOnclick = 0;




window.onload = function(){

    PICTURE_WIDTH  = Math.floor(document.body.scrollWidth  * 0.6);

    let currentDifficulty = 3;//默认值为3
    let currentImage = new Image();
    const segmentMargin = 1;

    //选择难度
    const difficultyInput = document.querySelector("#difficulty__input");
    const difficultyBtn = document.querySelector("#difficulty__btn");
    const difficultyInputIcon = document.querySelector(".panel__chose_difficulty i");
    difficultyBtn.addEventListener("click", ()=>{
        const input = Number(difficultyInput.value);
        if(!input || input < 0){
            difficultyInputIcon.className = FAULTY_ICON_NAME;
            difficultyInputIcon.title = "请不要输入负数及非数字字符";
            console.log(input);
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
    let gridWidth;
    let gridHeight;



    //打乱后的拼图所在的区域
    const dragSegmentPanel = document.querySelector(".panel__segment--drag");
    //可拖拽区域
    const draggablePanel = document.body;
        //绑定拖拽开启事件
    let currentDraggingSegment = null;
    draggablePanel.addEventListener("mousedown", function(event) {
        if(!event.target.isSegment){
            return ;
        }
        currentDraggingSegment = event.target;
        //这块拼图碎片的z-index最高
        currentDraggingSegment.style.zIndex = Puzzle_ZIndex.Moving;
        //记录鼠标在拼图上的相对位置
        relativeXOnclick = event.offsetX;
        relativeYOnclick = event.offsetY;
        this.addEventListener("mousemove", dragMove);
    }, true);

    //拼图碎片组成的数组 查看是否完成拼图
    const puzzleList = [];

        //绑定拖拽关闭事件
    draggablePanel.addEventListener("mouseup", function(event) {

        this.removeEventListener("mousemove", dragMove);
        event.target.style.zIndex = Puzzle_ZIndex.Finish;
        relativeXOnclick = 0;
        relativeYOnclick = 0;

        //计算当前鼠标所指向的拼图区所在的块 判断是否位置正确
        const rowId = Math.floor((event.clientY - placeSegmentPanel.offsetTop) / gridHeight);
        const colId = Math.floor((event.clientX - placeSegmentPanel.offsetLeft) / gridWidth);
        //算出鼠标当前指向的grid 通过比较拼图随便的id与这个gird格子 就可以知道是否匹配
        if(rowId * currentDifficulty + colId === event.target.segmentId){
            //如果匹配，将拼图移动到正确位置（吸附）
            elementMove(event.target, colId * gridWidth + placeSegmentPanel.offsetLeft + segmentMargin, rowId * gridHeight + placeSegmentPanel.offsetTop + segmentMargin);
            event.target.zIndex = Puzzle_ZIndex.Finish;
            //判断是否完成拼图
            let i;
            for(i = 0; i < currentDifficulty * currentDifficulty; ++i){
                if(puzzleList[i].correctLeft != parseInt(puzzleList[i].style.left)
                    || puzzleList[i].correctTop != parseInt(puzzleList[i].style.top)){
                    break;
                }
            }
            if(i == currentDifficulty * currentDifficulty){
                document.querySelector(".puzzle--finish").style.display = "block";
            }
        }
    }, true);

    //当更换图片时
    currentImage.addEventListener("load", function(){
        //修改body的背景
        // modifyBodyBackground(currentImage);
        //图片加载完成，计算拼图区的大小
        refresh();
    });

    //修改resource目录下图片的大小  返回dataURL保存到objectURLResource数组中
    const chosePicturePanel = document.querySelector(".picture--candidate");
    const candidatePicture = document.createDocumentFragment();
    resourceList.forEach(element => {
        const imageElement = new Image();
        imageElement.src = `${resourceURL}/${element}`;

        imageElement.addEventListener("load", function() {
            const dataUrl = modifyImageDimensions(this, PICTURE_WIDTH);
            objectURLOfResource.push(dataUrl);

            const imgCandidate = new Image();
            imgCandidate.src = dataUrl;
            candidatePicture.appendChild(imgCandidate);

            //这次加载成功的是最后一张图片  将DocumentFragment加入到文档树中渲染
            if(resourceList.length === objectURLOfResource.length){
                chosePicturePanel.appendChild(candidatePicture);

                //同时 给currentImage赋值
                currentImage.src = objectURLOfResource[0];
            }
        });
    });


    chosePicturePanel.addEventListener("click", event => {
        currentImage.src = event.target.src;
    });


    //添加候选的图片
    const addPictureBtn = document.querySelector(".add_picture__btn");
    const pictureInput = document.querySelector(".picture__input");
    addPictureBtn.addEventListener("click", ()=>{
        
        pictureInput.click();
    });
    pictureInput.addEventListener("change", function(){
        const file = this.files[0];
        const imgElement = new Image();
        imgElement.src = window.URL.createObjectURL(file);
        imgElement.addEventListener("load", function(){
            const img = new Image();
            img.src = modifyImageDimensions(this, PICTURE_WIDTH);
            chosePicturePanel.appendChild(img);
            currentImage.src = img.src;
        });

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
        
        puzzleList.length = 0;
        document.querySelector(".puzzle--finish").style.display = "none";

        gridWidth = Math.floor(currentImage.width / currentDifficulty);
        gridHeight = Math.floor(currentImage.height / currentDifficulty);
        
        placeSegmentPanel.style.width  = `${gridWidth * currentDifficulty + segmentMargin}px`;
        placeSegmentPanel.style.height = `${gridHeight * currentDifficulty + segmentMargin}px`;
        //更改放置区的背景
        modifyBackgroundByCSS(placeSegmentPanel, currentImage.src, 0, 0);
                
        //在拼图区添加有序的div，在拖拽区添加无序的div
        const placeSegmentPanelFragment = document.createDocumentFragment();
        const puzzlePanelFragment = document.createDocumentFragment();
        for(let i = 0; i < currentDifficulty * currentDifficulty; ++i){
             //在拼图区添加div元素(用来遮挡背景图片)
            let newElement = document.createElement("div");
            newElement.className = "puzzle__segment--place";
            newElement.style.width  = `${gridWidth - segmentMargin}px`
            newElement.style.height = `${gridHeight - segmentMargin}px`
            placeSegmentPanelFragment.appendChild(newElement);

            //在拖拽区添加混乱的碎片（div元素）
            newElement = document.createElement("div");
            //初始化拼图碎片
            initSegment(newElement, i);
            //在拖拽区随机摆放
            placeElementRandomly(newElement, dragSegmentPanel.offsetLeft, dragSegmentPanel.offsetLeft + dragSegmentPanel.clientWidth - gridWidth, dragSegmentPanel.offsetTop, dragSegmentPanel.offsetTop + dragSegmentPanel.clientHeight - gridHeight);
            puzzleList.push(newElement);
            puzzlePanelFragment.appendChild(newElement);
        }

        placeSegmentPanel.appendChild(placeSegmentPanelFragment);
        puzzlePanel.append(puzzlePanelFragment);
    }

    
    /**
     * 拖拽过程中 元素移动
     * @param {Event} event 
     */
    function dragMove(event){
        elementMove(currentDraggingSegment, event.clientX - relativeXOnclick, event.clientY - relativeYOnclick);
    }

    function initSegment(segment, segmentId){
        //首先计算拼图碎片的大小，"每格容器"的宽和高各减去2 * margin
        const segmentWidth = gridWidth - segmentMargin;
        const segmentHeight = gridHeight - segmentMargin;
        segment.isSegment = true;
        segment.className = "puzzle__segment--drag";
        segment.style.width = segmentWidth + "px";
        segment.style.height = segmentHeight + "px";
        segment.style.zIndex = Puzzle_ZIndex.NoMoving;
        //给碎片添加背景
        const left = Math.floor(segmentId%currentDifficulty) * gridWidth + segmentMargin;
        const top  = Math.floor(segmentId/currentDifficulty) * gridHeight + segmentMargin;
        modifyBackgroundByCSS(segment, currentImage.src, -left, -top);
        segment.segmentId = segmentId;//拼图碎片的ID

        //这片碎片正确的位置
        segment.correctLeft = left + placeSegmentPanel.offsetLeft;
        segment.correctTop  = top + placeSegmentPanel.offsetTop;
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
    element.style.backgroundImage = `url(${url})`;
    element.style.backgroundPosition = `${left}px ${top}px`;
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
}


function modifyImageDimensions(imgElement, dw){
    const canvas = document.createElement("canvas");

    const scalePercent = dw / imgElement.width;
    const dh = Math.floor(scalePercent * imgElement.height);

    canvas.setAttribute("width", dw+ "px");
    canvas.setAttribute("height",dh + "px" );
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
}
