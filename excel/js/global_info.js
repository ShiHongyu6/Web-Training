const INIT_INFO = {
    COL_NUMBER    : 20,
    ROW_NUMBER    : 100,
    COL_ID_HEIGHT : 26,
    ROW_ID_WIDTH  : 30,
    CELL_WIDTH    : 73,
    CELL_HEIGHT   : 18,
    BORDER        : 1
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
        editableCell = null;
    }
    if(cell){
        cell.contentEditable = "true";
        editableCell = cell;
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
