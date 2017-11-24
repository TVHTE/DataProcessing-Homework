# Toon van Holthe tot Echten
# 10798595
# JSON and csv formatter

"""
Convert txt files to JSON
"""

import json
import csv
import pandas as pd

# define headers raw data
header = '#'

ITEM_1 = open("CO2.csv", 'r')
ITEM_2 = open("cereal.csv", 'r')
ITEM_3 = open("class_2.csv",'r')
ITEM_4 = open("agri.csv",'r')

# panda_csv = pd.read_csv('CO2.csv', header=5, engine='python', usecols=([0,3,44]), names=['Country','Indicator Code','2000'])
panda_csv_ITEM_1 = pd.read_csv(ITEM_1, header=5, engine='python', usecols=([0,3,44]), names=['Country','Indicator Code','2000'])
panda_csv_ITEM_2 = pd.read_csv(ITEM_2, header=5, engine='python', usecols=([0,3,44]), names=['Country','Indicator Code','2000'])
panda_csv_ITEM_3 = pd.read_csv(ITEM_3, header=0, engine='python', usecols=([2]), skiprows=[10,11], names=['class'])
panda_csv_ITEM_4 = pd.read_csv(ITEM_4, header=5, engine='python', usecols=([44]), names=['agri'])

# print(panda_csv)
ITEM_1_json = json.loads(panda_csv_ITEM_1.to_json(orient='records'))
ITEM_2_json = json.loads(panda_csv_ITEM_2.to_json(orient='records'))
ITEM_3_json = json.loads(panda_csv_ITEM_3.to_json(orient='records'))
ITEM_4_json = json.loads(panda_csv_ITEM_4.to_json(orient='records'))

print(ITEM_4_json)

DATA = []
for element in ITEM_1_json:
    DATA.append({'CO2_emi':element['2000'],
                'Country':element['Country']})

DATA_cereal = []
for element in ITEM_2_json:
    DATA_cereal.append(element['2000'])

DATA_class = []
for element in ITEM_3_json:
    DATA_class.append(element['class'])

DATA_agri = []
for element in ITEM_4_json:
    DATA_agri.append(element['agri'])


for i in range(len(DATA)):
    DATA[i]['cereal'] = DATA_cereal[i]
    DATA[i]['class'] =  DATA_class[i]
    DATA[i]['agri'] =  DATA_agri[i]


for element in DATA:
    if element['CO2_emi'] == None:
        element['CO2_emi'] = 0
    if element['class'] == None:
        DATA.remove(element)
    if element['CO2_emi'] > 30:
        print(element)
        DATA.remove(element)

with open('CO2_data.json', 'w') as outfile:
    json.dump(ITEM_1_json, outfile)

with open('cereal_data.json', 'w') as outfile:
    json.dump(ITEM_2_json, outfile)

with open('DATA.json', 'w') as outfile:
    json.dump(DATA, outfile)
