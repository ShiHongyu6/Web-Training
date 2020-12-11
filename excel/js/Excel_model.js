/*****BaseCell******* */
function BaseCell(content) {
    this.content = content;
}
BaseCell.prototype.setContent = function(content) {
    this.content = content;
}
BaseCell.prototype.getContent = function() {
    return this.content;
}
/***BaseCell  End**** */


function Header(width, height, content) {
    this.width = width;
    this.height = height;
    BaseCell.call(this, content);
}
inheritPrototype(Header, BaseCell);
Header.prototype.setHeight = function(height) {
    this.height = height;
}
Header.prototype.getHeight = function() {
    return this.height;
}
Header.prototype.setWidth = function(width) {
    this.width = width;
}
Header.prototype.getWidth = function() {
    return this.width;
}




/*****ColHeader******* */
function ColHeader(width, height, content) {
    Header.call(this, width, height, content);
}
inheritPrototype(ColHeader, Header);
/***ColHeader  End**** */






/*****RowHeader******* */
function RowHeader(width, height, content) {
    Header.call(this, width, height, content);
}
inheritPrototype(RowHeader, Header);
/***RowHeader  End**** */





/*****CellHeader******* */
function Cell(content) {
    BaseCell.call(this, content);
}
inheritPrototype(Cell, BaseCell);
/***Cell  End**** */




/*****CornerHeader******* */
function CornerHeader(width, height,content) {
    Header.call(this, width, height, content);
}
inheritPrototype(CornerHeader, Header);
/*****CornerHeader  End**** */


/**
 * 选择cell时 包括
 * 1. 通过点击或者在cell上拖拽
 * 2. 选择一整行
 * 3. 选择一整列
 * 4. 全选
 */
const SelectionType = {
    Cells: "cells",
    FullRow: "fullRow",
    FullCol: "fullCol", 
    AllSelect: "allSelect"
};



function Excel(rowCount, colCount, cellWidth, cellHeight, rowHeaderWidth, colHeaderHeight){
    this.cornerHeader = new CornerHeader("");
    this.colHeaders = [];
    for(let i = 0; i < colCount; ++i){
        this.colHeaders.push(new ColHeader(cellWidth, colHeaderHeight ,transformNumberIdToLetterId(i)));
    }

    this.cells = [];
    this.rowHeaders = [];
    for(let i = 0; i < rowCount; ++i){
        this.rowHeaders.push(new RowHeader(rowHeaderWidth, cellHeight, i + 1));
        this.cells.push(new Array(0));
    }

    this.selectionArea = {
        leftTop : {
            rowIndex: 0,
            colIndex: 0
        },
        rightBottom: {
            rowIndex: 0,
            colIndex: 0
        }, 
        selectionType : SelectionType.Cells
    };

    this.activeCell = {
        rowIndex: 0,
        colIndex: 0
    }

    //命令的执行者
    this.commandExecutor = null;
}

/**
 * 注入命令的执行器
 */
Excel.prototype.setCommandExecutor = function(commandExecutor) {
    this.commandExecutor = commandExecutor;

    //同步选择框
    excel.setActiveCell();
    excel.setSelectionArea();
}

Excel.prototype.rowIndexBeInBoundary = function(rowIndex) {
    return rowIndex > -1 && rowIndex < this.rowHeaders.length
}

Excel.prototype.colIndexBeInBoundary = function(colIndex) {
    return colIndex > -1 && colIndex < this.colHeaders.length;
}

Excel.prototype.getColCount = function() {
    return this.colHeaders.length;
}

Excel.prototype.getRowCount = function() {
    return this.rowHeaders.length;
}


Excel.prototype.getColWidth = function(colIndex) {
    if(!this.colIndexBeInBoundary(colIndex)){
        throw new Error("col-index out of bounds: index should greater than -1 and less than " + this.colHeaders.length);
    }

    return colHeaders[colIndex].width;
}

Excel.prototype.getRowHeight = function(rowIndex) {
    if(!this.rowIndexBeInBoundary(rowIndex)){
        throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
    }

    return colHeaders[rowIndex].height;
}


Excel.prototype.setColWidth = function(colIndex, width) {
    if(!this.colIndexBeInBoundary(colIndex)){
        throw new Error("col-index out of bounds: index should greater than -1 and less than " + this.colHeaders.length);
    }

    if(width < 0) {
        throw new Error("invalid value of width : " + width);
    }

    this.colHeaders[colIndex].setWidth(width);
    this.commandExecutor.execute(new ModifyColWidth({colIndex, width}));
    //修改宽度后  同步选择框
    this.setActiveCell();
    this.setSelectionArea();
}

Excel.prototype.setRowHeight = function(rowIndex, height) {
    if(!this.rowIndexBeInBoundary(rowIndex)){
        throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
    }

    if(height < 0) {
        throw new Error("invalid value of height : " + height);
    }
    this.rowHeaders[rowIndex].setHeight(height);
    this.commandExecutor.execute(new ModifyRowHeight({rowIndex, height}));

    this.setActiveCell();
    this.setSelectionArea();
}

