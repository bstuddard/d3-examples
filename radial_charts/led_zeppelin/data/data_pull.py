# -*- coding: utf-8 -*-
"""
Created on Sat Jan 11 14:06:44 2020

@author: barre
"""

import requests
from bs4 import BeautifulSoup
import json
import pandas as pd

BASE_URL = 'https://www.ledzeppelin.com/shows/all'
NUM_PAGES = 21

def get_html(url):
    '''
    Retrieve html text given a URL string.
    '''
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception('Error, website not loaded.')
    return response.content

def get_song_list(url):
    '''
    Parse through web page to get to list of songs
    '''
    html_text = get_html(url)
    soup = BeautifulSoup(html_text)
    main_div = soup.find(id='block-system-main')
    song_parent = main_div.find_all("div", {"class": "view-content"})[0]
    songs = [song for song in song_parent.children]
    return songs

def parse_songs(song_list):
    '''
    Loop through list of songs and return dict
    '''
    json_list = []
    for song in song_list:
        if song != '\n':
            date_text = song.find('span', {'class': 'date-display-single'}).text
            month_text = date_text[:date_text.find(' ')]
            location_text = song.find_all('a')[2].text
            song_dict = {}
            song_dict['date_text'] = date_text
            song_dict['month_text'] = month_text
            song_dict['year_text'] = date_text[-4:]
            song_dict['location_text'] = location_text
            json_list.append(song_dict)
    return json_list

def get_page_append_text(page_num_input):
    '''
    Get url append text for page number
    '''
    append_str = ''
    if page_num_input > 1:
        append_str = '?page=' + str(page_num_input - 1)
    return append_str

# Get list of songs
song_list = []
for page_num in range(NUM_PAGES):
    url = BASE_URL + get_page_append_text((page_num + 1))    
    for song in get_song_list(url):
        song_list.append(song)

# Parse into single json object
json_list = parse_songs(song_list)

# Dataframe aggs
df = pd.DataFrame(json_list)
month_counts = df[['month_text', 'location_text']].groupby('month_text').count()
month_counts = [{'month': month, 'count': ct} for month, ct in month_counts['location_text'].to_dict().items()]
year_counts = df[['year_text', 'location_text']].groupby('year_text').count()
year_counts = [{'year': year, 'count': ct} for year, ct in year_counts['location_text'].to_dict().items()]

# Write to file
with open('led_zep_months.json', 'w') as file:
    json.dump(month_counts, file)
with open('led_zep_years.json', 'w') as file:
    json.dump(year_counts, file)
