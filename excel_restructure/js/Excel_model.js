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
    BaseCell.call(this.content);
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
            rowIndex: null,
            colIndex: null
        },
        rightBottom: {
            rowIndex: null,
            colIndex: null
        }, 
        selectFullRow : false,
        selectFullCol : false,
        selectAll     : false
    };

    this.activeCell = {
        rowIndex: null,
        colIndex: null
    }


    this.onChange = null;
}

Excel.prototype.setOnChangeCallBack = function(onChange) {
    this.onChange = onChange;
}

Excel.prototype.rowIndexBeInBoundary = function(rowIndex) {
    return rowIndex > -1 && rowIndex < this.rowHeaders.length
}

Excel.prototype.colIndexBeInBoundary = function(colIndex) {
    return colIndex > -1 && colIndex < this.colHeaders.length;
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
    this.onChange(OnChangeActions.ModifyColWidth, {colIndex, width});
}

Excel.prototype.setRowHeight = function(rowIndex, height) {
    if(!this.rowIndexBeInBoundary(rowIndex)){
        throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
    }

    if(height < 0) {
        throw new Error("invalid value of height : " + height);
    }
    this.onChange(OnChangeActions.ModifyRowHeight, {rowIndex, width});
}

Excel.prototype.setSelectionArea = function(leftTop, rightBottom, selectFullRow, selectFullCol, selectAll){
    if(!this.rowIndexBeInBoundary(leftTop.rowIndex)){
        throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
    }
    if(!this.rowIndexBeInBoundary(rightBottom.rowIndex)){
        throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
    }
    if(!this.colIndexBeInBoundary(leftTop.colIndex)){
        throw new Error("col-index out of bounds: index should greater than -1 and less than " + this.colHeaders.length);
    }
    if(!this.colIndexBeInBoundary(rightBottom.colIndex)){
        throw new Error("col-index out of bounds: index should greater than -1 and less than " + this.colHeaders.length);
    }
    this.selectionArea.leftTop = leftTop;
    this.selectionArea.rightBottom = rightBottom;
    this.selectFullRow = selectFullRow;
    this.selectFullCol = selectFullCol;
    this.selectAll     = selectAll;
    this.onChange(OnChangeActions.ModifySelectionArea, this.selectionArea);
}

Excel.prototype.setActiveCell = function(rowIndex, colIndex) {
    if(!this.rowIndexBeInBoundary(rowIndex)){
        throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
    }
    if(!this.colIndexBeInBoundary(colIndex)){
        throw new Error("col-index out of bounds: index should greater than -1 and less than " + this.colHeaders.length);
    }
    this.activeCell.rowIndex = rowIndex;
    this.activeCell.colIndex = colIndex;
    this.onChange(OnChangeAction.activeCell, this.activeCell);
}

// Excel.prototype.setEditingCell = function(rowIndex, colIndex) {
//     if(!this.rowIndexBeInBoundary(rowIndex)){
//         throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
//     }
//     if(!this.colIndexBeInBoundary(colIndex)){
//         throw new Error("col-index out of bounds: index should greater than -1 and less than " + this.colHeaders.length);
//     }
//     this.editingCell.rowIndex = rowIndex;
//     this.editingCell.colIndex = colIndex;
//     this.onChange(OnChangeAction.OpenEdit, this.editingCell);
// }


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
        const row = this.cells[i];

        //要将添加的这一列之后的所有列向后移动
        for(let j = row.length - 1; j >= colIndex; --j){
            if(row[j]){
                row[j + 1] = row[j];
                delete row[j];
            }
        }
    }

    this.onChange(OnChangeActions.AddCol, colIndex);
}

Excel.prototype.removeCol = function(colIndex) {
    if(!this.colIndexBeInBoundary(colIndex)){
        throw new Error("col-index out of bounds: index should greater than -1 and less than " + this.colHeaders.length);
    }
    this.colHeaders.splice(colIndex, 1);
    for(let i = colIndex; i < this.colHeaders.length; ++i){
        this.colHeaders[i].setContent(transformNumberIdToLetterId(i));
    }

    //如果删除的列对它之后的列造成影响 则进行调整
    for(let i = 0; i < this.rowHeaders.length; ++i){
        const row = this.cells[i];

        //要将删除的这一列之后的所有列向前移动
        for(let j = colIndex; j < row.length - 1; ++j){
            row[j] = row[j + 1];
            if(row[j + 1]){
                delete row[j + 1];
            }
        }
    }


    this.onChange(OnChangeActions.RemoveCol, colIndex);
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
    this.onChange(OnChangeActions.AddRow, rowIndex);
}

Excel.prototype.removeRow = function(rowIndex) {
    if(!this.rowIndexBeInBoundary(rowIndex)){
        throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
    }
    this.rowHeaders.splice(rowIndex, 1);
    this.cells.splice(rowIndex, 1);
    for(let i = rowIndex; i < this.rowHeaders.length; ++i) {
        this.rowHeaders[i].setContent(i + 1);
    }
    this.onChange(OnChangeActions.RemoveRow, rowIndex);
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
}


Excel.prototype.toString = function() {
    const stringBuilder = ["\n"];
    for(let i = 0; i < this.rowHeaders.length; ++i){
        for(let j = 0; j < this.colHeaders.length; ++j){
            if(this.cells[i][j]){
                stringBuilder.push(this.cells[i][j].getContent());
            } else {
                stringBuilder.push("-");
            }
        }
        stringBuilder.push("\n");
    }
    return stringBuilder.join('');
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