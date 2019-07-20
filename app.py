import os
import json
import pandas as pd
import numpy as np
import psycopg2
import psycopg2.extras
import sys

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, MetaData, Table, select

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']  = os.environ.get('DATABASE_URL', '') or "postgresql://etl:etl@localhost/ETL"
db = SQLAlchemy(app)

#teststring = {'Key': "pk.eyJ1Ijoibm9yYWxlYmUiLCJhIjoiY2p4aGxvb2ZkMGd6ajN5cXRicDNibG82ciJ9.I70hnoEXQzfAaTYA22WJuw"}
teststring = {'Key': os.environ.get('KEY', '')}

#################################################
# Database Setup
#################################################

#conn_string = "host='localhost' dbname='ETL' user='etl' password='etl'"
conn_string = os.environ.get('DATABASE_URL', '') or "host='localhost' dbname='ETL' user='etl' password='etl'"
print ("Connecting to database\n	->%s" % (conn_string))
 

conn = psycopg2.connect(conn_string)
 
	
dict_cur = conn.cursor('cursor_unique_name', cursor_factory=psycopg2.extras.DictCursor)
dict_cur.execute('SELECT * FROM \"ETL_Table\"')
rec= dict_cur.fetchall()

print(rec[0])

	
@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/map")
def map():
   return render_template("map.html", teststring=teststring)


@app.route("/names")
def names():
   row_count =0 
   country_list=[]
   for row_count in range(len(rec)):
      country_list.append(rec[row_count][1])
      row_count += 1
   return(jsonify(country_list))

@app.route("/years")
def years():
   Year_list=["2015","2016","2017"]
   return(jsonify(Year_list))

@app.route("/metadata/<sample>")
def sample_metadata(sample):

   Fertility_rate=[]
   happines_score=[]
   country=[]

   year_temp = int(sample)

   sample_metadata = {}
   for count in range(len(rec)):
      if rec[count][7]==year_temp:
         Fertility_rate.append(rec[count][19])
         happines_score.append(rec[count][6])
         country.append(rec[count][1])

   sample_metadata={"Fertility":Fertility_rate,
          "Happines_score":happines_score,
          "Country":country}

   print(sample_metadata)
   return jsonify(sample_metadata)


@app.route("/samples/<sample>")
def samples(sample):
    """Return `otu_ids`, `otu_labels`,and `sample_values`."""
   
    count =0 
    Fertility_rate=[]
    happines_score=[]
    country=[]
    years=[]
    fert1519=[]
    fert2024=[]
    fert2529=[]
    fert3034=[]
    fert3539=[]
    fert4044=[]
    fert4549=[]
    fert_total=[]
    dict={}

    for count in range(len(rec)):
      if rec[count][1]==sample:
         Fertility_rate.append(rec[count][19])
         happines_score.append(rec[count][6])
         country.append(rec[count][1])
         years.append(rec[count][7])
         fert1519.append(rec[count][9])
         fert2024.append(rec[count][10])
         fert2529.append(rec[count][11])
         fert3034.append(rec[count][12])
         fert3539.append(rec[count][13])
         fert4044.append(rec[count][14])
         fert4549.append(rec[count][15])
         fert_total.append(sum(rec[count][9:15]))
    dict={"Fertility":Fertility_rate,
          "Happines_score":happines_score,
          "Country":country,
          "Year":years,
          "Fertility_15_19":fert1519,
          "Fertility_20_24":fert2024,
          "Fertility_25_29":fert2529,
          "Fertility_30_34":fert3034,
          "Fertility_35_39":fert3539,
          "Fertility_40_44":fert4044,
          "Fertility_45_49":fert4549,
          "Fertility_Sum":fert_total}
    return(jsonify(dict))

@app.route("/samplesforyear/<year>")
def samplesforyear(year):
    """Return `otu_ids`, `otu_labels`,and `sample_values`."""
    count1 =0 
    Fertility_rate=[]
    happines_score=[]
    country=[]
    
    dict2={}

    for count1 in range(len(rec)):
      if rec[count1][7]==int(year):
         print(rec[count1][7])
         Fertility_rate.append(rec[count1][19])
         happines_score.append(rec[count1][6])
         country.append(rec[count1][1])
      dict2={"Fertility":Fertility_rate,
          "Happines_score":happines_score,
          "Country":country}
          
    return(jsonify(dict2))

if __name__ == "__main__":
    app.run()
