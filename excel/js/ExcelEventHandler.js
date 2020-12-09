/**
 * 通过ExcelRenderer执行
 * @param {HTMLElement} element 命令对应的对象
 * @param {Function} action 要执行的命令
 */
function Command(element, action){
    this.element = element;
    this.action = action;
};


function ExcelEventHandler(){
    this.excelRenderer = null;
    

    //鼠标在一个cell上按下 记录这个cell
    this.mousedownCell = null;
    
    //记录编辑的cell
    this.editingCell = null;
    /**
     * 选择时使用一个矩形的选择区覆盖到cell上
     * 下面的两个值分别表示这个矩形的左上角和右下角
     */
    this.selectedCellLeftTop     = null;
    this.selectedCellRightBottom = null;

    /**
     * 待执行的"卸载"命令队列
     *  一些要去掉的样式
     */
    this.unloadCommandQueue = [];

    /**
     * 待执行的"加载"命令
     *  添加一些属性或样式
     */
    this.loadCommandQueue = [];

    //加载命令总在卸载命令之后执行
}

ExcelEventHandler.prototype.bindExcelRenderer = function(excelRenderer){
    this.excelRenderer = excelRenderer; 
    /**
     * 将回调函数(事件触发时 this值为出发时间的元素)的this修改为eventHandler
     */
    this.mousedownCellToSelectHandler = this.mousedownCellToSelectHandler.bind(this);
    this.dblClickToEditCellHandler = this.dblClickToEditCellHandler.bind(this);

    this.excelRenderer.cellsContainer.addEventListener("mousedown", this.mousedownCellToSelectHandler);
    this.excelRenderer.cellsContainer.addEventListener("dblclick", this.dblClickToEditCellHandler);
};

ExcelEventHandler.prototype.mousedownCellToSelectHandler = function(event){

    //连续多次点击一个cell  只会触发一次
    if(event.target == this.mousedownCell){
        return;
    }

    // //给鼠标按下的cell添加样式
    // this.loadCommandQueue.push(new Command(event.target, this.excelRenderer.mousedownCellToSelect));
    // //去掉上一次选择的cell的样式
    // if(this.mousedownCell) {
    //     this.unloadCommandQueue.push(new Command(this.mousedownCell, this.excelRenderer.cancelSingleSelect));
    // }
    // //记录这次的选择
    // this.mousedownCell = event.target;

    // //如果存在正在编辑的cell 关闭正在编辑的cell
    // if(this.editingCell){
    //     this.unloadCommandQueue.push(new Command(this.editingCell, this.excelRenderer.closeEdit));    
    // }

    // this.excelRenderer.render();
    
    

    const selectBoxLeft = event.target.offsetLeft;
    const selectBoxTop  = event.target.offsetTop; 
};

ExcelEventHandler.prototype.dblClickToEditCellHandler = function(event) {
    
    //连续多次点击一个cell  只会触发一次
    if(event.target == this.editingCell){
        return;
    }

    //开启点击cell的编辑
    this.loadCommandQueue.push(new Command(event.target, this.excelRenderer.openEdit));

    //记录当前正在编辑的cell
    this.editingCell = event.target;

    this.excelRenderer.render();
};


