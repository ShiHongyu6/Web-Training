const INIT_INFO = {
    COL_NUMBER    : 5,
    ROW_NUMBER    : 100,
    COL_ID_HEIGHT : 26,
    ROW_ID_WIDTH  : 30,
    CELL_WIDTH    : 73,
    CELL_HEIGHT   : 18,
    BORDER        : 1, 

    //行/列id上鼠标改变时位置的百分比
    MODIFY_CURSOR_BOUNDARY_PERCENT: 0.1
};

let Excel;

const CELLS = {
    //保存每一列的列id节点
    colIdList : new Array(),
    //保存每一行的行id节点
    rowIdList : new Array(),
};


//每次只能编辑一个cell
let editableCell = null;



/**
 * 判断一个cell是否正在编辑
 * @param {HTMLElement} cell 
 */
function isEditableCell(cell){
    return cell === editableCell;
}


/**
 * 使参数传入的cell可编辑
 * 是上一个可编辑的cell不可编辑
 * @param {HTMLElement} cell 
 */
function switchEditableCell(cell){
    if(editableCell){
        editableCell.contentEditable = "false";
        editableCell.classList.remove("editable");
        editableCell = null;
    }
    if(cell){
        cell.contentEditable = "true";
        editableCell = cell;
        editableCell.classList.add("editable");
    }
}

//被单击选择的cell
let selectedCellByClick = null;


/**
 * 每次通过单击选择的cell只有一个
 * @param {HTMLElement} cell 
 */
function switchSelectedCellByClick(cell){

    if(selectedCellByClick){
        //撤销上一次的选择
        selectedCellByClick.classList.remove("selectedByClick");
    }
    if(cell){
        cell.classList.add("selectedByClick");
        selectedCellByClick = cell;
    }
}


//拖拽选择时的遮盖
let coverElement = null;

function takeOffCoverElement(){
    if(coverElement){
        coverElement.style.display = "none";
    }
}