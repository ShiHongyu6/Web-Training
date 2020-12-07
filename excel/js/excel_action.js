/**
 * 使cell可编辑
 */
function setCellEditable(){
    const excelCellsContainer = document.querySelector(".excel__cells-container");
    excelCellsContainer.addEventListener("dblclick", event => {
        switchEditableCell(event.target);
    });
}

let dragSelectEnd = null;//记录拖拽结束时的元素
/**
 * 使Cell可选择
 */
function setCellSelectable(){
    const excelCellsContainer = document.querySelector(".excel__cells-container");
    excelCellsContainer.addEventListener("mousedown", function(event) {

        //容器本身触发事件不处理
        if(this == event.target)
            return ;

        //当选择一个cell时 如果这个cell正在编辑 不做任何事
        if(isEditableCell(event.target)){
            return ;
        }

        //消除上一次的拖拽选择
        takeOffCoverElement();

        dragSelectEnd = event.target;
        //点击的这个cell不是正在编辑的cell  则使之前可编辑的cell不可编辑
        switchEditableCell();
        //选择当前的cell
        switchSelectedCellByClick(event.target);

        //开启拖拽事件
        this.addEventListener("mousemove", dragSelect, true);
    });

    excelCellsContainer.addEventListener("mouseup", function(event) {
        this.removeEventListener("mousemove", dragSelect, true);
    });
}

/**
 *处理拖拽
 */
function dragSelect(event){
    if(event.target === dragSelectEnd){
        return ;
    }
    dragSelectEnd = event.target;

    const startRow = selectedCellByClick.rowId;
    const startCol = selectedCellByClick.colId;
    const endRow = dragSelectEnd.rowId;
    const endCol = dragSelectEnd.colId;

    //找到左上角所在的行和列
    const leftTopRow = Math.min(startRow, endRow);
    const leftTopCol = Math.min(startCol, endCol);
    //算出遮盖矩形的左上角
    const coverLeft = leftTopCol * (INIT_INFO.CELL_WIDTH + INIT_INFO.BORDER) - INIT_INFO.BORDER;
    const coverTop = leftTopRow * (INIT_INFO.CELL_HEIGHT + INIT_INFO.BORDER) - INIT_INFO.BORDER;
    //算出所选的行数和列数
    const rowThrough = Math.abs(startRow - endRow) + 1;
    const colThrough = Math.abs(startCol - endCol) + 1;
    //算出遮盖矩形的尺寸
    const coverWidth = colThrough * (INIT_INFO.CELL_WIDTH + INIT_INFO.BORDER) + INIT_INFO.BORDER;
    const coverHeight = rowThrough * (INIT_INFO.CELL_HEIGHT + INIT_INFO.BORDER) + INIT_INFO.BORDER;

    coverElement.style.width = `${coverWidth}px`;
    coverElement.style.height = `${coverHeight}px`;
    coverElement.style.left = `${coverLeft}px`;
    coverElement.style.top = `${coverTop}px`;
    coverElement.style.display = "block";

    
    switchSelectedCellByClickOnDrag();
}


function setColsIdAction(){
    const colIdContainer = document.querySelector(".excel__col-id-container");
    /**
     * 当鼠标移动到列Id的边缘时  改变鼠标指针及背景颜色  
     */
    colIdContainer.addEventListener("mousemove", setColsCursorAndBackground);

    /**
     * 处理拖拽改变大小  选择一整列
     */
    colIdContainer.addEventListener("mousedown", colIdMouseDownHandler);
}


/**
 * 修改鼠标指针和背景颜色
 */
const colIdBackgroundColorStyle = document.createElement("style");
colIdBackgroundColorStyle.innerHTML = 
`.excel__col-id-container > div:hover{
    background-color: #76cebb;
};
`;
//是否已经加载
colIdBackgroundColorStyle.isEffective = false;
function setColsCursorAndBackground(event){
    if(event.offsetX < event.target.clientWidth * INIT_INFO.MODIFY_CURSOR_BOUNDARY_PERCENT 
        || event.offsetX > event.target.clientWidth * (1 - INIT_INFO.MODIFY_CURSOR_BOUNDARY_PERCENT)){
        event.target.style.cursor = "col-resize";
        if(colIdBackgroundColorStyle.isEffective){
            document.head.removeChild(colIdBackgroundColorStyle);
            colIdBackgroundColorStyle.isEffective = false;
        }
    } else {
        event.target.style.cursor = "default";
        if(!colIdBackgroundColorStyle.isEffective){
            document.head.appendChild(colIdBackgroundColorStyle);
            colIdBackgroundColorStyle.isEffective = true;
        }
    }
}

/**
 * 列Id上的行为有两个
 *  1. 点击列Id靠中间的位置时 选择整列
 *  2. 拖拽列Id边缘时  修改整列的大小
 */
