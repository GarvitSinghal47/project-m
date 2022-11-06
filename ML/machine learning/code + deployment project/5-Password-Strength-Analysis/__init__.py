from distutils.log import debug
from flask import Flask, render_template, flash, request,redirect
from flask_sqlalchemy import SQLAlchemy
import joblib
from recommender import *

app = Flask(__name__)
app.app_context().push()
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///manager.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Manager(db.Model):

    sno=db.Column(db.Integer,primary_key=True)
    website=db.Column(db.String(200),nullable=False)
    emailid=db.Column(db.String(200),nullable=False)
    password =db.Column(db.String(500), nullable=False)
    
    def __repr__(self) -> str:
        return f"{self.sno} - {self.website}"

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


@app.route('/manage', methods=['GET', 'POST'])
def manager() :
    alldata=Manager.query.all()
    if request.method == "POST":
        website = request.form['website']
        email = request.form['email']
        password = request.form['password']
        
        manageinstance=Manager(website=website,emailid=email,password=password)
        db.session.add(manageinstance)
        db.session.commit()
        alldata = Manager.query.all()

        print(website)

        return render_template('manager.html', data=alldata,value=1)
    
    else:
        
        return render_template('manager.html',value=1,data=alldata)


@app.route('/delete/<int:sno>')
def delete(sno):
    todelete=Manager.query.filter_by(sno=sno).first()
    db.session.delete(todelete)
    db.session.commit()
    return redirect("/manage")
    

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



if __name__ == "__main__":   
    app.run(debug=True)
