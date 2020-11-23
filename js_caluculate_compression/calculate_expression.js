
/**
 * 表示一个操作符
 * @param {string} token 用来表示这个操作符的符号 
 * @param {number} priority 用来表示符号的优先级
 * @param {number} number_of_operand 表示操作符操作数的数量 
 * @param {function} op_callback 该操作符进行的操作（回调） 
 */
function Operator(token, priority, number_of_operand, op_callback){
    this.token = token;
    this.priority = priority;
    this.number_of_operand = number_of_operand;
    this.op_callback = op_callback;
}

Operators = {
    //加法
    "ADD" : new Operator("+", 5, 2, function(){
        return arguments[0] + arguments[1];
    }),
    //减法
    "SUB" : new Operator("-", 5, 2, function(){
        return arguments[0] - arguments[1];
    }),
    //乘法
    "MULTI": new Operator("*", 7, 2, function(){
        return arguments[0] * arguments[1];
    }),
    //除法
    "DIV" : new Operator("/", 7, 2, function(){
        return arguments[0] / arguments[1];
    }),
    //定界符
    "DELIMITER" : new Operator("#", 0, 0, function(){

    })
};

/**
 * 根据符号，返回操作符对象
 * @param {string}} token 
 */
Operators.getOperatorByToken = function(token){
    switch(token){
        case "+": return Operators.ADD;
        case "-": return Operators.SUB;
        case "*": return Operators.MULTI;
        case "/": return Operators.DIV;
        case "#": return Operators.DELIMITER;


        default: throw new Error("Unrecognized Token :\"" + token + "\" ! ");
    }
};

/**
 * 判断是否为数字字符
 * @param {string}} character 
 */
function isDigit(character){
    return character >= "0" && character <= "9";
}

/**
 * 计算一个数学表达式的值
 * @param {string}} expression 数学表达式 
 */
function calculate(expression){

    //加一个定界符
    expression += Operators.DELIMITER.token;
    /**
     * 数字栈
     */
    let number_stack = [];
    /**
     * 操作符栈
     */
    let operator_stack = [Operators.DELIMITER.token];


    let number_builder = [];//用于把字符串转换为数字
    for(let i = 0; i < expression.length; ++i){
        // console.log(expression[i]);
        if(isDigit(expression[i]) || expression[i] === "."){
            //遍历字符串，如果是数字字符，加入“构建器”
            number_builder.push(expression[i]);
        }else {
            //找到一个非数字字符，表示找到一个完整的数据
            if(number_builder.length > 0){
                number_stack.push(Number(number_builder.join('')));
                number_builder.length = 0;
            }

            //对于非数字字符，获取它代表的运算符
            let operator_current = Operators.getOperatorByToken(expression[i]);

            //得到当前操作符栈顶的操作符
            let operator_top = operator_stack[operator_stack.length - 1];


            //如果栈顶操作符优先级出现“上凸/极大”，则使用栈顶操作符计算
            while(operator_stack.length > 0 && operator_current.priority <= operator_top.priority){
                //计算栈顶符号，出栈
                operator_stack.pop();

                //根据操作符指定的操作数数量，从数字栈取出操作数
                let arguments = [];
                for(let i = 0; i < operator_top.number_of_operand; ++i){
                    arguments.unshift(number_stack.pop());
                }
                // console.log("argument:" + arguments);
                //计算
                let mid_result = operator_top.op_callback.apply(operator_top.op_callback, arguments);
                //将结果压入数字栈
                number_stack.push(mid_result);

                //栈顶进行迭代，多次取出栈顶
                operator_top = operator_stack[operator_stack.length - 1];
            }

            //栈顶“上凸”处理完成，将当前符号入栈
            operator_stack.push(operator_current);
        }
    }

    return number_stack[0];
}


test_expressions = [
    // "1+2+3",
    // "1+5+7",
    // "1+8-1",
    // "2-5+9",
    // "1-3-5",
    // "1.1+2.2+3.3",
    "1+2*3",
    "1+2*3+4",
    "2-4/2+3",
    "2-4*3/5+1"

];

for(let i = 0; i < test_expressions.length; ++i){
    console.log(calculate(test_expressions[i]));
}