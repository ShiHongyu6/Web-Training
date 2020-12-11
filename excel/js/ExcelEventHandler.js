function ExcelEventHandler(excelRenderer) {
    this.excelRenderer = excelRenderer;

    /**
     * 当触发mouseup或mouseleave事件时  需要关闭的事件(拖拽)
     */
    this.unloadOnMouseUpOrMouseLeave = null;


    /**
     * 如果要进行resize 这里存储index
     */
    this.resize = false;
    this.resizeIndex = null;
    this.resizeRelative = null;

    this.bindEvent();
}

ExcelEventHandler.prototype.bindEvent = function() {
    mouseDownCell = mouseDownCell.bind(this);
    this.excelRenderer.cellsContainer.addEventListener("mousedown", mouseDownCell);

    mouseDblClick = mouseDblClick.bind(this);
    this.excelRenderer.cellsContainer.addEventListener("dblclick", mouseDblClick);

    mouseDownColHeader = mouseDownColHeader.bind(this);
    this.excelRenderer.colHeaderContainer.addEventListener("mousedown", mouseDownColHeader);

    mouseDownRowHeader = mouseDownRowHeader.bind(this);
    this.excelRenderer.rowHeaderContainer.addEventListener("mousedown", mouseDownRowHeader);

    mouseDownAllSelect = mouseDownAllSelect.bind(this);
    this.excelRenderer.allSelectButton.addEventListener("mousedown", mouseDownAllSelect);

    mouseMoveToDragSelect = mouseMoveToDragSelect.bind(this);
    //当鼠标在cell上按下时 绑定这个事件

    mouseMoveOnColHeader = mouseMoveOnColHeader.bind(this);
    this.excelRenderer.colHeaderContainer.addEventListener("mousemove", mouseMoveOnColHeader);

    mouseMoveToResizeCol = mouseMoveToResizeCol.bind(this);
    //当鼠标在colHeader按下时  并且不为选中整列 则绑定该事件

    mouseMoveOnRowHeader = mouseMoveOnRowHeader.bind(this);
    this.excelRenderer.rowHeaderContainer.addEventListener("mousemove", mouseMoveOnRowHeader);

    mouseMoveToResizeRow = mouseMoveToResizeRow.bind(this);

    addRow = addRow.bind(this);
    this.excelRenderer.addRowIndexBtn.addEventListener("click", addRow);

    addCol = addCol.bind(this);
    this.excelRenderer.addColIndexBtn.addEventListener("click", addCol);

    removeRow = removeRow.bind(this);
    this.excelRenderer.removeRowIndexBtn.addEventListener("click", removeRow);

    removeCol = removeCol.bind(this);
    this.excelRenderer.removeColIndexBtn.addEventListener("click", removeCol);


    mouseUpOrMouseLeaveOnExcelPanel = mouseUpOrMouseLeaveOnExcelPanel.bind(this);
    this.excelRenderer.excelElement.addEventListener("mouseup", mouseUpOrMouseLeaveOnExcelPanel);
    this.excelRenderer.excelElement.addEventListener("mouseleave", mouseUpOrMouseLeaveOnExcelPanel);

}


/**
 * 开启一个cell的编辑
 */
ExcelEventHandler.prototype.openEdit = function() {
    this.excelRenderer.activeCell.contentEditable = "true";
    this.excelRenderer.activeCell.focus();
};
/**
 * 关闭一个cell的编辑
 */
ExcelEventHandler.prototype.closeEdit = function() {
    this.excelRenderer.activeCell.contentEditable = "false";
};

/**
 * 在Cell上按下鼠标 
 */
function mouseDownCell(event){
    const x = event.pageX - this.excelRenderer.excelElement.offsetLeft - this.excelRenderer.colHeaderContainer.offsetLeft;
    const y = event.pageY - this.excelRenderer.rowHeaderContainer.offsetTop;
    const index = this.excelRenderer.transformCoordinateToIndex(x, y);
    console.log(index.rowIndex, index.colIndex);

    if(index.rowIndex != this.excelRenderer.excel.activeCell.rowIndex || index.colIndex != this.excelRenderer.excel.activeCell.colIndex){
        //即将切换ActiveCell 向模型中保存输入的内容
        this.excelRenderer.excel.setCellContent(this.excelRenderer.excel.activeCell.rowIndex, this.excelRenderer.excel.activeCell.colIndex, this.excelRenderer.activeCell.innerHTML);
        this.closeEdit();

        this.excelRenderer.excel.setActiveCell(index.rowIndex, index.colIndex);
        this.excelRenderer.excel.setSelectionArea(index.rowIndex, index.colIndex, index.rowIndex, index.colIndex, SelectionType.Cells);
    }

    //在Cell上按下鼠标后  绑定拖拽选择的事件
    this.excelRenderer.excelElement.addEventListener("mousemove", mouseMoveToDragSelect);
    //记录当前绑定的事件  当mouseup触发或者mouseleave触发时 将该事件移除
    this.unloadOnMouseUpOrMouseLeave = {
        element : this.excelRenderer.excelElement,
        event   : "mousemove", 
        handler : mouseMoveToDragSelect
    };
}

