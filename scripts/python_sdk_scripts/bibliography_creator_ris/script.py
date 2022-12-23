
import cript
def set_dict_str(dictionary,key,value,ogkey):
    """Puts information into dictionary as the string it is"""
    dictionary[key]=value
def set_dict_int(dictionary,key,value,ogkey):
    """Puts information into dictionary but changes value type to int """
    dictionary[key]=int(value)

def page_map(dictionary,key,value,ogkey):
    """Places start page and end page into the list. Doesn't matter if SP is noted before EP"""
    if key in dictionary:
        if ogkey=="SP":
            dictionary[key]=[value]+dictionary[key]
        else:
            dictionary[key].append(value)
    else:
        dictionary[key]=[value]
def year_map(dictionary,key,value,ogkey):
    """Uses publication year or primary publication year as the year, if not available the secondary
    publication year is used."""
    if key in dictionary:
        if ogkey=="PY" or ogkey=="Y1":
            try:
                dictionary[key]=int(value)
            except ValueError:
                pass
    else:
        dictionary[key]=int(value)

def author_map(dictionary,key,value,ogkey):
    """Creates a list of authors if no list is present, if there is a list started authors are added to the list."""
    if key in dictionary:
        dictionary[key].append(value)
    else:
        dictionary[key]=[value]

def title_map(dictionary,key,value,ogkey):
    """Primary Title or Title is used for the title entry in cript database while other forms of title
    entry are omitted or used in a different appropriate fashion. Translated Title is used only if
    the Primary Title or Title has not been used"""
    if key in dictionary:
        if ogkey=="TI" or ogkey=="T1":
            dictionary[key]=value
    else:
        dictionary[key]=value

def link_map(dictionary,key,value,ogkey):
    """LK gets precedence over UR"""
    if key in dictionary:
        if ogkey=="UR":
            pass
        else:
            dictionary[key]=value
    else:
        dictionary[key]=value

def journal_map(dictionary,key,value,ogkey):
    """JO and JF take first precedence, then BT, T2, J1, JA and J2"""
    if key in dictionary:
        if ogkey=="JO" or ogkey=="JF":
            dictionary[key]=value
    else:
        dictionary[key]=value

type_map={
    "SN": ("issn",set_dict_str),
    "PB":("publisher",set_dict_str),
    "DO":("doi",set_dict_str),
    "IS":("issue",set_dict_int),
    "VO":("volume",set_dict_int),
    "VL":("volume",set_dict_int),
    "SP":("pages",page_map),
    "EP":("pages",page_map),
    "LK":("website",link_map),
    "UR":("website",link_map),
    "PY":("year",year_map),
    "Y1":("year",year_map),
    "Y2": ("year",year_map),
    "A1":("authors",author_map),
    "A2":("authors",author_map),
    "A3":("authors",author_map),
    "A4":("authors",author_map),
    "AU":("authors",author_map),
    "TA":("authors",author_map),
    "T1":("title",title_map),
    "TI":("title",title_map),
    "TT":("title",title_map),
    "JO":("journal",journal_map),
    "JF": ("journal",journal_map),
    "BT": ("journal",journal_map),
    "T2":("journal",journal_map),
    "J1": ("journal",journal_map),
    "JA":("journal",journal_map),
    "J2":("journal",journal_map)
}


def parse_bib(filename,group):
    """Parses a RIS bibliography.
    inputs:
    -filename: str, name of file
    -group: cript group node
    -api: cript api connection
    outputs:
    -omitted: list of dictionaries of omitted information"""
    with open(filename, "r") as f:
        ref_num=1
        omitted=[]
        while (line:=f.readline()):
            #starts a new reference since "TY" is always the start of a reference
            if line.startswith("TY"):
                
                infoDict={}
                omit={"ref_num":ref_num}
                #collects information until "ER" since that denotes end of reference
                while not (line:=f.readline()).startswith("ER"):
                    #tidying up information from the line that is being processed
                    line=line.strip()
                    ix=line.index("-")
                    key=line[:ix].strip()
                    value=line[ix+1:].strip()
                    
                    #Places information into dictionary
                    if key in type_map:
                        valid,func=type_map[key]
                        func(infoDict,valid,value,key)
                    else:
                        omit[key]=value

                    
                       
                ref_num+=1
                #makes a new reference node and saves it to the database given collected info
                ref=cript.Reference(group,**infoDict)
                ref.save()
                
                #adds omit dictionary to list of omitted information, if information from original
                #citation was ommitted
                if len(omit.keys())>1:
                    omitted.append(omit)

            else:
                
                continue
        #returns all omitted information for user to see
        return omitted
def for_testing_parse_bib(filename):
    with open(filename, "r") as f:
        ref_num=1
        omitted=[]
        info=[]
        while (line:=f.readline()):
            #starts a new reference since "TY" is always the start of a reference
            if line.startswith("TY"):
                
                infoDict={}
                omit={"ref_num":ref_num}
                #collects information until "ER" since that denotes end of reference
                while not (line:=f.readline()).startswith("ER"):
                    #tidying up information from the line that is being processed
                    line=line.strip()
                    ix=line.index("-")
                    key=line[:ix].strip()
                    value=line[ix+1:].strip()
                    
                    #Places information into dictionary
                    if key in type_map:
                        valid,func=type_map[key]
                        func(infoDict,valid,value,key)
                    else:
                        omit[key]=value

                    
                       
                ref_num+=1
                #adds infoDict to list of infoDicts
                info.append(infoDict)
                
                #adds omit dictionary to list of omitted information, if information from original
                #citation was ommitted
                if len(omit.keys())>1:
                    omitted.append(omit)

            else:
                
                continue
        #returns all omitted information for user to see
        return info,omitted

if __name__ == "__main__":
    host = input("input host: ")
    token = input("input token: ")
    api =cript.API(host,token)
    group = input("input access group: ")
    group = cript.Group(group)
    filename = input("filename: ")
    parse_bib(filename,group)
    pass
    

