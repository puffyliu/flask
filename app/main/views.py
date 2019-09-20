from flask import render_template, session, redirect, url_for, current_app, request, flash
from . import main
from ..models import db
from mysql.connector import connection
import redis
import json


@main.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index2.html')


@main.route('/createdb', methods=['GET', 'POST'])
def createdb():
    db.create_all()
    return redirect(url_for("main.index"))


@main.route('/index2', methods=['GET', 'POST'])
def index2():
    return render_template('index2.html')


@main.route('/data.json', methods=['GET', 'POST'])
def data_json():
    return render_template("data.json")


# 轉換代碼成中文
@main.route('/query1', methods=['GET', 'POST'])
def query1():
    result = ""
    if request.method == 'POST':
        # 因為input可能是中文，所以不能定為數字型態
        rev = str(request.get_json()['input'])
        conn = connection.MySQLConnection(host="10.120.14.18", port=3306, database='stock', user='db102stock',
                                          password='db102stock_pwd')  # docker
        mycursor = conn.cursor()
        mycursor.execute(" Select code, name from stocklisted ")
        myresult = mycursor.fetchall()
        conn.close()
        result_dict = {}
        # 轉換成dict{code:name}
        for r in myresult:
            result_dict[str(r[0])] = str(r[1])
        if rev in result_dict.keys():
            result = result_dict[rev]
        elif rev in result_dict.values():
            result = rev
        else:
            result = "wrong!"
        # print(result)
        return result
    else:
        return render_template('index3.html', result=result)


# 查詢下面的表格
@main.route('/query2', methods=['GET', 'POST'])
def query2():
    stock_list = []
    stock_json = []
    if request.method == 'POST':
        # 因為input可能是中文，所以不能定為數字型態
        rev = request.get_json()['input']
        conn = connection.MySQLConnection(host="10.120.14.18", port=3306, database='stock', user='db102stock',
                                          password='db102stock_pwd')  # docker
        mycursor = conn.cursor()
        if rev.isdigit():
            mycursor.execute(
                "SELECT date_format(t_date, '%Y-%m-%d'), name, code, p_open, p_high, p_low, p_close, volume FROM stock_inf"  # 日期要轉字串不然無法轉json
                " where code = {} order by t_date desc limit 15 ".format(rev))
        elif isinstance(rev, str):
            mycursor.execute(
                "SELECT date_format(t_date, '%Y-%m-%d'), name, code, p_open, p_high, p_low, p_close, volume FROM stock_inf"
                " where name = {} order by t_date desc limit 15 ".format(rev))
        myresult = mycursor.fetchall()
        conn.close()

        for i in myresult:
            stock_data = {"t_date": i[0], "name": i[1], "code": i[2], "p_open": i[3], "p_high": i[4], "p_low": i[5],
                          "p_close": i[6], "volume": i[7]}
            stock_list.append(stock_data)
        stock_json = json.dumps(stock_list)
        # print(stock_json)
        return stock_json
    else:
        return render_template('index3.html', stock_json=stock_json)


#
@main.route('/analysis', methods=['GET', 'POST'])
def analysis():
    return render_template('analysis.html')


@main.route('/recommend', methods=['GET', 'POST'])
def recommend():
    return render_template('recommend.html')


@main.route('/keep', methods=['GET', 'POST'])
def keep():
    redis_json = []
    if request.method == 'POST':
        r = redis.Redis(host='10.120.14.128', port=6379, decode_responses=True)
        re_stock = r.hgetall('stock')
        for key in re_stock:
            redis_list = {"key": (re_stock[key])}
            redis_json.append(redis_list)
        redis_json = json.dumps(redis_json)
        return redis_json
    else:
        return render_template('keep.html', redis_json=redis_json)


@main.route('/onSetting', methods=['GET', 'POST'])
def setting():
    if request.method == 'POST':
        fc = str(request.get_json()['fc'])
        fradio = str(request.get_json()['fradio'])
        stockname = str(request.get_json()['stockname'])
        # setting = str(request.get_json()['setting'])
        conn = connection.MySQLConnection(host="10.120.14.18", port=3306, database='stock', user='db102stock',
                                          password='db102stock_pwd')  # docker
        mycursor = conn.cursor()
        # status = 1 表示已設定 0表示未設定
        mycursor.execute(" select status from instantprice_inf where stockname = '{}' ".format(stockname))
        myresult2 = mycursor.fetchone()[0]  # 因為回傳的是tuple型態
        if myresult2 == 0:
            mycursor.execute(" Update instantprice_inf set updown = '{}', extent = '{}', update_date = curdate(), status = 1 where stockname = '{}' ".format(fradio, fc, stockname))
            conn.commit()
            mycursor.execute(" Select status from instantprice_inf where stockname = '{}' ".format(stockname))
        # elif myresult2 == 1:
        #     mycursor.execute(" Update instantprice_inf set updown = '{}', extent = '{}', update_date = curdate(), status = 0 where stockname = '{}' ".format(fradio, fc, stockname))
        #     conn.commit()
        #     mycursor.execute(" Select status from instantprice_inf where stockname = '{}' ".format(stockname))
        myresult = mycursor.fetchone()
        conn.close()
        myresult = str(myresult[0])
        return myresult
    else:
        return render_template('keep.html')


