window.onload = function() {

    var eyeAction = function () {
        //运行过程大小会改变
        var panel = document.querySelector(".panel--control");
        
        //将'figure'放到panel中间
        var figure = document.querySelector(".figure");
        figure.style.top = 0.5 * panel.clientHeight - figure.clientHeight / 2 + "px";

        //运行过程大小不会变
        var leftEyeBall = document.querySelector("#leftEye>.eye__eyeball");
        var rightEyeBall = document.querySelector("#rightEye>.eye__eyeball"); 
        var eyeWidth = document.querySelector("#leftEye").clientWidth;
        var eyeballWidth = leftEyeBall.clientWidth; 
        function moveEyeball(e) {
    
            //得到接收鼠标事件的面板的长度可宽度
            let panelWidth = panel.clientWidth;
            let panelHeight = panel.clientHeight;
    
            //得到鼠标的当前位置
            let mouseX = e.clientX;
            let mouseY = e.clientY;
            
            //计算鼠标当前位置相对于面板的相对位置（结果为相对于原点的百分比）
            let relativeX = mouseX / panelWidth;
            let relativeY = mouseY / panelHeight;
    
            //根据相对位置，计算眼球的位置
            let eyeBallLeft = Math.floor(eyeWidth * relativeX);
            let eyeBallTop = Math.floor(eyeWidth * relativeY);
    
            /**
             * 调整眼球位置：
             * 1. 使用定位时，上面计算的位置是眼球左上角的位置，要将这个位置调整到眼球中间
             * 2. 防止眼球越界
             */
            eyeBallLeft = justifyPosition(eyeBallLeft)
            eyeBallTop = justifyPosition(eyeBallTop);

            leftEyeBall.style.left = rightEyeBall.style.left = eyeBallLeft + "px";
            leftEyeBall.style.top = rightEyeBall.style.top = eyeBallTop + "px";
    
        }
        
        
        /**
         * 限制眼球的范围
         * 为了防止眼球越界，眼球应该在眼睛的内接正方形中运动
         * top和left的范围应该在R-R/sqrt(2)~R+R/sqrt(2)-2*r
         * @param {number} position 
         * @return {number} position限定在范围之内，返回限定之后的结果
         */
        var eyeRadius = eyeWidth / 2;
        var MinOfEyeball =  Math.ceil(eyeRadius - eyeRadius / Math.sqrt(2));
        var MaxOfEyeball = Math.floor(eyeRadius + eyeRadius / Math.sqrt(2) - eyeballWidth);
        function justifyPosition(position){
            position -= Math.floor(eyeballWidth / 2);
            position = Math.min(position, MaxOfEyeball);
            position = Math.max(position, MinOfEyeball);
            return position;
        }
        
        /**
         * 绑定鼠标移动时的事件
         */
        panel.addEventListener("mousemove", moveEyeball);
    }();
}