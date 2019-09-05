// 個股資訊
function onQuery() {
        var input = document.getElementsByClassName("search-input")[0].value
        var inf = document.getElementsByClassName("info").value
        var data = {"input":input};
        $.ajax({
                type: 'POST',
                url: '/query1',
                data: JSON.stringify(data),

                contentType: 'application/json; charset=UTF-8',
//                dataType: 'json', // 加上這個會報parsererror
                success: function(data){
//                    alert("成功");
                    console.log(data)
                    $('.info').html("個股資訊：" + data);
                    $('.history').html(data + " 歷史行情");
                },
                error: function(xhr, type) {
//                alert("失敗");
                console.log(xhr.responseText);
                console.log(type);
                }
        });

}

// 歷史行情的表格
function onQuery2() {
        var input = document.getElementsByClassName("search-input")[0].value;
        var his = document.getElementsByClassName("history").value;
        var data = {"input":input};
        $.ajax({
                type: 'POST',
                url: '/query2',
                data: JSON.stringify(data),
                contentType: 'application/json; charset=UTF-8',
                success: function(data){
//                    alert("成功");
                    console.log(data)

                },
                error: function(xhr, type) {
//                alert("失敗");
//                console.log(xhr.responseText);
                console.log(type);
                }
        });

}

//
function onQuery3() {


}

//
function onQuery4() {


}


// 產業推薦股的查詢
function onQuery5() {


}
// 情感分析的查詢
function onAnalysis() {
    var input = document.getElementsByClassName("search-input")[0].value;
    var data = {"input":input};
    // 取得圖片
    var obj = document.getElementById("imgid");
    var imgSrc = obj.getAttribute("src");
    alert(input)
    alert(typeof(input))
    if (input == '2317' || input == "鴻海") {
    alert(1)
        var imgSrc = obj.setAttribute("src", "/static/image/WordArt2.jpg");
    }
// 中間幾張再補上
    else{
        // 設置一個錯誤的圖片
        var imgSrc = obj.setAttribute("src", "/static/image/Error.jpeg");
    }

}

function onKeep() {
    var input = document.getElementsByClassName("search-input")[0].value
    var data = {"input":input};
    $.ajax({
            type: 'POST',
            url: '/keep',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=UTF-8',
            success: function(data){
                console.log(data)

            },
            error: function(xhr, type) {
            console.log(xhr.responseText);
            console.log(type);
            }
    });

}