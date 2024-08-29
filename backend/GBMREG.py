import os
import sys
import io
import pandas as pd
import numpy as np
import xlrd
import matplotlib

from numpy import mean
from numpy import std
from sklearn.datasets import make_regression
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import cross_val_score
from sklearn.model_selection import RepeatedKFold
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from matplotlib import pyplot as plt

matplotlib.use('agg')  # Use non-GUI backend

# importing modules and packages 
#    import pandas as pd 
#    import numpy as np 
#    import matplotlib.pyplot as plt 
import seaborn as sns 
#    from sklearn.model_selection import train_test_split 
from sklearn.linear_model import LinearRegression 
from sklearn.metrics import mean_squared_error, mean_absolute_error 
from sklearn import preprocessing

import pickle

#from dtreeviz.trees import * 
import tempfile 


#Rakha 
def gbmRakha(fn,selectedInputHeaders, selectedOutputHeaders, n_estimators, max_depth, loss, criterion, learning_rate):
    
    fedf = pd.read_csv(fn)
    #fedf = pd.read_excel(fn, sheet="singbhum")
    #print(type(fedf))
    #fedf.drop('Sl.No.', inplace=True, axis=1)
    # drop rows with all zeros
    

    fedf = fedf.loc[(fedf!=0).any(axis=1)]
    fedf = fedf[(fedf[['GRADE']] != 0).all(axis=1)]
    #fedf = fedf.loc[:,['X','Y','Z','Lithology_code','MOC_code','Structure_code','GRADE']]
    #fedf.head()
    #sys.exit()
    # creating feature variables 

    selectedInputHeaders = [s.strip() for s in selectedInputHeaders]
    selectedOutputHeaders = [s.strip() for s in selectedOutputHeaders]

    X = fedf.loc[:,selectedInputHeaders]
    if 'GRADE' in X.columns:
        X.drop('GRADE', axis=1, inplace=True)
   
    y = fedf['GRADE']
    #y = fedf.loc[:,selectedOutputHeaders]
                   
    #print(fedf.loc[1:2,['X','Y']])
    #X = fedf.loc[:,['X-COR','Y-COR']]
    X = X.to_numpy()
    #y = fedf.loc[:,['ACCUM']]
    y = y.to_numpy()
    #y = np.squeeze(y ,axis=(1,))
    #print("Pos 1")
    # gradient boosting for regression in scikit-learn
    
    # define dataset
    #X, y = make_regression(n_samples=1000, n_features=10, n_informative=5, random_state=1)
    # evaluate the model
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=13)
    #params = {'n_estimators' : 30, 'max_depth' : 10, 'loss' : 'ls','learning_rate' : 0.2 , 'criterion' : 'mae'}
    params = {'n_estimators' : 30, 'max_depth' : 10, 'loss' : 'quantile','learning_rate' : 0.2 , 'criterion' : 'friedman_mse'}  # criterion:{'squared_error', 'friedman_mse'}, loss:=  {'squared_error', 'quantile', 'huber', 'absolute_error'}.
    #print("Pos 2")
    model = GradientBoostingRegressor(**params) #loss='ls',learning_rate=0.2,criterion='mae')
    #print("Pos 3")
    cv = RepeatedKFold(n_splits=10, n_repeats=3, random_state=1)
    #print(type(cv))
    #print("Pos 4",cv)
    #n_scores = cross_val_score(model, X_train, y_train, scoring='neg_mean_absolute_error', cv=cv, n_jobs=-1, error_score='raise')
    #https://stackoverflow.com/questions/35876508/evaluate-multiple-scores-on-sklearn-cross-val-score
    n_scores = cross_val_score(model, X, y, scoring='neg_mean_absolute_error', cv=cv, n_jobs=-1, error_score='raise')
    #n_scores = cross_val_score(model, X, y, scoring='neg_mean_absolute_error', cv=10, n_jobs=-1, error_score='raise')
    #print("Pos 5")
    #print('2. MAE: %.3f (%.3f)' % (mean(n_scores), std(n_scores)))
    #print("Pos 6")

    # fit the model on the whole dataset
    # loss: {'squared_error', 'absolute_error', 'huber', 'quantile'}

    params = {'n_estimators' : 30, 'max_depth' : 30, 'loss' :'huber' ,'learning_rate' : 0.2 , 'criterion' : 'friedman_mse'} # ceiterion : {'squared_error', 'friedman_mse'}
    params = {'n_estimators' : 30, 'max_depth' : 30, 'loss' :'ls' ,'learning_rate' : 0.5 , 'criterion' : 'friedman_mse'} # ceiterion : {'squared_error', 'friedman_mse'}
    params = {'n_estimators' : int(n_estimators), 'max_depth' : int(max_depth), 'loss' :loss ,'learning_rate' : float(learning_rate) , 'criterion' : criterion} # ceiterion : {'squared_error', 'friedman_mse'}
    model = GradientBoostingRegressor(**params)
    model.fit(X, y)

    # save the model 
    filename = 'linear_model.sav'
    pickle.dump(model, open(filename, 'wb'))
                

    

    mse = mean_squared_error(y, model.predict(X))
    print(mse)
    predictions=model.predict(X)
    plt.scatter(y,predictions)
    #plt.show()

    temp_file = tempfile.NamedTemporaryFile(suffix='.png', delete= False)
    plt.savefig(temp_file)
    temp_file.close()
    return temp_file.name

    #temp_fd, temp_file = tempfile.mkstemp(suffix='.png')
    #os.close(temp_fd)
    #plt.savefig(temp_file)
    #return temp_file
    #print("3. The mean squared error (MSE) on test set: {:.4f}".format(mse))

