/**
 * 初始化操作
 * @param {number} rowNumber 
 * @param {colNumber} colNumber 
 */
function init(){

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

        body, .excel {
            width :${INIT_INFO.ROW_ID_WIDTH + INIT_INFO.COL_NUMBER * INIT_INFO.CELL_WIDTH + (INIT_INFO.COL_NUMBER + 1) * INIT_INFO.BORDER}px;
        }

        .excel__row-id-container {
            width :${INIT_INFO.ROW_ID_WIDTH + INIT_INFO.BORDER}px;
        }
        .excel__icon--all-select, .excel__col-id-container > div, .excel__row-id-container > div , .excel__cells-container > div {
            border-width :${INIT_INFO.BORDER}px;
        }
        `;

    document.head.append(initCssElement);

    //添加列ID (A B C...)
    const colIdFragment = document.createDocumentFragment();
    for(let i = 0; i < INIT_INFO.COL_NUMBER; ++i){
        const newNode = document.createElement("div");
        newNode.innerHTML = getColId(i);
        colIdFragment.appendChild(newNode);
    }
    document.querySelector(".excel__col-id-container").appendChild(colIdFragment);
    
    //添加行ID
    const rowIdFragment = document.createDocumentFragment();
    for(let i = 0; i < INIT_INFO.ROW_NUMBER; ++i){
        const newNode = document.createElement("div");
        newNode.innerHTML = i + 1;
        rowIdFragment.appendChild(newNode);
    }
    document.querySelector(".excel__row-id-container").appendChild(rowIdFragment);

    //添加cell
    const cellsFragment = document.createDocumentFragment();
    for(let i = 0; i < INIT_INFO.ROW_NUMBER * INIT_INFO.COL_NUMBER; ++i){
        const newNode = document.createElement("div");
        cellsFragment.appendChild(newNode);
    }
    document.querySelector(".excel__cells-container").appendChild(cellsFragment);
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