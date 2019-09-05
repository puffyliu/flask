from flask import render_template, session, redirect, url_for, current_app, request, flash
from . import main
from ..models import db
from mysql.connector import connection
import redis

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
    print(111)
    stock_list = []
    if request.method == 'POST':
        # 因為input可能是中文，所以不能定為數字型態
        rev = request.get_json()['input']
        conn = connection.MySQLConnection(host="10.120.14.18", port=3306, database='stock', user='db102stock',
                                          password='db102stock_pwd')  # docker
        mycursor = conn.cursor()
        if rev.isdigit():
            mycursor.execute("SELECT t_date, name, code, p_open, p_high, p_low, p_close, volume FROM stock_inf"
                                " where code = {} order by t_date desc limit 15 ".format(rev))
        elif isinstance(rev, str):
            mycursor.execute("SELECT t_date, name, code, p_open, p_high, p_low, p_close, volume FROM stock_inf"
                             " where name = {} order by t_date desc limit 15 ".format(rev))

        myresult = mycursor.fetchall()
        conn.close()

        for i in myresult:
            stock_data = {"t_date": i[0], "name": i[1], "code": i[2], "p_open": i[3], "p_high": i[4], "p_low": i[5],
                          "p_close": i[6], "volume": i[7]}
            # print(stock_data)
            stock_list.append(stock_data)
        print(tuple(stock_list))
        return tuple(stock_list)
    else:
        return render_template('index3.html', stock_list=stock_list)

#
@main.route('/analysis', methods=['GET', 'POST'])
def analysis():
    return render_template('analysis.html')


@main.route('/recommend', methods=['GET', 'POST'])
def recommend():
    return render_template('recommend.html')

@main.route('/keep', methods=['GET', 'POST'])
def keep():
    r = redis.Redis(host='10.120.14.128', port=6379, decode_responses=True)
    test = r.hget('stock', '2317')
    print(test)

    return render_template('keep.html')


@main.route('/mail', methods=['GET', 'POST'])
def mail():
    return render_template('mail.html')
