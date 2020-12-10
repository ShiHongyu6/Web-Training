/**
 * 
 * @param {Excel} excel 
 * @param {number} cellBorder 
 * @param {ExcelEventHandler} excelEventHandler 
 */
function ExcelRenderer(excel, cellBorder){
    this.excel = excel;
    this.cellBorder = cellBorder;
    
    //从Dom中取出需要的元素
    this.getDomElement();
    
    //刷新时需要从文档树删除的style节点
    this.removeStyleElementOnRefresh = [];
    
    //填充文档树
    this.init();
}

//继承命令模式中的执行者
inheritPrototype(ExcelRenderer, Executor);

ExcelRenderer.prototype.getDomElement = function() {
    this.excelElement       = document.querySelector(".excel");
    //header容器
    this.colHeaderContainer = this.excelElement.querySelector(".excel__col-header-container");
    this.rowHeaderContainer = this.excelElement.querySelector(".excel__row-header-container");
    //cells容器
    this.cellsContainer     = this.excelElement.querySelector(".excel__cells-container");
    //选择框
    this.selectBox          = this.cellsContainer.querySelector(".excel__select-box");
    
    this.activeCell         = this.cellsContainer.querySelector(".excel__select-box--active");
    //选择时header效果
    this.colHeaderSelectBox = this.colHeaderContainer.querySelector(".col-header__select-box");
    this.rowHeaderSelectBox = this.rowHeaderContainer.querySelector(".row-header__select-box");
    //用来存储colHeader的DOM
    this.colHeaderElements = [];
    //用来存储rowHeader的DOM
    this.rowHeaderElements = [];
    //这些DOM节点都存储了各自行/列的样式(style节点)  可通过修改这个style节点的innerHTML来修改样式

    this.cellElements = [];


    //全选按钮
    this.allSelectButton   = document.querySelector(".excel__icon--all-select"); 
}

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
    
    this.removeStyleElementOnRefresh.push(initCssElement);
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
        this.removeStyleElementOnRefresh.push(colWidthStyle);
        
        newNode.colWidthStyle = colWidthStyle;
        this.setColWidth(i, colHeader.getWidth());
        colIdFragment.appendChild(newNode);
    }
    // this.colHeaderContainer.colHeadersStyle = document.createElement("style");
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
        this.removeStyleElementOnRefresh.push(rowHeightStyle);
        document.head.appendChild(rowHeightStyle);

        newNode.rowHeightStyle = rowHeightStyle;
        this.setRowHeight(i, rowHeader.getHeight());
        rowIdFragment.appendChild(newNode);
    }
    // this.rowHeaderContainer.rowHeadersStyle = document.createElement("style");
    this.rowHeaderContainer.appendChild(rowIdFragment);
}


ExcelRenderer.prototype.initCells = function() {
    const cellsFragment = document.createDocumentFragment();
    for(let i = 0; i < this.excel.getRowCount(); ++i){
        const newRowNode = document.createElement("div");
        cellsFragment.appendChild(newRowNode);
        this.cellElements.push(new Array(0));
        for(let j = 0; j < this.excel.getColCount(); ++j){
            const cell = this.excel.cells[i][j];
            const cellElement = document.createElement("div");
            if(cell){
                cellElement.innerHTML = cell.getContent();
            }
            newRowNode.appendChild(cellElement);
            this.cellElements[this.cellElements.length - 1].push(cellElement);
        }
    }
    this.cellsContainer.appendChild(cellsFragment);
}




ExcelRenderer.prototype.setSelectBox = function(selectBoxX, selectBoxY, selectBoxWidth, selectBoxHeight,  boxBorderWidth){
    this.selectBox.style.left   = `${selectBoxX - boxBorderWidth}px`;
    this.selectBox.style.top    = `${selectBoxY - boxBorderWidth}px`;
    this.selectBox.style.width  = `${selectBoxWidth}px`;
    this.selectBox.style.height = `${selectBoxHeight}px`;
    this.selectBox.style.boxBorderWidth = `${boxBorderWidth}px`;
    this.selectBox.style.display = "block";
}

ExcelRenderer.prototype.setActiveCell = function(activeCellX, activeCellY, activeCellWidth, activeCellHeight, cellContent) {
    this.activeCell.style.left   = `${activeCellX}px`;
    this.activeCell.style.top    = `${activeCellY}px`;
    this.activeCell.style.width  = `${activeCellWidth}px`;
    this.activeCell.style.height = `${activeCellHeight}px`;
    this.activeCell.innerHTML    =  cellContent;
    this.selectBox.style.display = "block";
}


/**
 * 修改列的宽度
 * @param {number} colIndex 
 * @param {number} width 
 */
