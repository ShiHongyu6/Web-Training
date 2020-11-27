function Polygon(...edges){
    this.edges = [];
    edges.forEach(element => {
        if(element <= 0)
            throw new Error("invalid value : \"" + element + "\" !" );
        this.edges.push(element);
    });
}

Polygon.prototype.getPerimeter = function(){
    let perimeter = 0;
    this.edges.forEach(element => {
        perimeter += element;
    });
    return perimeter;
};

Polygon.prototype.getArea = function(){

}


function Triangle(edge1, edge2, edge3){
    /**
     * 设三角形边长为a,b,c。c最长
     * 则，三角形存在的条件是 a + b > c，故 a + b + c > 2 * c
     */
    const maxEdge = Math.max(edge1, edge2, edge3);
    if(arguments.length < 3 || edge1 + edge2 + edge3 <= 2 * maxEdge)
        throw new Error("invalid : Can not form a Triangle");
    Polygon.apply(this, arguments);
}

//三角形继承多边形
inheritPrototype(Triangle, Polygon);

/**
 * 使用海伦公式求三角形面积
 */
Triangle.prototype.getArea = function(){
    const p = this.getPerimeter() / 2;
    return Math.sqrt(p * (p - this.edges[1]) * (p - this.edges[1]) * (p - this.edges[1]));
}


/**
 * 四边形，想要确定一个四边形，要知道四条边的大小以及一对“对角”的度数（使用弧度）
 * 这里使用的对角：1. 第一条边和第二条边的夹角 2. 第三条边和第四条边的夹角
 */
function Quadrilateral(){
    const args = Array.from(arguments);
    Polygon.apply(this, args.splice(0, 4));

    //四边形除了需要记录边长以外，还需要记录对角的弧度
    this.angles = args;
}

//四边形继承多边形
inheritPrototype(Quadrilateral, Polygon);

//重写求面积的方法
Quadrilateral.prototype.getArea = function(){
    return 0.5 * this.edges[0] * this.edges[1] * Math.sin(this.angles[0]) + 0.5 * this.edges[2] * this.edges[3] * Math.sin(this.angles[1]);
}


/**
 * 1. 创建一个原型对象（作为子类的原型对象）
 * 2. 将这个原型对象的[[prototype]]属性指向父类原型
 */
function inheritPrototype(subType, superType){
    const subProto = {};
    Object.defineProperty(subProto, "constructor", {
        value: subType,
        enumerable: false
    });
    Object.setPrototypeOf(subProto, superType.prototype);
    subType.prototype = subProto;
}


/*******测试************ */
const polygon1 = new Triangle(3, 4, 5);
const polygon2 = new Triangle(2, 3, 3);

console.log("Triangle-------------");
console.log(polygon1 instanceof Object);
console.log(polygon1 instanceof Polygon);
console.log(polygon1 instanceof Triangle);
console.log("perimeter:" + polygon1.getPerimeter() + "\tarea:" + polygon1.getArea());
console.log("perimeter:" + polygon2.getPerimeter() + "\tarea:" + polygon2.getArea());
console.log("\tProto-chain----------");
for(let p = Object.getPrototypeOf(polygon1); p; p = Object.getPrototypeOf(p)){
    console.log(p.constructor);
}
console.log();


const polygon3 = new Quadrilateral(2, 2, 3, 3, Math.PI / 2, Math.PI / 2);
const polygon4 = new Quadrilateral(12, 14, 5, 9, 80 / 180 * Math.PI, 110 / 180 * Math.PI);
console.log("Quadrilateral-------------");
console.log(polygon3 instanceof Object);
console.log(polygon3 instanceof Polygon);
console.log(polygon3 instanceof Quadrilateral);
console.log("perimeter:" + polygon3.getPerimeter() + "\tarea:" + polygon3.getArea());
console.log("perimeter:" + polygon4.getPerimeter() + "\tarea:" + polygon4.getArea());
console.log("\tProto-chain----------");
for(let p = Object.getPrototypeOf(polygon3); p; p = Object.getPrototypeOf(p)){
    console.log(p.constructor);
}
console.log();