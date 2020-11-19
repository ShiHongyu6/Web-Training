window.onload = function() {
    var panel = document.querySelector("body");
    var eyeWidth = document.querySelector("#leftEye").clientWidth;

    var leftEyeBall = document.querySelector("#leftEye>.smiley__eyeBall");
    var rightEyeBall = document.querySelector("#rightEye>.smiley__eyeBall"); 
    var count = 0;
    /**
     * 绑定鼠标移动时的事件
     */
    panel.onmouseover =  e => {

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

        //console.log(eyeBallLeft + ", " + eyeBallTop);
        leftEyeBall.style.left = rightEyeBall.style.left = eyeBallLeft + "px";
        leftEyeBall.style.top = rightEyeBall.style.top = eyeBallTop + "px";
    };
}