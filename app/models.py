from flask_login import UserMixin, AnonymousUserMixin
from . import db
from . import login_manager
from werkzeug.security import generate_password_hash, check_password_hash
from mysql.connector import connection

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True, index=True)
    username = db.Column(db.String(64), index=True)
    password_hash = db.Column(db.String(128))
    confirmed = db.Column(db.Boolean, default=False)
    thumbernail = db.Column(db.String(128), default=None, unique=True)

    def insert_data(self, i, e, u, p, c, t):
        conn = connection.MySQLConnection(host="10.120.14.18", port=3306, database='member_inf', user='db102stock',
                                          password='db102stock_pwd')
        mycursor = conn.cursor()
        mycursor.execute("Insert into member_inf (id, email, username, password_hash, confirmed, thumbernail) values "
                         "({}, {}, {}, {}, {}, {}) ".format(i, e, u, p, c, t))
        print(mycursor)
        myresult = mycursor.fetchone()
        conn.close()

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_administrator(self):
        return True

    def __repr__(self):
        return '<User %r>' % self.username


class AnonymousUser(AnonymousUserMixin):

    def is_administrator(self):
        return False

login_manager.anonymous_user = AnonymousUser
login_manager.session_protection = "basic"

