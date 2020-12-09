/**
 * 
 * @param {Excel} excel 
 * @param {number} cellBorder 
 * @param {ExcelEventHandler} excelEventHandler 
 */
function ExcelRenderer(excel, cellBorder, excelEventHandler){
    this.excel = excel;
    this.cellBorder = cellBorder;
    this.excelEventHandler = excelEventHandler;
    
    this.excelElement       = document.querySelector(".excel");
    this.colHeaderContainer = this.excelElement.querySelector(".excel__col-header-container");
    this.rowHeaderContainer = this.excelElement.querySelector(".excel__row-header-container");
    this.cellsContainer     = this.excelElement.querySelector(".excel__cells-container");
    this.selectBox          = this.cellsContainer.querySelector(".excel__select-box--drag");
    this.selectBox.mousedownBox = this.selectBox.querySelector(".select-box--mouseDown");
    //将cells构成的矩阵使用链表的形式存储起来
    this.cells = {
        colHeaderList : [],
        rowHeaderList : []
    };
    
    //填充文档树
    this.init();
    //将实例对象与事件处理器绑定
    excelEventHandler.bindExcelRenderer(this);
}

ExcelRenderer.prototype.init = function() {

    this.initCSS();
    this.initColHeader(this.colHeaderContainer);
    this.initRowHeader(this.rowHeaderContainer);
    this.initCells(this.cellsContainer);
};


ExcelRenderer.prototype.initCSS = function() {
    //创建CSS样式  插入head节点
    const initCssElement = document.createElement("style");
    initCssElement.innerHTML = `
        .excel__col-header-container > div {
            width:${this.excel.colWidthList[0]}px;
            height :${this.excel.colHeaderHeight}px;
        }

        .excel__icon--all-select {
            width :${this.excel.rowHeaderWidth}px;
            height:${this.excel.colHeaderHeight}px;
        }
        
        .excel__row-header-container > div {
            width :${this.excel.rowHeaderWidth}px;
            height:${this.excel.rowHeightList[0]}px;
        }

        .excel__cells-container > div {
            width :${this.excel.colWidthList[0]}px;
            height:${this.excel.rowHeightList[0]}px;
        }

        .excel__container {
            width :${this.excel.rowHeaderWidth + this.excel.numberOfCol * this.excel.colWidthList[0] + (this.excel.numberOfCol + 1) * this.cellBorder}px;
        }

        .excel__row-header-container {
            width :${this.excel.rowHeaderWidth + this.cellBorder}px;
        }
        .excel__icon--all-select, .excel__col-header-container > div, .excel__row-header-container > div , .excel__cells-container > div {
            border-width :${this.cellBorder}px;
        }
        `;
    //将创建的CSS样式节点插入head的子节点
    document.head.append(initCssElement);
}

//添加列ID (A B C...)
/**
 * 初始化colHeader
 */
ExcelRenderer.prototype.initColHeader = function(colHeaderContainerElement) {
    const colIdFragment = document.createDocumentFragment();
    for(let i = 0; i < this.excel.numberOfCol; ++i){
        const newNode = document.createElement("div");
        newNode.innerHTML = getColId(i);
        newNode.colId = i;
        colIdFragment.appendChild(newNode);
        this.cells.colHeaderList.push(newNode);
    }
    // console.log(CELLS.colIdList);
    colHeaderContainerElement.appendChild(colIdFragment);
};



//添加行ID
/**
 * 初始化啊rowHeader
 */
ExcelRenderer.prototype.initRowHeader = function(rowHeaderContainerElement) {
    const rowIdFragment = document.createDocumentFragment();
    for(let i = 0; i < this.excel.numberOfRow; ++i){
        const newNode = document.createElement("div");
        newNode.innerHTML = i + 1;
        newNode.rowId = i;
        rowIdFragment.appendChild(newNode);
        this.cells.rowHeaderList.push(newNode);
    }
    rowHeaderContainerElement.appendChild(rowIdFragment);
    // console.log(CELLS.rowIdList);
}


