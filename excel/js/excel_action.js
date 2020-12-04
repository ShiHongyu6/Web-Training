/**
 * 使cell可编辑
 */
function setCellEditable(){
    const excelCellsContainer = document.querySelector(".excel__cells-container");
    excelCellsContainer.addEventListener("dblclick", event => {
        switchEditableCell(event.target);
    });
}


/**
 * 使Cell可选择
 */
function setCellSelectable(){
    const excelCellsContainer = document.querySelector(".excel__cells-container");
    excelCellsContainer.addEventListener("click", function(event) {

        //容器本身触发事件不处理
        if(this == event.target)
            return ;

        //当选择一个cell时 如果这个cell正在编辑 不做任何事
        if(isEditableCell(event.target)){
            return ;
        }

        //点击的这个cell不是正在编辑的cell  则使之前可编辑的cell不可编辑
        switchEditableCell();
        //选择当前的cell
        switchSelectedCellByClick(event.target);
    });
}
