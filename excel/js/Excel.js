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



function Excel(numberOfRow, numberOfCol){
    this.numberOfRow = numberOfRow;
    this.numberOfCol = numberOfCol;
}