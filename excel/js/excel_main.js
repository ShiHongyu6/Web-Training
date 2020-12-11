const INIT_INFO = {
    COL_NUMBER    : 30,
    ROW_NUMBER    : 10,
    COL_HEADER_HEIGHT : 26,
    ROW_HEADER_WIDTH  : 30,
    CELL_WIDTH    : 73,
    CELL_HEIGHT   : 18,
    CELL_BORDER        : 1, 
    SELECT_BORDER : 2
};

const excel = new Excel(INIT_INFO.COL_NUMBER, INIT_INFO.ROW_NUMBER, INIT_INFO.CELL_WIDTH, INIT_INFO.CELL_HEIGHT, INIT_INFO.ROW_HEADER_WIDTH, INIT_INFO.COL_HEADER_HEIGHT);


window.onload = function() {

    const excelRenderer = new ExcelRenderer(excel, 1);
    
    excel.setCommandExecutor(excelRenderer);

    const excelEventHandler = new ExcelEventHandler(excelRenderer);
};