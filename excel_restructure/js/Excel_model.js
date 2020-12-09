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






/*****ColHeader******* */
function ColHeader(width, content) {
    this.width = width;
    BaseCell.call(this, content);
}
inheritPrototype(ColHeader, BaseCell);
ColHeader.prototype.setWidth = function(width) {
    this.width = width;
}
ColHeader.prototype.getWidth = function() {
    return this.width;
}
/***ColHeader  End**** */






/*****RowHeader******* */
function RowHeader(height, content) {
    this.height = height;
    BaseCell.call(this, content);
}
inheritPrototype(RowHeader, BaseCell);
RowHeader.prototype.setHeight = function(height) {
    this.height = height;
}
RowHeader.prototype.getHeight = function() {
    return this.height;
}
/***RowHeader  End**** */





/*****CellHeader******* */
function Cell(content) {
    BaseCell.call(this, content);
}
inheritPrototype(Cell, BaseCell);
/***Cell  End**** */




/*****CornerHeader******* */
function CornerHeader(content) {
    BaseCell.call(this, content);
}
inheritPrototype(CornerHeader, BaseCell);
/*****CornerHeader  End**** */


function Excel(cornerHeader, colHeaders, rowHeaders, cells){
    this.cornerHeader = cornerHeader;
    this.colHeaders = colHeaders;
    this.rowHeaders = rowHeaders;
    this.cells = cells;
    
    this.selectionArea = {
        leftTop : {
            rowIndex: null,
            colIndex: null
        },
        rightBottom: {
            rowIndex: null,
            colIndex: null
        }
    };

    this.selectionCell = {
        rowIndex: null,
        colIndex: null
    }

    this.editingCell = {
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


Excel.prototype.resizeColWidth = function(colIndex, width) {
    if(!this.colIndexBeInBoundary(colIndex)){
        throw new Error("col-index out of bounds: index should greater than -1 and less than " + this.colHeaders.length);
    }

    if(width < 0) {
        throw new Error("invalid value of width : " + width);
    }

    this.colHeaders[colIndex].setWidth(width);
    this.onChange(OnChangeActions.ModifyColWidth, {colIndex, width});
}

Excel.prototype.resizeRowHeight = function(rowIndex, height) {
    if(!this.rowIndexBeInBoundary(rowIndex)){
        throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
    }

    if(height < 0) {
        throw new Error("invalid value of height : " + height);
    }
    this.onChange(OnChangeActions.ModifyRowHeight, {rowIndex, width});
}

Excel.prototype.setSelectionArea = function(leftTop, rightBottom){
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
    this.onChange(OnChangeActions.ModifySelectionArea, this.selectionArea);
}

Excel.prototype.setSelectionCell = function(rowIndex, colIndex) {
    if(!this.rowIndexBeInBoundary(rowIndex)){
        throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
    }
    if(!this.colIndexBeInBoundary(colIndex)){
        throw new Error("col-index out of bounds: index should greater than -1 and less than " + this.colHeaders.length);
    }
    this.selectionCell.rowIndex = rowIndex;
    this.selectionCell.colIndex = colIndex;
    this.onChange(OnChangeAction.ModifySelectionCell, this.selectionCell);
}

Excel.prototype.setEditingCell = function(rowIndex, colIndex) {
    if(!this.rowIndexBeInBoundary(rowIndex)){
        throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
    }
    if(!this.colIndexBeInBoundary(colIndex)){
        throw new Error("col-index out of bounds: index should greater than -1 and less than " + this.colHeaders.length);
    }
    this.editingCell.rowIndex = rowIndex;
    this.editingCell.colIndex = colIndex;
    this.onChange(OnChangeAction.OpenEdit, this.editingCell);
}


Excel.prototype.addCol = function(colIndex, width) {
    if(!this.colIndexBeInBoundary(colIndex)){
        throw new Error("col-index out of bounds: index should greater than -1 and less than " + this.colHeaders.length);
    }

    if(width < 0) {
        throw new Error("invalid value of width : " + width);
    }
    this.colHeaders.splice(colIndex, 0, new ColHeader(width, ""));
    this.onChange(OnChangeAction.AddCol, colIndex);
}

Excel.prototype.removeCol = function(colIndex) {
    if(!this.colIndexBeInBoundary(colIndex)){
        throw new Error("col-index out of bounds: index should greater than -1 and less than " + this.colHeaders.length);
    }
    this.colHeaders.splice(colIndex, 1);
    this.onChange(OnChangeAction.RemoveCol, colIndex);
}

Excel.prototype.addRow = function(rowIndex, height) {
    if(!this.rowIndexBeInBoundary(rowIndex)){
        throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
    }
    if(height < 0) {
        throw new Error("invalid value of height : " + height);
    }
    this.rowHeaders.splice(rowIndex, 0);
    this.onChange(OnChangeAction.AddRow, rowIndex);
}

Excel.prototype.removeCol = function(rowIndex) {
    if(!this.rowIndexBeInBoundary(rowIndex)){
        throw new Error("row-index out of bounds: index should greater than -1 and less than " + this.rowHeaders.length);
    }
    this.rowHeaders.splice(rowIndex, 1);
    this.onChange(OnChangeAction.RemoveRow, rowIndex);
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
