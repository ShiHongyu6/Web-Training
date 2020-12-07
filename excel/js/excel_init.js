/**
 * 初始化操作
 * @param {number} rowNumber 
 * @param {colNumber} colNumber 
 */
function init(){

    initCSS();

    initColId();
    
    initRolId();

    initCells();

    Excel = document.querySelector(".excel");
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


function initCSS() {
    //创建CSS样式  插入head节点
    const initCssElement = document.createElement("style");
    initCssElement.innerHTML = `
        .excel__col-id-container > div {
            width :${INIT_INFO.CELL_WIDTH}px;
            height:${INIT_INFO.COL_ID_HEIGHT}px;
        }

        .excel__icon--all-select {
            width :${INIT_INFO.ROW_ID_WIDTH}px;
            height:${INIT_INFO.COL_ID_HEIGHT}px;
        }
        
        .excel__row-id-container > div {
            width :${INIT_INFO.ROW_ID_WIDTH}px;
            height:${INIT_INFO.CELL_HEIGHT}px;
        }

        .excel__cells-container > div {
            width :${INIT_INFO.CELL_WIDTH}px;
            height:${INIT_INFO.CELL_HEIGHT}px;
        }

        body {
            width :${INIT_INFO.ROW_ID_WIDTH + INIT_INFO.COL_NUMBER * INIT_INFO.CELL_WIDTH + (INIT_INFO.COL_NUMBER + 1) * INIT_INFO.BORDER}px;
        }

        .excel__row-id-container {
            width :${INIT_INFO.ROW_ID_WIDTH + INIT_INFO.BORDER}px;
        }
        .excel__icon--all-select, .excel__col-id-container > div, .excel__row-id-container > div , .excel__cells-container > div {
            border-width :${INIT_INFO.BORDER}px;
        }
        `;
    //将创建的CSS样式节点插入head的子节点
    document.head.append(initCssElement);
}

//添加列ID (A B C...)
function initColId() {
    const colIdFragment = document.createDocumentFragment();
    for(let i = 0; i < INIT_INFO.COL_NUMBER; ++i){
        const newNode = document.createElement("div");
        newNode.innerHTML = getColId(i);
        newNode.colId = i;
        colIdFragment.appendChild(newNode);
        CELLS.colIdList.push(newNode);
    }
    // console.log(CELLS.colIdList);
    document.querySelector(".excel__col-id-container").appendChild(colIdFragment);
}

//添加行ID
function initRolId() {
    const rowIdFragment = document.createDocumentFragment();
    for(let i = 0; i < INIT_INFO.ROW_NUMBER; ++i){
        const newNode = document.createElement("div");
        newNode.innerHTML = i + 1;
        newNode.rowId = i;
        rowIdFragment.appendChild(newNode);
        CELLS.rowIdList.push(newNode);
    }
    document.querySelector(".excel__row-id-container").appendChild(rowIdFragment);
    // console.log(CELLS.rowIdList);
}



function initCells() {
    const cellsFragment = document.createDocumentFragment();
    const cellsContainer = document.querySelector(".excel__cells-container");
    for(let i = 0; i < INIT_INFO.ROW_NUMBER * INIT_INFO.COL_NUMBER; ++i){
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
            CELLS.colIdList[colIdOfNode].colTail = CELLS.colIdList[colIdOfNode];
        }

        //第一列的元素 让rowId节点的nextRow指针指向这个节点
        if(colIdOfNode == 0){
            CELLS.rowIdList[rowIdOfNode].rowTail = CELLS.rowIdList[rowIdOfNode];
        }
        CELLS.colIdList[colIdOfNode].colTail = CELLS.colIdList[colIdOfNode].colTail.nextRow = newNode;
        CELLS.rowIdList[rowIdOfNode].rowTail =  CELLS.rowIdList[rowIdOfNode].rowTail.nextCol = newNode;
    }
    cellsContainer.appendChild(cellsFragment);

    coverElement = document.querySelector(".cells-cover");
}