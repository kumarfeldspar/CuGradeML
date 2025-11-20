# -*- coding: utf-8 -*-
"""
Created on Wed Sep 11 16:50:07 2024

@author: Dipankar Ray
"""
import sys

import pandas as pd
#import csv
#import xlrd

######################################################
def  openfile(outfile,io,nl):
     try:
         myfile= open(outfile,io, newline=nl)
         return(myfile)
     except:    #This means that the file does not exist (or some other IOError)
         print ("Oops,  file error")
         sys.exit()
         return None
def dumpfile(X,outfile, sep, encoding):
     try:
         X.to_csv(outfile, sep=sep, encoding=encoding,mode='a')
     except:
         print("OOps, csv file write error!")
         sys.exit()
         return None
######################################################


def nnoutfile(site,model,X,fv,fv0,fv2,y,yhat,val_ratio, ids,fn0):
    #site='Rakha'
    Z= {'Site': ['x'],'Model': ['m']}
    Z=pd.DataFrame(Z)
    Z.loc[0,'Site']=site
    Z.loc[0,'Model']=str(model).split('(')[0]+'\n'+'('+str(model).split('(')[1]
    
    X = pd.DataFrame(X,columns=fv)
    X = X.astype(object)
    list_of_column_names = fv0
    X.insert(loc=len(fv),column=fv2[0], value=y)
    X.insert(loc=len(fv)+1, column=fv2[0]+"-Prd",value=yhat)
    X.insert(loc=len(fv)+2, column="Ratio",value=val_ratio )
    X.insert(loc=len(fv)+3,column=list_of_column_names[0], value=ids)
    X.describe()
    mean1=X[fv2[0]].mean()
    mean2=X[fv2[0]+"-Prd"].mean()
    lst_row_index = len(X.index)
    
    X.loc[lst_row_index,fv[len(fv)-1]]="Mean"
    X.loc[lst_row_index,fv2[0]]=mean1
    X.loc[lst_row_index,fv2[0]+"-Prd"]=mean2
    
    
    YY= pd.concat([Z,X],axis=0)
    
    outfile=fn0+"_out_1"+".csv"
    #k=X.to_csv(outfile, sep=',', encoding='utf-8',mode='a')
    myfile = openfile(outfile,'a',"")
    #myfile.write(model_name+'\n')
    
    #myfile = open(outfile,'w', newline="")
    sep=','
    encoding='utf-8'
    
    dumpfile(YY,outfile, sep, encoding)
    #X.to_csv(outfile, sep=',', encoding='utf-8')
    myfile.flush() # whenever you want, and/or
    myfile.close()
    return None

def readsetup(fn):
    sep=','
    fedf = pd.read_csv(fn,sep=sep, header=None)
    projT=fedf[fedf.loc[:,0]=='ProjectTitle'][1].tolist()[0]
    projPI=fedf[fedf.loc[:,0]=='PI'][1].tolist()[0]
    projCoPI1=fedf[fedf.loc[:,0]=='CoPI1'][1].tolist()[0]
    projCoPI2=fedf[fedf.loc[:,0]=='CoPI2'][1].tolist()[0]
    projCon=fedf[fedf.loc[:,0]=='Consultant'][1].tolist()[0]
    projP=fedf[fedf.loc[:,0]=='ProgramDir'][1].tolist()[0]
    projD=fedf[fedf.loc[:,0]=='DataBaseDir'][1].tolist()[0]
    projM=fedf[fedf.loc[:,0]=='MineName'][1].tolist()[0]
    dc ={'ProjectTitle':projT,'PI':projPI,
    'CoPI1':projCoPI1,
    'CoPI2':projCoPI2,
    'Consultant':projCon,
    'ProgramDir':projP,
    'DataBaseDir':projD,
    'MineName':projM
     }
    return(dc) #projT,projPI,projCoPI1,projCoPI2,projCon,projP,projD)
    
fn='setup.csv'
readsetup(fn)