let modifyingColId = null; //用来记录正在调整的列
let relativeXOnColId = null; //用来记录按下时鼠标的位置
function colIdMouseDownHandler(event){
    relativeXOnColId = event.offsetX;
    if(event.offsetX < event.target.clientWidth * INIT_INFO.MODIFY_CURSOR_BOUNDARY_PERCENT ) {
        //在列Id靠前面的范围里   修改前一列的宽度
        const preColId = event.target.colId - 1;
        if(preColId > -1){
            modifyingColId = CELLS.colIdList[preColId];
        }
        relativeXOnColId *= -1;
    } else if(event.offsetX > event.target.clientWidth * (1 - INIT_INFO.MODIFY_CURSOR_BOUNDARY_PERCENT)) {
        //在列Id靠后面的范围  修改当前列的宽度
        modifyingColId = event.target;
    } else{
        //选中当前列

        return ;
    }

    Excel.addEventListener("mousemove", resizeColByDarg);
    Excel.addEventListener("mouseup", function() {
        this.removeEventListener("mousemove", resizeColByDarg);
    });
}

function resizeColByDarg(event){
    if(!modifyingColId){
        return ;
    }

    const width = event.clientX - modifyingColId.offsetLeft + Excel.offsetLeft;
    const increaseOfWidth = width - modifyingColId.clientWidth;
    document.body.style.width = `${increaseOfWidth + document.body.clientWidth}px`;
    console.log(modifyingColId.clientWidth);
    let p = modifyingColId;
    while(p) {
        p.style.width = `${width}px`;
        p = p.nextRow;
    }
}

/**
 * 行Id的行为
 */
function setRowsIdAction(){
    const rowIdContainer = document.querySelector(".excel__row-id-container");
    /**
     * 当鼠标移动到行Id的边缘时  改变鼠标指针及背景颜色  
     */
    rowIdContainer.addEventListener("mousemove", setRowsCursorAndBackground);

    /**
     * 处理拖拽改变大小  选择一整列
     */
    rowIdContainer.addEventListener("mousedown", rowIdMouseDownHandler);
}


// /**
//  * 修改鼠标指针和背景颜色
//  */
// const rowIdBackgroundColorStyle = document.createElement("style");
// rowIdBackgroundColorStyle.innerHTML = 
// `.excel__row-id-container > div:hover{
//     background-color: #76cebb;
// };
// `;
// //是否已经加载
// rowIdBackgroundColorStyle.isEffective = false;
// function setRowsCursorAndBackground(event){
//     if(event.offsetY < event.target.clientHeight * INIT_INFO.MODIFY_CURSOR_BOUNDARY_PERCENT 
//         || event.offsetY > event.target.clientHeight * (1 - INIT_INFO.MODIFY_CURSOR_BOUNDARY_PERCENT)){
//         event.target.style.cursor = "row-resize";
//         if(rowIdBackgroundColorStyle.isEffective){
//             document.head.removeChild(rowIdBackgroundColorStyle);
//             rowIdBackgroundColorStyle.isEffective = false;
//         }
//     } else {
//         event.target.style.cursor = "default";
//         if(!rowIdBackgroundColorStyle.isEffective){
//             document.head.appendChild(rowIdBackgroundColorStyle);
//             rowIdBackgroundColorStyle.isEffective = true;
//         }
//     }
// }

// /**
//  * 列Id上的行为有两个
//  *  1. 点击列Id靠中间的位置时 选择整列
//  *  2. 拖拽列Id边缘时  修改整列的大小
//  */
// let modifyingRowId = null;
// function rowIdMouseDownHandler(event){
//     if(event.offsetX < event.target.clientWidth * INIT_INFO.MODIFY_CURSOR_BOUNDARY_PERCENT ) {
//         //在列Id靠前面的范围里   修改前一列的宽度
//         const preColId = event.target.colId - 1;
//         if(preColId > -1){
//             modifyingRowId = CELLS.colIdList[preColId];
//         }
//     } else if(event.offsetX > event.target.clientWidth * (1 - INIT_INFO.MODIFY_CURSOR_BOUNDARY_PERCENT)) {
//         //在列Id靠后面的范围  修改当前列的宽度
//         modifyingRowId = CELLS.colIdList[event.target.colId];
//     } else{
//         //选中当前列

//         return ;
//     }

//     Excel.addEventListener("mousemove", resizeColByDarg);
//     Excel.addEventListener("mouseup", function() {
//         this.removeEventListener("mousemove", resizeColByDarg);
//     });
// }

// function resizeRowByDarg(event){
//     if(!modifyingColId){
//         return ;
//     }

//     const width = event.clientX - modifyingColId.offsetLeft + Excel.offsetLeft;
//     const increaseOfWidth = width - modifyingColId.clientWidth;
//     document.body.style.width = `${increaseOfWidth + document.body.clientWidth}px`;


//     let p = modifyingColId;
//     while(p) {
//         p.style.width = `${width}px`;
//         p = p.nextRow;
//     }
// }



window.addEventListener("keydown", event => {
    if(event.code === "Enter"){
        //选择下一行的同列cell
        switchSelectedCellByClick(selectedCellByClick.nextRow);
        //关闭cell的可编辑选项
        switchEditableCell();
        //消除上一次的拖拽选择
        takeOffCoverElement();
    }

    if(event.code === "Tab"){
        event.returnValue = false;
        //选择下一列的同行cell
        switchSelectedCellByClick(selectedCellByClick.nextCol);
        //关闭cell的可编辑选项
        switchEditableCell();
        //消除上一次的拖拽选择
        takeOffCoverElement();
    }
});
