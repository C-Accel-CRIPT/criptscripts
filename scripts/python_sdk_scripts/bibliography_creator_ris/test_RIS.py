import pytest
from script import *

def test_set_dict_str():
    aDict={}
    set_dict_str(aDict,"issn","1476-4687","SN")
    assert aDict=={"issn":"1476-4687"}
    set_dict_str(aDict,"doi","10.1038/1781168a0","DO")
    assert aDict=={"issn":"1476-4687", "doi":"10.1038/1781168a0"}
    set_dict_str(aDict,"publisher","Stringer","PB")
    assert aDict=={"issn":"1476-4687", "doi":"10.1038/1781168a0","publisher":"Stringer"}

def test_set_dict_int():
    aDict={}
    set_dict_int(aDict,"issue","57","IS")
    assert aDict=={"issue":57}
    set_dict_int(aDict,"volume","10","VL")
    assert aDict=={"issue":57,"volume":10}

def test_page_map1():
    """Case of SP coming before EP"""
    aDict={}
    page_map(aDict,"pages","1","SP")
    assert aDict=={"pages":["1"]}
    page_map(aDict,"pages","4","EP")
    assert aDict=={"pages":["1","4"]}

def test_page_map2():
    """Case of EP coming before SP"""
    aDict={}
    page_map(aDict,"pages","4","EP")
    assert aDict=={"pages":["4"]}
    page_map(aDict,"pages","1","SP")
    assert aDict=={"pages":["1","4"]}

def test_link_map():
    """LK precedence 1"""
    aDict={}
    link_map(aDict,"website","somewebsite.com","LK")
    assert aDict=={"website":"somewebsite.com"}
    link_map(aDict,"website","someotherwebsite.com","UR")
    assert aDict=={"website":"somewebsite.com"}

def test_link_map2():
    """LK precedence 2"""
    aDict={}
    link_map(aDict,"website","someotherwebsite.com","UR")
    assert aDict=={"website":"someotherwebsite.com"}
    link_map(aDict,"website","somewebsite.com","LK")
    assert aDict=={"website":"somewebsite.com"}

def test_year_map():
    aDict={}
    year_map(aDict,"year","1976","PY")
    assert aDict=={"year":1976}
    year_map(aDict,"year","1980","Y2")
    assert aDict=={"year":1976}
    aDict={}
    year_map(aDict,"year","1980","Y2")
    assert aDict=={"year":1980}
    year_map(aDict,"year","1976","Y1")
    assert aDict=={"year":1976}

def test_author_map():
    aDict={}
    author_map(aDict,"authors","Alfred","A1")
    assert aDict=={"authors":["Alfred"]}
    author_map(aDict,"authors","Pennyworth","A2")
    assert aDict=={"authors":["Alfred","Pennyworth"]}
    author_map(aDict,"authors","Bruce","A3")
    assert aDict=={"authors":["Alfred","Pennyworth","Bruce"]}
    author_map(aDict,"authors","Wayne","A4")
    assert aDict=={"authors":["Alfred","Pennyworth","Bruce","Wayne"]}
    author_map(aDict,"authors","Richard","A4")
    assert aDict=={"authors":["Alfred","Pennyworth","Bruce","Wayne","Richard"]}
    author_map(aDict,"authors","Grayson","AU")
    assert aDict=={"authors":["Alfred","Pennyworth","Bruce","Wayne","Richard","Grayson"]}
    author_map(aDict,"authors","Tim","TA")
    assert aDict=={"authors":["Alfred","Pennyworth","Bruce","Wayne","Richard","Grayson","Tim"]}
    author_map(aDict,"authors","Drake","TA")
    assert aDict=={"authors":["Alfred","Pennyworth","Bruce","Wayne","Richard","Grayson","Tim","Drake"]}

def test_title_map():
    aDict={}
    title_map(aDict,"title","Dog","TI")
    assert aDict=={"title":"Dog"}
    title_map(aDict,"title","Perro","TT")
    assert aDict=={"title":"Dog"}
    aDict={}
    title_map(aDict,"title","Perro","TT")
    assert aDict=={"title":"Perro"}
    title_map(aDict,"title","Dog","T1")
    assert aDict=={"title":"Dog"}

def test_journal_map():
    aDict={}
    journal_map(aDict,"journal","BTJournal","BT")
    assert aDict=={"journal":"BTJournal"}
    journal_map(aDict,"journal","T2Journal","T2")
    assert aDict=={"journal":"BTJournal"}
    journal_map(aDict,"journal","J1Journal","J1")
    assert aDict=={"journal":"BTJournal"}
    journal_map(aDict,"journal","J2Journal","J2")
    assert aDict=={"journal":"BTJournal"}
    journal_map(aDict,"journal","JOJournal","JO")
    assert aDict=={"journal":"JOJournal"}
    journal_map(aDict,"journal","JAJournal","JA")
    assert aDict=={"journal":"JOJournal"}
    aDict={}
    journal_map(aDict,"journal","JAJournal","JA")
    assert aDict=={"journal":"JAJournal"}
    journal_map(aDict,"journal","JFJournal","JF")
    assert aDict=={"journal":"JFJournal"}

file1="sample1.ris.txt"
correct1A=[{"authors":["Shannon, Claude E."],"year":1948,"title":"A Mathematical Theory of Communication",
"journal":"Bell System Technical Journal","pages":["379","423"],"volume":27},{"title":"On computable numbers, with an application to the Entscheidungsproblem",
"authors":["Turing, Alan Mathison"],"journal":"Proc. of London Mathematical Society","volume":47,"issue":1,
"year":1937,"pages":["230","265"]}]
correct1B=[{"DA":"July","ref_num":1}]
file2="sample2.ris"
correct2A=[{"title":"On the Usage of History for Energy Efficient Spectrum Sensing","journal":"IEEE Communications Letters",
"pages":["407","410"],"authors":["T. S. Syed","G. A. Safdar"],"year":2015,"doi":"10.1109/LCOMM.2015.2389243","issue":3,
"issn":"1558-2558","volume":19},{"title":"Collaborative use of individual search histories","journal":"Interacting with Computers",
"pages":["184","198"],"authors":["A. Komlodi","W. G. Lutters"],"year":2008,"doi":"10.1016/j.intcom.2007.10.003",
"issue":1,"issn":"1873-7951","volume":20}]
correct2B=[]



def test_parser():
    info,omitted=for_testing_parse_bib(file1)
    assert info==correct1A
    assert omitted==correct1B
    info2,omitted2=for_testing_parse_bib(file2)
    assert info2==correct2A
    assert omitted2==correct2B








