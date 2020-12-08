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
    
    this.excelElement = document.querySelector(".excel");
    this.colHeaderContainer = this.excelElement.querySelector(".excel__col-header-container");
    this.rowHeaderContainer = this.excelElement.querySelector(".excel__row-header-container");
    this.cellsContainer     = this.excelElement.querySelector(".excel__cells-container");
    //将cells构成的矩阵使用链表的形式存储起来
    this.cells = {
        colHeaderList : [],
        rowHeaderList : []
    };
    
    //填充文档树
    this.init();
    //将实例对象与事件处理器绑定
    excelEventHandler.bindExcelRenderer(this);
    //将节点的事件与EventHandler关联
    this.bindEvent();
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

/**
 * 绑定事件
 */
ExcelRenderer.prototype.bindEvent = function() {
    this.cellsContainer.addEventListener("mousedown", this.excelEventHandler.mousedownCellToSelectHandler);
    this.cellsContainer.addEventListener("dblclick", this.excelEventHandler.dblClickToEditCellHandler);
};


ExcelRenderer.prototype.render = function() {
    //从上一个状态转出
    this.excelEventHandler.status.preStatus.turnoff(this);
    //转入当前状态
    this.excelEventHandler.status.currentStatus.turnon(this);
};


/**
 * 单选一个cell
 */
ExcelRenderer.prototype.mousedownCellToSelect = function() {
    const cell = this.excelEventHandler.mousedownCell.currentCell;
    if(cell){
        cell.classList.add("excel__cell--selected");
        this.cells.rowHeaderList[cell.rowId].classList.add("excel__row-header--cell-selected");
        this.cells.colHeaderList[cell.colId].classList.add("excel__col-header--cell-selected");
    }
};

/**
 * 取消上一次单选
 */
ExcelRenderer.prototype.cancelLastSingleSelect = function() {
    const cell = this.excelEventHandler.mousedownCell.preCell;
    if(cell){
        cell.classList.remove("excel__cell--selected");
        this.cells.rowHeaderList[cell.rowId].classList.remove("excel__row-header--cell-selected");
        this.cells.colHeaderList[cell.colId].classList.remove("excel__col-header--cell-selected");
    }
};

ExcelRenderer.prototype.openEdit = function() {
    const cell = this.excelEventHandler.editCell;
    console.log("load");
    if(cell){
        cell.contentEditable = "true";
        cell.focus();
    }
};

ExcelRenderer.prototype.closeLastEdit = function() {
    const cell = this.excelEventHandler.editCell;
    if(cell){
        cell.contentEditable = "false";
    }
};


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