/**
 * leftTop = {
 *      rowIndex, colIndex
 * }
 */
Excel.prototype.setSelectionArea = function(leftTopRowIndex, leftTopColIndex, rightBottomRowIndex, rightBottomColIndex, selectionType){
    //仅在参数个数满足时 才会更改  否则  仅以当前值发送命令
    if(arguments.length == 5) {
        if(!this.rowIndexBeInBoundary(leftTopRowIndex)){
            throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
        }
        if(!this.rowIndexBeInBoundary(rightBottomRowIndex)){
            throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
        }
        if(!this.colIndexBeInBoundary(leftTopColIndex)){
            throw new Error("col-index out of bounds: index should greater than -1 and less than " + this.colHeaders.length);
        }
        if(!this.colIndexBeInBoundary(rightBottomColIndex)){
            throw new Error("col-index out of bounds: index should greater than -1 and less than " + this.colHeaders.length);
        }
        this.selectionArea.leftTop.rowIndex = leftTopRowIndex;
        this.selectionArea.leftTop.colIndex = leftTopColIndex;
        this.selectionArea.rightBottom.rowIndex = rightBottomRowIndex;
        this.selectionArea.rightBottom.colIndex = rightBottomColIndex;
        this.selectionArea.selectionType = selectionType;
    }
    this.commandExecutor.execute(new ModifySelectionArea({
        leftTopRowIndex : this.selectionArea.leftTop.rowIndex, 
        leftTopColIndex : this.selectionArea.leftTop.colIndex,
        rightBottomRowIndex : this.selectionArea.rightBottom.rowIndex, 
        rightBottomColIndex : this.selectionArea.rightBottom.colIndex, 
        selectionType : this.selectionArea.selectionType}));
}




Excel.prototype.setActiveCell = function(rowIndex, colIndex) {

    if(arguments.length == 2){
        if(!this.rowIndexBeInBoundary(rowIndex)){
            throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
        }
        if(!this.colIndexBeInBoundary(colIndex)){
            throw new Error("col-index out of bounds: index should greater than -1 and less than " + this.colHeaders.length);
        }
        
        this.activeCell.rowIndex = rowIndex;
        this.activeCell.colIndex = colIndex;
    }

    const activeCellWidth  = this.colHeaders[this.activeCell.colIndex].getWidth();
    const activeCellHeight = this.rowHeaders[this.activeCell.rowIndex].getHeight();
    let cellContent = "";
    if(this.cells[this.activeCell.rowIndex][this.activeCell.colIndex] && this.cells[this.activeCell.rowIndex][this.activeCell.colIndex].getContent()) {
        cellContent = this.cells[this.activeCell.rowIndex][this.activeCell.colIndex].getContent();
    } 

    this.commandExecutor.execute(new ModifyActiveCell({
        colIndex : this.activeCell.colIndex, 
        rowIndex : this.activeCell.rowIndex, 
        activeCellWidth, 
        activeCellHeight, 
        cellContent}));
}


Excel.prototype.addCol = function(colIndex, width) {
    if(width < -1){
        throw new Error("col-index out of bounds: index should greater than -1");
    }

    if(width < 0) {
        throw new Error("invalid value of width : " + width);
    }
    this.colHeaders.splice(colIndex, 0, new ColHeader(width, this.colHeaders[0].getHeight() , transformNumberIdToLetterId(colIndex)));
    //将新添加的列之后的colHeader的内容更新
    for(let i = colIndex; i < this.colHeaders.length; ++i){
        this.colHeaders[i].setContent(transformNumberIdToLetterId(i));
    }

    //如果新添加的列对它之后的列造成影响 则进行调整
    for(let i = 0; i < this.rowHeaders.length; ++i){
        this.cells[i].splice(colIndex, 0, undefined);
    }


    if(colIndex <= this.selectionArea.rightBottom.colIndex){
        ++this.selectionArea.rightBottom.colIndex;
        if(colIndex <= this.selectionArea.leftTop.colIndex){
            ++this.selectionArea.leftTop.colIndex;
        }
    }

    if(colIndex <= this.activeCell.colIndex) {
        ++this.activeCell.colIndex;
    }


    this.commandExecutor.execute(new Refresh());
}

