# -*- coding: utf-8 -*-
"""
Created on Tue Sep  3 12:11:41 2024

@author: Dipankar Ray
"""
import os
import sys
sys.path.append('d:\Geology\library')
                            #project library d:\geology\library\mathutil.py
import dataanalysis as da
import libhull as hl
import sysutils as su


#Close the system and exit

def close_win():
    try:
        #win_param.destroy()
        sys.exit("Exiting the program.")
        return None
    except:
        print("Win not closed !!!")
        return None
    
def firstname(fn):     
        #https://favtutor.com/blogs/get-filename-from-path-python
        file_path = fn    #full path name with file name
        full_name = os.path.basename(file_path)
        file_name = os.path.splitext(full_name)
        #file_name = file_name.split(".")[0]
        #print(full_name)
        #print(file_name[0])
        return(file_name[0])
    
def full_name(fn):     
    #https://favtutor.com/blogs/get-filename-from-path-python
    file_path = fn    #full path name with file name
    full_name = os.path.basename(file_path)
    file_name = os.path.splitext(full_name)
    #print(full_name)
    #print(file_name[0])
    return(full_name)
def extname(fn):
    #https://favtutor.com/blogs/get-filename-from-path-python
    file_path = fn    #full path name with file name
    full_name = os.path.basename(file_path)
    file_name = os.path.splitext(full_name)
    #print(full_name)
    #print(file_name[0])
    return(file_name[1])

def switchstate(stateVar,item):
    
       if stateVar[item]=="normal":
           stateVar[item]="disabled"
       else:
           stateVar[item]='normal'
       return stateVar
def switch2Normal(stateVar,item):
       stateVar.update({item:'normal'})
       return stateVar
def switch2Disabled(stateVar,item):
       stateVar.update({item:"disabled"})
       return stateVar
def switch2NormalList(stateVar,items):  #HERE ITEMM IS A LIST
       for i in items:
           stateVar.update({i:'normal'})
       return stateVar
def switch2DisabledList(stateVar,items):
       for i in items:
           stateVar.update({i:'disabled'})
       return stateVar   
def stateALLNormal(stateVar):
    keys=stateVar.keys()
    for k in keys:
        stateVar.update({k:'normal  '})
    return stateVar
def stateALLDisabled(stateVar):
    keys=stateVar.keys()
    for k in keys:
        stateVar.update({k:'disabled'})
    return stateVar
def stateAppend(stateVar,keyvalDict):
    keys=keyvalDict.keys()
    values=keyvalDict.values()
    
    for k,i in zip(keys,values):
        stateVar[k]=i
        
    return stateVar

stateVar={}
x = {'gbm' : 'normal', 'rf': 'normal'}
y = {'mlr' : 'normal'}
z = switch2DisabledList(x,['gbm','rf'])
print(z)
                           
z=stateAppend(stateVar,x)
print(z)
z=stateAppend(stateVar,y)
print(z)
z=stateALLDisabled(stateVar)
print(z)
stateDisabled = {'gbm' : "disabled", 'rf': "disabled", 'mlr' : "disabled"}
stateVar = {'gbm' : "disabled", 'rf': "disabled", 'mlr' : "disabled"}
       
        
    
       