#!/usr/bin/env python
# Name: Toon van Holthe tot Echten
# Student number: 10798595
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM, plaintext
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'
FROM = 11

def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    dom = DOM(URL(TARGET_URL).download(cached=True))

    # create class
    class Series(object):
        def __init__(self, titles, genres, time, ratings, stars):
            self.titles = titles
            self.genres = genres
            self.time = time
            self.ratings = ratings
            self.stars = stars

    # create empty lists
    titles = []
    genres =[]
    time = []
    ratings = []
    stars = []
    tvseries = []

    # get all data from the dom
    for e in dom.by_tag("h3.lister-item-header"):
        for a in e.by_tag("a"):
            title = a.content.encode("utf-8")

            if not title:
                titles.append("None")
            else:
                titles.append(title.rstrip())

    # genre & runtime
    for e in dom.by_tag("p.text-muted"):
        for a in e.by_tag("span.genre"):
            genre = a.content.encode("utf-8")

            if not genre:
                genres.append("None")
            else:
                genres.append(genre.rstrip())

        for a in e.by_tag("span.runtime"):
            runtime = a.content.encode("utf-8")

            if not runtime:
                time.append("None")
            else:
                time.append(runtime.rstrip())

    # rating
    for e in dom.by_tag("div.inline-block ratings-imdb-rating"):
        for a in e.by_tag("strong"):
            rating = a.content.encode("utf-8")

            if not rating:
                ratings.append("None")
            else:
                ratings.append(rating.rstrip())

    # actors
    for e in dom.by_tag("p.")[FROM:]:

        # if e.by_tag("a."):
        tmpstars = []

        for a in e.by_tag("a."):
            star = a.content.encode("utf-8")

            # check if list is not empty
            if not star:
                stars.append("None")
            else:
                tmpstars.append(star.rstrip())

        # print(tmpstars)

        stars.append(tmpstars)

    # get rid of empty lists in stars
    stars = [x for x in stars if x != []]

    # put all elements into one big list "tvseries"
    for i in range(len(titles)):
        tvseries.extend((titles[i],genres[i],time[i],ratings[i],stars[i]))

    # put every element into class of type "Series"
    tvseries_class = Series(titles,genres,time,ratings,stars)

    return tvseries


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Genre', 'Runtime', 'Rating', 'Actors'])
    writer.writerow(tvseries)
    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)