@main.route('/deSetting', methods=['GET', 'POST'])
def de_setting():
    if request.method == 'POST':
        fc = str(request.get_json()['fc'])
        fradio = str(request.get_json()['fradio'])
        stockname = str(request.get_json()['stockname'])
        # setting = str(request.get_json()['setting'])
        conn = connection.MySQLConnection(host="10.120.14.18", port=3306, database='stock', user='db102stock',
                                          password='db102stock_pwd')  # docker
        mycursor = conn.cursor()
        # status = 1 表示已設定 0表示未設定
        mycursor.execute(" select status from instantprice_inf where stockname = '{}' ".format(stockname))
        myresult2 = mycursor.fetchone()[0]  # 因為回傳的是tuple型態
        if myresult2 == 1:
            mycursor.execute(" Update instantprice_inf set updown = '{}', extent = '{}', update_date = curdate(), status = 0, extent = '0' where stockname = '{}' ".format(fradio, fc, stockname))
            conn.commit()
            mycursor.execute(" Select status from instantprice_inf where stockname = '{}' ".format(stockname))
        myresult = mycursor.fetchone()
        conn.close()
        myresult = str(myresult[0])
        return myresult
    else:
        return render_template('keep.html')


@main.route('/onBuy', methods=['GET', 'POST'])
def buy():
    recommend_list = []
    recommend_list2 = []
    recommend_list3 = []
    recommend_json = ""
    if request.method == 'POST':
        # pred = 0且score越大越好 -> 買進
        conn = connection.MySQLConnection(host="10.120.14.18", port=3306, database='stock', user='db102stock',
                                          password='db102stock_pwd')  # docker
        mycursor = conn.cursor()
        # 9/3 預測 9/4
        mycursor.execute(" select st.name, f.code, f.pred, f.date, f.score from flask f left join stocklisted st on f.code = st.code where f.pred = 0 and f.date = '2019/9/3' order by score desc limit 5 ")
        myresult = mycursor.fetchall()
        conn.close()
        for i in myresult:
            recommend_data = {"name": i[0], "code": i[1], "pred": i[2], "date": i[3], "score": i[4]}
            recommend_list.append(recommend_data)
        recommend_list3.append(recommend_list)
        conn = connection.MySQLConnection(host="10.120.14.18", port=3306, database='stock', user='db102stock',
                                          password='db102stock_pwd')  # docker
        mycursor2 = conn.cursor()
        # 9/4 預測 9/5
        mycursor2.execute(" select st.name, f.code, f.pred, f.date, f.score from flask f left join stocklisted st on f.code = st.code where f.pred = 0 and f.date = '2019/9/4' order by score desc limit 5 ")
        myresult2 = mycursor2.fetchall()
        conn.close()
        for j in myresult2:
            recommend_data2 = {"name": j[0], "code": j[1], "pred": j[2], "date": j[3], "score": j[4]}
            recommend_list2.append(recommend_data2)
        recommend_list3.append(recommend_list2)
        recommend_json = json.dumps(recommend_list3)
        return recommend_json
    else:
        return render_template('recommend.html', recommend_json=recommend_json)


@main.route('/onSell', methods=['GET', 'POST'])
def sell():
    recommend_list = []
    recommend_list2 = []
    recommend_list3 = []
    recommend_json = ""
    if request.method == 'POST':
        # pred = 1且score越小越好 -> 賣出
        conn = connection.MySQLConnection(host="10.120.14.18", port=3306, database='stock', user='db102stock',
                                          password='db102stock_pwd')  # docker
        mycursor = conn.cursor()
        # 9/3 預測 9/4
        mycursor.execute(" select st.name, f.code, f.pred, f.date, f.score from flask f left join stocklisted st on f.code = st.code where f.pred = 1 and f.date = '2019/9/3' order by score asc limit 5 ")
        myresult = mycursor.fetchall()
        conn.close()
        for i in myresult:
            recommend_data = {"name": i[0], "code": i[1], "pred": i[2], "date": i[3], "score": i[4]}
            recommend_list.append(recommend_data)
        recommend_list3.append(recommend_list)
        conn = connection.MySQLConnection(host="10.120.14.18", port=3306, database='stock', user='db102stock',
                                          password='db102stock_pwd')  # docker
        mycursor2 = conn.cursor()
        # 9/4 預測 9/5
        mycursor2.execute(" select st.name, f.code, f.pred, f.date, f.score from flask f left join stocklisted st on f.code = st.code where f.pred = 1 and f.date = '2019/9/4' order by score asc limit 5 ")
        myresult2 = mycursor2.fetchall()
        conn.close()
        for j in myresult2:
            recommend_data2 = {"name": j[0], "code": j[1], "pred": j[2], "date": j[3], "score": j[4]}
            recommend_list2.append(recommend_data2)
        recommend_list3.append(recommend_list2)
        recommend_json = json.dumps(recommend_list3)
        return recommend_json
    else:
        return render_template('recommend.html', recommend_json=recommend_json)


@main.route('/mail', methods=['GET', 'POST'])
def mail():
    return render_template('mail.html')
