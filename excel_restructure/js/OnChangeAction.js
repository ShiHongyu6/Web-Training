function OnChangeAction(action) {
    this.action = action;
}


const OnChangeActions = {
    ModifyColWidth : new OnChangeAction(
        function(args){
            console.log("colIndex:" + args.colIndex + " ,width:" + args.width );
        }
    ),
    ModifyRowHeight : new OnChangeAction(
        function(args){

        }
    ),
    ModifySelectionArea : new OnChangeAction(
        function(args){

        }
    ),
    ModifySelectionCell : new OnChangeAction(
        function(args){

        }
    ),
    OpenEdit : new OnChangeAction(
        function(args){

        }
    ),
    AddCol : new OnChangeAction(
        function(args){

        }
    ),
    AddRow : new OnChangeAction(
        function(args){

        }
    ),
    RemoveCol : new OnChangeAction(
        function(args){

        }
    ),
    RemoveRow : new OnChangeAction(
        function(args){

        }
    )
};



const colHeaders = [];
for(let i = 0; i < 10; ++i){
    colHeaders.push(new ColHeader(20, ""));
}
const rowHeaders = [];
for(let i = 0; i < 5; ++i){
    rowHeaders.push(new RowHeader(20, ""));
}

const excel = new Excel(3, 5, 20, 20, 20, 20);

function execute(onChangeAction, args){
    onChangeAction.action(args);
}

excel.setOnChangeCallBack(execute);

excel.setCellContent(2, 2, "0");

// excel.addRow(0, 20);
