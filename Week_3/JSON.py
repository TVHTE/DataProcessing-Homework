# Toon van Holthe tot Echten
# 10798595
# JSON and csv formatter

"""
Convert txt files to JSON
"""

import json
import csv

# define headers raw data
header = '#'
raw_data = open("KNMI_20111101_NEERSLAG.txt", 'r')
ITEM_1 = 1
ITEM_2 = 2

# in_txt = csv.reader(open("KNMI_20161112.txt", "rb"), delimiter = ',')


def reformat_txt(raw_data):

    tmp_data = []

    with raw_data as in_file:
        for line in raw_data:
            if line[0] != header:
                tmp_data.append(line.strip().split(','))

        list_dict = []
        data_dict = dict()
        list_date = []
        list_temp = []

        for line in tmp_data:
            list_dict.append({'date':int(line[ITEM_1]),'neer':int(line[ITEM_2].strip())})
            list_date.append(line[ITEM_1])
            list_temp.append(line[ITEM_2].strip())

        data_dict['date'] = list_date
        data_dict['temp'] = list_temp

        print(list_dict)

        json_data = json.dumps(list_dict)
        j = json.loads(json_data)

        with open('json_data_1.json', 'w') as outfile:
            json.dump(j, outfile)

        with open('csv_data_2.csv', 'w') as out_file:
            writer = csv.writer(out_file)
            writer.writerow(('date', 'neer'))
            writer.writerows(tmp_data)


reformat_txt(raw_data)