Excel.prototype.removeCol = function(colIndex) {

    if(this.colHeaders.length == 1)
        return ;

    if(!this.colIndexBeInBoundary(colIndex)){
        throw new Error("col-index out of bounds: index should greater than -1 and less than " + this.colHeaders.length);
    }
    this.colHeaders.splice(colIndex, 1);
    for(let i = colIndex; i < this.colHeaders.length; ++i){
        this.colHeaders[i].setContent(transformNumberIdToLetterId(i));
    }

    //如果删除的列对它之后的列造成影响 则进行调整
    for(let i = 0; i < this.rowHeaders.length; ++i){
        this.cells[i].splice(colIndex, 1);
    }

    if(colIndex == this.selectionArea.rightBottom.colIndex && this.selectionArea.rightBottom.colIndex == this.selectionArea.leftTop.colIndex) {
        //这一行删除干净 默认选择(0, 0)
        this.setActiveCell(0, 0)
        this.setSelectionArea(0, 0, 0, 0, SelectionType.Cells);
    } else if(colIndex <= this.selectionArea.rightBottom.colIndex){
        --this.selectionArea.rightBottom.colIndex;
        if(colIndex < this.selectionArea.leftTop.colIndex){
            --this.selectionArea.leftTop.colIndex;
        }
    }

    if(colIndex < this.activeCell.colIndex) {
        --this.activeCell.colIndex;
    }

    this.commandExecutor.execute(new Refresh());
}

Excel.prototype.addRow = function(rowIndex, height) {
    if(rowIndex < -1){
        throw new Error("row-index out of bounds: index should greater than -1");
    }
    if(height < 0) {
        throw new Error("invalid value of height : " + height);
    }
    //添加一个新的RowHeader
    this.rowHeaders.splice(rowIndex, 0, new RowHeader(this.rowHeaders[0].getWidth(), height, rowIndex + 1));
    for(let i = rowIndex + 1; i < this.rowHeaders.length; ++i) {
        this.rowHeaders[i].setContent(i + 1);
    }

    this.cells.splice(rowIndex, 0, new Array(0));

    if(rowIndex <= this.selectionArea.rightBottom.rowIndex){
        ++this.selectionArea.rightBottom.rowIndex;
        if(rowIndex <= this.selectionArea.leftTop.rowIndex){
            ++this.selectionArea.leftTop.rowIndex;
        }
    }

    if(rowIndex <= this.activeCell.rowIndex) {
        ++this.activeCell.rowIndex;
    }

    this.commandExecutor.execute(new Refresh());
}

Excel.prototype.removeRow = function(rowIndex) {

    if(this.rowHeaders.length == 1)
        return ;

    if(!this.rowIndexBeInBoundary(rowIndex)){
        throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
    }
    this.rowHeaders.splice(rowIndex, 1);
    this.cells.splice(rowIndex, 1);
    for(let i = rowIndex; i < this.rowHeaders.length; ++i) {
        this.rowHeaders[i].setContent(i + 1);
    }

    if(rowIndex == this.selectionArea.rightBottom.rowIndex && this.selectionArea.rightBottom.rowIndex == this.selectionArea.leftTop.rowIndex) {
        //这一行删除干净 默认选择(0, 0)
        this.setActiveCell(0, 0)
        this.setSelectionArea(0, 0, 0, 0, SelectionType.Cells);
    } else if(rowIndex <= this.selectionArea.rightBottom.rowIndex){
            --this.selectionArea.rightBottom.rowIndex;
            if(rowIndex < this.selectionArea.leftTop.rowIndex){
                --this.selectionArea.leftTop.rowIndex;
            }
    }

    if(rowIndex < this.activeCell.rowIndex) {
        --this.activeCell.rowIndex;
    }
    this.commandExecutor.execute(new Refresh());
}

Excel.prototype.setColHeaderContent = function(colIndex, content) {
    if(!this.rowIndexBeInBoundary(rowIndex)){
        throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
    }
    this.colHeaders[colIndex].setContent(content);
}

Excel.prototype.setRowHeaderContent = function(rowIndex, content) {
    if(!this.rowIndexBeInBoundary(rowIndex)){
        throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
    }
    this.rowHeaders[rowIndex].setContent(content);
}

Excel.prototype.setCellContent = function(rowIndex, colIndex, content) {
    if(!this.rowIndexBeInBoundary(rowIndex)){
        throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
    }
    if(!this.rowIndexBeInBoundary(rowIndex)){
        throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
    }

    if(!this.cells[rowIndex][colIndex]) {
        this.cells[rowIndex][colIndex] = new Cell();
    }
    this.cells[rowIndex][colIndex].setContent(content);
    this.commandExecutor.execute(new ModifyCellContent({rowIndex, colIndex, content}));
}


function inheritPrototype(subType, superType){
    const subProto = {};//构造一个子类实例的的[[prototype]]
    Object.defineProperty(subProto, "constructor", {
        value: subType,
        enumerable: false
    });
    subType.prototype = subProto;
    Object.setPrototypeOf(subProto, superType.prototype);//子类的prototype的[[prototype]]指向父类的prototype
}


function transformNumberIdToLetterId(id){
    id = Number(id);
    if((!id && id != 0) || id < 0){
        throw Error(`invalid id, it,: "${id}"` );
    }

    const unicodeOfA = 'A'.charCodeAt(0); 
    const stringBuilder = [];
    do {
        stringBuilder.unshift(String.fromCharCode(unicodeOfA + id % 26));
        id = Math.floor(id / 26);
    }while(id);

    return stringBuilder.join('');
}