/**
 * 双击
 */
function mouseDblClick(event){
    this.openEdit();
}


/**
 * 在colHeader上按下鼠标
 */
function mouseDownColHeader(event){
    //如果不是要resize 则选择整列
    const x = event.pageX - this.excelRenderer.excelElement.offsetLeft - this.excelRenderer.colHeaderContainer.offsetLeft;
    if(this.resizeIndex == null){
        const index = this.excelRenderer.transformCoordinateToIndex(x, null);
        this.excelRenderer.excel.setActiveCell(0, index.colIndex);
        this.excelRenderer.excel.setSelectionArea(0, index.colIndex, this.excelRenderer.excel.rowHeaders.length - 1, index.colIndex, SelectionType.FullCol);
    } else {
    //resize-col
        this.resize = true;

        //记录相对位置
        this.resizeRelative = x - this.excelRenderer.colHeaderElements[this.resizeIndex + 1].offsetLeft;


        //开启拖拽
        this.excelRenderer.excelElement.addEventListener("mousemove", mouseMoveToResizeCol);
        //记录该拖拽事件
        this.unloadOnMouseUpOrMouseLeave = {
            element : this.excelRenderer.excelElement,
            event   : "mousemove", 
            handler : mouseMoveToResizeCol
        };
    }
}


/**
 * 在rowHeader上按下鼠标 
 */
function mouseDownRowHeader(event){
    const y = event.pageY - this.excelRenderer.rowHeaderContainer.offsetTop;
    if(this.resizeIndex == null){
        const index = this.excelRenderer.transformCoordinateToIndex(null, y);
        this.excelRenderer.excel.setActiveCell(index.rowIndex, 0);
        this.excelRenderer.excel.setSelectionArea(index.rowIndex, 0, index.rowIndex, this.excelRenderer.excel.colHeaders.length - 1, SelectionType.FullRow);
    } else {
        this.resize = true;
        this.resizeRelative = y - this.excelRenderer.rowHeaderElements[this.resizeIndex + 1].offsetTop;

        //开启拖拽
        this.excelRenderer.excelElement.addEventListener("mousemove", mouseMoveToResizeRow);
        //记录该拖拽事件
        this.unloadOnMouseUpOrMouseLeave = {
            element : this.excelRenderer.excelElement,
            event   : "mousemove", 
            handler : mouseMoveToResizeRow
        };
    }
}

/**
 * 在全选按钮上按下鼠标
 */
function mouseDownAllSelect(event){
    this.excelRenderer.excel.setActiveCell(0, 0);
    this.excelRenderer.excel.setSelectionArea(0, 0, this.excelRenderer.excel.rowHeaders.length - 1, this.excelRenderer.excel.colHeaders.length - 1, SelectionType.AllSelect);
}

/**
 * 在cell上按下鼠标后  绑定该事件  开启拖拽
 */
function mouseMoveToDragSelect(event) {
    //得到鼠标移动时对应的行号和列号
    const x = event.pageX - this.excelRenderer.excelElement.offsetLeft - this.excelRenderer.colHeaderContainer.offsetLeft;
    const y = event.pageY - this.excelRenderer.rowHeaderContainer.offsetTop;
    const index = this.excelRenderer.transformCoordinateToIndex(x, y);

    const rowIndexActive = this.excelRenderer.excel.activeCell.rowIndex;
    const colIndexActive = this.excelRenderer.excel.activeCell.colIndex;

    const leftTopRowIndex = Math.min(rowIndexActive, index.rowIndex);
    const leftTowColIndex = Math.min(colIndexActive, index.colIndex);
    const rightBottomRowIndex = Math.max(rowIndexActive, index.rowIndex);
    const rightBottomColIndex = Math.max(colIndexActive, index.colIndex);

    this.excelRenderer.excel.setSelectionArea(leftTopRowIndex, leftTowColIndex, rightBottomRowIndex, rightBottomColIndex, SelectionType.Cells);
}


/**
 * mouseup触发时  关闭当前的事件
 */
