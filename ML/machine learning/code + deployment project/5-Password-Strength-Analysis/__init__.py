from flask import Flask, render_template, flash, request
import joblib

app = Flask(__name__)
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

if __name__ == "__main__":
    app.run()
