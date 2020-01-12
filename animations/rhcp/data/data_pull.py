# -*- coding: utf-8 -*-

import requests
from bs4 import BeautifulSoup
import json

BASE_URL = 'https://www.songkeyfinder.com/'
SEARCH_URLS = ['https://www.songkeyfinder.com/artists/Red+Hot+Chili+Peppers?page=1',
               'https://www.songkeyfinder.com/artists/Red+Hot+Chili+Peppers?page=2']

def get_html(url):
    '''
    Retrieve html text given a URL string.
    '''
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception('Error, website not loaded.')
    return response.content

def get_html_table(html_text):
    '''
    Parse page containing a single table with header as first row.
    '''
    # Parse html string into bs4 object and find table
    soup = BeautifulSoup(html_text)
    table_rows = soup.find_all('tr')
    # Loop through rows in table, gathering relevant info
    songs = []
    for i, row in enumerate(table_rows):
        if i > 0:
            tds = row.find_all('td')
            song_name = tds[1].get_text()
            song_url = tds[1].find('a')['href']
            popularity = int(tds[2].get_text())
            songs.append({'song_name': song_name,
                          'song_url': BASE_URL + song_url,
                          'popularity': popularity})
    return songs

def get_song_key(url):
    '''
    Gets a song key given url.
    '''
    # Parse html string into bs4 object
    html_text = get_html(url)
    soup = BeautifulSoup(html_text)
    # Find Key text location
    key_search_text = soup.find_all('h2')[1].get_text()
    key_text_loc_start = key_search_text.find('in the Key of ') \
                            + len('in the Key of ')
    key_text_loc_end = key_search_text.find('\n')
    # Parse text and return
    key_text = key_search_text[key_text_loc_start:key_text_loc_end]
    return clean_up_song_key(key_text)

def clean_up_song_key(raw_key):
    '''
    Parses key into shortened music nomenclature.
    '''
    updated_key_string = raw_key
    # Shorten major and minor
    if updated_key_string[-5:] in ['major', 'Major']:
        updated_key_string = updated_key_string[:-5]
    elif updated_key_string[-5:] in ['minor', 'Minor']:
        updated_key_string = updated_key_string[:-5]
        updated_key_string += 'min'
    # Force to one accidental
    if updated_key_string[1:3] == '#/':
        updated_key_string = updated_key_string[0:2] + updated_key_string[5:]
    return updated_key_string

            
# Get all song urls and basic information
song_list = []
for url in SEARCH_URLS:
    html = get_html(url)
    for song in get_html_table(html):
        song['key'] = get_song_key(song['song_url'])
        del song['song_url']
        song_list.append(song)
    
# Write to file
with open('selected_song_data.json', 'w') as file:
    json.dump(song_list, file)
    

