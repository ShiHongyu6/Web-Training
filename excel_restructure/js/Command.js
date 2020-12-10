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


//修改一个行的稿库后 给渲染器发送消息
function ModifyRowHeight(args) {
    Command.call(this, args);
}
inheritPrototype(ModifyRowHeight, Command);
ModifyRowHeight.prototype.action = function(executor) {
    executor.setRowHeight(this.args.rowIndex, this.args.height);
}


//选择一个Cell时 给渲染器发送消息
function SelectCell(args) {
    Command.call(this, args);
}
inheritPrototype(SelectCell, Command);
SelectCell.prototype.action = function(executor) {
    //模型传来的X坐标不含边框  因此需要调整
    this.args.coordinateX += executor.cellBorder * this.args.colIndex;
    this.args.coordinateY += executor.cellBorder * this.args.rowIndex;

    executor.setSelectBox(this.args.coordinateX, this.args.coordinateY, this.args.activeCellWidth, this.args.activeCellHeight, this.args.coordinateX, this.args.coordinateY, this.args.activeCellWidth, this.args.activeCellHeight, INIT_INFO.SELECT_BORDER);
}

//选择多个cell(selectionArea)时  给渲染器发送消息
function SelectArea(args) {
    Command.call(this, args);
}
inheritPrototype(SelectArea, Command);
SelectArea.prototype.action = function(executor) {
    
}


// const OnChangeActions = {
//     ModifyRowHeight : new OnChangeAction(
//         function(args){
//             OnChangeActions.renderer
//         }
//     ),
//     ModifySelectionArea : new OnChangeAction(
//         function(args){

//         }
//     ),
//     ModifySelectionCell : new OnChangeAction(
//         function(args){

//         }
//     ),
//     OpenEdit : new OnChangeAction(
//         function(args){

//         }
//     ),
//     AddCol : new OnChangeAction(
//         function(args){

//         }
//     ),
//     AddRow : new OnChangeAction(
//         function(args){

//         }
//     ),
//     RemoveCol : new OnChangeAction(
//         function(args){

//         }
//     ),
//     RemoveRow : new OnChangeAction(
//         function(args){

//         }
//     ),
//     setRenderer(renderer){
//         this.renderer = renderer;
//     }
// };



// const excel = new Excel(3, 5, 73, 20, 20, 20);

// excel.setOnChangeCallBack(execute);

// excel.setCellContent(2, 2, "0");



// excel.addRow(0, 20);
