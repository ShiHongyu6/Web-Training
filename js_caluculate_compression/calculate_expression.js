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
    //左括号
    "L_PARENTHESIS" : new Operator("(", 0, 0, function(){

    }),
    //右括号
    "R_PARENTHESIS" : new Operator(")", 0, 0, function(){

    }),
    //负号
    "NEGATIVE" : new Operator("#", 10, 1, function(){
        return -1 * arguments[0];
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
        case "(": return Operators.L_PARENTHESIS;
        case ")": return Operators.R_PARENTHESIS;
        //为了和减号做区分，负号使用#代替，需要调整表达式
        case "#": return Operators.NEGATIVE;
        default: throw new Error("Unrecognized Token :\"" + token + "\" ! ");
    }
};



/**
 * 计算一个数学表达式的值
 * 1. 首先转换为后缀表达式
 * 2. 计算后缀表达式
 * @param {string}} expression 数学表达式 
 */
function calculate(expression){

    //将中缀表达式转换为后缀表达式
    expression = format_expression(expression);

    //计算
    let result_stack = [];
    while(expression.length > 0){
        //找到后缀表达式中的操作符
        if(!isNaN(expression[0])){
            //将表达式的操作数取出，压入栈
            result_stack.push(expression.shift());
        }else {
            //取出操作符号
            let op = expression.shift();
            //根据操作符指定的操作数数量，从栈中取出操作数
            let arg = [];
            for(let i = 0; i < op.number_of_operand; ++i){
                arg.unshift(result_stack.pop());
            }
            //将这一步的计算结果压入操作数栈
            result_stack.push(op.op_callback.apply(op, arg));
        }
    }

    //后缀表达式遍历完成，结果保存在栈中
    return result_stack[0];
}

/*******测试开始************************** */

test_expressions = [
    "2-4*3/5+1",
    "(2 + 3 * (4 + 5) * (6 + 7))",
    "5-(-(-3))",
    "5---3 * 6",
    "3+8.3*1"
];


for(let i = 0; i < test_expressions.length; ++i){
    console.log(calculate(test_expressions[i]));
}


/*******测试结束************************** */


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
    //左括号
    "L_PARENTHESIS" : new Operator("(", 0, 0, function(){

    }),
    //右括号
    "R_PARENTHESIS" : new Operator(")", 0, 0, function(){

    }),
    //负号
    "NEGATIVE" : new Operator("#", 10, 1, function(){
        return -1 * arguments[0];
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
        case "(": return Operators.L_PARENTHESIS;
        case ")": return Operators.R_PARENTHESIS;
        //为了和减号做区分，负号使用#代替，需要调整表达式
        case "#": return Operators.NEGATIVE;
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
 * 判断一个表达式的括号是否匹配
 * 并且，将表达式中的“减号”前添加“加号”，将减法操作转换为假发操作
 * @param {string} expression 
 */
function isMatch(expression){
    let stack_top = -1;

    for(let i = 0; i < expression.length; ++i){

        if(expression[i] === '('){
            //如果检测到左括号，入栈
            ++stack_top;
        }

        if(expression[i] === ')'){
            //如果检测到右括号，并且栈不空，左括号出栈
            if(stack_top > -1)
                --stack_top;
            else
                return false;
        }

    }
    return stack_top == -1;
}


/**
 * 调整表达式：
 * 1. 将表达式中的“负号”，修改为#
 * 2. 将中缀表达式转换为后缀表达式
 * @param {string} expression 中缀表达式 
 */
function format_expression(expression){

    //判断括号是否匹配
    if(!isMatch(expression)){
        throw new Error("Expression Error : 括号不匹配");
    }

    string_builder = ['('];
    let last = " ";
    for(let i = 0; i < expression.length; ++i){
        //忽略空格
        if(expression[i] === ' '){
            continue;
        }

        string_builder.push(expression[i]);
        if(expression[i] === '-' && !isDigit(last) && last !== ')'){
            string_builder.pop();
            string_builder.push('#');
        }
        last = expression[i];
    }
    //将整个表达式包含在一个括号中，方便后续转后缀表达式
    string_builder.push(')');
    //已将负号全部替换为'#'
    expression = string_builder.join('');

    let expression_stack = []; //接下来将这个表达式转换为后缀表达式，并将结果保存到这个栈中
    let operator_stack = [];//转后缀表达式的过程中，需要一个符号栈来保存中间结果
    let number_builder = [];//用于把字符串转换为数字
    for(let i = 0; i < expression.length; ++i){

        if(isDigit(expression[i]) || expression[i] === "."){
            //遍历字符串，如果是数字字符，加入“构建器”
            number_builder.push(expression[i]);
        }else {
            //找到一个非数字字符，表示找到一个完整的操作数，将操作数入栈
            if(number_builder.length > 0){
                expression_stack.push(Number(number_builder.join('')));
                number_builder.length = 0;
            }

            //对于非数字字符，获取它代表的运算符
            let operator_current = Operators.getOperatorByToken(expression[i]);
            
            //如果是左括号，直接入栈;如果不是左括号，则需要判断栈顶操作数是否出现了操作符优先级的“上凸”
            if(operator_current !== Operators.L_PARENTHESIS){
                //得到当前操作符栈顶的操作符
                let operator_top = operator_stack[operator_stack.length - 1];
                //如果操作符栈顶操作符优先级出现“上凸/极大”，将操作符栈的栈顶弹出，压入到后缀表达式栈
                while(operator_stack.length > 0 && operator_current.priority <= operator_top.priority){
                    //对于单目运算符，结合方向向右，所以只有操作符栈顶的优先级更高的时候，才能将操作符栈顶加入后缀表达式
                    if(operator_top.number_of_operand == 1 && operator_current.priority == operator_top.priority)
                        break;
                    operator_stack.pop();
                    //左括号不会进入后缀表达式
                    if(operator_top !== Operators.L_PARENTHESIS){
                        expression_stack.push(operator_top);
                    }
                    if(operator_top === Operators.L_PARENTHESIS && operator_current === Operators.R_PARENTHESIS)
                        break;

                    //栈顶进行迭代，多次取出栈顶
                    operator_top = operator_stack[operator_stack.length - 1];
                }
                
            }
            //栈顶“上凸”处理完成，将当前符号入栈;右括号不入栈
            if(operator_current !== Operators.R_PARENTHESIS){
                operator_stack.push(operator_current);
            }
        }
    }
    return expression_stack;
}

