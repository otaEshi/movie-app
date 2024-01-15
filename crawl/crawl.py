from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from datetime import datetime

# API settings
API_KEY = 'YOUR_YOUTUBE_API_KEY' # Put your YouTube API key here
API_NAME = 'youtube'
API_VERSION = 'v3'

youtube = build(API_NAME, API_VERSION, developerKey=API_KEY)

search_terms = ['list of', 'search terms']  # Put your search terms here

for search_term in search_terms:
    search_response = youtube.search().list(
        q=search_term,
        type='video',
        part='id,snippet',
        maxResults=10
    ).execute()

    print(f'Videos for the search term "{search_term}":\n')

    for search_result in search_response.get('items', []):
        video_id = search_result['id']['videoId']
        video_info = youtube.videos().list(
            id=video_id,
            part='snippet')
        video_response= video_info.execute()
        for video_result in video_response.get('items', []):
            title = video_result['snippet']['title']
            description = video_result['snippet']['description']
            release_date = video_result['snippet']['publishedAt']
            thumbnail_url = video_result['snippet']['thumbnails']['default']['url']

            print(f"Title: {title}")
            print(f"Description: {description}")
            print(f"Release Date: {datetime.strptime(release_date, '%Y-%m-%dT%H:%M:%SZ')}")
            print(f"Thumbnail URL: {thumbnail_url}")
            print("\n")