def gbmRakhaTest(fn,t1,t2,t3,t4,t5,t6,selectedInputHeaders, selectedOutputHeaders ):

    #print("gbmRakhaTest  Model xyz: ", model)

    # load the model
    filename = 'linear_model.sav'
    model = pickle.load(open(filename, 'rb'))
    
    #row =[[t1,t2,t3,t4,t5,t6]]
    #yhat = model.predict(row)

    
    
    print('Gradient Booster Model for (Rakha)',t1,t2,t3,t4,t5,t6)
    #print('4. Rakha - Prediction: %.3f' % yhat[0])

    #fn0='d:\project\Geology\data\RAKHA\RAKHA_CODED_MAIN_DATA_TRAIL'
    #fn=fn0+".csv"
    
    fedf = pd.read_csv(fn)
    fedf = fedf.loc[(fedf!=0).any(axis=1)]
    fedf = fedf[(fedf[['GRADE']] != 0).all(axis=1)]
    #fedf = fedf.loc[:,['X','Y','Z','Lithology_code','MOC_code','Structure_code','GRADE']]
    #fedf.head()
    #sys.exit()

    selectedInputHeaders = [s.strip() for s in selectedInputHeaders]
    selectedOutputHeaders = [s.strip() for s in selectedOutputHeaders]
    print("selectedinput header = ", selectedInputHeaders)
    print("selected output header = ", selectedOutputHeaders)
    # creating feature variables 
    X = fedf.loc[:,selectedInputHeaders]
    if 'GRADE' in X.columns:
        X.drop('GRADE', axis=1, inplace=True)
   
    y = fedf['GRADE']
    print(X)
    #print(type(row))
    print(type(X))
    X = X[:].values
    y = y[:].values
    yhat = model.predict(X)
    #yhat = np.round(yhat,2)
    print('Gradient Booster Model for Rakha')
    if 'GRADE' in selectedInputHeaders:
        selectedInputHeaders.remove('GRADE')
    X = pd.DataFrame(X,columns=selectedInputHeaders)
    
    X.insert(loc=X.shape[1],column="Grade 2", value=y)
    X.insert(loc=X.shape[1], column="PGrade 2",value=yhat)
    #outfile=fn0+"_out"+".csv"
    # temp_file = tempfile.NamedTemporaryFile(suffix='.csv', delete=False)
    # X.to_csv(temp_file, sep=',', encoding='utf-8')
    #print('4. Prediction(RAKHA): %.3f' % yhat)
    print("Test Data 2:", X)
    return X.to_csv(sep=',', encoding='utf-8')
    # print(type(temp_file))
    # return temp_file
    #print(y, yhat)
    #Note: Your results may vary given the stochastic nature of the algorithm or evaluation 

