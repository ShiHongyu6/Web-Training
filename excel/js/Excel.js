/**
 * Excel模型
 * @param {number} numberOfRow 行数
 * @param {number} numberOfCol 列数
 * @param {number} cellWidth   cell的初始宽度
 * @param {number} cellHeight  cell的初始高度
 * @param {number} rowHeaderWidth row-header的宽度
 * @param {number} colHeaderHeight col-header的高度
 */
function Excel(numberOfRow, numberOfCol, cellWidth, cellHeight, rowHeaderWidth, colHeaderHeight){
    this.numberOfRow = numberOfRow;
    this.numberOfCol = numberOfCol;

    this.rowHeightList = [];//记录每一行的高度
    this.colWidthList = [];//记录每一列的宽度

    this.rowHeaderWidth  = rowHeaderWidth; //row header的宽度  使用初始值初始化
    this.colHeaderHeight = colHeaderHeight;


    //使用初始值给每一列的高度赋值
    for(let i = 0; i < numberOfRow; ++i) {
        this.rowHeightList.push(cellHeight);
    }

    //使用初始值给每一行的宽度赋值
    for(let i = 0; i < numberOfCol; ++i) {
        this.colWidthList.push(cellWidth);
    }
}

/**
 * 计算坐标落在哪一行/哪一列
 * @param {Object} coordinate
 * 
 * coordinate = {
 *     x: ---, 
 *     y: ---
 * };
 *  
 * 
 * return : {row: ---, col: ---};
 */
Excel.prototype.coordinateToId = function(coordinate) {
    const returnValue = {};

    if(coordinate.x != null){
        let offsetX = 0;
        for(let i = 0; i < this.excel.numberOfCol; ++i){
            offsetX += this.excel.colWidthList[i];
            if(coordinateX <= offset){
                returnValue.row = i;
                break;
            }
        }
    } else {
        returnValue.col = null;
    }

    if(coordinate.y != null){
        let offsetY = 0;
        for(let i = 0; i < this.excel.numberOfRow; ++i){
            offsetY += this.excel.rowHightList[i];
            if(coordinateX <= offset){
                returnValue.col = i;
                break;
            }
        }
    } else {
        returnValue.col = null;
    }

    return returnValue;
};
