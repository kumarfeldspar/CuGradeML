import os
import sys
import io
import pandas as pd
import numpy as np
import xlrd


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


import seaborn as sns 
 

from sklearn.metrics import mean_squared_error, mean_absolute_error 
from sklearn import preprocessing

    


def gbmTP2(fn,t1,t2,z,cu):
    print('file name', fn, 'T1=', t1, 'T2=', t2)
    fedf = pd.read_csv(fn)
    fedf.drop('Sl.No.', inplace=True, axis=1) 
    #fedf = fedf.loc[:,['X-COR','Y-COR','ACCUM']]
    fedf.head()
    # creating feature variables 
    X = fedf.drop('ACCUM', axis=1) 
    y = fedf['ACCUM'] 
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

    params = {'n_estimators' : 30, 'max_depth' : 30, 'loss' : 'ls','learning_rate' : 0.2 , 'criterion' : 'friedman_mse'} # ceiterion : {'squared_error', 'friedman_mse'}
    model = GradientBoostingRegressor(**params)
    model.fit(X, y)

    mse = mean_squared_error(y, model.predict(X))
    #print("Pos 4")
    #print("3. The mean squared error (MSE) on test set: {:.4f}".format(mse))


    # make a single prediction
    #row = [[2.02220122, 0.31563495, 0.82797464, -0.30620401, 0.16003707, -1.44411381, 0.87616892, -0.50446586, 0.23009474, 0.76201118]]
    row = [[180.027,	-779.765, 820.72,	7.35,	7.07]]  # Ans: 55.57
    row = [[180.027,	-779.765, 817.72, 	9.58,	8.07]]  # Ans: 52.77
    row = [[60.33,	-779.817, 817.13,		1.42,	1.89]]  #Ans: 67.29
    row = [[64,	155,774.55,		29.8,	1.99]]          #Ans: 	47.27
    row = [[64,	155,783.55,		8.08,	1.32]]          #3216 Ans: 	63.07
    row = [[8,	416,849.5,		1.86, 1.42]]          #B2 Ans: 	64.53
    row = [[-2179.82,-236.39,875.02,2.02,1.19]]          #12 C Ans: 	66.6
    row = [[180,-779.765]]   #11 47.19
    #row = [[60.33,-779.817]] #16 68.17
    row =[[119,-596]]  #54.36261
    row =[[t1,t2,z,cu]]
    yhat = model.predict(row)
    print('Gradient Booster Model for',t1,t2)
    result = f'%.3f' % yhat[0]
    #Note: Your results may vary given the stochastic nature of the algorithm or evaluation 
    return result
