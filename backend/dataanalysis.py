# DATA ANALYSIS LIBRARY
#https://careerfoundry.com/en/blog/data-analytics/how-to-find-outliers/
# FIND OUTLIERS
#create a function to find outliers using IQR

import scipy as sp
import numpy as np

def find_outliers_IQR(df,out_feature_var):

   q1=df[out_feature_var].quantile(0.25)

   q3=df[out_feature_var].quantile(0.75)

   IQR=q3-q1

   outliers = df[((df[out_feature_var]<(q1-1.5*IQR)) | (df[out_feature_var]>(q3+1.5*IQR)))]

   return outliers

#  DROP OUTLIERS
def drop_outliers_IQR(df,out_feature_var):

   q1=df[out_feature_var].quantile(0.25)

   q3=df[out_feature_var].quantile(0.75)

   IQR=q3-q1

   not_outliers = df[~((df[out_feature_var]<(q1-1.5*IQR)) | (df[out_feature_var]>(q3+1.5*IQR)))]

   outliers_dropped = not_outliers.dropna().reset_index()

   return outliers_dropped



def rsquared(X, Y): #arrays
     slope, intercept, r_value, p_value, std_err = sp.stats.linregress(np.ravel(X),np.ravel(Y))
     return r_value**2

#np.random.seed(111)
#X = np.random.uniform(0,1,(50,1))
#Y = np.random.uniform(0,1,(50,1))
#print(rsquared(X,Y))
 