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
    this.selectBox          = this.cellsContainer.querySelector(".excel__select-box");
    this.activeCell         = this.cellsContainer.querySelector(".excel__select-box--active");
    
    //用来存储colHeader的DOM
    this.colHeaderElements = [];
    //用来存储rowHeader的DOM
    this.rowHeaderElements = [];
    //这些DOM节点都存储了各自行/列的样式(style节点)  可通过修改这个style节点的innerHTML来修改样式

    //填充文档树
    this.init();
}

//继承命令模式中的执行者
inheritPrototype(ExcelRenderer, Executor);



ExcelRenderer.prototype.init = function() {

    this.initCSS();
    this.initColHeader();
    this.initRowHeader();
    this.initCells();
};


ExcelRenderer.prototype.initCSS = function() {
    //创建CSS样式  插入head节点
    const initCssElement = document.createElement("style");
    initCssElement.innerHTML = `
        .excel__col-header-container > div {
            height :${this.excel.colHeaders[0].getHeight()}px;
        }

        .excel__icon--all-select {
            width :${this.excel.rowHeaders[0].getWidth()}px;
            height:${this.excel.colHeaders[0].getHeight()}px;
        }
        
        .excel__row-header-container > div {
            width :${this.excel.rowHeaders[0].getWidth()}px;
        }

        .excel__row-header-container {
            width :${this.excel.rowHeaders[0].getWidth() + this.cellBorder}px;
        }
        .excel__icon--all-select, .excel__col-header-container > div, .excel__row-header-container > div , .excel__cells-container > div > div {
            border-width :${this.cellBorder}px;
        }
        `;
    //将创建的CSS样式节点插入head的子节点
    document.head.append(initCssElement);
}

/**
 * 初始化colHeader
 */
ExcelRenderer.prototype.initColHeader = function() {
    const colIdFragment = document.createDocumentFragment();
    for(let i = 0; i < this.excel.getColCount(); ++i){
        const colHeader = this.excel.colHeaders[i];
        const newNode = document.createElement("div");
        newNode.innerHTML = colHeader.getContent();
        this.colHeaderElements.push(newNode);
        
        //这个style节点渲染每个列的宽度
        const colWidthStyle = document.createElement("style");
        document.head.appendChild(colWidthStyle);
        newNode.colWidthStyle = colWidthStyle;
        this.setColWidth(i, colHeader.getWidth());
        colIdFragment.appendChild(newNode);
    }
    // console.log(CELLS.colIdList);
    this.colHeaderContainer.appendChild(colIdFragment);
};



/**
 * 初始化啊rowHeader
 */
ExcelRenderer.prototype.initRowHeader = function() {
    const rowIdFragment = document.createDocumentFragment();
    for(let i = 0; i < this.excel.getRowCount(); ++i){
        const rowHeader = this.excel.rowHeaders[i];
        const newNode = document.createElement("div");
        newNode.innerHTML = rowHeader.getContent();
        this.rowHeaderElements.push(newNode);

        const rowHeightStyle = document.createElement("style");
        document.head.appendChild(rowHeightStyle);
        newNode.rowHeightStyle = rowHeightStyle;
        this.setRowHeight(i, rowHeader.getHeight());
        rowIdFragment.appendChild(newNode);
    }
    this.rowHeaderContainer.appendChild(rowIdFragment);
    // console.log(CELLS.rowIdList);
}


ExcelRenderer.prototype.initCells = function(cellsContainerElement) {
    const cellsFragment = document.createDocumentFragment();
    for(let i = 0; i < this.excel.getRowCount(); ++i){
        const newRowNode = document.createElement("div");
        cellsFragment.appendChild(newRowNode);
        for(let j = 0; j < this.excel.getColCount(); ++j){
            const cell = this.excel.cells[i][j];
            const cellElement = document.createElement("div");
            if(cell){
                cellElement.innerHTML = cell.getContent();
            }
            newRowNode.appendChild(cellElement);
        }
    }
    this.cellsContainer.appendChild(cellsFragment);
}



// ExcelRenderer.prototype.render = function() {
//     //取得"卸载"命令队列
//     const unload = this.excelEventHandler.unloadCommandQueue;
//     //执行卸载队列中的命令
//     while(unload.length){
//         const command = unload.shift();
//         command.action.call(this, command.element);
//     }

//     //取得"加载"命令队列
//     const load = this.excelEventHandler.loadCommandQueue;
//     //执行加载队列中的命令
//     while(load.length){
//         const command = load.shift();
//         command.action.call(this,command.element);
//     }
// };

/**
 * 根据excelModel绘制
 */
ExcelRenderer.prototype.render = function() {
    
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
 
 * @param {number} mousedownBoxWidth 宽度
 * @param {number} mousedownBoxHeight 长度
 */
ExcelRenderer.prototype.setSelectBox = function(selectBoxX, selectBoxY, selectBoxWidth, selectBoxHeight, activeCellX, activeCellY, activeCellWidth, activeCellHeight, boxBorderWidth){
    console.log(boxBorderWidth);
    this.selectBox.style.left   = `${selectBoxX - boxBorderWidth}px`;
    this.selectBox.style.top    = `${selectBoxY - boxBorderWidth}px`;
    this.selectBox.style.width  = `${selectBoxWidth}px`;
    this.selectBox.style.height = `${selectBoxHeight}px`;
    this.selectBox.style.boxBorderWidth = `${boxBorderWidth}px`;
    this.activeCell.style.left   = `${activeCellX}px`;
    this.activeCell.style.top    = `${activeCellY}px`;
    this.activeCell.style.width  = `${activeCellWidth}px`;
    this.activeCell.style.height = `${activeCellHeight}px`;

    this.selectBox.style.display = "block";
}

/**
 * 修改列的宽度
 * @param {number} colIndex 
 * @param {number} width 
 */
ExcelRenderer.prototype.setColWidth = function(colIndex, width) {
    this.colHeaderElements[colIndex].colWidthStyle.innerHTML = `
        .excel__cells-container > div > div:nth-child(${colIndex + 1}), .excel__col-header-container > div:nth-child(${colIndex + 1}){
            width : ${width}px;
        }
    `;
}

/**
 * 修改行的高度
 * @param {number} rowIndex 
 * @param {number} height 
 */
ExcelRenderer.prototype.setRowHeight = function(rowIndex, height) {
    this.rowHeaderElements[rowIndex].rowHeightStyle.innerHTML = `
        .excel__cells-container > div:nth-child(${rowIndex + 3}), .excel__row-header-container > div:nth-child(${rowIndex + 1}){
            height : ${height}px;
        }
    `;
}

ExcelRenderer.prototype.getCorr