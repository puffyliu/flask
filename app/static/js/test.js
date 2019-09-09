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
                    console.log(data)
                    $('.info').html("個股資訊：" + data);
                    $('.history').html(data + " 歷史行情");
                },
                error: function(xhr, type) {
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
                    var arrayJson = JSON.parse(data);
                    var tr = '';
                    for(var p in arrayJson){
                        tr += '<tr>';
                        tr += '<td>' + arrayJson[p]['t_date'] + '</td>';
                        tr += '<td>' + arrayJson[p]['p_open'] + '</td>';
                        tr += '<td>' + arrayJson[p]['p_high'] + '</td>';
                        tr += '<td>' + arrayJson[p]['p_low'] + '</td>';
                        tr += '<td>' + arrayJson[p]['p_close'] + '</td>';
                        tr += '<td>' + arrayJson[p]['volume'] + '</td>';
                        tr += '</tr>';
                    }
                    $("#gvFitting").append(tr);
                },
                error: function(xhr, type) {
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
    if (input == '2412' || input == "中華電信") {
        var imgSrc = obj.setAttribute("src", "/static/image/2412.png");
    }
    else if (input == '3008' || input == "大立光") {
        var imgSrc = obj.setAttribute("src", "/static/image/3008.png");
    }
    else if (input == '2885' || input == "元大金") {
        var imgSrc = obj.setAttribute("src", "/static/image/2885.png");
    }
    else if (input == '2330' || input == "台積電") {
        var imgSrc = obj.setAttribute("src", "/static/image/2330.png");
    }
    else if (input == '2882' || input == "國泰金") {
        var imgSrc = obj.setAttribute("src", "/static/image/2882.png");
    }
    else if (input == '2912' || input == "統一超") {
        var imgSrc = obj.setAttribute("src", "/static/image/2912.png");
    }
    else if (input == '2881' || input == "富邦金") {
        var imgSrc = obj.setAttribute("src", "/static/image/2881.png");
    }
    else if (input == '2317' || input == "鴻海") {
        var imgSrc = obj.setAttribute("src", "/static/image/2317.png");
    }
    else{
        // 設置一個錯誤的圖片
        var imgSrc = obj.setAttribute("src", "/static/image/Error.jpeg");
    }

}

// 即時追蹤
function onKeep() {
    $.ajax({
            type: 'POST',
            url: '/keep',
//            data: JSON.stringify(data),
            contentType: 'application/json; charset=UTF-8',
            success: function(data){
//                console.log(data);
                var redisJson = JSON.parse(data);
                console.log(redisJson);
                    var tr = '';
                    for(var p in redisJson){
                        console.log(redisJson[p]);
                        tr += '<tr>';
                        tr += '<td>' + redisJson[p] + '</td>';
//                        tr += '<td>' + redisJson[p]['p_open'] + '</td>';
//                        tr += '<td>' + redisJson[p]['p_high'] + '</td>';
//                        tr += '<td>' + redisJson[p]['p_low'] + '</td>';
//                        tr += '<td>' + redisJson[p]['p_close'] + '</td>';
//                        tr += '<td>' + redisJson[p]['volume'] + '</td>';
                        tr += '</tr>';
                    }
                    $("#Andytable").append(tr);
            },
            error: function(xhr, type) {
            console.log(xhr.responseText);
            console.log(type);
            }
    });

}


