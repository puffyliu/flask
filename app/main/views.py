
from flask import render_template, session, redirect, url_for, current_app, request, flash
from . import main
from ..models import db

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

@main.route('/index3', methods=['GET', 'POST'])
def index3():
    return render_template('index3.html')