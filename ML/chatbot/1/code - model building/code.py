from statistics import mode
from jsonschema import draft201909_format_checker
import nltk
from nltk.stem import WordNetLemmatizer
import json
import pickle
import random
import numpy
import tensorflow as tf
import keras
from keras import layers
from keras.layers import Dense,activation,Dropout
from keras.optimizers import SGD
# import tensorflow._api.v2.compat.v1 as v1
from keras.models import Sequential

from sklearn.feature_selection import SequentialFeatureSelector
lemmatizer=WordNetLemmatizer()
# each word of the pattern to be trained will be added in inside the words .
words=[]

# classes is used to store the all different type of tag we have in our intents.
classes=[]

# DOCUMENT IS  used to store all the word of the intent we have with there corresponding tag releate dto there category.
documents=[]

ignore_words=['?','!',',','.']
data_file=open('intents.json').read()
intents=json.loads(data_file)

for intent in intents:
    for pattern in intent['patterns']:
        # tokkenize word
        w=nltk.word_tokenize(pattern)
        words.extend(w)
        documents.append((w,intent['tag']))

        if intent['tag'] not in classes:
            classes.append(intent['tag'])

words=[lemmatizer.lemmatize(w.lower()) for w in words if w not in ignore_words]

words=list(set(words))
classes=list(set(classes))


pickle.dump(words,open('words.pkl','wb'))
pickle.dump(classes,open('classes.pkl','wb'))


training=[]
output_empty=[0]*len(classes)

for doc in documents:
    bag=[]
    pattern_words=doc[0]
    pattern_words=[lemmatizer.lemmatize(word.lower()) for word in pattern_words]

    for w in words:
        bag.append(1) if w in pattern_words else bag.append(0)

    output_row=list(output_empty)
    output_row[classes.index(doc[1])]=1


    training.append([bag,output_row])

random.shuffle(training)
training=numpy.array(training)


trainx=list(training[:,0])
trainy=list(training[:,1])


model=Sequential() 
model.add(Dense(128,input_shape=(len(trainx[0]),),activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(64,activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(len(trainy[0]),activation='softmax'))


sgd=SGD(lr=0.1,decay=1e-6,momentum=0.9,nesterov=True)
model.compile(loss='categorical_crossentropy',optimizer=sgd,metrics=['accuracy'])


mfit=model.fit(numpy.array(trainx),numpy.array(trainy),epochs=200,batch_size=5,verbose=1)

model.save('chatbot.h5',mfit)
