from distutils.log import debug
from flask import Flask, render_template, flash, request,redirect,session
from flask_sqlalchemy import SQLAlchemy
import joblib
from extensions import db,login_manager
from model import User,Manager
from recommender import *
from flask_login import login_required


def create_app():
    app = Flask(__name__)

    app.secret_key = "super secret key"
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///manager.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    # db = SQLAlchemy(app)
    db.init_app(app)
    # For managing sessions during login
    login_manager.init_app(app)
    from auth import auth

    app.register_blueprint(auth)




    @login_manager.user_loader
    def load_user(user_id):
        # using the user id as primary key as id for session
        return User.query.get(int(user_id))

    # Load the algorithm models
    DecisionTree_Model = joblib.load('model/DecisionTree_Model.joblib')
    LogisticRegression_Model = joblib.load('model/LogisticRegression_Model.joblib')
    NaiveBayes_Model = joblib.load('model/NaiveBayes_Model.joblib')
    RandomForest_Model = joblib.load('model/RandomForest_Model.joblib')
    NeuralNetwork_Model = joblib.load('model/NeuralNetwork_Model.joblib')

    @app.route('/')
    def homepage():
        return render_template('index.html')


    @app.route('/main/', methods=['GET', 'POST'])
    def mainpage():
        if request.method == "POST":
            enteredPassword = request.form['password']
        else:
            return render_template('index.html')


        
        Password = [enteredPassword]

        # Predict the strength
        DecisionTree_Test = DecisionTree_Model.predict(Password)
        LogisticRegression_Test = LogisticRegression_Model.predict(Password)
        NaiveBayes_Test = NaiveBayes_Model.predict(Password)
        RandomForest_Test = RandomForest_Model.predict(Password)
        NeuralNetwork_Test = NeuralNetwork_Model.predict(Password)
        

        return render_template("main.html", DecisionTree=DecisionTree_Test,
                                            LogReg=LogisticRegression_Test, 
                                            NaiveBayes=NaiveBayes_Test,
                                            RandomForest=RandomForest_Test,
                                            NeuralNetwork=NeuralNetwork_Test
                                            )



    @app.route('/recommend', methods=['GET', 'POST'])
    def recommend():
        if request.method == "POST":
            passwordlength = int(request.form['passwordlength'])
            alphabetcount = int(request.form['alphabetcount'])
            numbercount = int(request.form['digitcount'])
            specialcharcount=int(request.form['specialcharcount'])

            # invoking the function
            data, passwordlist =generate_random_password(passwordlength,alphabetcount,numbercount,specialcharcount)
            
            

            return render_template('recommend.html',data=data,passwordlist=passwordlist)
        
        else:
            return render_template('recommend.html')


    @login_required
    @app.route('/manage', methods=['GET', 'POST'])
    def manager() :
        email = session['user']
        alldata = Manager.query.filter_by(emailid=email).all()

        if request.method == "POST":
            website = request.form['website']
            email = request.form['email']
            password = request.form['password']
            
            manageinstance=Manager(website=website,emailid=email,password=password)
            db.session.add(manageinstance)
            db.session.commit()
            email = session['user']
            alldata = Manager.query.filter_by(emailid=email).all()

            print(website)

            return render_template('manager.html', data=alldata,value=1)
        
        else:
            
            return render_template('manager.html',value=1,data=alldata)

    @login_required
    @app.route('/delete/<int:sno>')
    def delete(sno):
        todelete=Manager.query.filter_by(sno=sno).first()
        db.session.delete(todelete)
        db.session.commit()
        return redirect("/manage")
        

    @login_required
    @app.route('/update/<int:sno>', methods=['GET', 'POST'])
    def update(sno):
        if request.method == "POST":
            website = request.form["website"]
            email = request.form['email']
            password = request.form['password']
            toupdate = Manager.query.filter_by(sno=sno).first()
            toupdate.website=website
            toupdate.emailid=email
            toupdate.password=password
            
            db.session.add(toupdate)
            db.session.commit()
            return redirect("/manage")


        toupdate = Manager.query.filter_by(sno=sno).first()
        return render_template('update.html',toupdate=toupdate)
    return app

if __name__ == "__main__":
    app=create_app()
    app.app_context().push()

    app.run(debug=True)