ExcelRenderer.prototype.setColWidth = function(colIndex, width) {
    this.colHeaderElements[colIndex].colWidthStyle.innerHTML = `
        .excel__cells-container > div > div:nth-child(${colIndex + 1}), .excel__col-header-container > div:nth-child(${colIndex + 2}){
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
        .excel__cells-container > div:nth-child(${rowIndex + 3}), .excel__row-header-container > div:nth-child(${rowIndex + 2}){
            height : ${height}px;
        }
    `;
}

/**
 * 不同选择headers上的不同效果
 */
ExcelRenderer.prototype.setHeadersOnSelected = function(colLeft, colRight, rowTop, rowBottom, selectionType, borderWidth) {


    this.allSelectButton.classList.remove("all-select--active");

    //col-header
    let colHeaderX = 0;
    for(let i = 0; i < colLeft; ++i){
        colHeaderX += this.excel.colHeaders[i].getWidth() + this.cellBorder;
    }
    
    let width = 0;
    for(let i = colLeft; i <= colRight; ++i){
        width += this.excel.colHeaders[i].getWidth() + this.cellBorder;
    }

    this.colHeaderSelectBox.style.height =`${this.excel.colHeaders[0].getHeight() - borderWidth}px`;
    this.colHeaderSelectBox.style.borderWidth = `${borderWidth}px`;
    this.colHeaderSelectBox.style.width = `${width}px`;
    this.colHeaderSelectBox.style.left  = `${colHeaderX}px`
    this.colHeaderSelectBox.style.backgroundColor = "rgba(170, 170, 170, 0.5)"
    if(SelectionType.FullCol == selectionType || SelectionType.AllSelect == selectionType){
        this.colHeaderSelectBox.style.backgroundColor = "rgba(159, 205, 179, 0.5)";
    }


    //row-header
    let rowHeaderY = 0;
    for(let i = 0; i < rowTop; ++i){
        rowHeaderY += this.excel.rowHeaders[i].getHeight() + this.cellBorder;
    }

    let height = 0;
    for(let i = rowTop; i <= rowBottom; ++i){
        height += this.excel.rowHeaders[i].getHeight() +this.cellBorder;
    }

    this.rowHeaderSelectBox.style.width = `${this.excel.rowHeaders[0].getWidth() - borderWidth}px`;
    this.rowHeaderSelectBox.style.borderWidth = `${borderWidth}px`;
    this.rowHeaderSelectBox.style.height = `${height}px`;
    this.rowHeaderSelectBox.style.top = `${rowHeaderY}px`;
    this.rowHeaderSelectBox.style.backgroundColor = "rgba(170, 170, 170, 0.5)";
    if(SelectionType.FullRow == selectionType || SelectionType.AllSelect == selectionType){
        this.rowHeaderSelectBox.style.backgroundColor = "rgba(159, 205, 179, 0.5)";
    }

    if(SelectionType.AllSelect == selectionType){
         this.allSelectButton.classList.add("all-select--active");
    }
}

ExcelRenderer.prototype.refresh = function() {
    //清理容器
    this.colHeaderContainer.innerHTML = `<div class="col-header__select-box"></div>`;
    this.rowHeaderContainer.innerHTML = `<div class="row-header__select-box"></div>`;
    this.cellsContainer.innerHTML = `<div class="excel__select-box--active"></div><div class="excel__select-box"></div>`;
    //因为DOM已经重建  所以要重新取
    this.getDomElement();

    //清理运行中加载的style节点
    while(this.removeStyleElementOnRefresh.length) {
        document.head.removeChild(this.removeStyleElementOnRefresh.pop());
    }
    //重新构建文档树
    this.init();

    //默认选择(0, 0)
    excel.setActiveCell(0, 0);
    excel.setSelectionArea(0, 0, 0, 0, SelectionType.Cells);
}


ExcelRenderer.prototype.transformCoordinateToIndex = function(x, y) {
    const returnValue = {
        rowIndex: null,
        colIndex: null
    };


    let sum = 0;
    if(x != null){
        for(let i = 0; i < this.excel.colHeaders.length; ++i){
            sum += this.excel.colHeaders[i].getWidth() + this.cellBorder;
            if(x < sum){
                returnValue.colIndex = i;
                break;
            }
        }
    }

    sum = 0;
    if(y != null){
        for(let i = 0; i < this.excel.rowHeaders.length; ++i) {
            sum += this.excel.rowHeaders[i].getHeight() + this.cellBorder;
            if(y < sum){
                returnValue.rowIndex = i;
                break;
            }
        }
    }

    return returnValue;
}

ExcelRenderer.prototype.setCellContent = function(rowIndex, colIndex, content) {
    this.cellElements[rowIndex][colIndex].innerHTML = content;
}