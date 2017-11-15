# Toon van Holthe tot Echten
# 10798595
# JSON and csv formatter

import json
import csv

# define headers raw data
header = '#'
raw_data = open("KNMI_20161112.txt", 'r')
# in_txt = csv.reader(open("KNMI_20161112.txt", "rb"), delimiter = ',')


def reformat_csv(raw_data):

    tmp_data = []
    dict_data = {'date':'','temp':''}

    with raw_data as in_file:
        for line in raw_data:
            if line[0] != header:
                tmp_data.append(line.strip().split(','))

        list = []
        data_dict = dict()
        list_date = []
        list_temp = []
        for line in tmp_data:
            # list.extend([(line[1],line[2].strip())])
            list_date.append(line[1])
            list_temp.append(line[2].strip())
            # dict.append({'date':line[1],'temp':line[2].strip()})
            # dict_data['date'] = line[1]
            # dict_data['temp'] = line[2].strip()
        data_dict['date'] = list_date
        data_dict['temp'] = list_temp

        print(list)
        print(data_dict)

        with open('json_data_2', 'wb') as outfile:
            json.dumps(data_dict)

        with open('csv_data_2.csv', 'w') as out_file:
            writer = csv.writer(out_file)
            writer.writerow(('date', 'temp'))
            writer.writerows(tmp_data)

# open new file to write json and csv data

# def reformat_json(raw_data):
#
#     json_data = open('json_data.json', 'w')
#     date = []
#     temp = []
#     fieldnames = ['date', 'temp']
#     writer = csv.writer(json_data)
#
#     # get data to jsonnify
#     with open('json_data.json', 'w') as tmp_data:
#         for line in raw_data:
#             if line[0] != header:
#                 # line_split = line.split(',', 365)
#                 writer.write(line)
#                 # writer.write('\n')
#
#     json_data.close()
# with open('names.csv', 'w') as csvfile:
#     fieldnames = ['first_name', 'last_name']
#     writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
#
#     writer.writeheader()
#     writer.writerow({'first_name': 'Baked', 'last_name': 'Beans'})
#     writer.writerow({'first_name': 'Lovely', 'last_name': 'Spam'})
#     writer.writerow({'first_name': 'Wonderful', 'last_name': 'Spam'})

reformat_csv(raw_data)