function mouseUpOrMouseLeaveOnExcelPanel(event) {

    if(event.type == "mouseleave" && event.target != this.excelRenderer.excelElement)
        return ;

    if(this.unloadOnMouseUpOrMouseLeave){
        this.unloadOnMouseUpOrMouseLeave.element.removeEventListener(this.unloadOnMouseUpOrMouseLeave.event, this.unloadOnMouseUpOrMouseLeave.handler);
        this.unloadOnMouseUpOrMouseLeave = null;
    }
    this.resize = false;

}


/**
 * 鼠标在colHeaderContainer上移动时 碰到colHeader的边缘时  要更改样式
 */
function mouseMoveOnColHeader(event) {

    //如果正在拖拽  则不理会
    if(this.resize){
        return ;
    }

    //判断是否在header边缘
    const x = event.pageX - this.excelRenderer.excelElement.offsetLeft - this.excelRenderer.colHeaderContainer.offsetLeft;
    const index = this.excelRenderer.transformCoordinateToIndex(x, null);
    const headerElement = this.excelRenderer.colHeaderElements[index.colIndex];
    this.resizeIndex = null;
    headerElement.classList.add("hover");
    this.excelRenderer.colHeaderContainer.classList.remove("resize");


    if(x - headerElement.offsetLeft < 5 && index.colIndex > 0){
        headerElement.classList.remove("hover");
        this.excelRenderer.colHeaderContainer.classList.add("resize");
        this.resizeIndex = index.colIndex - 1;
    }
    if(-(x - headerElement.offsetLeft - headerElement.clientWidth) < 5 && index.colIndex < this.excelRenderer.colHeaderElements.length - 1) {
        headerElement.classList.remove("hover");
        this.excelRenderer.colHeaderContainer.classList.add("resize");
        this.resizeIndex = index.colIndex;
    }
}


function mouseMoveOnRowHeader(event) {

    //如果正在拖拽  则不理会
    if(this.resize){
        return ;
    }

    //判断是否在header边缘
    const y = event.pageY - this.excelRenderer.rowHeaderContainer.offsetTop;
    const index = this.excelRenderer.transformCoordinateToIndex(null, y);
    const headerElement = this.excelRenderer.rowHeaderElements[index.rowIndex];
    this.resizeIndex = null;
    headerElement.classList.add("hover");
    this.excelRenderer.rowHeaderContainer.classList.remove("resize");


    if(y - headerElement.offsetTop < 5){
        headerElement.classList.remove("hover");
        this.excelRenderer.rowHeaderContainer.classList.add("resize");
        this.resizeIndex = index.rowIndex - 1;
    }
    if(-(y - headerElement.offsetTop - headerElement.clientHeight) < 5) {
        headerElement.classList.remove("hover");
        this.excelRenderer.rowHeaderContainer.classList.add("resize");
        this.resizeIndex = index.rowIndex;
    }
}


function mouseMoveToResizeCol(event) {
    
    const colHeaderElement = this.excelRenderer.colHeaderElements[this.resizeIndex];
    const width = event.pageX - this.excelRenderer.colHeaderContainer.offsetLeft - colHeaderElement.offsetLeft - this.resizeRelative;
    this.excelRenderer.excel.setColWidth(this.resizeIndex, width);
}

function mouseMoveToResizeRow(event) {
    const rowHeaderElement = this.excelRenderer.rowHeaderElements[this.resizeIndex];
    const height = event.pageY - this.excelRenderer.rowHeaderContainer.offsetTop - rowHeaderElement.offsetTop - this.resizeRelative;
    this.excelRenderer.excel.setRowHeight(this.resizeIndex, height);
}

function addRow() {
    const rowIndex = Number(this.excelRenderer.addRowIndexInput.value);
    if(!isNaN(rowIndex) && rowIndex > -1) {
        this.excelRenderer.excel.addRow(rowIndex - 1, INIT_INFO.CELL_HEIGHT);
    }
}

function addCol() {
    const colIndex = Number(this.excelRenderer.addColIndexInput.value);
    if(!isNaN(colIndex) && colIndex > -1) {
        this.excelRenderer.excel.addCol(colIndex - 1, INIT_INFO.CELL_WIDTH);
    }
}

function removeRow() {
    const rowIndex = Number(this.excelRenderer.removeRowIndexInput.value);
    if(!isNaN(rowIndex) && rowIndex > -1) {
        this.excelRenderer.excel.removeRow(rowIndex - 1);
    }
}


function removeCol() {
    const colIndex = Number(this.excelRenderer.removeColIndexInput.value);
    if(!isNaN(colIndex) && colIndex > -1) {
        this.excelRenderer.excel.removeCol(colIndex - 1);
    }
}