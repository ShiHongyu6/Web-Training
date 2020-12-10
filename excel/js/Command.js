/**
 * 命令模式
 */


//命令的执行者
function Executor() {

}

Executor.prototype.execute = function(command){
    command.action(this);
};


//命令
function Command(args) {
    this.args = args;//命令的参数
};
Command.prototype.action = function(executor) {
    console.log(this.args);
};


//修改一个列的宽度后  给渲染器发送消息
function ModifyColWidth(args){
    Command.call(this, args);
}

//继承命令接口
inheritPrototype(ModifyColWidth, Command);
ModifyColWidth.prototype.action = function(executor) {
    executor.setColWidth(this.args.colIndex, this.args.width);
}


//修改一个行的高度后 给渲染器发送消息
function ModifyRowHeight(args) {
    Command.call(this, args);
}
inheritPrototype(ModifyRowHeight, Command);
ModifyRowHeight.prototype.action = function(executor) {
    executor.setRowHeight(this.args.rowIndex, this.args.height);
}


//选择一个Cell时 给渲染器发送消息
function ModifyActiveCell(args) {
    Command.call(this, args);
}
inheritPrototype(ModifyActiveCell, Command);
ModifyActiveCell.prototype.action = function(executor) {
    /**计算activeCell的坐标 宽度 高度*/
    let coordinateX = 0;
    for(let i = 0; i < this.args.colIndex; ++i) { 
        coordinateX += executor.excel.colHeaders[i].getWidth();
    }
    let coordinateY = 0;
    for(let i = 0; i < this.args.rowIndex; ++i) {
        coordinateY += executor.excel.rowHeaders[i].getHeight();
    }
    //存在边框 将边框的宽度加上
    coordinateX += executor.cellBorder * this.args.colIndex;
    coordinateY += executor.cellBorder * this.args.rowIndex;

    executor.setActiveCell(coordinateX, coordinateY, this.args.activeCellWidth, this.args.activeCellHeight, this.args.cellContent);
}

//选择多个cell(selectionArea)时  给渲染器发送消息
function ModifySelectionArea(args) {
    Command.call(this, args);
}
inheritPrototype(ModifySelectionArea, Command);
ModifySelectionArea.prototype.action = function(executor) {
    let coordinateX = 0;
    for(let i = 0; i < this.args.leftTopColIndex; ++i) { 
        coordinateX += executor.excel.colHeaders[i].getWidth();
    }

    let coordinateY = 0;
    for(let i = 0; i < this.args.leftTopRowIndex; ++i) {
        coordinateY += executor.excel.rowHeaders[i].getHeight();
    }
    //存在边框 将边框的宽度加上
    coordinateX += executor.cellBorder * this.args.leftTopColIndex;
    coordinateY += executor.cellBorder * this.args.leftTopRowIndex;

    let width = 0;
    for(let i = this.args.leftTopColIndex; i <= this.args.rightBottomColIndex; ++i){
        width += executor.excel.colHeaders[i].getWidth() + executor.cellBorder;
    }
    width -= executor.cellBorder;
    let height = 0;
    for(let i = this.args.leftTopRowIndex; i <= this.args.rightBottomRowIndex; ++i){
        height += executor.excel.rowHeaders[i].getHeight() + executor.cellBorder;
    }
    height -= executor.cellBorder;

    executor.setSelectBox(coordinateX, coordinateY, width, height, INIT_INFO.SELECT_BORDER);
    executor.setHeadersOnSelected(this.args.leftTopColIndex, this.args.rightBottomColIndex, this.args.leftTopRowIndex, this.args.rightBottomRowIndex, this.args.selectionType, INIT_INFO.SELECT_BORDER);
}


//当添加/删除怒行/列时  发送刷新命令
function Refresh(args){
    Command.call(this, args);
}
inheritPrototype(Refresh, Command);
Refresh.prototype.action = function(executor) {
    executor.refresh();
}