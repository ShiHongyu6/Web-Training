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