ExcelRenderer.prototype.initCells = function(cellsContainerElement) {
    const cellsFragment = document.createDocumentFragment();
    for(let i = 0; i < this.excel.numberOfRow * this.excel.numberOfCol; ++i){
        const newNode = document.createElement("div");
        cellsFragment.appendChild(newNode);

        //创建两个指针  分别指向这个节点的下一列和下一行的节点
        newNode.nextCol = null;
        newNode.nextRow = null;
        rowIdOfNode = Math.floor(i / INIT_INFO.COL_NUMBER);
        colIdOfNode = i % INIT_INFO.COL_NUMBER;
        //记录这个节点自身的行号和列号
        newNode.rowId = rowIdOfNode;
        newNode.colId = colIdOfNode;

        // console.log(rowIdOfNode + ", " + colIdOfNode);

        //第一行的元素  让colId节点的nextRow指针指向这个节点
        if(rowIdOfNode == 0){
            //记录尾指针 方便尾插
            this.cells.colHeaderList[colIdOfNode].colTail = this.cells.colHeaderList[colIdOfNode];
        }

        //第一列的元素 让rowId节点的nextRow指针指向这个节点
        if(colIdOfNode == 0){
            this.cells.rowHeaderList[rowIdOfNode].rowTail = this.cells.rowHeaderList[rowIdOfNode];
        }
        this.cells.colHeaderList[colIdOfNode].colTail = this.cells.colHeaderList[colIdOfNode].colTail.nextRow = newNode;
        this.cells.rowHeaderList[rowIdOfNode].rowTail =  this.cells.rowHeaderList[rowIdOfNode].rowTail.nextCol = newNode;
    }
    cellsContainerElement.appendChild(cellsFragment);
}



ExcelRenderer.prototype.render = function() {
    //取得"卸载"命令队列
    const unload = this.excelEventHandler.unloadCommandQueue;
    //执行卸载队列中的命令
    while(unload.length){
        const command = unload.shift();
        command.action.call(this, command.element);
    }

    //取得"加载"命令队列
    const load = this.excelEventHandler.loadCommandQueue;
    //执行加载队列中的命令
    while(load.length){
        const command = load.shift();
        command.action.call(this,command.element);
    }
};


/**
 * 单选一个cell
 */
ExcelRenderer.prototype.mousedownCellToSelect = function(cell) {
    if(cell){
        cell.classList.add("excel__cell--selected");
        this.cells.rowHeaderList[cell.rowId].classList.add("excel__row-header--cell-selected");
        this.cells.colHeaderList[cell.colId].classList.add("excel__col-header--cell-selected");
    }
};

/**
 * 取消上一次单选
 */
ExcelRenderer.prototype.cancelSingleSelect = function(cell) {
    if(cell){
        cell.classList.remove("excel__cell--selected");
        this.cells.rowHeaderList[cell.rowId].classList.remove("excel__row-header--cell-selected");
        this.cells.colHeaderList[cell.colId].classList.remove("excel__col-header--cell-selected");
    }
};

/**
 * 开启一个cell的编辑
 */
ExcelRenderer.prototype.openEdit = function(cell) {
    if(cell){
        cell.contentEditable = "true";
        cell.focus();
    }
};
/**
 * 关闭一个cell的编辑
 */
ExcelRenderer.prototype.closeEdit = function(cell) {
    if(cell){
        cell.contentEditable = "false";
    }
};


/**
 * 设置选择框的大小与定位
 * @param {number} selectBoxX 选择框左上角X坐标
 * @param {number} selectBoxY 选择框左上角Y坐标
 * @param {number} selectBoxWidth 选择框宽度
 * @param {number} selectBoxHeight 选择框高度
 * @param {number} mousedownBoxPosition 0表示左上角; 1表示右上角; 2表示右下角; 3表示左下角
 * @param {number} mousedownBoxWidth 宽度
 * @param {number} mousedownBoxHeight 长度
 * @param {number} borderWidth 边框宽度
 */
ExcelRenderer.prototype.setSelectBoxOnDragCellSelect = function(selectBoxX, selectBoxY, selectBoxWidth, selectBoxHeight, mousedownBoxPosition, mousedownBoxWidth, mousedownBoxHeight, borderWidth){
    this.selectBox.style.left   = `${selectBoxX - borderWidth}px`;
    this.selectBox.style.top    = `${selectBoxY - borderWidth}px`;
    this.selectBox.style.width  = `${selectBoxWidth}px`;
    this.selectBox.style.height = `${selectBoxHeight}px`
    this.selectBox.mousedownBox.style.width  = `${mousedownBoxWidth}px`;
    this.selectBox.mousedownBox.style.height = `${mousedownBoxHeight}px`;
    let mousedownBoxLeft = 0;
    let mousedownBoxTop  = 0;
    switch(mousedownBoxPosition){
        case 0:
            mousedownBoxLeft = 0;
            mousedownBoxTop  = 0;
            break;
        case 1:
            mousedownBoxLeft = selectBoxWidth - mousedownBoxWidth;
            mousedownBoxTop  = 0;
            break;
        case 2:
            mousedownBoxLeft = 0;
            mousedownBoxTop = selectBoxHeight - mousedownBoxHeight;
            break;
        case 3:
            mousedownBoxLeft = selectBoxWidth - mousedownBoxWidth;
            mousedownBoxTop = selectBoxHeight - mousedownBoxHeight;
            break;
    }
    this.selectBox.mousedownBox.style.left = `${mousedownBoxLeft}px`;
    this.selectBox.mousedownBox.style.top  = `${mousedownBoxTop}px`;

    this.selectBox.style.display = "block";
}

function getColId(id){
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