####################################################################################################
####################################################################################################
"""
    
fn="D:\project\Geology\data\mgb.csv"
t1=119
t2=-554
gbm_1(fn,t1,t2)


fn = r'd:\project\Geology\data\T1_2.csv'



t1 = 7596.16
t2= 11352.9 #24 5.39
gbmTP(fn,t1,t2)


fn = r'd:\project\Geology\data\CODED_MAIN_DATA.csv'
t1 = 86
t2 = 22.7 #24 5.39
t3 = 8
t4 = 11
t5 = 17
t6 = 12
t7 = 16
t8 = 7
cu = 1.57
mlr(fn,t1,t2,t3,t4,t5,t6,t7,t8,cu)


fn = r'd:\project\Geology\data\CODED_MAIN_DATA.csv'



t1 = 86
t2 = 22.7 #24 5.39
t3 = 8
t4 = 11
t5 = 17
t6 = 12
t7 = 16
t8 = 7
cu = 1.57
rf(fn,t1,t2,t3,t4,t5,t6,t7,t8,cu)

fn = r'd:\project\Geology\data\CODED_MAIN_DATA.csv'
t1 = 86 #Line no 31
t2 = 22.7 #24 5.39
t3 = 8
t4 = 11
t5 = 17.85
t6 = 12
t7 = 16
t8 = 7
cu = 1.57

#gbmTP2(fn,t1,t2,z,cu)

fn = r'd:\project\Geology\data\CODED_MAIN_DATA.csv'
t1 = 86
t2 = 22.7 #24 5.39
t3 = 8
t4 = 11
t5 = 17
t6 = 12
t7 = 16
t8 = 7
cu = 1.57
lesso(fn,t1,t2,t3,t4,t5,t6,t7,t8,cu)

#Sarda 
fn = r'D:\project\Geology\data\CODED_MAIN_DATA.csv'
t1 = 86
t2 = 22.7 #24 5.39
#t3 = 8
#t4 = 11
#t5 = 17
t6 = 12
t7 = 16
t8 = 7
cu = 1.57


gbmTP3(fn,t1,t2,t6,t7,t8,cu)
"""
"""
#RAKHA

fn = r'D:\project\Geology\data\Rakha\RAKHA_DATABASE_NUMERIC_CODES.csv'
#25 MRCB21	457.5	456	9892.497253	11159.78631	-291.51775	2	8	1	0.01

t1 = 9892.497253
t2 = 11159.78631
t3 = -291.51775
t4 = 2
t5 = 8
t6 = 1
cu = 0.01


gbmRakha(fn,t1,t2,t3,t4,t5,t6,cu)
"""
#RAKHA 2
"""
fn = r'D:\project\Geology\data\Rakha\RAKHA_DATABASE_NUMERIC_CODES.csv'
#25 MRCB21	457.5	456	9892.497253	11159.78631	-291.51775	2	8	1	0.01

t1 = 9892.497253
t2 = 11159.78631
t3 = -291.51775
t4 = 2
t5 = 8
t6 = 1
cu = 0.01


gbmRakha2(fn,t1,t2,t3,t4,t5,t6,cu)

 

fn = r'D:\project\Geology\data\CODED_MAIN_DATA.csv'
t1 = 86
t2 = 22.7 #24 5.39
t3 = 8
t4 = 11
t5 = 17
t6 = 12
t7 = 16
t8 = 7
cu = 1.57
"""
#nonlinear_regression (fn,t1,t2,t3,t4,t5,t6,t7,t8,cu)

#pyinstaller --onefile --nowindow  GBMREG_6_2.py --distpath .

#https://stackoverflow.com/questions/47390514/running-sk-learn-model-predict-with-python-multiprocessing
#https://stackoverflow.com/questions/64746594/using-pyinstaller-to-compile-pickled-sklearn-model-to-exe-file-without-import-sk
#https://stackoverflow.com/questions/71215713/python-multiprocessing-code-running-infinitely
