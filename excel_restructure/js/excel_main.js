const INIT_INFO = {
    COL_NUMBER    : 20,
    ROW_NUMBER    : 100,
    COL_HEADER_HEIGHT : 26,
    ROW_HEADER_WIDTH  : 30,
    CELL_WIDTH    : 73,
    CELL_HEIGHT   : 18,
    CELL_BORDER        : 1, 
    SELECT_BORDER : 2
};

const excel = new Excel(10, 5, 73, 18, 30, 26);


window.onload = function() {
    // const excel = new Excel(INIT_INFO.ROW_NUMBER, INIT_INFO.COL_NUMBER, INIT_INFO.CELL_WIDTH, INIT_INFO.CELL_HEIGHT, INIT_INFO.ROW_HEADER_WIDTH, INIT_INFO.COL_HEADER_HEIGHT);
    // const excelElement = new ExcelRenderer(excel, INIT_INFO.BORDER, new ExcelEventHandler());

    excel.setCellContent(2, 2, "0");

    const excelRenderer = new ExcelRenderer(excel, 1, null);
    //设置命令的执行者为excelRenderer
    excel.setCommandExecutor(excelRenderer);
};