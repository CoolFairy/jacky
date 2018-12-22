var table;
var squareWidth=40;//每个小方块的宽度
var boardWidth=10;//横竖有多少小方块
var squareSet=[];
var choose=[];
var timer=null;
var baseScore=5;
var stepScore=10;
var totalScore=0;
var targetScore=1500;
var flag=true;
var tempSquare=null; //在处理鼠标动作过程中，动作屏蔽，不连贯

function refresh(){
    for (var i = 0; i < squareSet.length; i++) {
        for (var j = 0; j < squareSet[i].length; j++) {
            if (squareSet[i][j]==null) {
                continue;
            }
            squareSet[i][j].row=i;
            squareSet[i][j].col=j;
            squareSet[i][j].style.transition='left 0.3s, bottom 0.3s';
            squareSet[i][j].style.left=squareSet[i][j].col*squareWidth+'px';
            squareSet[i][j].style.bottom=squareSet[i][j].row*squareWidth+'px';
            squareSet[i][j].style.backgroundImage="url('./pic/" + squareSet[i][j].num + ".png')";
            squareSet[i][j].style.backgroundSize='cover';
            squareSet[i][j].style.transform='scale(0.95)';
        }
    }
};



//创建小方块
//value是颜色
function creatSquare(value,row,col){
    var temp=document.createElement('div');
    temp.style.width=squareWidth+'px';
    temp.style.height=squareWidth+'px';
    temp.style.display='inline-block';
    temp.style.position='absolute';
    temp.style.boxSizing='border-box';
    temp.style.borderRadius='12px';
    temp.num=value;
    temp.row=row;
    temp.col=col;
    return temp;

}

function checkLinked(square, arr) {
    if (square == null) {
        return;
    }
    arr.push(square);
    //判断左边的小方块
    //1.左边是否存在
    //2.左边得存在一个小块
    //3.左边的颜色相同
    //4.左边的没有被收录进数组
    if (square.col > 0 && squareSet[square.row][square.col - 1] && squareSet[square.row][square.col - 1].num == square.num && arr.indexOf(squareSet[square.row][square.col - 1]) == -1) {
        checkLinked(squareSet[square.row][square.col - 1], arr);
    }
    if (square.col < boardWidth - 1 && squareSet[square.row][square.col + 1] && squareSet[square.row][square.col + 1].num == square.num && arr.indexOf(squareSet[square.row][square.col + 1]) == -1) {
        checkLinked(squareSet[square.row][square.col + 1], arr);
    }
    if (square.row < boardWidth - 1 && squareSet[square.row + 1][square.col] && squareSet[square.row + 1][square.col].num == square.num && arr.indexOf(squareSet[square.row + 1][square.col]) == -1) {
        checkLinked(squareSet[square.row + 1][square.col], arr);
    }
    if (square.row > 0 && squareSet[square.row - 1][square.col] && squareSet[square.row - 1][square.col].num == square.num && arr.indexOf(squareSet[square.row - 1][square.col]) == -1) {
        checkLinked(squareSet[square.row - 1][square.col], arr);
    }
};

function goBack(){
    if (timer!=null) {
        clearInterval(timer);
    }
    for (var i = 0; i < squareSet.length; i++) {
        for (var j = 0; j < squareSet[i].length; j++) {
            if (squareSet[i][j]==null) {
                continue;
            }
            squareSet[i][j].style.border='0px';
            squareSet[i][j].style.transform='scale(0.95)';
        }
    }
};

function flicker(arr){
    var num=0;
    timer=setInterval(function(){
        for (var i = 0; i < arr.length; i++) {

            arr[i].style.border='3px solid #BFEFFF';
            arr[i].style.transform="scale("+(0.90+0.05*Math.pow(-1,num))+")";
        }
        num++;
    },300);
};

//计算选中小方块的分数
function selectScore(){
    var score=0;
    for (var i = 0; i < choose.length; i++) {
        score+=baseScore+i*stepScore;
    }
    if (score<=0) {
        return;
    }
    document.getElementById('select_score').innerHTML=choose.length+'块'+score+'分';
    document.getElementById('select_score').style.transition=null;
    document.getElementById('select_score').style.opacity=1;
    setTimeout(function(){
        document.getElementById('select_score').style.transition='opacity 2s';
        document.getElementById('select_score').style.opacity=0;
    },1000);
};


//鼠标移动的情况  obj是小方块
function mouseOver(obj){
    if (!flag) {
        tempSquare=obj;
        return;
    }
    goBack();
    choose=[];
    checkLinked(obj,choose);
    if (choose.length<=1) {
        choose=[];
        return;
    }
    flicker(choose);
    selectScore();
};

function move(){
    //向下
    for (var i = 0; i < boardWidth; i++) {
        var pointer=0;//point指向小方块，当遇到null是停止加加
        for (var j = 0; j < boardWidth; j++) {
            if (squareSet[j][i]!=null) {
                if (j!=pointer) {
                    squareSet[pointer][i]=squareSet[j][i];
                    squareSet[j][i].row=pointer;
                    squareSet[j][i]=null;
                }
                pointer++;
            }
        }
    } 
    //横向移动
    //
    for (var i = 0; i < squareSet[0].length; ) {
        if (squareSet[0][i]==null) {
            for (var j = 0; j <boardWidth; j++) {
                squareSet[j].splice(i,1);
            }
            continue;
        }
        i++;
    }
    
    refresh();
};

function isFinish(){
    for (var i = 0; i < squareSet.length; i++) {
        for (var j = 0; j < squareSet[i].length; j++) {
            var temp=[];
            checkLinked(squareSet[i][j],temp);
            if (temp.length>1) {
                return false;
            }
        }
    }
    return true;
};


function init(){
    table=document.getElementById('pop_star');
    for (var i = 0; i < boardWidth; i++) {
        squareSet[i]=new Array();
        for (var j = 0; j < boardWidth; j++) {
            var square=creatSquare(Math.floor(Math.random()*5),i,j);
            square.onmouseover=function(){
                mouseOver(this);
            }
            square.onclick=function(){
                
                if (!flag||choose.length==0) {
                    return;
                }
                flag=false;
                tempSquare=null;
                //加分数
                var score=0;
                for (var i = 0; i < choose.length; i++) {
                    score+=baseScore+i*stepScore;
                }
                totalScore+=score;
                document.getElementById('now_score').innerHTML='当前分数：'+totalScore;
                //消灭星星
                for (var i = 0; i < choose.length; i++) {
                    (function(i){
                        setTimeout(function(){
                        squareSet[choose[i].row][choose[i].col]=null;
                        table.removeChild(choose[i]);

                    },i*100)
                    })(i);
                }
                //移动
                setTimeout(function(){
                    move();
                    //判断结束
                    setTimeout(function(){
                        var is=isFinish();
                        if (is) {
                            if (totalScore>targetScore) {
                                document.getElementById('img').style.display='block';
                            }else{
                                alert('游戏结束');
                            }
                        }else{
                            choose=[];
                            flag=true;
                            mouseOver(tempSquare);
                        }
                    },300+choose.length*150)
                },choose.length*100);
                
            };
            squareSet[i][j]=square;
            table.appendChild(square);
        }
    }
    refresh();
};

window.onload=function(){
    init();
};