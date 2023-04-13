import re
import cript
def authors_func(string):
    alist=re.split(r', | and',string)
    alist=[item.strip() for item in alist]
    return alist
#recognizable data keys for a reference node, as well as author for ease of use with BibTeX
#also includes functions for formatting information as cript expects it
accepted_types={
    "url":lambda x:x,
    "title":lambda x:x,
    "authors":authors_func,
    "author":lambda x:x,
    "journal":lambda x:x,
    "publisher":lambda x:x,
    "year":lambda x:int(x),
    "volume":lambda x:int(x),
    "issue":lambda x:int(x),
    "pages":lambda x:x.split("-"),
    "doi":lambda x:x,
    "cript_doi":lambda x:x,
    "issn":lambda x:x,
    "arxiv_id":lambda x:x,
    "pmid":lambda x:int(x),
    "website":lambda x:x
}

def parse_ref(ref,group):
    """Parses an individual reference."""
    adict={}
    omit={}
    index=ref.index("{")
    omitted=[]
    #only handles from the beginning { to the end } in a reference of form such as
    #BOOk{Title = bookTitle,
    # author= bookAuthor}
    newref=ref[index:].strip('\n')
    
    #Can split in this manner since bib citations are formatted on their own lines
    #newref=newref[1:-1].split(",\n\t")
    newref=re.split(",\n| ,\n\t",newref)
    for ix,value in enumerate(newref):
        if ix==0:
            #skips citekey info because it isn't relevant for us i believe
            continue
            #adict["citekey"]=value.strip()
        else:
            
            index2=value.index("=")
            
            key=value[:index2].strip().lower()
            val=value[index2+1:].strip()
            val=val.replace("{","").replace("}","").strip('\n')

            #Puts key,values into the dictionary according to cript specifications
            if val:
                if key in accepted_types:
                    if key=="author":
                        key="authors"
                    adict[key]=accepted_types[key](val)
                    if key=="title":
                        omit[key]=val
                else:
                    omit[key]=val
            
    #Makes sure dictionary isn't empty
    if adict:
        #reference node is created and saved, but for now just printed
        ref=cript.Reference(group,**adict)
        ref.save()
        
    
    if len(omit.keys())>1:
        omitted.append(omit)
    return omitted

def parse_bib(filename,group):
    """Function takes in the name of a .bib.txt file as an argument. File must be in the same folder as
    the script for it to function properly due to how open() works. A reference node is created for each
    reference. The function returns a list of dictionaries that contain information that was not included
    in a reference.
    input:
    -filename: str, name of a file in the same folder as script
    -group: cript group node
    outputs:
    -
    -omitted: list of dictionaries with omitted information and title to show where it was omitted from
    """
    with open(filename,"r") as f:
        lines=f.readlines()
        #Removes commented lines from document
        myFile=[line for line in lines if "%" not in line]
        #separates each individual reference in the string into a list
        file="".join(myFile).split("@")
        omitted=[]
        for ref in file:
            if ref:
                omit=parse_ref(ref,group)
                omitted.extend(omit)
        #references and things omitted from the references
        return omitted

#Following functions are for testing

def parse_ref_test(ref):
    """Parses an individual reference."""
    adict={}
    omit={}
    index=ref.index("{")
    omitted=[]
    #only handles from the beginning { to the end } in a reference of form such as
    #BOOk{Title = bookTitle,
    # author= bookAuthor}
    newref=ref[index:].strip('\n')
    
    #Can split in this manner since bib citations are formatted on their own lines
    #newref=newref[1:-1].split(",\n\t")
    newref=re.split(",\n| ,\n\t",newref)
   
    for ix,value in enumerate(newref):
        
        if ix==0:
            #skips citekey info because it isn't relevant for us i believe
            continue
            #adict["citekey"]=value.strip()
        else:
            
            index2=value.index("=")
            
            key=value[:index2].strip().lower()
            val=value[index2+1:].strip()
            
            val=val.replace("{","").replace("}","").strip('\n')
            
            #Puts key,values into the dictionary according to cript specifications
            if val:
                if key in accepted_types:
                    if key=="author":
                        key="authors"
                    adict[key]=accepted_types[key](val)
                    if key=="title":
                        omit[key]=val
                else:
                    omit[key]=val
            
        
    
    if len(omit.keys())>1:
        omitted.append(omit)
    return adict,omitted

def parse_bib_test(filename):
    """Function takes in the name of a .bib.txt file as an argument. File must be in the same folder as
    the script for it to function properly due to how open() works. A reference node is created for each
    reference. The function returns a list of dictionaries that contain information that was not included
    in a reference.
    input:
    -filename: str, name of a file in the same folder as script

    outputs:
    -
    -omitted: list of dictionaries with omitted information and title to show where it was omitted from
    """
    with open(filename,"r") as f:
        lines=f.readlines()
        #Removes commented lines from document
        myFile=[line for line in lines if "%" not in line]
        #separates each individual reference in the string into a list
        file="".join(myFile).split("@")
        references=[]
        omitted=[]
        for ref in file:
            if ref:
                
                refs,omit=parse_ref_test(ref)
                omitted.extend(omit)
                references.append(refs)
        #references and things omitted from the references
        return references,omitted




if __name__ == "__main__":
    host = input("input host: ")
    token = input("input token: ")
    api =cript.API(host,token)
    group = input("input access group: ")
    group = cript.Group(group)
    filename = input("filename: ")
    parse_bib(filename,group)

    
