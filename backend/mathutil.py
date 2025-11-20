# Math utility library

def str2bool(val):
    val = val.lower()
    if val in ('y', 'yes', 't', 'true', 'on', '1'):
        return 1
    elif val in ('n', 'no', 'f', 'false', 'off', '0'):
        return 0
    else:
        return 2
        #raise ValueError("invalid truth value %r" % (val,))
    
def isfloat(n):
    flagint = False
    flagfloat = False
    flagstr = False

    try:
         n=int(n)
         flagint = True
         #print("Integer",n)
    except ValueError:
         try:
            n=float(n)
            flagfloat = True
            #print("Float",n)
         except ValueError:
            try:
                
                m=str2bool(n)
                if m == 1:
                   flagbool=True
                elif m==0:
                   flagbool=False
                else:
                    int(n)
                    
            except:   
                flagstr = True
                n=str(n)
                

    return n
