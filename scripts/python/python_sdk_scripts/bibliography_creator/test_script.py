import pytest
from script import *
file1="sample.bib.txt"
correct1A=[{"authors":["J. G. Smith","H. K. Weston"],"title":"Nothing Particular in this Year's History","year":1954,"journal":"J. Geophys. Res.",
"volume":2,"pages":["14","15"]},{"authors":["Christopher Columbus"],"title":"How I Discovered America","year":1492,"publisher":"Hispanic Press"},
{"authors":["R. J. Green", "U. P. Fred", "W. P. Norbert"],"title":"Things that Go Bump in the Night",
"year":1900,"journal":"Psych. Today","volume":46,"pages":["345","678"]},
{"authors":["T. P. Phillips"],"title":"Possible Influence of the Magnetosphere on American History",
"year":1999,"journal": "J. Oddball Res.","volume":98,"pages":["1000","1003"]}]
correct1B=[{"address":"Barcelona","title":"How I Discovered America"}]

extra_ref={"journal":"IEEE Std 1680.1-2009","title":"Standard for Environmental Assessment of Personal Computer Products, Including Notebook Personal Computers, Desktop Personal Computers, and Personal Computer Displays",
"year":2010,"pages":["c1",33],"doi":"10.1109/IEEESTD.2009.5431217"}

file2="sample2.bib.txt"
correct2A=[{"journal":"IEEE Std 1680.1-2018 (Revision of IEEE Std 1680.1-2009)","title":"IEEE Standard for Environmental and Social Responsibility Assessment of Computers and Displays",
"year":2018,"pages":["1","121"],"doi":"10.1109/IEEESTD.2018.8320570"},{"authors":["Kurniawan", "Wijaya" ,"Ichsan", "Mochammad Hannats Hanafi"],"title":"Teaching and learning support for computer architecture and organization courses design on computer engineering and computer science for undergraduate: A review",
"year":2017,"pages":["1","6"],"doi":"10.1109/EECSI.2017.8239076"},{"authors":["Zhong Qu"],"title":"Research and practice on computer talent training of Chinese college and university",
"year":2011,"pages":["1537","1540"],"doi":"10.1109/CSSS.2011.5972156"},{"authors":["Wang", "Yan", "Wang", "Zhao", "Hu", "Xuemei", "Bai", "Tian", "Yang", "Sen", "Huang", "Lan"],
"title":"A Courses Ontology System for Computer Science Education","year":2019,"pages":["251","254"],"doi":"10.1109/CSEI47661.2019.8938930"
}]
correct2B=[{"title":"Teaching and learning support for computer architecture and organization courses design on computer engineering and computer science for undergraduate: A review",
"booktitle":"2017 4th International Conference on Electrical Engineering, Computer Science and Informatics (EECSI)"},
{"title":"Research and practice on computer talent training of Chinese college and university","booktitle":"2011 International Conference on Computer Science and Service System (CSSS)"},
{"title":"A Courses Ontology System for Computer Science Education","booktitle":"2019 IEEE International Conference on Computer Science and Educational Informatization (CSEI)"}
]

def test_parser1():
    info1,omit1=parse_bib_test(file1)
    assert info1==correct1A
    assert omit1==correct1B
    

def test_parser2():
    info2,omit2=parse_bib_test(file2)
    assert info2==correct2A
    assert omit2==correct2B
