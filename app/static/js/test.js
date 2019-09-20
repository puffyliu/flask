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
//function onKeep() {
//    $.ajax({
//            type: 'POST',
//            url: '/keep',
////            data: JSON.stringify(data),
//            contentType: 'application/json; charset=UTF-8',
//            success: function(data){
////                console.log(data);
//                var redisJson = JSON.parse(data);
//                console.log(redisJson);
//                    var tr = '';
//                    for(var p in redisJson){
//                        console.log(redisJson[p]);
//                        tr += '<tr>';
//                        tr += '<td>' + redisJson[p] + '</td>';
////                        tr += '<td>' + redisJson[p]['p_open'] + '</td>';
////                        tr += '<td>' + redisJson[p]['p_high'] + '</td>';
////                        tr += '<td>' + redisJson[p]['p_low'] + '</td>';
////                        tr += '<td>' + redisJson[p]['p_close'] + '</td>';
////                        tr += '<td>' + redisJson[p]['volume'] + '</td>';
//                        tr += '</tr>';
//                    }
//                    $("#Andytable").append(tr);
//            },
//            error: function(xhr, type) {
//            console.log(xhr.responseText);
//            console.log(type);
//            }
//    });
//
//}

// 即時追蹤
function onSetting() {
    var fc = document.getElementsByClassName("form-control")[0].value;
    var fradio = document.querySelector('input[name="price"]:checked').value;
    var stockname = document.getElementsByClassName("instant-name")[0].textContent;
    var setting = document.getElementById("update_setting").textContent;
    var data = {"fc":fc, "fradio":fradio, "stockname":stockname, "setting":setting};
    console.log(data);
    $.ajax({
                type: 'POST',
                url: '/onSetting',
                data: JSON.stringify(data),
                contentType: 'application/json; charset=UTF-8',
                success: function(data){
//                    console.log(data);
//                    console.log(app);
                },
                error: function(xhr, type) {
                    console.log("xhr = " + xhr);
                    console.log("type = " + type);
                }

        });
        alert("設定完成!");
        change_button();
}


function deSetting() {
    var fc = document.getElementsByClassName("form-control")[0].value;
    var fradio = document.querySelector('input[name="price"]:checked').value;
    var stockname = document.getElementsByClassName("instant-name")[0].textContent;
    var setting = document.getElementById("remove_setting").textContent;
    var data = {"fc":fc, "fradio":fradio, "stockname":stockname, "setting":setting};
    console.log(data);
    $.ajax({
                type: 'POST',
                url: '/deSetting',
                data: JSON.stringify(data),
                contentType: 'application/json; charset=UTF-8',
                success: function(data){
                    console.log(data);
//                    console.log(app);
                },
                error: function(xhr, type) {
                    console.log("xhr = " + xhr);
                    console.log("type = " + type);
                }

        });
        alert("成功解除!");
        change_button();
}


// 推薦股:買進
function onBuy() {
    var data = {"pred":1};
    $.ajax({
                type: 'POST',
                url: '/onBuy',
                data: JSON.stringify(data),
                contentType: 'application/json; charset=UTF-8',
                success: function(data){
                    console.log(data)
                    var arrayJson = JSON.parse(data);
                    var tr1 = '';
                    var tr2 = '';
                    for(var p in arrayJson[0]){
                        tr1 += '<tr>';
                        tr1 += '<th scope="row">' + arrayJson[0][p]['code'] + '</th>';
                        tr1 += '<td>' + arrayJson[0][p]['name'] + '</td>';
                        tr1 += '<td>' + '買進' + '</td>';
                        tr1 += '<td>' + arrayJson[0][p]['score'] + '</td>';
                        tr1 += '</tr>';
                    }
                    for(var k in arrayJson[1]){
                        tr2 += '<tr>';
                        tr2 += '<th scope="row">' + arrayJson[1][k]['code'] + '</th>';
                        tr2 += '<td>' + arrayJson[1][k]['name'] + '</td>';
                        tr2 += '<td>' + '買進' + '</td>';
                        tr2 += '<td>' + arrayJson[1][k]['score'] + '</td>';
                        tr2 += '</tr>';
                    }
                    // 先清空在新增
                    $("#tp_buy_1 tbody").html("");
                    $("#tp_buy_2 tbody").html("");
                    $("#todayPredict1").append(tr1);
                    $("#tomorrowPredict1").append(tr2);
                },
                error: function(xhr, type) {
                    console.log("xhr = " + xhr);
                    console.log("type = " + type);
                }
        });
}


// 推薦股:賣出
function onSell() {
    var data = {"pred":0};
    $.ajax({
                type: 'POST',
                url: '/onSell',
                data: JSON.stringify(data),
                contentType: 'application/json; charset=UTF-8',
                success: function(data){
                    console.log(data)
                    var arrayJson = JSON.parse(data);
                    var tr1 = '';
                    var tr2 = '';
                    for(var p in arrayJson[0]){
                        tr1 += '<tr>';
                        tr1 += '<th scope="row">' + arrayJson[0][p]['code'] + '</th>';
                        tr1 += '<td>' + arrayJson[0][p]['name'] + '</td>';
                        tr1 += '<td>' + '賣出' + '</td>';
                        tr1 += '<td>' + arrayJson[0][p]['score'] + '</td>';
                        tr1 += '</tr>';
                    }
                    for(var k in arrayJson[1]){
                        tr2 += '<tr>';
                        tr2 += '<th scope="row">' + arrayJson[1][k]['code'] + '</th>';
                        tr2 += '<td>' + arrayJson[1][k]['name'] + '</td>';
                        tr2 += '<td>' + '賣出' + '</td>';
                        tr2 += '<td>' + arrayJson[1][k]['score'] + '</td>';
                        tr2 += '</tr>';
                    }
                    // 先清空在新增
                    $("#tp_sell_1 tbody").html("");
                    $("#tp_sell_2 tbody").html("");
                    $("#todayPredict2").append(tr1);
                    $("#tomorrowPredict2").append(tr2);
                },
                error: function(xhr, type) {
                    console.log("xhr = " + xhr);
                    console.log("type = " + type);
                }
        });
}