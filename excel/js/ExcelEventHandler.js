/**
 * 用来描述状态
 * @param {Function} turnoff 从当前状态转出时  进行的操作
 * @param {Function} turnon 转入当前状态时 进行的操作
 */
function Status(turnoff, turnon){
    this.turnoff = turnoff;
    this.turnon = turnon;
}

const STATUS = {
    //单选
    SELECT_SINGLE: new Status(
        //从单选转出时  取消上一次单选设置的样式
        function(render) {
            render.cancelLastSingleSelect();
        },
        function(render) {
            render.mousedownCellToSelect();
        }
    ),
    //编辑(双击一个cell后进入该状态)
    EDIT: new Status(
        function(render) {
            //关闭上一次编辑
            render.closeLastEdit();
        },
        function(render) {
            render.openEdit();
        }
    )
};



function ExcelEventHandler(){
    this.excelRenderer = null;
    
    //用来记录状态的变化
    this.status = {preStatus: null, currentStatus: null};

    //鼠标在一个cell上按下时 记录上一次鼠标按下时的cell以及当前cell
    this.mousedownCell = {preCell: null, currentCell: null};
    
    //记录编辑的cell
    this.editCell = null;
    /**
     * 选择时使用一个矩形的选择区覆盖到cell上
     * 下面的两个值分别表示这个矩形的左上角和右下角
     */
    this.selectedCellLeftTop     = null;
    this.selectedCellRightBottom = null;
}

ExcelEventHandler.prototype.bindExcelRenderer = function(excelRenderer){
    this.excelRenderer = excelRenderer;
    this.status.currentStatus = STATUS.SELECT_SINGLE;
    this.mousedownCell.currentCell = this.excelRenderer.cells.colHeaderList[0].nextRow;


    //将所有handler的this指针指向当前this
    this.mousedownCellToSelectHandler = this.mousedownCellToSelectHandler.bind(this);
    this.dblClickToEditCellHandler = this.dblClickToEditCellHandler.bind(this);
};

ExcelEventHandler.prototype.mousedownCellToSelectHandler = function(event){
    //状态切换
    this.status.preStatus = this.status.currentStatus;
    this.currentStatus = STATUS.SELECT_SINGLE;
    //记录本次单选的对象
    this.mousedownCell.preCell = this.mousedownCell.currentCell;
    this.mousedownCell.currentCell = event.target;
    this.excelRenderer.render();
};

ExcelEventHandler.prototype.dblClickToEditCellHandler = function(event) {
    this.status.preStatus = this.status.currentStatus;
    this.status.currentStatus = STATUS.EDIT;

    this.editCell = event.target;
    this.excelRenderer.render();
};


