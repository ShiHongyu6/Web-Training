function ExcelEventHandler(excelRenderer) {
    this.excelRenderer = excelRenderer;

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
    const x = event.pageX - this.excelRenderer.colHeaderContainer.offsetLeft;
    const y = event.pageY - this.excelRenderer.rowHeaderContainer.offsetTop;
    const index = this.excelRenderer.transformCoordinateToIndex(x, y);

    if(index.rowIndex != this.excelRenderer.excel.activeCell.rowIndex || index.colIndex != this.excelRenderer.excel.activeCell.colIndex){
        //即将切换ActiveCell 向模型中保存输入的内容
        this.excelRenderer.excel.setCellContent(this.excelRenderer.excel.activeCell.rowIndex, this.excelRenderer.excel.activeCell.colIndex, this.excelRenderer.activeCell.innerHTML);

        this.excelRenderer.excel.setActiveCell(index.rowIndex, index.colIndex);
        this.excelRenderer.excel.setSelectionArea(index.rowIndex, index.colIndex, index.rowIndex, index.colIndex, SelectionType.Cells);
        this.closeEdit();
    }
}

/**
 * 双击
 */
function mouseDblClick(event){
    this.openEdit();
}


/**
 * 在colHeader上点击鼠标
 */
function mouseDownColHeader(event){
    const x = event.pageX - this.excelRenderer.colHeaderContainer.offsetLeft;
    const index = this.excelRenderer.transformCoordinateToIndex(x, null);
    this.excelRenderer.excel.setActiveCell(0, index.colIndex);
    this.excelRenderer.excel.setSelectionArea(0, index.colIndex, this.excelRenderer.excel.rowHeaders.length - 1, index.colIndex, SelectionType.FullCol);
}


/**
 * 在rowHeader上点击鼠标 
 */
function mouseDownRowHeader(event){
    const y = event.pageY - this.excelRenderer.rowHeaderContainer.offsetTop;
    const index = this.excelRenderer.transformCoordinateToIndex(null, y);
    this.excelRenderer.excel.setActiveCell(index.rowIndex, 0);
    this.excelRenderer.excel.setSelectionArea(index.rowIndex, 0, index.rowIndex, this.excelRenderer.excel.colHeaders.length - 1, SelectionType.FullRow);
}


function mouseDownAllSelect(event){
    this.excelRenderer.excel.setActiveCell(0, 0);
    this.excelRenderer.excel.setSelectionArea(0, 0, this.excelRenderer.excel.rowHeaders.length - 1, this.excelRenderer.excel.colHeaders.length - 1, SelectionType.AllSelect);
}